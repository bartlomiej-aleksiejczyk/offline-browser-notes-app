import { TestBed } from '@angular/core/testing';

import { DevicePreferencesService } from './device-preferences.service';

describe('DevicePreferencesService', () => {
  let service: DevicePreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevicePreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
