import express from 'express'
import vm from 'vm'
import ZadatakModel from '../models/zadatak'
import PredajaModel from '../models/predaja'
import KorisnikModel from '../models/korisnik'
import RecenzijaModel from '../models/recenzija'
import mongoose from 'mongoose'

export class PredajaController {

    predajResenje = (req: express.Request, res: express.Response) => {
        const zadatakId = req.params.id
        const kodStudenta = req.body.kod
        const autorKorIme = req.body.autorKorIme

        PredajaModel.findOne({ zadatakId, autorKorIme }).then((postojecaPredaja) => {
            if (postojecaPredaja) {
                res.status(400).json({ message: "Već ste predali rešenje za ovaj zadatak" })
                return
            }

            ZadatakModel.findById(zadatakId).then((zadatak) => {
                if (!zadatak) {
                    res.status(404).json({ message: "Zadatak ne postoji" })
                    return
                }

                const rezultati = zadatak.testovi.map((test) => {
                    let dobijenoIzlaz
                    let greska = null
                    try {
                        const sandbox = vm.createContext({})
                        const skripta = `
                            ${kodStudenta}
                            rezultatFunkcije = ${zadatak.imeFunkcije}(...${JSON.stringify(test.ulaz)})
                        `
                        vm.runInContext(skripta, sandbox, { timeout: 1000 })
                        dobijenoIzlaz = sandbox.rezultatFunkcije
                    } catch (err: any) {
                        greska = err.message
                    }
                    const prosao = greska === null && JSON.stringify(dobijenoIzlaz) === JSON.stringify(test.ocekivaniIzlaz)
                    return { prosao }
                })

                const brojProslihTestova = rezultati.filter(r => r.prosao).length
                const bazniPoeni = brojProslihTestova * 20

                const novaPredaja = {
                    zadatakId, autorKorIme, kod: kodStudenta, brojProslihTestova, bazniPoeni
                }

                new PredajaModel(novaPredaja).save().then((sacuvanaPredaja) => {
                    this.dodeliRecenzente(sacuvanaPredaja._id, autorKorIme).then(() => {
                        res.json({ message: "Rešenje uspešno predato", brojProslihTestova, bazniPoeni })
                    }).catch((err) => {
                        console.log(err)
                        res.json({ message: "Rešenje predato, ali dodela recenzenata nije uspela", brojProslihTestova, bazniPoeni })
                    })
                }).catch((err) => {
                    console.log(err)
                    res.status(400).json({ message: "Greška pri predaji" })
                })

            }).catch((err) => {
                console.log(err)
                res.status(500).json({ message: "Greška na serveru" })
            })
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        })
    }

    mojaPredaja = (req: express.Request, res: express.Response) => {
        const zadatakId = req.params.id
        const autorKorIme = req.params.autorKorIme

        PredajaModel.findOne({ zadatakId, autorKorIme }).then((predaja) => {
            res.json({ predaja })
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        })
    }

