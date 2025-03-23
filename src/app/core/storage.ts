import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'Window Local Storage Object',
  {
    providedIn: 'root',
    factory: () =>
      inject(PLATFORM_ID) === 'browser' ? window.localStorage : ({} as Storage),
  },
);
