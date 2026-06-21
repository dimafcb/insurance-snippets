import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest, map, shareReplay } from 'rxjs';

import { Rider, RiderGroup } from './insurance-package.interfaces';
import { getMockRidersWithVariantCount, RIDER_GROUPS_MOCK } from './insurance-package.mock';

@Component({
  selector: 'app-insurance-package',
  imports: [CommonModule],
  templateUrl: './insurance-package.component.html',
  styleUrl: './insurance-package.component.scss',
})
export class InsurancePackageComponent {
  private readonly hostElementRef = inject(ElementRef<HTMLElement>);
  private readonly sanitizer = inject(DomSanitizer);
  // private readonly store = inject(Store);

  @ViewChild('variantsViewport', { read: ElementRef })
  private variantsViewportRef?: ElementRef<HTMLElement>;

  private readonly ridersSubject = new BehaviorSubject<RiderGroup[]>(RIDER_GROUPS_MOCK);
  private readonly variantsViewportWidthSubject = new BehaviorSubject<number>(window.innerWidth);

  // Replace `of(...)` with your NgRx selector when ready:
  // this.store.select(selectRiders)
  protected readonly riderGroups$ = this.ridersSubject.asObservable();
  protected readonly filteredVariants$ = this.riderGroups$.pipe(
    // Hook your domain filters here when they are ready.
    map((riderGroups) => riderGroups),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  private readonly variantsOffsetSubject = new BehaviorSubject<number>(0);
  protected readonly variantsOffset$ = this.variantsOffsetSubject.asObservable();

  protected readonly variantsViewportWidth$ = this.variantsViewportWidthSubject.asObservable();

  protected readonly filteredAndPaginatedVariants$ = combineLatest([
    this.filteredVariants$,
    this.variantsViewportWidth$,
    this.variantsOffset$,
  ] as const).pipe(
    map(([filteredVariants, viewportWidthPx, sliceOffset]: [RiderGroup[], number, number]) => {
      const maxVariantCount = Math.max(
        1,
        ...filteredVariants.flatMap((group) => group.riders.map((rider) => rider.variants.length)),
      );
      const layoutRem = this.getLayoutRemValues();

      const rootFontSizePx = this.getRootFontSizePx();
      const riderColumnWidthPx = layoutRem.riderColumnWidthRem * rootFontSizePx;
      const variantFitMinWidthPx = layoutRem.variantFitMinWidthRem * rootFontSizePx;
      const gapPx = layoutRem.gridGapRem * rootFontSizePx;

      const availableVariantsWidthPx = Math.max(0, viewportWidthPx - riderColumnWidthPx);
      const fittedVariantCount = Math.floor(
        (availableVariantsWidthPx + gapPx) / (variantFitMinWidthPx + gapPx),
      );
      const visibleVariantCount = this.clamp(fittedVariantCount, 1, maxVariantCount);
      const maxSliceOffset = Math.max(0, maxVariantCount - visibleVariantCount);
      const clampedSliceOffset = this.clamp(sliceOffset, 0, maxSliceOffset);

      const displayedVariantIndexes = Array.from(
        { length: visibleVariantCount },
        (_, index) => clampedSliceOffset + index,
      );

      return {
        riderGroups: filteredVariants.map((group) => ({
          ...group,
          riders: group.riders.map((rider: Rider) => ({
            ...rider,
            variantsCount: rider.variants.length,
            variants: rider.variants.slice(clampedSliceOffset, clampedSliceOffset + visibleVariantCount),
          })),
        })),
        visibleVariantCount,
        totalVariantsCount: maxVariantCount,
        variantIndexes: displayedVariantIndexes,
        canSliceLeft: clampedSliceOffset > 0,
        canSliceRight: clampedSliceOffset < maxSliceOffset,
      };
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  protected readonly gridStyles$ = this.filteredAndPaginatedVariants$.pipe(
    map((state): SafeStyle => {
      const visibleVariantCount = this.clamp(state.visibleVariantCount, 1, state.totalVariantsCount);
      const styles = [
        'display: grid',
        `grid-template-columns: calc(var(--rider-name-width) * 1rem) repeat(${visibleVariantCount}, minmax(16rem, 1fr))`,
        'gap: calc(var(--rider-grid-gap) * 1rem)',
        'width: 100%',
        'min-width: 0',
      ].join('; ');

      return this.sanitizer.bypassSecurityTrustStyle(styles);
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  protected readonly visibleRiderGroups$ = this.filteredAndPaginatedVariants$.pipe(
    map((state) => state.riderGroups),
  );

  protected readonly visibleVariantCount$ = this.filteredAndPaginatedVariants$.pipe(
    map((state) => state.visibleVariantCount),
  );

  protected readonly totalVariantsCount$ = this.filteredAndPaginatedVariants$.pipe(
    map((state) => state.totalVariantsCount),
  );

  protected readonly canSliceLeft$ = this.filteredAndPaginatedVariants$.pipe(
    map((state) => state.canSliceLeft),
  );

  protected readonly canSliceRight$ = this.filteredAndPaginatedVariants$.pipe(
    map((state) => state.canSliceRight),
  );

  public ngAfterViewInit(): void {
    // Defer initial emission to avoid ExpressionChanged errors.
    queueMicrotask(() => this.updateViewportMeasurements());
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    this.updateViewportMeasurements();
  }

  protected sliceVariants(direction: 'left' | 'right'): void {
    const currentOffset = this.variantsOffsetSubject.getValue();
    const nextOffset = direction === 'right' ? currentOffset + 1 : currentOffset - 1;
    this.variantsOffsetSubject.next(nextOffset);
    // Replace with store dispatch when NgRx is set up:
    // this.store.dispatch(updateVariantsOffset({ offset: nextOffset }));
  }

  protected getRandomVariantsCount(): number {
    const currentCount = this.ridersSubject.getValue()[0]?.riders[0]?.variants.length ?? 1;
    const nextCount = this.getRandomVariantCount(currentCount);
    this.ridersSubject.next(getMockRidersWithVariantCount(nextCount));
    this.variantsOffsetSubject.next(0);
    return nextCount;
  }

  private getRandomVariantCount(currentCount: number): number {
    const maxVariantCount = RIDER_GROUPS_MOCK[0]?.riders[0]?.variants.length ?? currentCount;
    const availableCounts = Array.from({ length: maxVariantCount }, (_, idx) => idx + 1).filter(
      (count) => count !== currentCount,
    );
    const randomIndex = Math.floor(Math.random() * availableCounts.length);
    return availableCounts[randomIndex] ?? currentCount;
  }

  private getRootFontSizePx(): number {
    const rawRootFont = getComputedStyle(document.documentElement).fontSize;
    const parsedRootFont = Number.parseFloat(rawRootFont);
    return Number.isNaN(parsedRootFont) ? 16 : parsedRootFont;
  }

  private getLayoutRemValues(): {
    riderColumnWidthRem: number;
    variantFitMinWidthRem: number;
    gridGapRem: number;
  } {
    const hostStyles = getComputedStyle(this.hostElementRef.nativeElement);

    return {
      riderColumnWidthRem: this.readCssRemVariable(hostStyles, '--rider-name-width', 20),
      variantFitMinWidthRem: this.readCssRemVariable(hostStyles, '--variant-fit-min-width', 16),
      gridGapRem: this.readCssRemVariable(hostStyles, '--rider-grid-gap', 1),
    };
  }

  private readCssRemVariable(
    styles: CSSStyleDeclaration,
    variableName: string,
    fallback: number,
  ): number {
    const rawValue = styles.getPropertyValue(variableName).trim();
    const parsedValue = Number.parseFloat(rawValue);
    return Number.isNaN(parsedValue) ? fallback : parsedValue;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private updateViewportMeasurements(): void {
    const viewportWidth =
      this.variantsViewportRef?.nativeElement.getBoundingClientRect().width ?? window.innerWidth;

    this.variantsViewportWidthSubject.next(viewportWidth);
  }
}
