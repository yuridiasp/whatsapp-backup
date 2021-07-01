'use strict'

const express = require('express')
const fs = require('fs');
const path = require('path')
const passport = require ('passport')
const bodyParser = require('body-parser')
const multer = require('multer')
const app = express()
const db = require("./config/db")
const passaport = require("passport")
require("./config/auth")(passaport)
const session = require ('express-session')
const mongoose = require ('mongoose')
const flash = require ('connect-flash')
require("./models/Conversa")
require("./models/Usuario")
const Conversas = mongoose.model('conversas')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const {logado} = require("./helpers/logado")


//Configurações
    //Sessão
        app.use(session({
            secret: "wppbackup",
            resave: true,
            saveUninitialized:true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())

    //Middleware
        app.use((req,res,next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
            next();
        })

    //EJS
        app.set("view engine","ejs")

    //Body Parser
        app.use (bodyParser.urlencoded({extended:false}))
        app.use(bodyParser.json())

    //Mongoose
        mongoose.connect(db.mongoURI, {
            useNewUrlParser: true
        }).then(() =>{
            console.log("Conectado ao mongo!")
        }).catch((erro) => {
            console.log("Erro para conectar ao servidor: " + erro)
        })

    //Public
        app.use(express.static(path.join(__dirname,"public")))
        app.use((req,res,next) => {
            next()
        })

function leituraArquivo (params) {

    function formataMensagens (dados) {

        dados[0] = dados[0].replace('\"',``)
        dados[dados.length-1] = dados[dados.length-1].replace('\"','')
        
        let msg = []
        let data
        let hora
        let texto
        let user
        let page = 1
        let contador = 1

        dados.forEach(dado => {
            if (contador == 20){
                ++page
                contador = 1
            }
            let EhMsg = true
            dado = dado.trim()
            const loc = dado.indexOf('[')+1

            if (dado.indexOf('[') != -1) {
                dado = dado.slice(loc)
            }

            if (dado.indexOf("‎Você criou este grupo") != -1 || dado.indexOf("‎Você mudou a imagem do grupo") != -1) {
                EhMsg = false
            }
            
            if (dado[2] == '/' && dado[5] == '/') {
                if (!EhMsg) {
                    texto = dado.slice(21)
                }
                else {
                    user = dado.slice(19)
                    user = user.trim()
                    user = user.slice(0,user.indexOf(':'))
                    data = dado.slice(0,10)
                    hora = dado.slice(11,19)
                    texto = dado.slice(dado.indexOf(user))
                    texto = texto.slice(texto.indexOf(':')+1)
                    msg.push({user: user, msg: texto, data: data, hora: hora, ehMsg: EhMsg, page: page})
                }
            }
            else {
                if (msg.length > 0) {
                    let last = msg.length-1
                    msg[last].msg += `<br>${dado}`
                }
            }
            ++contador
        })
            return msg
        }
        
        function formataDado(arquivo) {
            //Remover \r, >, < do texto
            arquivo = arquivo.replace(/\\r/gi,'')
            arquivo = arquivo.replace(/>/gi,'&gt;')
            arquivo = arquivo.replace(/</gi,'&lt;')
            arquivo = arquivo.replace(/<Arquivo de mídia oculto>/gi,'&lt;Arquivo de mídia oculto&gt;')
            arquivo = arquivo.replace(/]/gi,'')

            //Didivir as mensagens separando por quebra de linha
            let msg = []
            msg = arquivo.split("\\n")
            msg[0] = msg[0].replace('\"','')
            msg[msg.length-1] = msg[msg.length-1].replace('\"','')

            return formataMensagens(msg)
            // return msg
    }

    
    return new Promise ((resolve) => {
        
        if (params == 0 || params == 1 || params == 3) {
            let url = ["backup/Yuri/_chat.txt","backup/Grupo Poli/_chat.txt","backup/teste.txt"]
            
            fs.readFile(url[params], 'utf-8', function (err, data) {
                if(err) throw console.log(`Houve um erro para ler o arquivo ${url[params]} | Erro interno: ${err}`);
                let msg = formataDado(JSON.stringify(data))
                resolve(msg)
            })
        }
        else {
            let msg = formataDado(params)
            resolve(msg)
        }
    })
}

function salvaConversa (msg,nome) {

    return new Promise ((resolve) => {
        let resposta
        Conversas.findOne({nome: nome}).lean().then((conversa) => {
            if (conversa) {
                resposta = ["resp","erro","Já existe uma conversa com essse nome!"]
                resolve(resposta)
            }
            else {
                const lastMsg = `${msg[msg.length-1].user}: ${msg[msg.length-1].msg}`
                const novaConversa = new Conversas ({
                    nome: nome,
                    lastMsg: lastMsg,
                    mensagens: msg
                })

                novaConversa.save().then(() => {
                    resposta = ["resp","sucesso","Conversa salva com sucesso!"]
                    resolve(resposta)
                }).catch((erro) => {
                    resposta = ["resp","erro",`Erro ao salvar conversa no banco de dados: ${erro}`]
                    resolve(resposta)
                })
            }
        }).catch((erro) => {
            resposta = ["resp","erro",`Houve um erro interno: ${erro}`]
            resolve(resposta)
        })
    })
}

app.get("/index", logado, (req,res) => {
    Conversas.find().lean().sort({data:"desc"}).then((conversas) => {
        res.render("pages/index", {conversas: conversas})
    }).catch((erro)=> {
        req.flash("error_msg","Houve um erro interno: " + erro)
        res.redirect("/")
    })
})

app.post("/index", logado, (req,res) => {
    const id = req.body.id
    Conversas.findOne({_id: id}).lean().then((conversa)=> {
        if (conversa) {
            switch (req.body.f) {
                case "edit":
                    res.send(["edit" ,conversa])
                    break;
                    
                default:
                    res.send(["load" ,conversa])
                    break;
            }
        }
        else {
            res.send(["resp","erro", "Conversa não encontrada!"])
        }
    }).catch((erro) => {
        res.send(["resp","erro","Erro interno: " + erro])
    })
})

app.post("/send", logado, (req,res) => {

    const upload = multer().single('arquivo')

    upload(req,res, err => {
        if (err || req.file === undefined) {
            console.log(`Erro no envio do arquivo: ${err}`)
            res.send(["resp","erro",`Erro no envio do arquivo: ${err}`])
        }
        else {
            let nome = req.body.nome
            let msg = JSON.stringify(req.file.buffer.toString())
            leituraArquivo(msg,nome).then( msg => {
                    return salvaConversa(msg,nome) 
                }).then(resposta => {
                    res.send(resposta)
            }).catch((erro) => {
                console.log(erro)
                res.send(["resp","erro",`Houve um erro interno: ${erro}`])
            })
        }
    })

})

app.get("/", (req,res) => {
    res.render("pages/login")
})

app.post("/", (req, res, next) => {
    passport.authenticate('local',
    {
        successRedirect: '/index',
        failureRedirect: '/',
        failureFlash: true
    })
    (req, res, next)
})

app.post("/edit", (req,res) => {
    Conversas.findOne({_id: req.body.id}).then((conversa) => {
        conversa.nome = req.body.nome

        conversa.save().then(() => {
            res.send(["resp","sucesso",`Conversa editada com sucesso!`])
        }).catch((erro) => {
            res.send(["resp","erro",`Erro interno: ${erro}`])
        })
    }).catch((erro) => {
        res.send(["resp","erro",`Houve um erro na edição da conversa: ${erro}`])
    })

})

app.post("/del", (req,res) => {
    Conversas.deleteOne({_id: req.body.id}).then(() => {
        res.send(["resp","sucesso",`Conversa apagada!`])
    }).catch((erro) => {
        res.send(["resp","erro",`Houve um erro para apagar conversa: ${erro}`])
    })
})

app.get("/logout",logado, (req,res) => {
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso!")
    res.redirect("/")
})

app.listen(8080, () => {
    console.log("Servidor rodando!")
})

function registro (login, senha) {
    Usuario.findOne({login: login}).lean().then((usuario) => {
        if (usuario) {
            console.log("Já existe uma conta com esse email!")
        }
        else {
            const novoUsuario = new Usuario ({
                login: login,
                senha: senha
            })

            bcrypt.genSalt(10,(erro, salt) => {
                bcrypt.hash(novoUsuario.senha,salt,(erro,hash) => {
                    if (erro) {
                        console.log("Houve um erro durante o cadastro de usuário: " + erro)
                    }
                    else {
                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            console.log("Usuário criado com sucesso!")
                        }).catch((erro) => {
                            console.log("Erro ao criar usuário: " + erro)
                        })
                    }
                })
            })
        }
    }).catch((erro) => {
        console.log("Houve um erro interno: " + erro)
    })
}