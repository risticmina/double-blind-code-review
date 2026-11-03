import express from 'express'
import { ZadatakController } from '../controllers/zadatak.controller'

const zadatakRouter = express.Router();

zadatakRouter.route('/').get(
    (req, res) => new ZadatakController().listaZadataka(req, res)
)

zadatakRouter.route('/').post(
    (req, res) => new ZadatakController().dodajZadatak(req, res)
)

zadatakRouter.route('/:id').get(
    (req, res) => new ZadatakController().jedanZadatak(req, res)
)

zadatakRouter.route('/:id').delete(
    (req, res) => new ZadatakController().obrisiZadatak(req, res)
)

zadatakRouter.route('/:id').put(
    (req, res) => new ZadatakController().azurirajZadatak(req, res)
)

zadatakRouter.route('/:id/pokreni-test').post(
    (req, res) => new ZadatakController().pokreniTest(req, res)
)


export default zadatakRouter;