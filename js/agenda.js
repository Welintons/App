// =====================================================
// WS SOLUÇÕES — AGENDA
// Integrado ao banco V1
// =====================================================

let agendamentos = [];
let clientes = [];
let ordensServico = [];

let dataVisualizada = new Date();
let dataSelecionada = new Date();

let agendamentoSelecionado = null;
let modoEdicao = false;


// =====================================================
// ELEMENTOS
// =====================================================

const btnVoltar = document.getElementById("btnVoltar");
const themeToggle = document.getElementById("themeToggle");

const btnNovoAgendamento =
    document.getElementById("btnNovoAgendamento");

const btnNovoAgendamentoVazio =
    document.getElementById("btnNovoAgendamentoVazio");

const btnMesAnterior =
    document.getElementById("btnMesAnterior");

const btnMesProximo =
    document.getElementById("btnMesProximo");

const btnHoje =
    document.getElementById("btnHoje");

const mesAnoAtual =
    document.getElementById("mesAnoAtual");

const gradeCalendario =
    document.getElementById("gradeCalendario");

const tituloAgendaDia =
    document.getElementById("tituloAgendaDia");

const contadorAgenda =
    document.getElementById("contadorAgenda");

const listaAgendamentos =
    document.getElementById("listaAgendamentos");

const estadoVazio =
    document.getElementById("estadoVazio");


// Modal Agenda
const modalAgenda =
    document.getElementById("modalAgenda");

const btnFecharModal =
    document.getElementById("btnFecharModal");

const btnCancelar =
    document.getElementById("btnCancelar");

const formAgenda =
    document.getElementById("formAgenda");

const campoCliente =
    document.getElementById("cliente");

const campoData =
    document.getElementById("data");

const campoHora =
    document.getElementById("hora");

const campoTipoServico =
    document.getElementById("tipoServico");

const campoEndereco =
    document.getElementById("endereco");

const campoObservacoes =
    document.getElementById("observacoes");

const campoStatus =
    document.getElementById("status");


// Modal detalhes
const modalDetalhes =
    document.getElementById("modalDetalhes");

const detalheCliente =
    document.getElementById("detalheCliente");

const detalheData =
    document.getElementById("detalheData");

const detalheHora =
    document.getElementById("detalheHora");

const detalheServico =
    document.getElementById("detalheServico");

const detalheStatus =
    document.getElementById("detalheStatus");

const detalheEndereco =
    document.getElementById("detalheEndereco");

const detalheObservacoes =
    document.getElementById("detalheObservacoes");

const btnEditarAgendamento =
    document.getElementById("btnEditarAgendamento");

const btnExcluirAgendamento =
    document.getElementById("btnExcluirAgendamento");

const toast =
    document.getElementById("toast");


// =====================================================
// CONFIGURAÇÕES
// =====================================================

const meses = [
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

const diasSemana = [
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
    em_atendimento: "Em atendimento",
    concluido: "Concluído",
    cancelado: "Cancelado",
    faltou: "Faltou"
};


// =====================================================
// INICIALIZAÇÃO
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarAgenda
);


async function iniciarAgenda() {

    configurarTema();
    configurarEventos();

    prepararDataInicial();

    renderizarCalendario();

    await carregarClientes();

    await carregarOrdensServico();

    await carregarAgendamentos();

    selecionarDia(dataSelecionada);
}


// =====================================================
// DATA INICIAL
// =====================================================

function prepararDataInicial() {

    const hoje = new Date();

    dataVisualizada = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
    );

    dataSelecionada = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
    );
}


// =====================================================
// EVENTOS
// =====================================================

