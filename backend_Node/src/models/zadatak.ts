import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    ulaz: { type: [mongoose.Schema.Types.Mixed], required: true },
    ocekivaniIzlaz: {
        type: mongoose.Schema.Types.Mixed,
        required: function() { return this.ocekivaniIzlaz === undefined }
    }
}, { _id: false })

const zadatakSchema = new mongoose.Schema({
    naziv: { type: String, required: true },
    opis: { type: String, required: true },
    imeFunkcije: { type: String, required: true },  
    testovi: { type: [testSchema], required: true },  
    pravilaOcenjivanja: { type: String, default: "" },  
    datumKreiranja: { type: Date, default: Date.now }
})

export default mongoose.model('ZadatakModel', zadatakSchema, 'zadaci');