import mongoose from "mongoose";

const recenzijaSchema = new mongoose.Schema({
    predajaId: { type: mongoose.Schema.Types.ObjectId, ref: "PredajaModel", required: true },
    recenzentKorIme: { type: String, required: true },
    tipRecenzenta: { type: String, enum: ["student", "profesor"], required: true },
    zavrsena: { type: Boolean, default: false },
    dodatiOduzetiPoeni: { type: Number, default: 0 },
    obojeniDelovi: { type: [mongoose.Schema.Types.Mixed], default: [] }, 
    datumDodele: { type: Date, default: Date.now },
    datumZavrsetka: { type: Date, default: null }
})

export default mongoose.model('RecenzijaModel', recenzijaSchema, 'recenzije');