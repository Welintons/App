// =====================================================
// AGENDA — WS SOLUÇÕES
// =====================================================

let agendamentos = [];
let clientes = [];

let dataVisualizada = new Date();
let dataSelecionada = new Date();

let agendamentoSelecionado = null;
let modoEdicao = false;


// =====================================================
// ELEMENTOS
// =====================================================

const btnVoltar = document.getElementById("btnVoltar");
const themeToggle = document.getElementById("themeToggle");

const btnNovoAgendamento = document.getElementById("btnNovoAgendamento");
const btnNovoAgendamentoVazio = document.getElementById("btnNovoAgendamentoVazio");

const btnMesAnterior = document.getElementById("btnMesAnterior");
const btnMesProximo = document.getElementById("btnMesProximo");
const btnHoje = document.getElementById("btnHoje");

const mesAnoAtual = document.getElementById("mesAnoAtual");
const gradeCalendario = document.getElementById("gradeCalendario");

const tituloAgendaDia = document.getElementById("tituloAgendaDia");
const contadorAgenda = document.getElementById("contadorAgenda");
const listaAgendamentos = document.getElementById("listaAgendamentos");
const estadoVazio = document.getElementById("estadoVazio");

const modalAgenda = document.getElementById("modalAgenda");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelar = document.getElementById("btnCancelar");
const formAgenda = document.getElementById("formAgenda");

const campoCliente = document.getElementById("cliente");
const campoData = document.getElementById("data");
const campoHora = document.getElementById("hora");
const campoTipoServico = document.getElementById("tipoServico");
const campoEndereco = document.getElementById("endereco");
const campoObservacoes = document.getElementById("observacoes");
const campoStatus = document.getElementById("status");

const modalDetalhes = document.getElementById("modalDetalhes");

const detalheCliente = document.getElementById("detalheCliente");
const detalheData = document.getElementById("detalheData");
const detalheHora = document.getElementById("detalheHora");
const detalheServico = document.getElementById("detalheServico");
const detalheStatus = document.getElementById("detalheStatus");
const detalheEndereco = document.getElementById("detalheEndereco");
const detalheObservacoes = document.getElementById("detalheObservacoes");

const btnEditarAgendamento = document.getElementById("btnEditarAgendamento");
const btnExcluirAgendamento = document.getElementById("btnExcluirAgendamento");

const toast = document.getElementById("toast");


// =====================================================
// CONFIGURAÇÕES
// =====================================================

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

const nomesDias = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
];

const statusLabels = {
    agendado: "Agendado",
    confirmado: "Confirmado",
    concluido: "Concluído",
    cancelado: "Cancelado"
};


// =====================================================
// INICIALIZAÇÃO
// =====================================================

document.addEventListener("DOMContentLoaded", async () => {

    configurarTema();
    configurarEventos();

    renderizarCalendario();

    await carregarClientes();
    await carregarAgendamentos();

    selecionarDia(dataSelecionada);
});


// =====================================================
// EVENTOS
// =====================================================

function configurarEventos() {

    if (btnVoltar) {
        btnVoltar.addEventListener("click", () => {
            window.location.href = "index2.html";
        });
    }


    if (themeToggle) {
        themeToggle.addEventListener("click", alternarTema);
    }


    if (btnMesAnterior) {
        btnMesAnterior.addEventListener("click", () => {

            dataVisualizada.setMonth(
                dataVisualizada.getMonth() - 1
            );

            renderizarCalendario();
        });
    }


    if (btnMesProximo) {
        btnMesProximo.addEventListener("click", () => {

            dataVisualizada.setMonth(
                dataVisualizada.getMonth() + 1
            );

            renderizarCalendario();
        });
    }


    if (btnHoje) {
        btnHoje.addEventListener("click", () => {

            const hoje = new Date();

            dataVisualizada = new Date(
                hoje.getFullYear(),
                hoje.getMonth(),
                1
            );

            dataSelecionada = hoje;

            renderizarCalendario();
            selecionarDia(hoje);
        });
    }


    if (btnNovoAgendamento) {
        btnNovoAgendamento.addEventListener(
            "click",
            abrirNovoAgendamento
        );
    }


    if (btnNovoAgendamentoVazio) {
        btnNovoAgendamentoVazio.addEventListener(
            "click",
            abrirNovoAgendamento
        );
    }


    if (btnFecharModal) {
        btnFecharModal.addEventListener(
            "click",
            fecharModal
        );
    }


    if (btnCancelar) {
        btnCancelar.addEventListener(
            "click",
            fecharModal
        );
    }


    if (formAgenda) {
        formAgenda.addEventListener(
            "submit",
            salvarAgendamento
        );
    }


    if (btnEditarAgendamento) {
        btnEditarAgendamento.addEventListener(
            "click",
            editarAgendamentoSelecionado
        );
    }


    if (btnExcluirAgendamento) {
        btnExcluirAgendamento.addEventListener(
            "click",
            excluirAgendamentoSelecionado
        );
    }


    // Fechar modais clicando fora
    if (modalAgenda) {

        modalAgenda.addEventListener("click", (e) => {

            if (e.target === modalAgenda) {
                fecharModal();
            }

        });

    }


    if (modalDetalhes) {

        modalDetalhes.addEventListener("click", (e) => {

            if (e.target === modalDetalhes) {
                fecharDetalhes();
            }

        });

    }
}


