import { TestBed } from '@angular/core/testing';

import { SiteNavigationService } from './site-navigation.service';

describe('SiteNavigationService', () => {
  let service: SiteNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
