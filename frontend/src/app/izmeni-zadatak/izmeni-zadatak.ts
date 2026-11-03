import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ZadatakService } from '../services/zadatak.service';


class TestUnos {
  ulaz = ""
  ocekivaniIzlaz = ""
}

@Component({
  selector: 'app-izmeni-zadatak',
  imports: [FormsModule, RouterLink],
  templateUrl: './izmeni-zadatak.html',
  styleUrl: './izmeni-zadatak.css',
})
export class IzmeniZadatak implements OnInit {

  private zadatakService = inject(ZadatakService)
  private ruter = inject(Router)
  private aktivnaRuta = inject(ActivatedRoute)

  id = ""
  naziv = ""
  opis = ""
  imeFunkcije = ""
  pravilaOcenjivanja = ""
  testovi: TestUnos[] = []

  poruka = ""

  ngOnInit() {
    this.id = this.aktivnaRuta.snapshot.params['id']
    this.zadatakService.jedanZadatak(this.id).subscribe({
      next: (data) => {
        const z = data.zadatak
        this.naziv = z.naziv
        this.opis = z.opis
        this.imeFunkcije = z.imeFunkcije
        this.pravilaOcenjivanja = z.pravilaOcenjivanja || ""
        this.testovi = z.testovi.map((t) => {
          const tu = new TestUnos()
          tu.ulaz = JSON.stringify(t.ulaz)
          tu.ocekivaniIzlaz = JSON.stringify(t.ocekivaniIzlaz)
          return tu
        })
      },
      error: (err) => {
        this.poruka = "Greška pri učitavanju zadatka"
      }
    })
  }

  dodajTest() {
    this.testovi.push(new TestUnos())
  }

  ukloniTest(i: number) {
    this.testovi.splice(i, 1)
  }

  sacuvaj() {
    if (this.testovi.length < 5) {
      this.poruka = "Potrebno je najmanje 5 testova"
      return
    }

    let parsiraniTestovi = []
    for (let t of this.testovi) {
      try {
        const ulazParsiran = JSON.parse(t.ulaz)
        const izlazParsiran = JSON.parse(t.ocekivaniIzlaz)
        parsiraniTestovi.push({ ulaz: ulazParsiran, ocekivaniIzlaz: izlazParsiran })
      } catch (e) {
        this.poruka = "Ulaz i očekivani izlaz moraju biti validan JSON (npr. [8, 70] i 600, ili null)"
        return
      }
    }

    const podaci = {
      naziv: this.naziv,
      opis: this.opis,
      imeFunkcije: this.imeFunkcije,
      pravilaOcenjivanja: this.pravilaOcenjivanja,
      testovi: parsiraniTestovi
    }

    this.zadatakService.azurirajZadatak(this.id, podaci).subscribe({
      next: () => {
        this.ruter.navigate(['/pocetna'])
      },
      error: (err) => {
        this.poruka = err.error?.message || "Greška pri izmeni zadatka"
      }
    })
  }

}
