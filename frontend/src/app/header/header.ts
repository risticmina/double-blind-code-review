import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TrenutniKorisnikService } from '../services/trenutni-korisnik.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  private tk = inject(TrenutniKorisnikService)
  private ruter = inject(Router)

  get korisnik() {
    return this.tk.ucitaj()
  }

  odjava() {
    this.tk.obrisi()
    this.ruter.navigate(['/login'])
  }
}