function configurarEventos() {

    if (btnVoltar) {

        btnVoltar.addEventListener(
            "click",
            () => {
                window.location.href = "index2.html";
            }
        );
    }


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            alternarTema
        );
    }


    if (btnMesAnterior) {

        btnMesAnterior.addEventListener(
            "click",
            () => {

                dataVisualizada.setMonth(
                    dataVisualizada.getMonth() - 1
                );

                renderizarCalendario();
            }
        );
    }


    if (btnMesProximo) {

        btnMesProximo.addEventListener(
            "click",
            () => {

                dataVisualizada.setMonth(
                    dataVisualizada.getMonth() + 1
                );

                renderizarCalendario();
            }
        );
    }


    if (btnHoje) {

        btnHoje.addEventListener(
            "click",
            irParaHoje
        );
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


    if (modalAgenda) {

        modalAgenda.addEventListener(
            "click",
            event => {

                if (event.target === modalAgenda) {
                    fecharModal();
                }

            }
        );
    }


    if (modalDetalhes) {

        modalDetalhes.addEventListener(
            "click",
            event => {

                if (event.target === modalDetalhes) {
                    fecharDetalhes();
                }

            }
        );
    }
}


// =====================================================
// CLIENTES
// =====================================================

async function carregarClientes() {

    try {

        const { data, error } =
            await supabaseClient
                .from("clientes")
                .select(`
                    id,
                    codigo,
                    nome,
                    whatsapp,
                    endereco,
                    numero,
                    complemento,
                    bairro,
                    cidade,
                    estado,
                    cep,
                    status
                `)
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
// PREENCHER CLIENTES
// =====================================================

function preencherClientes() {

    if (!campoCliente) {
        return;
    }


    campoCliente.innerHTML =
        `<option value="">Selecione o cliente</option>`;


    clientes.forEach(cliente => {

        const option =
            document.createElement("option");

        option.value = cliente.id;

        option.textContent =
            `${cliente.nome}${cliente.codigo ? " • " + cliente.codigo : ""}`;

        campoCliente.appendChild(option);
    });
}


// =====================================================
// ORDENS DE SERVIÇO
// =====================================================

async function carregarOrdensServico() {

    try {

        const { data, error } =
            await supabaseClient
                .from("ordens_servico")
                .select(`
                    id,
                    codigo,
                    cliente_id,
                    aparelho,
                    tipo_servico,
                    status
                `)
                .order("criado_em", {
                    ascending: false
                });


        if (error) {
            throw error;
        }


        ordensServico = data || [];

    } catch (erro) {

        console.error(
            "Erro ao carregar OS:",
            erro
        );

        // A Agenda continua funcionando mesmo
        // se não houver OS disponíveis.
        ordensServico = [];
    }
}


// =====================================================
// AGENDAMENTOS
// =====================================================

async function carregarAgendamentos() {

    try {

        const { data, error } =
            await supabaseClient
                .from("agendamentos")
                .select(`
                    id,
                    codigo,
                    cliente_id,
                    os_id,
                    data,
                    hora,
                    servico,
                    status,
                    observacoes,
                    criado_em,
                    atualizado_em
                `)
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


        vincularDados();


        renderizarCalendario();


    } catch (erro) {

        console.error(
            "Erro ao carregar agendamentos:",
            erro
        );

        agendamentos = [];

        mostrarToast(
            "Erro ao carregar agenda",
            "erro"
        );
    }
}


// =====================================================
// VINCULAR CLIENTE E OS
// =====================================================

function vincularDados() {

    agendamentos.forEach(agendamento => {

        const cliente =
            clientes.find(
                item =>
                    item.id ===
                    agendamento.cliente_id
            );


        const os =
            ordensServico.find(
                item =>
                    item.id ===
                    agendamento.os_id
            );


        agendamento.clienteDados =
            cliente || null;


        agendamento.clienteNome =
            cliente?.nome ||
            "Cliente não encontrado";


        agendamento.osDados =
            os || null;


        agendamento.osCodigo =
            os?.codigo || null;
    });
}


// =====================================================
// CALENDÁRIO
// =====================================================

function renderizarCalendario() {

    if (!gradeCalendario) {
        return;
    }


    const ano =
        dataVisualizada.getFullYear();

    const mes =
        dataVisualizada.getMonth();


    mesAnoAtual.textContent =
        `${meses[mes]} ${ano}`;


    gradeCalendario.innerHTML = "";


    const primeiroDia =
        new Date(
            ano,
            mes,
            1
        ).getDay();


    const ultimoDia =
        new Date(
            ano,
            mes + 1,
            0
        ).getDate();


    const diasMesAnterior =
        new Date(
            ano,
            mes,
            0
        ).getDate();


    for (
        let i = 0;
        i < 42;
        i++
    ) {

        let dia;
        let mesCelula = mes;
        let anoCelula = ano;

        let outroMes = false;


        if (i < primeiroDia) {

            dia =
                diasMesAnterior -
                primeiroDia +
                i +
                1;

            mesCelula--;

            if (mesCelula < 0) {

                mesCelula = 11;
                anoCelula--;
            }

            outroMes = true;

        } else if (
            i >=
            primeiroDia + ultimoDia
        ) {

            dia =
                i -
                primeiroDia -
                ultimoDia +
                1;

            mesCelula++;

            if (mesCelula > 11) {

                mesCelula = 0;
                anoCelula++;
            }

            outroMes = true;

        } else {

            dia =
                i -
                primeiroDia +
                1;
        }


        const dataDia =
            new Date(
                anoCelula,
                mesCelula,
                dia
            );


        const elemento =
            document.createElement("div");


        elemento.className =
            "dia-calendario";


        if (outroMes) {

            elemento.classList.add(
                "dia-outro-mes"
            );
        }


        if (ehHoje(dataDia)) {

            elemento.classList.add(
                "dia-hoje"
            );
        }


        if (
            mesmoDia(
                dataDia,
                dataSelecionada
            )
        ) {

            elemento.classList.add(
                "dia-selecionado"
            );
        }


        const numero =
            document.createElement("div");


        numero.className =
            "dia-numero";


        numero.textContent =
            dia;


        elemento.appendChild(
            numero
        );


        const eventosContainer =
            document.createElement("div");


        eventosContainer.className =
            "dia-eventos";


        const eventos =
            agendamentos
                .filter(
                    agendamento =>
                        mesmaData(
                            agendamento.data,
                            dataDia
                        )
                )
                .sort(
                    ordenarPorHora
                );


        eventos
            .slice(0, 3)
            .forEach(
                agendamento => {

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
                        `${agendamento.hora?.substring(0, 5) || "--:--"} ${
                            agendamento.clienteNome
                        }`;


                    eventosContainer.appendChild(
                        evento
                    );
                }
            );


        if (eventos.length > 3) {

            const mais =
                document.createElement("div");


            mais.className =
                "evento-mini";


            mais.textContent =
                `+${eventos.length - 3} mais`;


            eventosContainer.appendChild(
                mais
            );
        }


        elemento.appendChild(
            eventosContainer
        );


        elemento.addEventListener(
            "click",
            () => {

                dataSelecionada =
                    new Date(dataDia);


                if (outroMes) {

                    dataVisualizada =
                        new Date(
                            dataDia.getFullYear(),
                            dataDia.getMonth(),
                            1
                        );
                }


                renderizarCalendario();

                selecionarDia(
                    dataSelecionada
                );
            }
        );


        gradeCalendario.appendChild(
            elemento
        );
    }
}


// =====================================================
// AGENDA DO DIA
// =====================================================

function selecionarDia(data) {

    dataSelecionada =
        new Date(
            data.getFullYear(),
            data.getMonth(),
            data.getDate()
        );


    const eventos =
        agendamentos
            .filter(
                agendamento =>
                    mesmaData(
                        agendamento.data,
                        data
                    )
            )
            .sort(
                ordenarPorHora
            );


    tituloAgendaDia.textContent =
        `${diasSemana[data.getDay()]}, ${formatarData(data)}`;


    contadorAgenda.textContent =
        `${eventos.length} ${
            eventos.length === 1
                ? "agendamento"
                : "agendamentos"
        }`;


    listaAgendamentos.innerHTML = "";


    if (eventos.length === 0) {

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


    eventos.forEach(
        renderizarAgendamento
    );
}


// =====================================================
// ITEM DA AGENDA
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
        agendamento.hora
            ? agendamento.hora.substring(0, 5)
            : "--:--";


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
        agendamento.clienteNome;


    const servico =
        document.createElement("span");


    servico.textContent =
        agendamento.servico ||
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


    campoData.value =
        converterParaInputDate(
            dataSelecionada
        );


    campoStatus.value =
        "agendado";


    // Endereço não faz parte do banco da Agenda.
    // Ele será mostrado automaticamente pelo cliente.
    if (campoEndereco) {

        campoEndereco.value = "";

        campoEndereco.readOnly = true;

        campoEndereco.placeholder =
            "Endereço cadastrado no cliente";
    }


    abrirModal();
}


// =====================================================
// EDITAR AGENDAMENTO
// =====================================================

function editarAgendamentoSelecionado() {

    if (!agendamentoSelecionado) {
        return;
    }


    modoEdicao = true;


    fecharDetalhes();


    campoCliente.value =
        agendamentoSelecionado.cliente_id ||
        "";


    campoData.value =
        agendamentoSelecionado.data ||
        "";


    campoHora.value =
        agendamentoSelecionado.hora
            ? agendamentoSelecionado.hora.substring(0, 5)
            : "";


    campoTipoServico.value =
        agendamentoSelecionado.servico ||
        "";


    campoObservacoes.value =
        agendamentoSelecionado.observacoes ||
        "";


    campoStatus.value =
        agendamentoSelecionado.status ||
        "agendado";


    atualizarEnderecoCliente();


    abrirModal();
}


// =====================================================
// ENDEREÇO DO CLIENTE
// =====================================================

if (campoCliente) {

    campoCliente.addEventListener(
        "change",
        atualizarEnderecoCliente
    );
}


function atualizarEnderecoCliente() {

    if (!campoEndereco) {
        return;
    }


    const cliente =
        clientes.find(
            item =>
                item.id ===
                campoCliente.value
        );


    if (!cliente) {

        campoEndereco.value = "";

        return;
    }


    campoEndereco.value =
        montarEndereco(cliente);


    campoEndereco.readOnly =
        true;
}


// =====================================================
// MONTAR ENDEREÇO
// =====================================================

function montarEndereco(cliente) {

    const partes = [];


    if (cliente.endereco) {

        let endereco =
            cliente.endereco;


        if (cliente.numero) {

            endereco +=
                `, ${cliente.numero}`;
        }


        partes.push(
            endereco
        );
    }


    if (cliente.complemento) {

        partes.push(
            cliente.complemento
        );
    }


    if (cliente.bairro) {

        partes.push(
            cliente.bairro
        );
    }


    if (
        cliente.cidade ||
        cliente.estado
    ) {

        let cidadeEstado =
            cliente.cidade || "";


        if (cliente.estado) {

            cidadeEstado +=
                ` - ${cliente.estado}`;
        }


        partes.push(
            cidadeEstado
        );
    }


    if (cliente.cep) {

        partes.push(
            `CEP: ${cliente.cep}`
        );
    }


    return partes.join(", ");
}


// =====================================================
// SALVAR
// =====================================================

async function salvarAgendamento(event) {

    event.preventDefault();


    const dados = {

        cliente_id:
            campoCliente.value || null,

        data:
            campoData.value,

        hora:
            campoHora.value,

        servico:
            campoTipoServico.value.trim(),

        status:
            campoStatus.value,

        observacoes:
            campoObservacoes.value.trim()
    };


    if (!dados.cliente_id) {

        mostrarToast(
            "Selecione o cliente",
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


    if (!dados.servico) {

        mostrarToast(
            "Informe o serviço",
            "erro"
        );

        return;
    }


    try {

        alterarEstadoBotaoSalvar(
            true
        );


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
                    .insert([
                        dados
                    ]);
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


        await carregarAgendamentos();


        renderizarCalendario();


        selecionarDia(
            dataSelecionada
        );


    } catch (erro) {

        console.error(
            "Erro ao salvar agendamento:",
            erro
        );


        mostrarToast(
            erro.message ||
            "Erro ao salvar agendamento",
            "erro"
        );


    } finally {

        alterarEstadoBotaoSalvar(
            false
        );
    }
}


// =====================================================
// DETALHES
// =====================================================

function abrirDetalhes(
    agendamento
) {

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
        agendamento.hora
            ? agendamento.hora.substring(0, 5)
            : "--:--";


    detalheServico.textContent =
        agendamento.servico ||
        "Não informado";


    const statusAtual =
        agendamento.status ||
        "agendado";


    detalheStatus.textContent =
        statusLabels[statusAtual] ||
        statusAtual;


    detalheStatus.className =
        `agendamento-status status-${statusAtual}`;


    // Endereço vem da tabela CLIENTES
    detalheEndereco.textContent =
        agendamento.clienteDados
            ? montarEndereco(
                agendamento.clienteDados
            )
            : "Endereço não cadastrado";


    detalheObservacoes.textContent =
        agendamento.observacoes ||
        "Nenhuma observação";


    modalDetalhes.classList.add(
        "show"
    );

    modalDetalhes.style.display =
        "flex";
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
            `Deseja realmente excluir o agendamento ${agendamentoSelecionado.codigo || ""}?`
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
            erro.message ||
            "Erro ao excluir agendamento",
            "erro"
        );
    }
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


function fecharDetalhes() {

    modalDetalhes.classList.remove(
        "show"
    );

    modalDetalhes.style.display =
        "none";
}


// =====================================================
// BOTÃO SALVAR
// =====================================================

function alterarEstadoBotaoSalvar(
    carregando
) {

    const botao =
        document.getElementById(
            "btnSalvar"
        );


    if (!botao) {
        return;
    }


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
// HOJE
// =====================================================

function irParaHoje() {

    const hoje =
        new Date();


    dataVisualizada =
        new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            1
        );


    dataSelecionada =
        new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            hoje.getDate()
        );


    renderizarCalendario();

    selecionarDia(
        dataSelecionada
    );
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
        dark
            ? "dark"
            : "light"
    );


    if (themeToggle) {

        themeToggle.textContent =
            dark
                ? "☀"
                : "☾";
    }
}


// =====================================================
// DATAS
// =====================================================

function ehHoje(data) {

    const hoje =
        new Date();


    return (
        data.getDate() ===
            hoje.getDate() &&

        data.getMonth() ===
            hoje.getMonth() &&

        data.getFullYear() ===
            hoje.getFullYear()
    );
}


function mesmoDia(
    data1,
    data2
) {

    return (
        data1.getDate() ===
            data2.getDate() &&

        data1.getMonth() ===
            data2.getMonth() &&

        data1.getFullYear() ===
            data2.getFullYear()
    );
}


function mesmaData(
    valor,
    data
) {

    if (!valor) {
        return false;
    }


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
        ano ===
            data.getFullYear() &&

        mes ===
            data.getMonth() &&

        dia ===
            data.getDate()
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


// =====================================================
// ORDENAR HORÁRIO
// =====================================================

function ordenarPorHora(
    a,
    b
) {

    return String(
        a.hora || ""
    ).localeCompare(
        String(
            b.hora || ""
        )
    );
}


// =====================================================
// TOAST
// =====================================================

function mostrarToast(
    mensagem,
    tipo = "sucesso"
) {

    if (!toast) {
        return;
    }


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
        window.wsToastTimer
    );


    window.wsToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );
}