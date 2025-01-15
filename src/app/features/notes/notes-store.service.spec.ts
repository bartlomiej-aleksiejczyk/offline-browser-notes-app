import { TestBed } from '@angular/core/testing';

import { NotesStoreService } from './notes-store.service';

describe('NotesStoreService', () => {
  let service: NotesStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotesStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
