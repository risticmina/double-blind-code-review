import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

interface IzmeniProsekResponse {
    message: string;
    prosek: number;
}
@Injectable({
  providedIn: 'root',
})

export class KorisnikService {
  private http = inject(HttpClient)

  izmeniProsek(korIme: string, prosek: number) {
    return this.http.put<IzmeniProsekResponse>("http://localhost:4000/korisnik/prosek/" + korIme, { prosek })
  }
}
