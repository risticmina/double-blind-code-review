import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ZadatakService } from '../services/zadatak.service';
import { Zadatak } from '../models/zadatak.model';
import { RezultatTest } from '../models/rezultat-test.model';
import { CommonModule } from '@angular/common';
import { TrenutniKorisnikService } from '../services/trenutni-korisnik.service';

@Component({
  selector: 'app-resi-zadatak',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './resi-zadatak.html',
  styleUrl: './resi-zadatak.css',
})
export class ResiZadatak implements OnInit{

  private zadatakService = inject(ZadatakService)
  private aktivnaRuta = inject(ActivatedRoute)

  id = ""
  zadatak: Zadatak = new Zadatak()
  kod = ""
  rezultati: RezultatTest[] = []
  brojProslih = 0
  ukupnoTestova = 0
  testoviPokrenuti = false
  poruka = ""

  ngOnInit() {
    this.id = this.aktivnaRuta.snapshot.params['id']
    this.zadatakService.jedanZadatak(this.id).subscribe({
      next: (data) => {
        this.zadatak = data.zadatak

        const korisnik = this.tk.ucitaj()
        if (!korisnik) return

        this.zadatakService.mojaPredaja(this.id, korisnik.kor_ime).subscribe({
          next: (data) => {
            if (data.predaja) {
              this.kod = data.predaja.kod
              this.vecPredato = true
              this.porukaPredaje = `Rešenje predato! ${data.predaja.brojProslihTestova}/5 testova, ${data.predaja.bazniPoeni} poena.`
            } else {
              this.kod = `function ${this.zadatak.imeFunkcije}() {\n  \n}`
            }
          }
        })
      },
      error: (err) => {
        this.poruka = "Greška pri učitavanju zadatka"
      }
    })
  }

  pokreniTestove() {
    this.zadatakService.pokreniTest(this.id, this.kod).subscribe({
      next: (data) => {
        this.rezultati = data.rezultati
        this.brojProslih = data.brojProslih
        this.ukupnoTestova = data.ukupnoTestova
        this.testoviPokrenuti = true
        this.poruka = ""
      },
      error: (err) => {
        this.poruka = err.error?.message || "Greška pri pokretanju testova"
      }
    })
  }

  private tk = inject(TrenutniKorisnikService)
  vecPredato = false
  porukaPredaje = ""

  predaj() {
    const korisnik = this.tk.ucitaj()
    if (!korisnik) return

    this.zadatakService.predajResenje(this.id, this.kod, korisnik.kor_ime).subscribe({
      next: (data) => {
        this.vecPredato = true
        this.porukaPredaje = `Rešenje predato! ${data.brojProslihTestova}/5 testova, ${data.bazniPoeni} poena.`
      },
      error: (err) => {
        this.porukaPredaje = err.error?.message || "Greška pri predaji"
      }
    })
  }

}
