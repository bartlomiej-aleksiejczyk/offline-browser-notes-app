import { TestBed } from '@angular/core/testing';

import { FileExplorerStoreService } from './file-explorer-store.service';

describe('FileExplorerStoreService', () => {
  let service: FileExplorerStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileExplorerStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
