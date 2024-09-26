import { TestBed } from '@angular/core/testing';

import { PackingHelperService } from './packing-helper.service';

describe('PackingHelperService', () => {
  let service: PackingHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackingHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
