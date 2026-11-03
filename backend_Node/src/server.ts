import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRouter from './routes/auth.router'
import zadatakRouter from './routes/zadatak.router'
import predajaRouter from './routes/predaja.router'
import korisnikRouter from './routes/korisnik.router'

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/OcenjivanjeKoda')
const conn = mongoose.connection
conn.once('open', () => {
    console.log("database ok")
})

const router = express.Router();
router.use('/auth', authRouter)
router.use('/zadatak', zadatakRouter)
router.use('/predaja', predajaRouter)
router.use('/korisnik', korisnikRouter)
app.use('/', router);

app.listen(4000, ()=>console.log("Express running on port 4000!"))