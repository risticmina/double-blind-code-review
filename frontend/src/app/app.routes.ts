import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Pocetna } from './pocetna/pocetna';
import { DodajZadatak } from './dodaj-zadatak/dodaj-zadatak';
import { IzmeniZadatak } from './izmeni-zadatak/izmeni-zadatak';
import { ResiZadatak } from './resi-zadatak/resi-zadatak';
import { Zahtevi } from './zahtevi/zahtevi';
import { PregledaniKodovi } from './pregledani-kodovi/pregledani-kodovi';
import { ListaZahteva } from './lista-zahteva/lista-zahteva';
import { Pregled } from './pregled/pregled';
import { Rezultat } from './rezultat/rezultat';
import { MojProfil } from './moj-profil/moj-profil';

export const routes: Routes = [
  {path: "login", component:Login},
  {path: 'register', component:Register},
  {path: 'pocetna', component:Pocetna},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dodaj-zadatak', component: DodajZadatak },
  { path: 'izmeni-zadatak/:id', component: IzmeniZadatak },
  { path: 'zadatak/:id', component: ResiZadatak },
  { path: 'zahtevi', component: Zahtevi},
  { path: 'pregledani-kodovi', component: PregledaniKodovi },
  { path: 'zahtevi/:zadatakId', component: ListaZahteva },
  { path: 'pregled/:id', component: Pregled },
  { path: 'rezultat/:zadatakId', component: Rezultat },
  { path: 'moj-profil', component: MojProfil },
];
