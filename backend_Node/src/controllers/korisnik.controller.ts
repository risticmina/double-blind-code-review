import express from 'express'
import KorisnikModel from '../models/korisnik'

export class KorisnikController {

    izmeniProsek = async (req: express.Request, res: express.Response) => {
        try {
            const korIme = req.params.korIme
            const noviProsek = parseFloat(req.body.prosek)

            if (isNaN(noviProsek) || noviProsek < 6 || noviProsek > 10) {
                res.status(400).json({ message: "Prosek mora biti broj između 6 i 10" })
                return
            }

            const korisnik = await KorisnikModel.findOne({ kor_ime: korIme })
            if (!korisnik) {
                res.status(404).json({ message: "Korisnik ne postoji" })
                return
            }
            if (korisnik.tip !== "student") {
                res.status(400).json({ message: "Samo student ima prosek" })
                return
            }

            korisnik.prosek = noviProsek
            await korisnik.save()

            res.json({ message: "Prosek izmenjen", prosek: noviProsek })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        }
    }
}