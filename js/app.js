/* =========================================================
   WS SOLUÇÕES — APP.JS
   Painel principal
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const themeToggle = document.getElementById("themeToggle");
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    const moduleCards = document.querySelectorAll(".module-card");


    /* =====================================================
       MODO NOTURNO
    ===================================================== */

    const modoSalvo = localStorage.getItem("ws_modo_noturno");

    if (modoSalvo === "true") {
        document.body.classList.add("dark");
        atualizarBotaoTema();
    }


    function atualizarBotaoTema() {

        if (!themeToggle) return;

        if (document.body.classList.contains("dark")) {
            themeToggle.textContent = "☀";
            themeToggle.setAttribute(
                "aria-label",
                "Ativar modo claro"
            );
        } else {
            themeToggle.textContent = "☾";
            themeToggle.setAttribute(
                "aria-label",
                "Ativar modo noturno"
            );
        }
    }


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("dark");

            const modoNoturno =
                document.body.classList.contains("dark");

            localStorage.setItem(
                "ws_modo_noturno",
                modoNoturno
            );

            atualizarBotaoTema();

        });

    }


    /* =====================================================
       TOAST / NOTIFICAÇÃO
    ===================================================== */

    let toastTimeout;


    function mostrarToast(mensagem) {

        if (!toast || !toastMessage) return;

        clearTimeout(toastTimeout);

        toastMessage.textContent = mensagem;

        toast.classList.add("show");

        toastTimeout = setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

    }


    /* =====================================================
       MÓDULOS
    ===================================================== */

    moduleCards.forEach(card => {

        card.addEventListener("click", () => {

            const modulo =
                card.dataset.module;

            switch (modulo) {

                case "clientes":
                    mostrarToast(
                        "Clientes — em desenvolvimento"
                    );
                    break;


                case "os":
                    mostrarToast(
                        "Ordens de Serviço — em desenvolvimento"
                    );
                    break;


                case "agenda":
                    mostrarToast(
                        "Agenda — em desenvolvimento"
                    );
                    break;


                case "financeiro":
                    mostrarToast(
                        "Financeiro — em desenvolvimento"
                    );
                    break;


                default:
                    mostrarToast(
                        "Módulo não encontrado"
                    );

            }

        });

    });


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    atualizarBotaoTema();

});