// =====================================================
// CARREGAR CLIENTES
// =====================================================

async function carregarClientes() {

    try {

        const { data, error } = await supabaseClient
            .from("clientes")
            .select("*")
            .order("nome", {
                ascending: true
            });


        if (error) {
            throw error;
        }


        clientes = data || [];

        preencherClientes();

    } catch (erro) {

        console.error(
            "Erro ao carregar clientes:",
            erro
        );

        mostrarToast(
            "Erro ao carregar clientes",
            "erro"
        );
    }
}


// =====================================================
// PREENCHER SELECT DE CLIENTES
// =====================================================

function preencherClientes() {

    if (!campoCliente) return;


    campoCliente.innerHTML =
        `<option value="">Selecione o cliente</option>`;


    clientes.forEach(cliente => {

        const option =
            document.createElement("option");

        option.value = cliente.id;

        option.textContent =
            cliente.nome || "Cliente sem nome";

        campoCliente.appendChild(option);

    });
}


// =====================================================
// CARREGAR AGENDAMENTOS
// =====================================================

async function carregarAgendamentos() {

    try {

        const { data, error } = await supabaseClient
            .from("agendamentos")
            .select("*")
            .order("data", {
                ascending: true
            })
            .order("hora", {
                ascending: true
            });


        if (error) {
            throw error;
        }


        agendamentos = data || [];


        // Vincula o cliente manualmente
        agendamentos.forEach(agendamento => {

            const cliente =
                clientes.find(
                    c => c.id === agendamento.cliente_id
                );

            agendamento.clienteNome =
                cliente?.nome || "Cliente não encontrado";

        });


        renderizarCalendario();

        selecionarDia(dataSelecionada);

    } catch (erro) {

        console.error(
            "Erro ao carregar agendamentos:",
            erro
        );

        mostrarToast(
            "Erro ao carregar agenda",
            "erro"
        );
    }
}


// =====================================================
// RENDERIZAR CALENDÁRIO
// =====================================================

