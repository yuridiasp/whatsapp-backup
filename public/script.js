(function readyJS (win,doc) {

    'use strict'
    const root = document.documentElement
    let conversas = document.querySelectorAll("form.chat")
    let button = document.querySelectorAll(".envConversa")
    let divSub = document.getElementById("btn-submit")
    let nomeConversa = document.querySelector(".nomearConversa")
    let inputFile = document.querySelector("#inputBackup")
    let labelTxtFile = document.querySelector(".addTxt div p")
    let iconTxtFile = document.querySelector(".btn-mais")
    let btnFileConfirm = document.querySelector("#confirmar")
    let btnFileCancel = document.querySelector("#cancelar")
    let divConteudo = document.getElementById("conteudo")
    const pesquisaC = document.getElementById("pesquisa-c")
    const body = document.body
    const formFile = document.querySelector(".addTxt")
    const labelAddTxt = document.querySelector(".addTxt label")
    const opcoesChat = document.getElementById("opcoesChat")
    const btnEditConversa = document.querySelectorAll(".btnEdit")
    let inputNome = document.getElementById("nome")
    const confirmEdit = document.getElementById("confirmChange")
    const delEdit = document.getElementById("delChat")
    const btnTema = document.querySelectorAll(".tema button")

    let data = "0"
    let page = 1
    let idConversa
    let conversa
    // let scrollHeightOld = 0
    // let scrollHeightNew = 0
    let controle = true

    function changeTheme(e) {
        switch (e) {
            case 'dark':
                root.style.setProperty('--body-bg', '#090E11')
                root.style.setProperty('--input-bg', '#2A2F32')
                root.style.setProperty('--titulo-bg', '#016e63')
                root.style.setProperty('--icon-bg', '#6E7377')
                root.style.setProperty('--icon-color', '#D8DBD6')
                root.style.setProperty('--popup-bg', '#000000af')
                root.style.setProperty('--confirmarBtn-bg', '#23bb81')
                root.style.setProperty('--cancel-delBtn-bg', '#972038')
                root.style.setProperty('--avisoCript-bg', '#1E2A30')
                root.style.setProperty('--nMsg-bg', '#1E2A30')
                root.style.setProperty('--msg-bg', '#056162')
                root.style.setProperty('--fontInverse-color', '#262D31')
                root.style.setProperty('--sucesso-popup-bg', '#2e8b56e0')
                root.style.setProperty('--erro-popup-bg', '#dc143ce0')
                root.style.setProperty('--front-bottomBar-bg', '#009688')
                root.style.setProperty('--front-colorOrbg','#ffffff')
                root.style.setProperty('--loader-bg', '#003f39')
                root.style.setProperty('--loader-border', '#00ffe5')
                root.style.setProperty('--wpp-bg', '#2A2F32')
                root.style.setProperty('--header-bg', '#090E11')
                root.style.setProperty('--black-to-white', '#ffffff')
                break;

            case 'light':
                root.style.setProperty('--body-bg', '#D8DBD6')
                root.style.setProperty('--input-bg', '#F6F6F6')
                root.style.setProperty('--titulo-bg', '#016e63')
                root.style.setProperty('--icon-bg', '#505050')
                root.style.setProperty('--icon-color', '#D8DBD6')
                root.style.setProperty('--popup-bg', '#000000af')
                root.style.setProperty('--confirmarBtn-bg', '#23bb81')
                root.style.setProperty('--cancel-delBtn-bg', '#972038')
                root.style.setProperty('--avisoCript-bg', '#FFF5C4F2')
                root.style.setProperty('--nMsg-bg', '#E1F5FEEB')
                root.style.setProperty('--msg-bg', '#DCF8C6')
                root.style.setProperty('--fontInverse-color', '#ffffff')
                root.style.setProperty('--sucesso-popup-bg', '#2e8b56e0')
                root.style.setProperty('--erro-popup-bg', '#dc143ce0')
                root.style.setProperty('--front-bottomBar-bg', '#009688')
                root.style.setProperty('--front-colorOrbg', '#5050506e')
                root.style.setProperty('--loader-bg', '#003f39')
                root.style.setProperty('--loader-border', '#00ffe5')
                root.style.setProperty('--wpp-bg', '#F8F9FA')
                root.style.setProperty('--header-bg', '#009688')
                root.style.setProperty('--black-to-white', '#000000')
                break;
        }
    }

    //Personalizar botão de enviar arquivo de backup txt do Whatsapp
    function changeOptInput () {
        labelAddTxt.classList.add("c-pointer")
        let nome = "Carregar arquivo de backup em formato .txt"
        if (inputFile.files.length > 0) {
            nome = inputFile.files[0].name
            iconTxtFile.innerHTML = '<i class="fa fa-file-text" aria-hidden="true"></i>'
            divSub.classList.remove("d-none")
        }
        else {
            divSub.classList.add("d-none")
            iconTxtFile.innerHTML = '<span></span><span></span>'
        }
        labelTxtFile.innerHTML = nome
    }

    function resetFormSendFile() {
        const divSendFile = document.querySelector(".chat.envDoc")
        const formFile = document.querySelector("form.addTxt")
        divSendFile.removeChild(formFile)
        divSendFile.innerHTML = `<form class="addTxt c-pointer" action="/send" method="POST" autocomplete="off">
                                    <label for="inputBackup">
                                        <div class="btn-mais">
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <div>
                                            <p>Carregar arquivo de backup em formato .txt</p>
                                        </div>
                                    </label>
                                    <input accept=".txt" type="file" name="backup" id="inputBackup" style="display: none;">
                                    <div id="btn-submit" class="d-none">
                                        <div class="nomeConversa">
                                            <input id="nomearConversa" class="nomearConversa" type="text" name="nomearConversa" placeholder="Nome da conversa...">
                                        </div>
                                        <button class="btn-styled confirmar c-pointer" type="submit" value="load">Confirmar</button>
                                        <button class="btn-styled cancelar c-pointer" type="reset" value="cancel">Cancelar</button>
                                    </div>
                                </form>`
    }

    //Desabilita botão das conversas para evitar clique duplo e carregar as mensagens mais de uma vez
    function travaButton(btn) {
        liberaButton()
        btn.disabled = true
    }

    //Ativa todos os botões das conversas
    function liberaButton() {
        inputFile.disabled = false

        btnEditConversa.forEach(btn => {
            btn.disabled = false
        })

        button.forEach(btn => {
            btn.disabled = false
        })
    }

    //Fecha a conversa que está sendo visualizada
    function closeChat(event) {
        ativarDivConteudo(0)
        divConteudo.classList.remove("fundo-1")
        divConteudo.innerHTML = `<div class="front">
                                    <img src="/image/ImgBackup.png" alt="" srcset="">
                                    <div class="front-txt">
                                        <h1>Faça o backup das suas conversas</h1>
                                        <p>Exporte as suas conversas, envie o arquivo de texto gerado e suas mensagens serão carregadas.</p>
                                    </div>
                                    <div class="front-txt">
                                        <p>Arraste aqui o seu arquivo para carregá-lo.</p>
                                    </div>
                                </div>`
        liberaButton()
    }

    //Avançar página das conversas
    function nextPage(event) {
        page++
        addInToDOM(1)
        
    }

    //Modifica o estilo da div Conteúdo para trazer para frente ou para trás
    function ativarDivConteudo(index) {
        divConteudo.style.zIndex = index
    }

    //Adiciona ao DOM a estrura básica do HTML para receber as conversas via Ajax
    function criarEstruturaHtml() {
        divConteudo.innerHTML = `<div class="cabecalho">
                                    <div class="info-conv">
                                        <div class="icon">
                                            <!-- <img src="/image/yuri.jpeg" alt=""> -->
                                            <i class="fa fa-users" aria-hidden="true"></i>
                                        </div>
                                        <h3 id="nomeConv" class="nome">Nome da Conversa</h3>
                                    </div>
                                    <div id="fecharMsg" class="fecharMsg">
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                                <div class="mensagens">
                                    
                                </div>
                                <div class="pesquisa-msg">
                                    <div class="lupa">
                                        <i class="fa fa-search" aria-hidden="true"></i>
                                    </div>
                                    <div class="search">
                                        <input type="search" name="pesquisa" id="pesquisa-m" placeholder="Pesquisar mensagem">
                                    </div>
                                </div>`
        divConteudo.classList.add("fundo-1")
        let xChat = document.getElementById("fecharMsg")
        xChat.addEventListener("click", event =>{
            closeChat()
        })
        const pesquisaM = document.getElementById("pesquisa-m")
        pesquisaM.addEventListener('input', event => {
            document.querySelector(".mensagens").innerHTML = ''
            const inputValue = event.target.value.toLowerCase()
            let data
            for (let c = 0; c < conversa.mensagens.length; c++) {
                if (conversa.mensagens[c].ehMsg === true){
                    const msgTxt = conversa.mensagens[c].toLowerCase()
                    if (msgTxt.includes(inputValue)) {
                        let classe
                            
                        conversa.mensagens[c].user === 'Poliana' ? classe = 'eu' : classe ='outro'
                        document.querySelector(".mensagens").innerHTML += data + `<div class="mensagem active ${classe}">
                                <h3>${conversa.mensagens[c].user}</h3>
                                <p>${conversa.mensagens[c].msg}</p>
                                <p class="txt-r">${conversa.mensagens[c].hora.slice(0,5)}</p>
                            </div>`
                    }
                }
                else {
                    if (conversa.mensagens[c].msg[2] == '/' && conversa.mensagens[c].msg[5] == '/') {
                        data = `<div class="data">${conversa.mensagens[c].msg}</div>`
                    }
                }
            }
        })
    }

    //Adiciona mensagens ao DOM
    function addInToDOM(n) {
        if (n == 0) {
            criarEstruturaHtml()
            addEventScroll()
            ativarDivConteudo(1)
            addInToDOM(1)
        }
        else {
            let mensagens = document.querySelector(".mensagens")
            const nomeConv = document.querySelector("#nomeConv")
            nomeConv.textContent = conversa.nome
            conversa.mensagens.forEach(msg => {
                if (msg.page == page) {
                    if (data !== msg.data) {
                    data = msg.data
                    mensagens.innerHTML += `<div class="data">${data}</div>`
                    }
                    let cript = msg.msg.indexOf("As mensagens e as ligações são protegidas com a criptografia")
                    
                    if (!msg.ehMsg) {
                        mensagens.innerHTML += `<div class="data">${msg.msg}</div>`
                    }
                    else {
                        if (cript != -1) {
                            mensagens.innerHTML += `<div class="cript">${msg.msg}</div>`
                        }
                        else {
                            let classe
                            
                            msg.user === 'Poliana' ? classe = 'eu' : classe ='outro'
                            
                            mensagens.innerHTML += `<div class="mensagem active ${classe}">
                                <h3>${msg.user}</h3>
                                <p>${msg.msg}</p>
                                <p class="txt-r">${msg.hora.slice(0,5)}</p>
                            </div>`
                        }
                    }
                }
                //scrollBottom(mensagens)
            })
            mensagens.innerHTML +=   `<div class="loader">
                                        <span></span>
                                    </div>`
            controle = true
        }
    }

    function removeLoader(loader, mensagens) {
        mensagens.removeChild(loader)
        nextPage()
    }
    
    function showLoader(mensagens) {
        let loader = document.querySelector(".loader")
        loader.classList.add('active')
        setTimeout(() => {
            removeLoader(loader,mensagens)
        }, 1000);
    }
    
    function addEventScroll() {
        let mensagens = document.querySelector(".mensagens") 
        mensagens.addEventListener('scroll', () => {
            const proximoFimPage = mensagens.scrollTop + mensagens.clientHeight >= mensagens.scrollHeight - 10
        
            if (proximoFimPage && controle) {
                controle = false
                showLoader(mensagens)
            }
        })
            
            // const proximoFimPage = mensagens.scrollTop == 0
            // if (proximoFimPage) {
                //     scrollHeightOld = mensagens.scrollHeight
                //     nextPage()
                //     scrollHeightNew = mensagens.scrollHeight
                //     mensagens.scrollTop = scrollHeightNew - scrollHeightOld
            // }
    }
    
    function showEditPopUp() {
        inputNome.value = conversa.nome
        opcoesChat.classList.remove("d-none")
    }

    function closeEditPopUp() {
        opcoesChat.classList.add("d-none")
        liberaButton()
    }

    // function scrollToBottom(mensagens) {
    //     mensagens.scrollTop = mensagens.scrollHeight
    // }

    function overFileAction(event) {
        event.stopPropagation()
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
        console.log("inserindo")
    }

    function dropFileAction(event) {
        event.stopPropagation()
        event.preventDefault()
        console.log("opa!")
    }

    //Adiciona ao DOM uma resposta da requisição AJAX para erro ou sucesso
    function respostaSendFile(msg) {
        body.innerHTML += `<div id="resposta" class="${msg[1]}">
                                <p>${msg[2]}</p>
                            </div>`
        let resposta = document.getElementById("resposta")
        resposta.classList.add("show")
        setTimeout(() => {
            resposta.classList.remove("show")
            setTimeout(() => {
                body.removeChild(resposta)
                liberaButton()
            }, 600);
        }, 3000)
    }
    
    //Requisição Ajax
    function sendForm (event, rout,enctype,f) {
        event.preventDefault()
        travaButton(event.target)
        page = 1
        const ajax = new XMLHttpRequest()
        ajax.open('POST',rout)
        ajax.onreadystatechange = function () {
            if (ajax.status === 200 && ajax.readyState === 4) {
                const resposta = JSON.parse(ajax.responseText)
                switch (resposta[0]) {
                    case "resp": {
                        respostaSendFile(resposta) }
                        break;

                    case "edit": {
                        conversa = resposta[1]
                        showEditPopUp() }
                        break;
                
                    default: {
                        conversa = resposta[1]
                        addInToDOM(0) }
                        break;
                }
            }
        }

        switch (rout) {
            //Carregar as conversas do banco de dados
            case '/index': {
                ajax.setRequestHeader('Content-type',enctype)
                ajax.send("id=" + idConversa + "&f=" + f) }
                break;

            //Editar conversa selecionada
            case '/edit': {
                ajax.setRequestHeader('Content-type',enctype)
                ajax.send("id=" + idConversa + "&nome=" + inputNome.value) }
                break;

            case '/del': {
                ajax.setRequestHeader('Content-type',enctype)
                ajax.send("id=" + idConversa) }
                break;
        
            //Enviar novas conversas a partir de arquivo de backup em formato .txt
            default: { 
                const formData = new FormData()
                formData.append('nome', nomeConversa.value)
                formData.append('arquivo', inputFile.files[0])
                ajax.send(formData) }
                break;
        }
    }


    //Adicionando Eventos
        //Armazenar o ID da conversa clicada para fazer requisição ao banco de dados
        for (let c = 0; c < conversas.length; c++) {
            conversas[c].addEventListener("click", event => {
                const classClickedElement = event.target.classList[0]
                const classElementOfEdit = ["editar-excluir"]
                const validatedShowEdit = classElementOfEdit.some( classlist => classlist === classClickedElement)
                if (event.target != btnEditConversa[c]) {
                    if (validatedShowEdit) {
                        idConversa = btnEditConversa[c].value
                        btnEditConversa[c].click()
                    }
                    else {
                        idConversa = button[c].value
                        button[c].click()
                    }
                }
            })
        }

        btnEditConversa.forEach(btn => {
            btn.addEventListener("click", event => {
                sendForm(event,'/index','application/x-www-form-urlencoded','edit')
        }, false)})


        //Fechar janela pop-up de edição/exclusão da conversa
        opcoesChat.addEventListener('click',event => {

            const classClickedElement = event.target.classList[0]
            const classElementOfClose = ["xEdit"]
            const validatedClose = classElementOfClose.some( classlist => classlist === classClickedElement)

            if (validatedClose)
                closeEditPopUp()
        })

        confirmEdit.addEventListener('click', event => {
            sendForm(event,'/edit','application/x-www-form-urlencoded')
        },false)

        delEdit.addEventListener('click', event => {
            sendForm(event,'/del','application/x-www-form-urlencoded')
        },false)

        btnTema.forEach(btn => {
            btn.addEventListener('click', event => {
                btnTema[0].classList.remove("ativo") 
                btnTema[1].classList.remove("ativo") 
                changeTheme(event.target.value)
                event.target.classList.add("ativo")
            })
        })

        //Gerar solicitação Ajax do conteúdo das conversas
        button.forEach(btn => {
            btn.addEventListener("click", event => {
                sendForm(event,'/index','application/x-www-form-urlencoded','load')
        }, false)})

        //Modificar estilo da div Conteudo quando arquivo por arrastado para sua área
        divConteudo.addEventListener('dragover', event => {
            event.target.classList.add("active")
        },false)

        //Restaurar estilo da div Conteudo quando arquivo for removido da sua área
        divConteudo.addEventListener('dragleave', event => {
            event.target.classList.remove("active")
        })

        //Adicionar eventos para envio .txt
        function addEventFormSendBackup () {
            //Pesonalizar o botão de enviar arquivo quando arquvio é selecionado
            inputFile.addEventListener('input', event => {
                changeOptInput()
                travaButton(event.target)
                labelAddTxt.classList.remove("c-pointer")
            })

            //Gerar solicitação Ajax do input de arquivo
            btnFileConfirm.addEventListener("click", event => {
                sendForm(event,'/send','multipart/form-data')
                formFile.reset()
                changeOptInput()
                liberaButton()
            },false)
            
            //Resetar o botão de arquivo
            btnFileCancel.addEventListener("click", event =>{
                formFile.reset()
                changeOptInput()
                liberaButton()
            })
        }

        //Chamar a função para adicionar eventos para envio .txt
        addEventFormSendBackup()

})(window, document)