import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ZadatakService } from '../services/zadatak.service';
import { JednaRecenzijaResponse, ObojeniDeo } from '../models/zadatak.model';

@Component({
  selector: 'app-pregled',
  imports: [FormsModule, RouterLink],
  templateUrl: './pregled.html',
  styleUrl: './pregled.css',
})
export class Pregled implements OnInit {

  private zadatakService = inject(ZadatakService)
  private aktivnaRuta = inject(ActivatedRoute)
  private ruter = inject(Router)

  @ViewChild('kodElement') kodElementRef!: ElementRef

  recenzijaId = ""
  podaci: JednaRecenzijaResponse | null  = null
  kod = ""
  obojeniDelovi: ObojeniDeo[] = []
  poeniPromena = 0
  poruka = ""

  ngOnInit() {
    this.recenzijaId = this.aktivnaRuta.snapshot.params['id']
    this.zadatakService.jednaRecenzija(this.recenzijaId).subscribe({
      next: (data) => {
        this.podaci = data
        this.kod = data.kod
        this.obojeniDelovi = data.obojeniDelovi || []
        this.poeniPromena = data.dodatiOduzetiPoeni || 0
      },
      error: (err) => {
        this.poruka = "Greška pri učitavanju"
      }
    })
  }


  get obojeniKodHtml(): string {
    if (!this.kod) return ""


    let delovi = [...this.obojeniDelovi].sort((a, b) => a.pocetak - b.pocetak)
    let rezultat = ""
    let poslednjaPozicija = 0

    for (let deo of delovi) {

      rezultat += this.escapeHtml(this.kod.substring(poslednjaPozicija, deo.pocetak))

      const klasa = deo.boja === "zeleno" ? "oznaceno-zeleno" : "oznaceno-crveno"
      rezultat += `<span class="${klasa}">${this.escapeHtml(this.kod.substring(deo.pocetak, deo.kraj))}</span>`
      poslednjaPozicija = deo.kraj
    }
    rezultat += this.escapeHtml(this.kod.substring(poslednjaPozicija))

    return rezultat
  }

  escapeHtml(tekst: string): string {
    return tekst
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
  }


   oznaci(boja: "zeleno" | "crveno")  {
    const selekcija = window.getSelection()

    if (!selekcija || selekcija.rangeCount === 0 || selekcija.toString().length === 0) {
      this.poruka = "Prvo selektujte deo koda mišem"
      return
    }

    const opseg = selekcija.getRangeAt(0)
    const kodElement = this.kodElementRef.nativeElement


    const pocetakOpsega = document.createRange()
    pocetakOpsega.selectNodeContents(kodElement)
    pocetakOpsega.setEnd(opseg.startContainer, opseg.startOffset)
    const pocetak = pocetakOpsega.toString().length

    const kraj = pocetak + selekcija.toString().length


    this.obojeniDelovi.push({ pocetak, kraj, boja })

    selekcija.removeAllRanges()
    this.poruka = ""
  }

  ukloniOznaku(i: number) {
    this.obojeniDelovi.splice(i, 1)
  }

  potvrdi() {
    this.zadatakService.potvrdiRecenziju(this.recenzijaId, this.poeniPromena, this.obojeniDelovi).subscribe({
      next: () => {
        this.ruter.navigate(['/zahtevi'])
      },
      error: (err) => {
        this.poruka = "Greška pri potvrdi"
      }
    })
  }
}