function renderizarCalendario() {

    if (!gradeCalendario) return;


    const ano =
        dataVisualizada.getFullYear();

    const mes =
        dataVisualizada.getMonth();


    mesAnoAtual.textContent =
        `${nomesMeses[mes]} ${ano}`;


    gradeCalendario.innerHTML = "";


    const primeiroDia =
        new Date(ano, mes, 1).getDay();


    const ultimoDia =
        new Date(ano, mes + 1, 0).getDate();


    const diasMesAnterior =
        new Date(ano, mes, 0).getDate();


    const totalCelulas = 42;


    for (
        let i = 0;
        i < totalCelulas;
        i++
    ) {

        let numeroDia;
        let mesCelula = mes;
        let anoCelula = ano;

        let classeExtra = "";


        // Dias do mês anterior
        if (i < primeiroDia) {

            numeroDia =
                diasMesAnterior -
                primeiroDia +
                i +
                1;

            mesCelula--;

            if (mesCelula < 0) {
                mesCelula = 11;
                anoCelula--;
            }

            classeExtra = "dia-outro-mes";

        }

        // Dias do próximo mês
        else if (
            i >= primeiroDia + ultimoDia
        ) {

            numeroDia =
                i -
                (primeiroDia + ultimoDia) +
                1;

            mesCelula++;

            if (mesCelula > 11) {
                mesCelula = 0;
                anoCelula++;
            }

            classeExtra = "dia-outro-mes";

        }

        // Dias do mês atual
        else {

            numeroDia =
                i -
                primeiroDia +
                1;
        }


        const dataDia =
            new Date(
                anoCelula,
                mesCelula,
                numeroDia
            );


        const divDia =
            document.createElement("div");

        divDia.className =
            `dia-calendario ${classeExtra}`;


        // Hoje
        if (ehHoje(dataDia)) {

            divDia.classList.add(
                "dia-hoje"
            );
        }


        // Selecionado
        if (mesmoDia(
            dataDia,
            dataSelecionada
        )) {

            divDia.classList.add(
                "dia-selecionado"
            );
        }


        const numero =
            document.createElement("div");

        numero.className =
            "dia-numero";

        numero.textContent =
            numeroDia;


        divDia.appendChild(numero);


        const eventos =
            document.createElement("div");

        eventos.className =
            "dia-eventos";


        const eventosDoDia =
            agendamentos.filter(
                ag => mesmaData(
                    ag.data,
                    dataDia
                )
            );


        eventosDoDia
            .slice(0, 3)
            .forEach(agendamento => {

                const evento =
                    document.createElement("div");

                evento.className =
                    "evento-mini";


                if (
                    agendamento.status ===
                    "cancelado"
                ) {

                    evento.classList.add(
                        "cancelado"
                    );
                }


                if (
                    agendamento.status ===
                    "concluido"
                ) {

                    evento.classList.add(
                        "concluido"
                    );
                }


                evento.textContent =
                    `${agendamento.hora || "--:--"} ${
                        agendamento.clienteNome ||
                        "Cliente"
                    }`;


                eventos.appendChild(evento);

            });


        if (eventosDoDia.length > 3) {

            const mais =
                document.createElement("div");

            mais.className =
                "evento-mini";

            mais.textContent =
                `+${eventosDoDia.length - 3} mais`;

            eventos.appendChild(mais);
        }


        divDia.appendChild(eventos);


        divDia.addEventListener(
            "click",
            () => {

                dataSelecionada =
                    new Date(dataDia);

                if (
                    dataDia.getMonth() !==
                    dataVisualizada.getMonth()
                ) {

                    dataVisualizada =
                        new Date(
                            dataDia.getFullYear(),
                            dataDia.getMonth(),
                            1
                        );
                }

                renderizarCalendario();
                selecionarDia(dataDia);
            }
        );


        gradeCalendario.appendChild(
            divDia
        );
    }
}


// =====================================================
// SELECIONAR DIA
// =====================================================

function selecionarDia(data) {

    dataSelecionada =
        new Date(data);


    const eventosDoDia =
        agendamentos
            .filter(
                ag => mesmaData(
                    ag.data,
                    data
                )
            )
            .sort(
                ordenarPorHora
            );


    tituloAgendaDia.textContent =
        `${nomesDias[data.getDay()]}, ${
            formatarData(data)
        }`;


    contadorAgenda.textContent =
        `${eventosDoDia.length} ${
            eventosDoDia.length === 1
                ? "agendamento"
                : "agendamentos"
        }`;


    listaAgendamentos.innerHTML = "";


    if (eventosDoDia.length === 0) {

        estadoVazio.style.display =
            "flex";

        listaAgendamentos.style.display =
            "none";

        return;
    }


    estadoVazio.style.display =
        "none";

    listaAgendamentos.style.display =
        "flex";


    eventosDoDia.forEach(
        renderizarAgendamento
    );
}


// =====================================================
// RENDERIZAR AGENDAMENTO
// =====================================================

function renderizarAgendamento(
    agendamento
) {

    const item =
        document.createElement("div");

    item.className =
        "agendamento";


    const hora =
        document.createElement("div");

    hora.className =
        "agendamento-hora";

    hora.textContent =
        agendamento.hora || "--:--";


    const divisor =
        document.createElement("div");

    divisor.className =
        "agendamento-divisor";


    const info =
        document.createElement("div");

    info.className =
        "agendamento-info";


    const cliente =
        document.createElement("strong");

    cliente.textContent =
        agendamento.clienteNome ||
        "Cliente não encontrado";


    const servico =
        document.createElement("span");

    servico.textContent =
        agendamento.tipo_servico ||
        "Serviço não informado";


    info.appendChild(cliente);
    info.appendChild(servico);


    const status =
        document.createElement("span");

    const statusAtual =
        agendamento.status ||
        "agendado";


    status.className =
        `agendamento-status status-${statusAtual}`;


    status.textContent =
        statusLabels[statusAtual] ||
        statusAtual;


    item.appendChild(hora);
    item.appendChild(divisor);
    item.appendChild(info);
    item.appendChild(status);


    item.addEventListener(
        "click",
        () => abrirDetalhes(agendamento)
    );


    listaAgendamentos.appendChild(
        item
    );
}


