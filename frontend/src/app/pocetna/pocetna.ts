import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ZadatakService } from '../services/zadatak.service';
import { TrenutniKorisnikService } from '../services/trenutni-korisnik.service';
import { ZadatakLista } from '../models/zadatak.model';
@Component({
  selector: 'app-pocetna',
  imports: [RouterLink],
  templateUrl: './pocetna.html',
  styleUrl: './pocetna.css',
})
export class Pocetna implements OnInit {
  private zadatakService = inject(ZadatakService)
  private tk = inject(TrenutniKorisnikService)
  private ruter = inject(Router)

  zadaci: ZadatakLista[] = []
  korisnik = this.tk.ucitaj()

  ngOnInit() {
    this.ucitajZadatke()
  }

  ucitajZadatke() {
    this.zadatakService.listaZadataka().subscribe({
      next: (data) => {
        this.zadaci = data.zadaci
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  obrisi(id: string) {
    this.zadatakService.obrisiZadatak(id).subscribe({
      next: () => {
        this.ucitajZadatke()
      }
    })
  }

  izmeni(id: string) {
    this.ruter.navigate(['/izmeni-zadatak', id])
  }

  odjava() {
    this.tk.obrisi()
    this.ruter.navigate(['/login'])
  }
}
