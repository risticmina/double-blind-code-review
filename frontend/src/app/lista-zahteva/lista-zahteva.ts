import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ZadatakService } from '../services/zadatak.service';
import { TrenutniKorisnikService } from '../services/trenutni-korisnik.service';
import { ZahtevZaZadatak } from '../models/zadatak.model';

@Component({
  selector: 'app-lista-zahteva',
  imports: [RouterLink],
  templateUrl: './lista-zahteva.html',
  styleUrl: './lista-zahteva.css',
})
export class ListaZahteva implements OnInit {

  private zadatakService = inject(ZadatakService)
  private tk = inject(TrenutniKorisnikService)
  private aktivnaRuta = inject(ActivatedRoute)

  zadatakId = ""
  lista: ZahtevZaZadatak[] = []

  ngOnInit() {
    this.zadatakId = this.aktivnaRuta.snapshot.params['zadatakId']
    const korisnik = this.tk.ucitaj()
    if (!korisnik) return

    this.zadatakService.zahteviZaZadatak(korisnik.kor_ime, this.zadatakId).subscribe({
      next: (data) => {
        this.lista = data.lista
      }
    })
  }
}