// =====================================================
// NOVO AGENDAMENTO
// =====================================================

function abrirNovoAgendamento() {

    modoEdicao = false;

    agendamentoSelecionado = null;


    formAgenda.reset();


    if (campoData) {

        campoData.value =
            converterParaInputDate(
                dataSelecionada
            );
    }


    if (campoStatus) {

        campoStatus.value =
            "agendado";
    }


    abrirModal();
}


// =====================================================
// EDITAR
// =====================================================

function editarAgendamentoSelecionado() {

    if (!agendamentoSelecionado) {
        return;
    }


    modoEdicao = true;


    fecharDetalhes();


    campoCliente.value =
        agendamentoSelecionado.cliente_id || "";


    campoData.value =
        agendamentoSelecionado.data || "";


    campoHora.value =
        agendamentoSelecionado.hora || "";


    campoTipoServico.value =
        agendamentoSelecionado.tipo_servico || "";


    campoEndereco.value =
        agendamentoSelecionado.endereco || "";


    campoObservacoes.value =
        agendamentoSelecionado.observacoes || "";


    campoStatus.value =
        agendamentoSelecionado.status ||
        "agendado";


    abrirModal();
}


// =====================================================
// SALVAR
// =====================================================

async function salvarAgendamento(e) {

    e.preventDefault();


    const dados = {

        cliente_id:
            campoCliente.value || null,

        data:
            campoData.value,

        hora:
            campoHora.value,

        tipo_servico:
            campoTipoServico.value.trim(),

        endereco:
            campoEndereco.value.trim(),

        observacoes:
            campoObservacoes.value.trim(),

        status:
            campoStatus.value

    };


    if (!dados.cliente_id) {

        mostrarToast(
            "Selecione um cliente",
            "erro"
        );

        return;
    }


    if (!dados.data) {

        mostrarToast(
            "Informe a data",
            "erro"
        );

        return;
    }


    if (!dados.hora) {

        mostrarToast(
            "Informe o horário",
            "erro"
        );

        return;
    }


    try {

        btnSalvarEstado(true);


        let resposta;


        if (modoEdicao) {

            resposta =
                await supabaseClient
                    .from("agendamentos")
                    .update(dados)
                    .eq(
                        "id",
                        agendamentoSelecionado.id
                    );

        } else {

            resposta =
                await supabaseClient
                    .from("agendamentos")
                    .insert([dados]);
        }


        if (resposta.error) {
            throw resposta.error;
        }


        fecharModal();


        mostrarToast(
            modoEdicao
                ? "Agendamento atualizado!"
                : "Agendamento criado!",
            "sucesso"
        );


        await carregarAgendamentos();


        dataSelecionada =
            converterDataInput(
                dados.data
            );


        dataVisualizada =
            new Date(
                dataSelecionada.getFullYear(),
                dataSelecionada.getMonth(),
                1
            );


        renderizarCalendario();
        selecionarDia(dataSelecionada);


    } catch (erro) {

        console.error(
            "Erro ao salvar agendamento:",
            erro
        );


        mostrarToast(
            "Erro ao salvar agendamento",
            "erro"
        );

    } finally {

        btnSalvarEstado(false);
    }
}


// =====================================================
// EXCLUIR
// =====================================================

async function excluirAgendamentoSelecionado() {

    if (!agendamentoSelecionado) {
        return;
    }


    const confirmar =
        confirm(
            "Deseja realmente excluir este agendamento?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const { error } =
            await supabaseClient
                .from("agendamentos")
                .delete()
                .eq(
                    "id",
                    agendamentoSelecionado.id
                );


        if (error) {
            throw error;
        }


        fecharDetalhes();


        mostrarToast(
            "Agendamento excluído!",
            "sucesso"
        );


        await carregarAgendamentos();


        selecionarDia(
            dataSelecionada
        );


    } catch (erro) {

        console.error(
            "Erro ao excluir:",
            erro
        );


        mostrarToast(
            "Erro ao excluir agendamento",
            "erro"
        );
    }
}


// =====================================================
// DETALHES
// =====================================================

