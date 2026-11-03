import express from 'express'
import { PredajaController } from '../controllers/predaja.controller'

const predajaRouter = express.Router();

predajaRouter.route('/:id/predaj').post(
    (req, res) => new PredajaController().predajResenje(req, res)
)

predajaRouter.route('/:id/moja-predaja/:autorKorIme').get(
    (req, res) => new PredajaController().mojaPredaja(req, res)
)

predajaRouter.route('/moji-zahtevi/:korIme').get(
    (req, res) => new PredajaController().mojiZahtevi(req, res)
)

predajaRouter.route('/zahtevi/:korIme/:zadatakId').get(
    (req, res) => new PredajaController().zahteviZaZadatak(req, res)
)

predajaRouter.route('/recenzija/:id').get(
    (req, res) => new PredajaController().jednaRecenzija(req, res)
)

predajaRouter.route('/recenzija/:id/potvrdi').post(
    (req, res) => new PredajaController().potvrdiRecenziju(req, res)
)

predajaRouter.route('/rezultat/:zadatakId/:autorKorIme').get(
    (req, res) => new PredajaController().rezultatPredaje(req, res)
)

predajaRouter.route('/pregledano/:korIme').get(
    (req, res) => new PredajaController().pregledaniKodovi(req, res)
)
export default predajaRouter;