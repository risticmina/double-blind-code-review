import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { KorisnikService } from '../services/korisnik.service';
import { TrenutniKorisnikService } from '../services/trenutni-korisnik.service';

@Component({
  selector: 'app-moj-profil',
  imports: [FormsModule, RouterLink],
  templateUrl: './moj-profil.html',
  styleUrl: './moj-profil.css',
})
export class MojProfil {

  private korisnikService = inject(KorisnikService)
  private tk = inject(TrenutniKorisnikService)

  korisnik = this.tk.ucitaj()
  noviProsek = this.korisnik?.prosek || 0
  poruka = ""

  sacuvajProsek() {
    if (!this.korisnik) return

    this.korisnikService.izmeniProsek(this.korisnik.kor_ime, this.noviProsek).subscribe({
      next: (data) => {
        this.poruka = "Prosek uspešno izmenjen"
        if (this.korisnik) {
          this.korisnik.prosek = data.prosek
          this.tk.sacuvaj( this.korisnik )
        }
      },
      error: (err) => {
        this.poruka = err.error?.message || "Greška pri izmeni"
      }
    })
  }
}