function abrirDetalhes(agendamento) {

    agendamentoSelecionado =
        agendamento;


    detalheCliente.textContent =
        agendamento.clienteNome ||
        "Não informado";


    detalheData.textContent =
        formatarData(
            converterDataInput(
                agendamento.data
            )
        );


    detalheHora.textContent =
        agendamento.hora ||
        "--:--";


    detalheServico.textContent =
        agendamento.tipo_servico ||
        "Não informado";


    const statusAtual =
        agendamento.status ||
        "agendado";


    detalheStatus.textContent =
        statusLabels[statusAtual] ||
        statusAtual;


    detalheStatus.className =
        `agendamento-status status-${statusAtual}`;


    detalheEndereco.textContent =
        agendamento.endereco ||
        "Não informado";


    detalheObservacoes.textContent =
        agendamento.observacoes ||
        "Nenhuma observação";


    modalDetalhes.classList.add("show");
    modalDetalhes.style.display =
        "flex";
}


// =====================================================
// FECHAR DETALHES
// =====================================================

function fecharDetalhes() {

    modalDetalhes.classList.remove(
        "show"
    );

    modalDetalhes.style.display =
        "none";
}


// =====================================================
// MODAL
// =====================================================

function abrirModal() {

    modalAgenda.classList.add(
        "show"
    );

    modalAgenda.style.display =
        "flex";
}


function fecharModal() {

    modalAgenda.classList.remove(
        "show"
    );

    modalAgenda.style.display =
        "none";
}


// =====================================================
// BOTÃO SALVAR
// =====================================================

function btnSalvarEstado(
    carregando
) {

    const botao =
        document.getElementById(
            "btnSalvar"
        );


    if (!botao) return;


    if (carregando) {

        botao.disabled = true;
        botao.textContent =
            "Salvando...";

    } else {

        botao.disabled = false;
        botao.textContent =
            "Salvar";
    }
}


// =====================================================
// TEMA
// =====================================================

function configurarTema() {

    const tema =
        localStorage.getItem(
            "ws_modo_noturno"
        );


    if (tema === "dark") {

        document.body.classList.add(
            "dark"
        );

        if (themeToggle) {
            themeToggle.textContent =
                "☀";
        }

    } else {

        document.body.classList.remove(
            "dark"
        );

        if (themeToggle) {
            themeToggle.textContent =
                "☾";
        }
    }
}


function alternarTema() {

    const dark =
        document.body.classList.toggle(
            "dark"
        );


    localStorage.setItem(
        "ws_modo_noturno",
        dark ? "dark" : "light"
    );


    if (themeToggle) {

        themeToggle.textContent =
            dark ? "☀" : "☾";
    }
}


// =====================================================
// UTILITÁRIOS DE DATA
// =====================================================

function ehHoje(data) {

    const hoje =
        new Date();


    return (
        data.getDate() === hoje.getDate() &&
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear()
    );
}


function mesmoDia(
    data1,
    data2
) {

    return (
        data1.getDate() === data2.getDate() &&
        data1.getMonth() === data2.getMonth() &&
        data1.getFullYear() === data2.getFullYear()
    );
}


function mesmaData(
    valor,
    data
) {

    if (!valor) return false;


    const partes =
        String(valor).split("-");


    if (partes.length < 3) {
        return false;
    }


    const ano =
        Number(partes[0]);

    const mes =
        Number(partes[1]) - 1;

    const dia =
        Number(
            partes[2].substring(0, 2)
        );


    return (
        ano === data.getFullYear() &&
        mes === data.getMonth() &&
        dia === data.getDate()
    );
}


function converterParaInputDate(
    data
) {

    const ano =
        data.getFullYear();


    const mes =
        String(
            data.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            data.getDate()
        ).padStart(2, "0");


    return `${ano}-${mes}-${dia}`;
}


function converterDataInput(
    valor
) {

    if (!valor) {
        return new Date();
    }


    const partes =
        String(valor).split("-");


    return new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2])
    );
}


function formatarData(
    data
) {

    return data.toLocaleDateString(
        "pt-BR"
    );
}


function ordenarPorHora(
    a,
    b
) {

    return String(
        a.hora || ""
    ).localeCompare(
        String(b.hora || "")
    );
}


// =====================================================
// TOAST
// =====================================================

function mostrarToast(
    mensagem,
    tipo = "sucesso"
) {

    if (!toast) return;


    toast.textContent =
        mensagem;


    toast.className =
        "toast show";


    if (tipo === "erro") {

        toast.classList.add(
            "erro"
        );
    }


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);
}