    dodeliRecenzente = async (predajaId:  mongoose.Types.ObjectId, autorKorIme: string) => {
        const autor = await KorisnikModel.findOne({ kor_ime: autorKorIme })
        if (!autor || autor.prosek === null || autor.prosek === undefined) {
            throw new Error("Autor nema definisan prosek")
        }
        const prosekAutora: number = autor.prosek

       
        const profesor = await KorisnikModel.findOne({ tip: "profesor" })
        if (profesor) {
            await new RecenzijaModel({
                predajaId, recenzentKorIme: profesor.kor_ime, tipRecenzenta: "profesor"
            }).save()
        }

       
        let opseg = 1
        let izabraniStudenti: string[] = []

        while (izabraniStudenti.length < 2 && opseg <= 4) {
            const kandidati = await KorisnikModel.find({
                tip: "student",
                kor_ime: { $ne: autorKorIme, $nin: izabraniStudenti },
                prosek: { $gte: prosekAutora - opseg, $lte: prosekAutora + opseg }
            })

            
            const kandidatiSaBrojem = await Promise.all(kandidati.map(async (k) => {
                const brojDodeljenih = await RecenzijaModel.countDocuments({ recenzentKorIme: k.kor_ime, tipRecenzenta: "student" })
                return { korIme: k.kor_ime, brojDodeljenih }
            }))

           
            kandidatiSaBrojem.sort((a, b) => a.brojDodeljenih - b.brojDodeljenih)

            for (let k of kandidatiSaBrojem) {
                if (izabraniStudenti.length >= 2) break
                izabraniStudenti.push(k.korIme)
            }

            opseg++
        }

       
        if (izabraniStudenti.length < 2) {
            const sviStudenti = await KorisnikModel.find({
                tip: "student",
                kor_ime: { $ne: autorKorIme, $nin: izabraniStudenti },
                prosek: { $ne: null }
            })
            sviStudenti.sort((a: any, b: any) => Math.abs(a.prosek - prosekAutora) - Math.abs(b.prosek - prosekAutora))
            for (let s of sviStudenti) {
                if (izabraniStudenti.length >= 2) break
                izabraniStudenti.push(s.kor_ime)
            }
        }

        for (let korIme of izabraniStudenti) {
            await new RecenzijaModel({
                predajaId, recenzentKorIme: korIme, tipRecenzenta: "student"
            }).save()
        }
    }

    
    mojiZahtevi = async (req: express.Request, res: express.Response) => {
        try {
            const korIme = req.params.korIme
            const korisnik = await KorisnikModel.findOne({ kor_ime: korIme })
            if (!korisnik) {
                res.status(404).json({ message: "Korisnik ne postoji" })
                return
            }

            const nezavrseneRecenzije = await RecenzijaModel.find({ recenzentKorIme: korIme, zavrsena: false }).populate('predajaId')

           
            const brojPoZadatku: Record<string, number> = {}
            for (let r of nezavrseneRecenzije) {
                const predaja: any = r.predajaId
                if (!predaja) continue
                const zid = predaja.zadatakId.toString()
                brojPoZadatku[zid] = (brojPoZadatku[zid] || 0) + 1
            }

            const zadaciIds = Object.keys(brojPoZadatku)
            const zadaci = await ZadatakModel.find({ _id: { $in: zadaciIds } })

            const rezultat = await Promise.all(zadaci.map(async (z: any) => {
                let otkljucano = true
                if (korisnik.tip === "student") {
                    const svojaPredaja = await PredajaModel.findOne({ zadatakId: z._id, autorKorIme: korIme })
                    otkljucano = !!svojaPredaja
                }
                return {
                    zadatakId: z._id,
                    naziv: z.naziv,
                    brojNepregledanih: brojPoZadatku[z._id.toString()],
                    otkljucano
                }
            }))

            res.json({ zahtevi: rezultat })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        }
    }

  
    zahteviZaZadatak = async (req: express.Request, res: express.Response) => {
        try {
            const korIme = req.params.korIme
            const zadatakId = req.params.zadatakId

            const recenzije = await RecenzijaModel.find({
                recenzentKorIme: korIme, zavrsena: false
            }).populate('predajaId')

            const lista = recenzije
                .filter((r: any) => r.predajaId && r.predajaId.zadatakId.toString() === zadatakId)
                .map((r: any) => ({
                    recenzijaId: r._id,
                    brojProslihTestova: r.predajaId.brojProslihTestova,
                    bazniPoeni: r.predajaId.bazniPoeni
                }))

            res.json({ lista })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        }
    }

