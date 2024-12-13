import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, withFetch } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [CommonModule, provideHttpClient(withFetch()), provideRouter(routes), provideClientHydration()]
};
