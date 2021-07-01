(function readyJS (win, doc) {

    const xerro = document.querySelector(".erro .x")
    const erro_msg = document.querySelector(".erro")
    const xsucesso = document.querySelector(".sucesso .x")
    const sucesso_msg = document.querySelector(".sucesso")
    // const btnLogin = document.querySelector(".btn-login")
    // const divLogin = document.querySelector(".login")
    // const formLogin = document.querySelector(".login form")

    if (xerro) {
        xerro.addEventListener("click",() => {
            erro_msg.style.display = "none"
        })
    }

    if (xsucesso)
        xsucesso.addEventListener("click",() => {
        sucesso_msg.style.display = "none"
    })

    // function animation () {
    //     formLogin.classList.add("animate-small")
    //     formLogin.addEventListener("animationend", event => {
    //         if (event.animationName == "animate-small") {
    //             formLogin.style.display = "none"
    //             formLogin.classList.remove("animate-small")
    //         }
    //     })
    // }

    function login (event) {
        event.preventDefault()
        animation()
        const ajax = new XMLHttpRequest()
        ajax.open('POST','/')
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        ajax.onreadystatechange = function () {
            if (ajax.status === 200 && ajax.readyState === 4) {
                const ok = ajax.responseText
                console.log(ok)
                if (ok === true) {
                    //window.location.href ="/index"
                }
            }
        }
        ajax.send()
    }

    // btnLogin.addEventListener('click', login, false)

})(window,document)