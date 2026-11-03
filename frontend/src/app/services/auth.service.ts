import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KorisnikProfil } from '../models/korisnik.model';

interface LoginResponse {
  korisnik: KorisnikProfil;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)

  login(korIme: string, lozinka: string) {
    const data = { kor_ime: korIme, lozinka: lozinka }
    return this.http.post<LoginResponse>("http://localhost:4000/auth/login", data)
  }

  register(podaci: any) {
    return this.http.post<String>("http://localhost:4000/auth/register", podaci)
  }
}
