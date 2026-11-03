import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ZadatakService } from '../services/zadatak.service';


class TestUnos {
  ulaz = ""
  ocekivaniIzlaz = ""
}


@Component({
  selector: 'app-dodaj-zadatak',
  imports: [FormsModule, RouterLink],
  templateUrl: './dodaj-zadatak.html',
  styleUrl: './dodaj-zadatak.css',
})
export class DodajZadatak {

  private zadatakService = inject(ZadatakService)
  private ruter = inject(Router)

  naziv = ""
  opis = ""
  imeFunkcije = ""
  pravilaOcenjivanja = ""
  testovi: TestUnos[] = [new TestUnos(), new TestUnos(), new TestUnos(), new TestUnos(), new TestUnos()]

  poruka = ""

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
        this.poruka = "Ulaz i očekivani izlaz moraju biti validan JSON (npr. [8, 70] i 600)"
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

    this.zadatakService.dodajZadatak(podaci).subscribe({
      next: () => {
        this.ruter.navigate(['/pocetna'])
      },
      error: (err) => {
        this.poruka = err.error?.message || "Greška pri dodavanju zadatka"
      }
    })
  }

}
