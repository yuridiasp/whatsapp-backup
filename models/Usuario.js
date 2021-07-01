const mongoose = require ("mongoose")
const Schema = mongoose.Schema

const Usuario = new Schema({
    login: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    eAdmin: {
        type: Number,
        default: 1
    }
})

mongoose.model("usuarios", Usuario)