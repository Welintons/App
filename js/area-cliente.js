document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const gradeCalendario =
        document.getElementById("gradeCalendario");

    const mesAnoAtual =
        document.getElementById("mesAnoAtual");

    const btnMesAnterior =
        document.getElementById("btnMesAnterior");

    const btnMesProximo =
        document.getElementById("btnMesProximo");

    const agendaDia =
        document.getElementById("agendaDia");

    const tituloAgendaDia =
        document.getElementById("tituloAgendaDia");

    const listaAgendamentos =
        document.getElementById("listaAgendamentos");

    const formBuscaOS =
        document.getElementById("formBuscaOS");

    const codigoOS =
        document.getElementById("codigoOS");

    const resultadoOS =
        document.getElementById("resultadoOS");

    const osNaoEncontrada =
        document.getElementById("osNaoEncontrada");

    const btnBuscarOS =
        document.getElementById("btnBuscarOS");


    /* =====================================================
       ESTADO
    ===================================================== */

    let agendamentos = [];

    let dataAtual = new Date();

    let dataSelecionada = new Date();


    /* =====================================================
       VERIFICAÇÃO
    ===================================================== */

    console.log(
        "WS SOLUÇÕES — ÁREA DO CLIENTE carregada"
    );


    /* =====================================================
       TOAST
    ===================================================== */

    function mostrarToast(mensagem) {

        const toast =
            document.getElementById("toast");

        const toastMessage =
            document.getElementById("toastMessage");

        if (!toast || !toastMessage) {
            return;
        }

        toastMessage.textContent =
            mensagem;

        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

    }


    /* =====================================================
       FORMATAÇÃO
    ===================================================== */

    function formatarData(data) {

        if (!data) return "—";

        const partes =
            String(data)
                .substring(0, 10)
                .split("-");

        if (partes.length !== 3) {
            return data;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    function formatarHora(hora) {

        if (!hora) return "—";

        return String(hora)
            .substring(0, 5);

    }


    function formatarMoeda(valor) {

        return Number(valor || 0)
            .toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

    }


    function textoStatus(status) {

        const mapa = {

            aberta: "Aberta",

            aguardando:
                "Aguardando",

            em_andamento:
                "Em andamento",

            aguardando_peca:
                "Aguardando peça",

            concluida:
                "Concluída",

            entregue:
                "Entregue",

            cancelada:
                "Cancelada"

        };

        return mapa[status] ||
            status ||
            "—";

    }


    function textoStatusAgendamento(status) {

        const mapa = {

            agendado:
                "Agendado",

            confirmado:
                "Confirmado",

            em_atendimento:
                "Em atendimento",

            concluido:
                "Concluído",

            cancelado:
                "Cancelado",

            faltou:
                "Não compareceu"

        };

        return mapa[status] ||
            status ||
            "—";

    }


    /* =====================================================
       CALENDÁRIO
    ===================================================== */

    async function carregarAgendamentos() {

        const { data, error } =
            await supabaseClient
                .from("agendamentos")
                .select(`
                    id,
                    codigo,
                    cliente_id,
                    data,
                    hora,
                    servico,
                    status,
                    observacoes
                `)
                .order("data", {
                    ascending: true
                })
                .order("hora", {
                    ascending: true
                });


        if (error) {

            console.error(
                "Erro ao carregar agendamentos:",
                error
            );

            mostrarToast(
                "Erro ao carregar calendário."
            );

            return;

        }


        agendamentos =
            data || [];


        renderizarCalendario();

    }


    function mesmaData(data1, data2) {

        return (
            data1.getFullYear() ===
                data2.getFullYear() &&

            data1.getMonth() ===
                data2.getMonth() &&

            data1.getDate() ===
                data2.getDate()
        );

    }


    function dataBancoParaDate(data) {

        const partes =
            String(data)
                .substring(0, 10)
                .split("-");

        if (partes.length !== 3) {
            return null;
        }

        return new Date(
            Number(partes[0]),
            Number(partes[1]) - 1,
            Number(partes[2])
        );

    }


    function renderizarCalendario() {

        if (!gradeCalendario) {
            return;
        }


        gradeCalendario.innerHTML = "";


        const ano =
            dataAtual.getFullYear();

        const mes =
            dataAtual.getMonth();


        const primeiroDia =
            new Date(
                ano,
                mes,
                1
            );


        const ultimoDia =
            new Date(
                ano,
                mes + 1,
                0
            );


        const inicioSemana =
            primeiroDia.getDay();


        const totalDias =
            ultimoDia.getDate();


        const nomesMeses = [

            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"

        ];


        if (mesAnoAtual) {

            mesAnoAtual.textContent =
                `${nomesMeses[mes]} ${ano}`;

        }


        /*
         * 42 células para manter
         * o calendário estável.
         */

        for (
            let i = 0;
            i < 42;
            i++
        ) {

            const numeroDia =
                i - inicioSemana + 1;


            const dia =
                document.createElement("div");


            dia.className =
                "dia-calendario";


            let dataCelula;


            if (numeroDia < 1) {

                const diasMesAnterior =
                    new Date(
                        ano,
                        mes,
                        0
                    ).getDate();

                const diaAnterior =
                    diasMesAnterior +
                    numeroDia;

                dia.textContent =
                    diaAnterior;

                dia.classList.add(
                    "dia-outro-mes"
                );


                dataCelula =
                    new Date(
                        ano,
                        mes - 1,
                        diaAnterior
                    );

            } else if (
                numeroDia >
                totalDias
            ) {

                const diaProximo =
                    numeroDia -
                    totalDias;

                dia.textContent =
                    diaProximo;

                dia.classList.add(
                    "dia-outro-mes"
                );


                dataCelula =
                    new Date(
                        ano,
                        mes + 1,
                        diaProximo
                    );

            } else {

                dia.textContent =
                    numeroDia;


                dataCelula =
                    new Date(
                        ano,
                        mes,
                        numeroDia
                    );

            }


            /*
             * Hoje
             */

            const hoje =
                new Date();

            if (
                mesmaData(
                    dataCelula,
                    hoje
                )
            ) {

                dia.classList.add(
                    "dia-hoje"
                );

            }


            /*
             * Dia selecionado
             */

            if (
                mesmaData(
                    dataCelula,
                    dataSelecionada
                )
            ) {

                dia.classList.add(
                    "dia-selecionado"
                );

            }


            /*
             * Verifica agendamento
             */

            const dataISO =
                `${dataCelula.getFullYear()}-${String(
                    dataCelula.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    dataCelula.getDate()
                ).padStart(2, "0")}`;


            const eventos =
                agendamentos.filter(
                    agendamento =>
                        agendamento.data ===
                        dataISO
                );


            if (eventos.length > 0) {

                dia.classList.add(
                    "dia-com-agendamento"
                );

            }


            /*
             * Clique
             */

            dia.addEventListener(
                "click",
                () => {

                    dataSelecionada =
                        new Date(
                            dataCelula
                        );

                    renderizarCalendario();

                    renderizarAgendaDia();

                }
            );


            gradeCalendario.appendChild(
                dia
            );

        }

    }


    /* =====================================================
       AGENDA DO DIA
    ===================================================== */

    function renderizarAgendaDia() {

        if (
            !agendaDia ||
            !tituloAgendaDia ||
            !listaAgendamentos
        ) {
            return;
        }


        const ano =
            dataSelecionada
                .getFullYear();

        const mes =
            String(
                dataSelecionada.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                dataSelecionada.getDate()
            ).padStart(2, "0");


        const dataISO =
            `${ano}-${mes}-${dia}`;


        const eventos =
            agendamentos.filter(
                agendamento =>
                    agendamento.data ===
                    dataISO
            );


        tituloAgendaDia.textContent =
            `Agendamentos — ${formatarData(dataISO)}`;


        listaAgendamentos.innerHTML =
            "";


        agendaDia.hidden = false;


        if (!eventos.length) {

            listaAgendamentos.innerHTML = `
                <div class="estado-vazio">
                    <div class="estado-icone">
                        📅
                    </div>

                    <strong>
                        Nenhum agendamento
                    </strong>

                    <p>
                        Não há atendimento marcado para este dia.
                    </p>
                </div>
            `;

            return;

        }


        eventos
            .sort(
                (a, b) =>
                    String(a.hora)
                        .localeCompare(
                            String(b.hora)
                        )
            )
            .forEach(
                agendamento => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "agendamento-cliente";


                    item.innerHTML = `

                        <div class="agendamento-hora">

                            ${formatarHora(
                                agendamento.hora
                            )}

                        </div>


                        <div class="agendamento-servico">

                            ${escaparHTML(
                                agendamento.servico ||
                                "Serviço"
                            )}

                        </div>


                        <span class="agendamento-status">

                            ${escaparHTML(
                                textoStatusAgendamento(
                                    agendamento.status
                                )
                            )}

                        </span>

                    `;


                    listaAgendamentos.appendChild(
                        item
                    );

                }
            );

    }


    /* =====================================================
       NAVEGAÇÃO DO CALENDÁRIO
    ===================================================== */

    btnMesAnterior?.addEventListener(
        "click",
        () => {

            dataAtual.setMonth(
                dataAtual.getMonth() - 1
            );

            renderizarCalendario();

        }
    );


    btnMesProximo?.addEventListener(
        "click",
        () => {

            dataAtual.setMonth(
                dataAtual.getMonth() + 1
            );

            renderizarCalendario();

        }
    );


    /* =====================================================
       BUSCAR OS
    ===================================================== */

    async function buscarOS() {

        const codigo =
            codigoOS?.value
                .trim()
                .toUpperCase();


        if (!codigo) {

            mostrarToast(
                "Digite o código da OS."
            );

            return;

        }


        if (btnBuscarOS) {

            btnBuscarOS.disabled =
                true;

            btnBuscarOS.textContent =
                "…";

        }


        resultadoOS.hidden = true;

        osNaoEncontrada.hidden = true;


        const { data, error } =
            await supabaseClient
                .from("ordens_servico")
                .select(`
                    id,
                    codigo,
                    aparelho,
                    marca,
                    modelo,
                    data_entrada,
                    valor_total,
                    servico_realizado,
                    status
                `)
                .eq("codigo", codigo)
                .maybeSingle();


        if (btnBuscarOS) {

            btnBuscarOS.disabled =
                false;

            btnBuscarOS.textContent =
                "🔎";

        }


        if (error) {

            console.error(
                "Erro ao buscar OS:",
                error
            );

            mostrarToast(
                "Erro ao consultar OS."
            );

            return;

        }


        if (!data) {

            osNaoEncontrada.hidden =
                false;

            return;

        }


        document.getElementById(
            "resultadoCodigo"
        ).textContent =
            data.codigo || "—";


        document.getElementById(
            "resultadoStatus"
        ).textContent =
            textoStatus(
                data.status
            );


        document.getElementById(
            "resultadoAparelho"
        ).textContent =
            data.aparelho || "—";


        document.getElementById(
            "resultadoMarca"
        ).textContent =
            data.marca || "—";


        document.getElementById(
            "resultadoModelo"
        ).textContent =
            data.modelo || "—";


        document.getElementById(
            "resultadoData"
        ).textContent =
            formatarData(
                data.data_entrada
            );


        document.getElementById(
            "resultadoValor"
        ).textContent =
            formatarMoeda(
                data.valor_total
            );


        document.getElementById(
            "resultadoServico"
        ).textContent =
            data.servico_realizado ||
            "Ainda não concluído.";


        resultadoOS.hidden =
            false;

    }


    formBuscaOS?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            buscarOS();

        }
    );


    /* =====================================================
       SEGURANÇA — TEXTO HTML
    ===================================================== */

    function escaparHTML(valor) {

        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    async function iniciar() {

        renderizarCalendario();

        await carregarAgendamentos();

    }


    iniciar();

});