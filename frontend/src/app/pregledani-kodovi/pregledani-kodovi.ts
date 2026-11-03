import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZadatakService } from '../services/zadatak.service';
import { TrenutniKorisnikService } from '../services/trenutni-korisnik.service';
import { PregledanaRecenzija } from '../models/zadatak.model';

@Component({
  selector: 'app-pregledani-kodovi',
  imports: [RouterLink],
  templateUrl: './pregledani-kodovi.html',
  styleUrl: './pregledani-kodovi.css',
})
export class PregledaniKodovi implements OnInit{

  private zadatakService = inject(ZadatakService)
  private tk = inject(TrenutniKorisnikService)

  lista: PregledanaRecenzija[] = []

  ngOnInit() {
    const korisnik = this.tk.ucitaj()
    if (!korisnik) return

    this.zadatakService.pregledaniKodovi(korisnik.kor_ime).subscribe({
      next: (data) => {
        this.lista = data.lista
      }
    })
  }
}
