import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ZadatakService } from '../services/zadatak.service';
import { TrenutniKorisnikService } from '../services/trenutni-korisnik.service';
import { ObojeniDeo, RezultatPredajeResponse } from '../models/zadatak.model';

@Component({
  selector: 'app-rezultat',
  imports: [RouterLink],
  templateUrl: './rezultat.html',
  styleUrl: './rezultat.css',
})
export class Rezultat implements OnInit {

  private zadatakService = inject(ZadatakService)
  private tk = inject(TrenutniKorisnikService)
  private aktivnaRuta = inject(ActivatedRoute)

  zadatakId = ""
  podaci: RezultatPredajeResponse | null = null
  poruka = ""

  ngOnInit() {
    this.zadatakId = this.aktivnaRuta.snapshot.params['zadatakId']
    const korisnik = this.tk.ucitaj()
    if (!korisnik) return

    this.zadatakService.rezultatPredaje(this.zadatakId, korisnik.kor_ime).subscribe({
      next: (data) => {
        this.podaci = data
      },
      error: (err) => {
        this.poruka = err.error?.message || "Greška pri učitavanju rezultata"
      }
    })
  }

  obojenKod(kod: string, obojeniDelovi: ObojeniDeo[]): string {
    let delovi = [...obojeniDelovi].sort((a, b) => a.pocetak - b.pocetak)
    let rezultat = ""
    let poslednjaPozicija = 0

    for (let deo of delovi) {
      rezultat += this.escapeHtml(kod.substring(poslednjaPozicija, deo.pocetak))
      const klasa = deo.boja === "zeleno" ? "oznaceno-zeleno" : "oznaceno-crveno"
      rezultat += `<span class="${klasa}">${this.escapeHtml(kod.substring(deo.pocetak, deo.kraj))}</span>`
      poslednjaPozicija = deo.kraj
    }
    rezultat += this.escapeHtml(kod.substring(poslednjaPozicija))

    return rezultat
  }

  escapeHtml(tekst: string): string {
    return tekst
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
  }
}
