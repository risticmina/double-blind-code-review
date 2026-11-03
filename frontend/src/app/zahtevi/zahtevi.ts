import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZadatakService } from '../services/zadatak.service';
import { TrenutniKorisnikService } from '../services/trenutni-korisnik.service';
import { ZahtevZaRecenziju } from '../models/zadatak.model';

@Component({
  selector: 'app-zahtevi',
  imports: [RouterLink],
  templateUrl: './zahtevi.html',
  styleUrl: './zahtevi.css',
})
export class Zahtevi implements OnInit {

  private zadatakService = inject(ZadatakService)
  private tk = inject(TrenutniKorisnikService)

  zahtevi: ZahtevZaRecenziju[] = []
  korisnik = this.tk.ucitaj()

  ngOnInit() {
    if (!this.korisnik) return
    this.zadatakService.mojiZahtevi(this.korisnik.kor_ime).subscribe({
      next: (data) => {
        this.zahtevi = data.zahtevi
      }
    })
  }
}
