import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private authService = inject(AuthService)
  private ruter = inject(Router)

  kor_ime = ""
  lozinka = ""
  ime = ""
  prezime = ""
  tip = "student"
  indeks = ""
  prosek: number | null = null

  poruka = ""

  register() {
    const podaci: {
      kor_ime: string;
      lozinka: string;
      ime: string;
      prezime: string;
      tip: string;
      indeks?: string;
      prosek?: number | null;
    } = {
      kor_ime: this.kor_ime,
      lozinka: this.lozinka,
      ime: this.ime,
      prezime: this.prezime,
      tip: this.tip
    }

    if (this.tip === "student") {
      podaci.indeks = this.indeks
      podaci.prosek = this.prosek
    }

    this.authService.register(podaci).subscribe({
      next: (data) => {
        this.ruter.navigate([''])
      },
      error: (err) => {
        this.poruka = err.error?.message || "Greška pri registraciji"
      }
    })
  }

}
