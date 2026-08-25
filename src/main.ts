import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [provideZoneChangeDetection(),...(appConfig.providers ?? []), provideAnimationsAsync()],
})
  .catch((err) => console.error(err));
