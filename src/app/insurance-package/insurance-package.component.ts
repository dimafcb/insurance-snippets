import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { debounceTime, fromEvent, merge, startWith } from 'rxjs';

import { InsuranceRider, RiderVariant } from './insurance-package.interfaces';
import { INSURANCE_RIDERS_MOCK } from './insurance-package.mock';

@Component({
  selector: 'app-insurance-package',
  imports: [CommonModule],
  templateUrl: './insurance-package.component.html',
  styleUrl: './insurance-package.component.scss'
})
export class InsurancePackageComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  private readonly riderColumnWidthRem = 18;
  private readonly gridGapRem = 1;
  private readonly contentPaddingRem = 2;

  protected readonly riders: InsuranceRider[] = INSURANCE_RIDERS_MOCK;
  protected readonly maxVariantCount = Math.max(...this.riders.map((rider) => rider.variants.length));
  protected readonly variantMinWidthRem = this.getVariantMinWidthRem(this.maxVariantCount);

  protected displayedVariantCount = 1;
  protected visibleVariantIndexes: number[] = [0];

  ngOnInit(): void {
    merge(
      this.breakpointObserver.observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
        Breakpoints.Handset,
        Breakpoints.Tablet,
        Breakpoints.Web
      ]),
      fromEvent(window, 'resize')
    )
      .pipe(startWith(null), debounceTime(50), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.recalculateVisibleVariantCount();
      });
  }

  protected getVariantAt(rider: InsuranceRider, variantIndex: number): RiderVariant | null {
    return rider.variants[variantIndex] ?? null;
  }

  private recalculateVisibleVariantCount(): void {
    const rootFontSizePx = this.getRootFontSizePx();
    const riderColumnWidthPx = this.riderColumnWidthRem * rootFontSizePx;
    const variantMinWidthPx = this.variantMinWidthRem * rootFontSizePx;
    const gapPx = this.gridGapRem * rootFontSizePx;
    const pagePaddingPx = this.contentPaddingRem * rootFontSizePx;
    const viewportWidthPx = window.innerWidth;

    const availableVariantsWidthPx = viewportWidthPx - riderColumnWidthPx - pagePaddingPx;
    const fittedVariantCount = Math.floor((availableVariantsWidthPx + gapPx) / (variantMinWidthPx + gapPx));

    this.displayedVariantCount = this.clamp(fittedVariantCount, 1, this.maxVariantCount);
    this.visibleVariantIndexes = Array.from({ length: this.displayedVariantCount }, (_, idx) => idx);
  }

  private getVariantMinWidthRem(variantCount: number): number {
    if (variantCount <= 1) {
      return 24;
    }

    if (variantCount === 2) {
      return 20;
    }

    return 16;
  }

  private getRootFontSizePx(): number {
    const rawRootFont = getComputedStyle(document.documentElement).fontSize;
    const parsedRootFont = Number.parseFloat(rawRootFont);
    return Number.isNaN(parsedRootFont) ? 16 : parsedRootFont;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}