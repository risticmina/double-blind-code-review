import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { JednaRecenzijaResponse, MojaPredajaResponse, MojiZahteviResponse, NoviZadatak, PokretanjeTestaResponse, PredajaResenjaResponse, PregledaniKodoviResponse, RezultatPredajeResponse, Zadatak, ZadatakLista, ZahteviZaZadatakResponse } from '../models/zadatak.model';

interface ListaZadatakaResponse {
  zadaci: ZadatakLista [];
}
interface JedanZadatakResponse {
  zadatak: Zadatak;
}
interface PorukaResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ZadatakService {

  private http = inject(HttpClient)
  private baseUrl = "http://localhost:4000/zadatak"

  listaZadataka() {
    return this.http.get<ListaZadatakaResponse>(this.baseUrl)
  }

  jedanZadatak(id: string) {
    return this.http.get<JedanZadatakResponse>(this.baseUrl + "/" + id)
  }

  dodajZadatak(podaci: NoviZadatak) {
    return this.http.post<PorukaResponse>(this.baseUrl, podaci)
  }

  obrisiZadatak(id: string) {
    return this.http.delete<PorukaResponse>(this.baseUrl + "/" + id)
  }

  azurirajZadatak(id: string, podaci: NoviZadatak) {
    return this.http.put<PorukaResponse>(this.baseUrl + "/" + id, podaci)
  }

  pokreniTest(id: string, kod: string) {
    return this.http.post<PokretanjeTestaResponse>(this.baseUrl + "/" + id + "/pokreni-test", { kod })
  }

  predajResenje(id: string, kod: string, autorKorIme: string) {
    return this.http.post<PredajaResenjaResponse>("http://localhost:4000/predaja/" + id + "/predaj", { kod, autorKorIme })
  }

  mojaPredaja(id: string, autorKorIme: string) {
    return this.http.get<MojaPredajaResponse>("http://localhost:4000/predaja/" + id + "/moja-predaja/" + autorKorIme)
  }

  mojiZahtevi(korIme: string) {
    return this.http.get<MojiZahteviResponse>("http://localhost:4000/predaja/moji-zahtevi/" + korIme)
  }

  zahteviZaZadatak(korIme: string, zadatakId: string) {
    return this.http.get<ZahteviZaZadatakResponse>("http://localhost:4000/predaja/zahtevi/" + korIme + "/" + zadatakId)
  }

  jednaRecenzija(id: string) {
    return this.http.get<JednaRecenzijaResponse>("http://localhost:4000/predaja/recenzija/" + id)
  }

  potvrdiRecenziju(id: string, dodatiOduzetiPoeni: number, obojeniDelovi: any[]) {
    return this.http.post<PorukaResponse>("http://localhost:4000/predaja/recenzija/" + id + "/potvrdi", { dodatiOduzetiPoeni, obojeniDelovi })
  }

  rezultatPredaje(zadatakId: string, autorKorIme: string) {
    return this.http.get<RezultatPredajeResponse>("http://localhost:4000/predaja/rezultat/" + zadatakId + "/" + autorKorIme)
  }

  pregledaniKodovi(korIme: string) {
    return this.http.get<PregledaniKodoviResponse>("http://localhost:4000/predaja/pregledano/" + korIme)
  }

}
