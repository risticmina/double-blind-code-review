import express from 'express'
import { KorisnikController } from '../controllers/korisnik.controller'

const korisnikRouter = express.Router();

korisnikRouter.route('/prosek/:korIme').put(
    (req, res) => new KorisnikController().izmeniProsek(req, res)
)

export default korisnikRouter;