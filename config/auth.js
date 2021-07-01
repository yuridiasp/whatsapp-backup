const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")


//Model de usuário
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: `login`,passwordField: `senha`},(login,senha,done) => {
        Usuario.findOne({login: login}).then((usuario) => {
            if (!usuario) {
                return done (null,false,{message: "Este usuário não existe!"})
            }

            bcrypt.compare(senha,usuario.senha,(erro,batem) => {
                if(batem) {
                    return done (null,usuario)
                }
                else {
                    return done (null, false, {message: "Senha incorreta!"})
                }
            })

        }).catch((erro) => {

        })
    }))

    passport.serializeUser((usuario,done) => {
        done (null, usuario.id)
    })

    passport.deserializeUser((id,done) => {
        Usuario.findById(id,(err,usuario) => {
            done(err,usuario)
        })
    })

}