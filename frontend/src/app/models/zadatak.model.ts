import { Predaja } from "./predaja.model"
import { RezultatTest } from "./rezultat-test.model"

export class Test {
  ulaz: any[] = []
  ocekivaniIzlaz: any
}

export class Zadatak {
  _id = ""
  naziv = ""
  opis = ""
  imeFunkcije = ""
  testovi: Test[] = []
  pravilaOcenjivanja = ""
}

export interface ZadatakLista {
  _id: string;
  naziv: string;
}

export interface NoviZadatak {
  naziv: string;
  opis: string;
  imeFunkcije: string;
  pravilaOcenjivanja: string;
  testovi: Test[];
}

export interface PokretanjeTestaResponse {
  rezultati: RezultatTest[];
  brojProslih: number;
  ukupnoTestova: number;
}

export interface PredajaResenjaResponse {
  message: string;
  brojProslihTestova?: number;
  bazniPoeni?: number;
}

export interface MojaPredajaResponse {
  predaja: Predaja | null;
}

export interface ZahtevZaRecenziju {
  zadatakId: string;
  naziv: string;
  brojNepregledanih: number;
  otkljucano: boolean;
}

export interface MojiZahteviResponse {
  zahtevi: ZahtevZaRecenziju[];
}

export interface ZahtevZaZadatak {
  recenzijaId: string;
  brojProslihTestova: number;
  bazniPoeni: number;
}

export interface ZahteviZaZadatakResponse {
  lista: ZahtevZaZadatak[];
}

export interface RecenzijaZadatak {
  naziv: string;
  opis: string;
  imeFunkcije: string;
  testovi: Test[];
  pravilaOcenjivanja: string;
}

export interface JednaRecenzijaResponse {
  recenzijaId: string;
  zavrsena: boolean;
  dodatiOduzetiPoeni: number;
  obojeniDelovi: ObojeniDeo[];
  kod: string;
  brojProslihTestova: number;
  bazniPoeni: number;
  zadatak: RecenzijaZadatak;
}
export interface PrikazRecenzije {
  obojeniDelovi: ObojeniDeo[];
  dodatiOduzetiPoeni: number;
}

export interface RezultatPredajeResponse {
  zavrseno: boolean;
  finalnaOcena?: number;
  bazniPoeni?: number;
  kod?: string;
  prikazi?: PrikazRecenzije[];
  message?: string;
}

export interface PregledanaRecenzija {
  recenzijaId: string;
  nazivZadatka: string | undefined;
  brojProslihTestova: number;
  bazniPoeni: number;
  dodatiOduzetiPoeni: number;
  datumZavrsetka: Date | null;
}

export interface PregledaniKodoviResponse {
  lista: PregledanaRecenzija[];
}

export interface ObojeniDeo {
  pocetak: number;
  kraj: number;
  boja: "zeleno" | "crveno";
}
