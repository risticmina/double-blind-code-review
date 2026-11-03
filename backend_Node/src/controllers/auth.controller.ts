import express from 'express'
import bcrypt from 'bcrypt'
import KorisnikModel from '../models/korisnik'

const INDEKS_REGEX = /^\d{4}\/\d{4}$/

export class AuthController {

     login = (req: express.Request, res: express.Response) => {
        let korIme = req.body.kor_ime
        let lozinka = req.body.lozinka

        KorisnikModel.findOne({ kor_ime: korIme }).then((korisnik) => {
            if (!korisnik) {
                res.status(400).json({ message: "Pogrešno korisničko ime ili lozinka" })
                return
            }
            bcrypt.compare(lozinka, korisnik.lozinka).then((match) => {
                if (!match) {
                    res.status(400).json({ message: "Pogrešno korisničko ime ili lozinka" })
                    return
                }
                res.json({
                    korisnik: {
                        kor_ime: korisnik.kor_ime,
                        ime: korisnik.ime,
                        prezime: korisnik.prezime,
                        tip: korisnik.tip,
                        indeks: korisnik.indeks,
                        prosek: korisnik.prosek
                    }
                })
            })
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        })
    }

    register = (req: express.Request, res: express.Response) => {
        let kor_ime = req.body.kor_ime
        let lozinka = req.body.lozinka
        let ime = req.body.ime
        let prezime = req.body.prezime
        let tip = req.body.tip          
        let indeks = req.body.indeks    
        let prosek = req.body.prosek    

        if (tip !== "student" && tip !== "profesor") {
            res.status(400).json({ message: "Nevalidan tip korisnika" })
            return
        }

        if (tip === "student") {
            if (!indeks || !prosek) {
                res.status(400).json({ message: "Student mora uneti indeks i prosek" })
                return
            }
            if (!INDEKS_REGEX.test(indeks)) {
                res.status(400).json({ message: "Indeks mora biti u formatu GGGG/BBBB (npr. 2022/0054)" })
                return
            }
            const prosekBroj = parseFloat(prosek)
            if (isNaN(prosekBroj) || prosekBroj < 6 || prosekBroj > 10) {
                res.status(400).json({ message: "Prosek mora biti broj između 6 i 10" })
                return
            }
        }

        bcrypt.hash(lozinka, 10).then((hashLozinke) => {
            let noviKorisnik: {
                kor_ime: string;
                lozinka: string;
                ime: string;
                prezime: string;
                tip: "student" | "profesor";
                indeks?: string;
                prosek?: number;
            } = {
                kor_ime, lozinka: hashLozinke, ime, prezime, tip
            }
            if (tip === "student") {
                noviKorisnik.indeks = indeks
                noviKorisnik.prosek = parseFloat(prosek)
            }

            new KorisnikModel(noviKorisnik).save().then(() => {
                res.json({ message: "Registracija uspešna" })
            }).catch((err) => {
                console.log(err)
                res.status(400).json({ message: "Registracija nije uspela (korisničko ime ili indeks već postoje)" })
            })
        })
    }
}