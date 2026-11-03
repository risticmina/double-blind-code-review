import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TrenutniKorisnikService } from '../services/trenutni-korisnik.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  private authService = inject(AuthService)
  private ruter = inject(Router)
  private tk = inject(TrenutniKorisnikService)

  korIme = ""
  lozinka = ""
  poruka = ""

  ngOnInit() {
    this.tk.obrisi()
  }

  login() {
    this.authService.login(this.korIme, this.lozinka).subscribe({
      next: (data) => {
        this.tk.sacuvaj(data.korisnik)
        this.ruter.navigate(['/pocetna'])
      },
      error: (err) => {
        this.poruka = err.error?.message || "Greška pri prijavi"
      }
    })
  }


}
