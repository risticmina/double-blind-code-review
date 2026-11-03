import express from 'express'
import ZadatakModel from '../models/zadatak'
import vm from 'vm'

export class ZadatakController {

    listaZadataka = (req: express.Request, res: express.Response) => {
        ZadatakModel.find({}, { naziv: 1 }).then((zadaci) => {
            res.json({ zadaci })
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        })
    }

    jedanZadatak = (req: express.Request, res: express.Response) => {
        const id = req.params.id
        ZadatakModel.findById(id).then((zadatak) => {
            if (!zadatak) {
                res.status(404).json({ message: "Zadatak ne postoji" })
                return
            }
            res.json({ zadatak })
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        })
    }

    dodajZadatak = (req: express.Request, res: express.Response) => {
        const { naziv, opis, imeFunkcije, testovi, pravilaOcenjivanja } = req.body

        if (!naziv || !opis || !imeFunkcije || !testovi || testovi.length === 0) {
            res.status(400).json({ message: "Nedostaju obavezna polja" })
            return
        }

        const noviZadatak = { naziv, opis, imeFunkcije, testovi, pravilaOcenjivanja }
        new ZadatakModel(noviZadatak).save().then(() => {
            res.json({ message: "Zadatak dodat" })
        }).catch((err) => {
            console.log(err)
            res.status(400).json({ message: "Greška pri dodavanju zadatka" })
        })
    }

    obrisiZadatak = (req: express.Request, res: express.Response) => {
        const id = req.params.id
        ZadatakModel.findByIdAndDelete(id).then(() => {
            res.json({ message: "Zadatak obrisan" })
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        })
    }

    azurirajZadatak = async (req: express.Request, res: express.Response) => {
        const id = req.params.id
        const { naziv, opis, imeFunkcije, testovi, pravilaOcenjivanja } = req.body

        if (!naziv || !opis || !imeFunkcije || !testovi || testovi.length === 0) {
            res.status(400).json({ message: "Nedostaju obavezna polja" })
            return
        }

        try {
            await ZadatakModel.updateOne(
                { _id: id },
                { $set: { naziv, opis, imeFunkcije, pravilaOcenjivanja, testovi } }
            )
            res.json({ message: "Zadatak izmenjen" })
        } catch (err) {
            console.log(err)
            res.status(400).json({ message: "Greška pri izmeni zadatka" })
        }
    }

    pokreniTest = (req: express.Request, res: express.Response) => {
        const id = req.params.id
        const kodStudenta = req.body.kod

        ZadatakModel.findById(id).then((zadatak) => {
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

                return {
                    ulaz: test.ulaz,
                    ocekivaniIzlaz: test.ocekivaniIzlaz,
                    dobijenoIzlaz: greska ? null : dobijenoIzlaz,
                    greska,
                    prosao
                }
            })

            const brojProslih = rezultati.filter(r => r.prosao).length

            res.json({ rezultati, brojProslih, ukupnoTestova: rezultati.length })

        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Greška na serveru" })
        })
    }

}