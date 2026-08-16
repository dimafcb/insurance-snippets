import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [...(appConfig.providers ?? []), provideAnimationsAsync()],
})
  .catch((err) => console.error(err));
