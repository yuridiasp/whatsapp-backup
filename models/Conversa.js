const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Conversa = new Schema ({
    nome: {
        type: String,
        required: true
    },
    lastMsg: {
        type: String,
        required: true
    },
    mensagens: {
        type: [],
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("conversas", Conversa)