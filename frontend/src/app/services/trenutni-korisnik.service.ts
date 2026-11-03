import { Injectable } from '@angular/core';
import { KorisnikProfil } from '../models/korisnik.model';

@Injectable({
  providedIn: 'root',
})
export class TrenutniKorisnikService {
  private korisnik: KorisnikProfil | null = null

  sacuvaj(podaci: KorisnikProfil) {
    this.korisnik = podaci
    localStorage.setItem('korisnik', JSON.stringify(podaci))
  }

  ucitaj(): KorisnikProfil | null {
    if (this.korisnik) {
      return this.korisnik
    }
    const sacuvano = localStorage.getItem('korisnik')
    if (sacuvano) {
      this.korisnik = JSON.parse(sacuvano)
      return this.korisnik
    }
    return null
  }

  obrisi() {
    this.korisnik = null
    localStorage.removeItem('korisnik')
  }

}
