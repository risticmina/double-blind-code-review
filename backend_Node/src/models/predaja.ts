import mongoose from "mongoose";

const predajaSchema = new mongoose.Schema({
    zadatakId: { type: mongoose.Schema.Types.ObjectId, ref: "ZadatakModel", required: true },
    autorKorIme: { type: String, required: true },
    kod: { type: String, required: true },
    brojProslihTestova: { type: Number, required: true },
    bazniPoeni: { type: Number, required: true },
    finalnaOcena: { type: Number, default: null },
    datumPredaje: { type: Date, default: Date.now }
})

export default mongoose.model('PredajaModel', predajaSchema, 'predaje');