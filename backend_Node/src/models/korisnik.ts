import mongoose from "mongoose";

const korisnikSchema = new mongoose.Schema({
    kor_ime: { type: String, required: true, unique: true },
    lozinka: { type: String, required: true },
    ime: { type: String, required: true },
    prezime: { type: String, required: true },
    tip: { type: String, enum: ["student", "profesor"], required: true },
    indeks: { type: String, default: null, unique: true, sparse: true },
    prosek: { type: Number, default: null },
    datumRegistracije: { type: Date, default: Date.now }
})

export default mongoose.model('KorisnikModel', korisnikSchema, 'korisnici');