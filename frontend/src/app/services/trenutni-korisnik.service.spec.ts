import { TestBed } from '@angular/core/testing';

import { TrenutniKorisnikService } from './trenutni-korisnik.service';

describe('TrenutniKorisnikService', () => {
  let service: TrenutniKorisnikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrenutniKorisnikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