    jednaRecenzija = async (req: express.Request, res: express.Response) => {
        try {
            const id = req.params.id
            const recenzija: any = await RecenzijaModel.findById(id).populate('predajaId')

            if (!recenzija) {
                res.status(404).json({ message: "Recenzija ne postoji" })
                return
            }

            const predaja = recenzija.predajaId
            const zadatak = await ZadatakModel.findById(predaja.zadatakId)

            res.json({
                recenzijaId: recenzija._id,
                zavrsena: recenzija.zavrsena,
                dodatiOduzetiPoeni: recenzija.dodatiOduzetiPoeni,
                obojeniDelovi: recenzija.obojeniDelovi,
                kod: predaja.kod,
                brojProslihTestova: predaja.brojProslihTestova,
                bazniPoeni: predaja.bazniPoeni,
                zadatak: {
                    naziv: zadatak?.naziv,
                    opis: zadatak?.opis,
                    imeFunkcije: zadatak?.imeFunkcije,
                    testovi: zadatak?.testovi,
                    pravilaOcenjivanja: zadatak?.pravilaOcenjivanja
                }
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        }
    }

    potvrdiRecenziju = async (req: express.Request, res: express.Response) => {
        try {
            const id = req.params.id
            const { dodatiOduzetiPoeni, obojeniDelovi } = req.body

            const recenzija: any = await RecenzijaModel.findById(id)
            if (!recenzija) {
                res.status(404).json({ message: "Recenzija ne postoji" })
                return
            }

            recenzija.zavrsena = true
            recenzija.dodatiOduzetiPoeni = dodatiOduzetiPoeni
            recenzija.obojeniDelovi = obojeniDelovi
            recenzija.datumZavrsetka = new Date()
            await recenzija.save()

            const sveRecenzije = await RecenzijaModel.find({ predajaId: recenzija.predajaId })
            const sveZavrsene = sveRecenzije.every((r) => r.zavrsena)

            if (sveZavrsene && sveRecenzije.length === 3) {
                const predaja = await PredajaModel.findById(recenzija.predajaId)
                if (predaja) {
                    let ukupnoPondera = 0
                    let ukupnoPoena = 0

                    for (let r of sveRecenzije) {
                        const poeniRecenzenta = predaja.bazniPoeni + r.dodatiOduzetiPoeni
                        const koeficijent = r.tipRecenzenta === "profesor" ? 1.0 : 0.9
                        ukupnoPoena += poeniRecenzenta * koeficijent
                        ukupnoPondera += koeficijent
                    }

                    const finalnaOcena = Math.round((ukupnoPoena / ukupnoPondera) * 100) / 100
                    predaja.finalnaOcena = finalnaOcena
                    await predaja.save()
                }
            }

            res.json({ message: "Recenzija potvrđena" })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        }
    }

    rezultatPredaje = async (req: express.Request, res: express.Response) => {
        try {
            const { zadatakId, autorKorIme } = req.params
            const predaja: any = await PredajaModel.findOne({ zadatakId, autorKorIme })

            if (!predaja) {
                res.status(404).json({ message: "Predaja ne postoji" })
                return
            }

            if (predaja.finalnaOcena === null) {
                res.json({ zavrseno: false })
                return
            }

            const recenzije = await RecenzijaModel.find({ predajaId: predaja._id })

            const prikazi = recenzije.map((r: any) => ({
                obojeniDelovi: r.obojeniDelovi,
                dodatiOduzetiPoeni: r.dodatiOduzetiPoeni
            }))

            res.json({
                zavrseno: true,
                finalnaOcena: predaja.finalnaOcena,
                bazniPoeni: predaja.bazniPoeni,
                kod: predaja.kod,
                prikazi
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        }
    }

    pregledaniKodovi = async (req: express.Request, res: express.Response) => {
        try {
            const korIme = req.params.korIme

            const recenzije: any = await RecenzijaModel.find({ recenzentKorIme: korIme, zavrsena: true }).populate('predajaId')

            const validneRecenzije = recenzije.filter((r: any) => r.predajaId !== null)

            const rezultat = await Promise.all(validneRecenzije.map(async (r: any) => {
                const predaja = r.predajaId
                const zadatak = await ZadatakModel.findById(predaja.zadatakId)
                return {
                    recenzijaId: r._id,
                    nazivZadatka: zadatak?.naziv,
                    brojProslihTestova: predaja.brojProslihTestova,
                    bazniPoeni: predaja.bazniPoeni,
                    dodatiOduzetiPoeni: r.dodatiOduzetiPoeni,
                    datumZavrsetka: r.datumZavrsetka
                }
            }))

            res.json({ lista: rezultat })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        }
    }
}