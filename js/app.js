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

    const totalClientes = document.getElementById("totalClientes");
    const osAbertas = document.getElementById("osAbertas");
    const agendaHoje = document.getElementById("agendaHoje");


    /* =====================================================
       MODO NOTURNO
    ===================================================== */

    const modoSalvo = localStorage.getItem("ws_modo_noturno");

    if (modoSalvo === "true") {
        document.body.classList.add("dark");
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
       SUPABASE
    ===================================================== */

    async function carregarDashboard() {

        try {

            /* =================================================
               CLIENTES
            ================================================= */

            const { count: clientes, error: erroClientes } =
                await supabaseClient
                    .from("clientes")
                    .select("*", {
                        count: "exact",
                        head: true
                    })
                    .eq("status", "ativo");


            if (erroClientes) {
                throw erroClientes;
            }


            /* =================================================
               ORDENS DE SERVIÇO ABERTAS
            ================================================= */

            const { count: os, error: erroOS } =
                await supabaseClient
                    .from("ordens_servico")
                    .select("*", {
                        count: "exact",
                        head: true
                    })
                    .in("status", [
                        "aberta",
                        "aguardando",
                        "em_andamento",
                        "aguardando_peca"
                    ]);


            if (erroOS) {
                throw erroOS;
            }


            /* =================================================
               AGENDA DE HOJE
            ================================================= */

            const hoje = new Date();

            const ano = hoje.getFullYear();

            const mes =
                String(hoje.getMonth() + 1).padStart(2, "0");

            const dia =
                String(hoje.getDate()).padStart(2, "0");

            const dataHoje =
                `${ano}-${mes}-${dia}`;


            const { count: agenda, error: erroAgenda } =
                await supabaseClient
                    .from("agendamentos")
                    .select("*", {
                        count: "exact",
                        head: true
                    })
                    .eq("data", dataHoje)
                    .not("status", "eq", "cancelado");


            if (erroAgenda) {
                throw erroAgenda;
            }


            /* =================================================
               ATUALIZAR CARDS
            ================================================= */

            if (totalClientes) {
                totalClientes.textContent = clientes ?? 0;
            }

            if (osAbertas) {
                osAbertas.textContent = os ?? 0;
            }

            if (agendaHoje) {
                agendaHoje.textContent = agenda ?? 0;
            }


        } catch (erro) {

            console.error(
                "Erro ao carregar dashboard:",
                erro
            );

            mostrarToast(
                "Não foi possível carregar os dados do painel."
            );

        }

    }


 /* =====================================================
   MÓDULOS
===================================================== */

moduleCards.forEach(card => {

    card.addEventListener("click", () => {

        const modulo = card.dataset.module;

        switch (modulo) {

            case "clientes":
                window.location.href = "clientes.html";
                break;

            case "os":
                window.location.href = "os.html";
                break;

            case "agenda":
                window.location.href = "agenda.html";
                break;

            case "financeiro":
                window.location.href = "financeiro.html";
                break;

            default:
                mostrarToast("Módulo não encontrado");

        }

    });

});
}); =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    atualizarBotaoTema();

    carregarDashboard();

});