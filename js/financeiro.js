document.addEventListener("DOMContentLoaded", () => {

    console.log("WS SOLUÇÕES — FINANCEIRO.JS carregado");


    // =====================================================
    // ELEMENTOS
    // =====================================================

    const btnVoltar = document.getElementById("btnVoltar");
    const themeToggle = document.getElementById("themeToggle");

    const btnNovaMovimentacao =
        document.getElementById("btnNovaMovimentacao");

    const btnNovaMovimentacaoVazio =
        document.getElementById("btnNovaMovimentacaoVazio");

    const modalFinanceiro =
        document.getElementById("modalFinanceiro");

    const modalDetalhes =
        document.getElementById("modalDetalhes");

    const btnFecharModal =
        document.getElementById("btnFecharModal");

    const btnCancelar =
        document.getElementById("btnCancelar");

    const btnFecharDetalhes =
        document.getElementById("btnFecharDetalhes");

    const formFinanceiro =
        document.getElementById("formFinanceiro");

    const tituloModalFinanceiro =
        document.getElementById("tituloModalFinanceiro");

    const btnSalvar =
        document.getElementById("btnSalvar");

    const listaFinanceiro =
        document.getElementById("listaFinanceiro");

    const estadoVazio =
        document.getElementById("estadoVazio");

    const contadorMovimentacoes =
        document.getElementById("contadorMovimentacoes");

    const campoBusca =
        document.getElementById("campoBusca");

    const filtroTipo =
        document.getElementById("filtroTipo");

    const filtroCategoria =
        document.getElementById("filtroCategoria");

    const filtroPeriodo =
        document.getElementById("filtroPeriodo");

    const totalEntradas =
        document.getElementById("totalEntradas");

    const totalSaidas =
        document.getElementById("totalSaidas");

    const saldoAtual =
        document.getElementById("saldoAtual");

    const toast =
        document.getElementById("toast");


    // =====================================================
    // CAMPOS
    // =====================================================

    const campoTipo =
        document.getElementById("tipo");

    const campoDescricao =
        document.getElementById("descricao");

    const campoCategoria =
        document.getElementById("categoria");

    const campoValor =
        document.getElementById("valor");

    const campoData =
        document.getElementById("data");

    const campoFormaPagamento =
        document.getElementById("formaPagamento");

    const campoObservacoes =
        document.getElementById("observacoes");


    // =====================================================
    // DETALHES
    // =====================================================

    const detalheDescricao =
        document.getElementById("detalheDescricao");

    const detalheTipo =
        document.getElementById("detalheTipo");

    const detalheCategoria =
        document.getElementById("detalheCategoria");

    const detalheValor =
        document.getElementById("detalheValor");

    const detalheData =
        document.getElementById("detalheData");

    const detalhePagamento =
        document.getElementById("detalhePagamento");

    const detalheObservacoes =
        document.getElementById("detalheObservacoes");

    const btnEditarMovimentacao =
        document.getElementById("btnEditarMovimentacao");

    const btnExcluirMovimentacao =
        document.getElementById("btnExcluirMovimentacao");


    // =====================================================
    // VARIÁVEIS
    // =====================================================

    let movimentacoes = [];

    let movimentacaoSelecionada = null;


    // =====================================================
    // TEMA
    // =====================================================

    function aplicarTema() {

        const modo =
            localStorage.getItem("ws_modo_noturno");

        if (modo === "dark") {

            document.body.classList.add("dark");

            if (themeToggle) {
                themeToggle.textContent = "☀";
            }

        } else {

            document.body.classList.remove("dark");

            if (themeToggle) {
                themeToggle.textContent = "☾";
            }

        }

    }


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            const dark =
                document.body.classList.toggle("dark");

            localStorage.setItem(
                "ws_modo_noturno",
                dark ? "dark" : "light"
            );

            themeToggle.textContent =
                dark ? "☀" : "☾";

        });

    }


    aplicarTema();


    // =====================================================
    // VOLTAR
    // =====================================================

    if (btnVoltar) {

        btnVoltar.addEventListener("click", () => {

            window.location.href = "index2.html";

        });

    }


    // =====================================================
    // TOAST
    // =====================================================

    function mostrarToast(mensagem) {

        if (!toast) return;

        toast.textContent = mensagem;

        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

    }


    // =====================================================
    // FORMATAÇÃO DE VALOR
    // =====================================================

    function formatarMoeda(valor) {

        const numero =
            Number(valor) || 0;

        return numero.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }


    // =====================================================
    // FORMATAÇÃO DE DATA
    // =====================================================

    function formatarData(data) {

        if (!data) return "—";

        const partes =
            String(data).split("-");

        if (partes.length !== 3) {
            return data;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    // =====================================================
    // CATEGORIA
    // =====================================================

    function nomeCategoria(categoria) {

        const categorias = {

            servico: "Serviço",
            venda: "Venda",
            material: "Material",
            ferramentas: "Ferramentas",
            transporte: "Transporte",
            contas: "Contas",
            outros: "Outros"

        };

        return categorias[categoria] || categoria || "—";

    }


    // =====================================================
    // FORMA DE PAGAMENTO
    // =====================================================

    function nomePagamento(valor) {

        const pagamentos = {

            dinheiro: "Dinheiro",
            pix: "PIX",
            cartao: "Cartão",
            transferencia: "Transferência",
            outro: "Outro"

        };

        return pagamentos[valor] || valor || "—";

    }


    // =====================================================
    // TIPO
    // =====================================================

    function nomeTipo(tipo) {

        return tipo === "entrada"
            ? "Entrada"
            : "Saída";

    }


    // =====================================================
    // DATA ATUAL
    // =====================================================

    function dataAtual() {

        const agora = new Date();

        const ano =
            agora.getFullYear();

        const mes =
            String(agora.getMonth() + 1)
                .padStart(2, "0");

        const dia =
            String(agora.getDate())
                .padStart(2, "0");

        return `${ano}-${mes}-${dia}`;

    }


    // =====================================================
    // ABRIR MODAL
    // =====================================================

    function abrirModal(movimentacao = null) {

        if (!modalFinanceiro || !formFinanceiro) {
            return;
        }

        movimentacaoSelecionada =
            movimentacao;

        formFinanceiro.reset();


        if (movimentacao) {

            tituloModalFinanceiro.textContent =
                "Editar movimentação";

            btnSalvar.textContent =
                "Salvar alterações";


            campoTipo.value =
                movimentacao.tipo || "entrada";

            campoDescricao.value =
                movimentacao.descricao || "";

            campoCategoria.value =
                movimentacao.categoria || "";

            campoValor.value =
                movimentacao.valor ?? "";

            campoData.value =
                movimentacao.data || "";

            campoFormaPagamento.value =
                movimentacao.forma_pagamento || "";

            campoObservacoes.value =
                movimentacao.observacoes || "";


        } else {

            tituloModalFinanceiro.textContent =
                "Nova movimentação";

            btnSalvar.textContent =
                "Salvar movimentação";

            campoTipo.value =
                "entrada";

            campoData.value =
                dataAtual();

        }


        modalFinanceiro.classList.add("show");

        modalFinanceiro.style.display = "flex";

        modalFinanceiro.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-aberto"
        );

    }


    // =====================================================
    // FECHAR MODAL
    // =====================================================

    function fecharModal() {

        if (!modalFinanceiro) return;

        modalFinanceiro.classList.remove("show");

        modalFinanceiro.style.display = "none";

        modalFinanceiro.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-aberto"
        );

        movimentacaoSelecionada = null;

    }


    // =====================================================
    // NOVA MOVIMENTAÇÃO
    // =====================================================

    if (btnNovaMovimentacao) {

        btnNovaMovimentacao.addEventListener(
            "click",
            () => abrirModal()
        );

    }


    if (btnNovaMovimentacaoVazio) {

        btnNovaMovimentacaoVazio.addEventListener(
            "click",
            () => abrirModal()
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


    // =====================================================
    // FECHAR PELO FUNDO
    // =====================================================

    document
        .querySelectorAll("[data-fechar-modal]")
        .forEach(elemento => {

            elemento.addEventListener(
                "click",
                fecharModal
            );

        });


    // =====================================================
    // CARREGAR MOVIMENTAÇÕES
    // =====================================================

    async function carregarFinanceiro() {

        if (!listaFinanceiro) return;

        listaFinanceiro.innerHTML = `
            <div class="estado-vazio">
                Carregando financeiro...
            </div>
        `;


        try {

            const {
                data,
                error
            } = await supabaseClient

                .from("financeiro")

                .select("*")

                .order(
                    "data",
                    {
                        ascending: false
                    }
                );


            if (error) {
                throw error;
            }


            movimentacoes =
                data || [];


            atualizarCategorias();

            atualizarTela();


        } catch (erro) {

            console.error(
                "Erro ao carregar financeiro:",
                erro
            );


            listaFinanceiro.innerHTML = `
                <div class="estado-vazio">
                    Não foi possível carregar o financeiro.
                </div>
            `;


            mostrarToast(
                "Erro ao carregar financeiro."
            );

        }

    }


    // =====================================================
    // CATEGORIAS DO FILTRO
    // =====================================================

    function atualizarCategorias() {

        if (!filtroCategoria) return;


        const categoriaAtual =
            filtroCategoria.value;


        const categorias =
            [...new Set(
                movimentacoes
                    .map(item => item.categoria)
                    .filter(Boolean)
            )];


        filtroCategoria.innerHTML = `
            <option value="">
                Todas as categorias
            </option>
        `;


        categorias
            .sort()
            .forEach(categoria => {

                const option =
                    document.createElement("option");

                option.value =
                    categoria;

                option.textContent =
                    nomeCategoria(categoria);

                filtroCategoria.appendChild(
                    option
                );

            });


        filtroCategoria.value =
            categoriaAtual;

    }


    // =====================================================
    // FILTRAR
    // =====================================================

    function obterMovimentacoesFiltradas() {

        let resultado =
            [...movimentacoes];


        const busca =
            (campoBusca?.value || "")
                .trim()
                .toLowerCase();


        const tipo =
            filtroTipo?.value || "";


        const categoria =
            filtroCategoria?.value || "";


        const periodo =
            filtroPeriodo?.value || "todos";


        // BUSCA

        if (busca) {

            resultado =
                resultado.filter(item => {

                    const texto = [

                        item.descricao,
                        item.categoria,
                        item.observacoes,
                        item.forma_pagamento

                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                    return texto.includes(busca);

                });

        }


        // TIPO

        if (tipo) {

            resultado =
                resultado.filter(
                    item => item.tipo === tipo
                );

        }


        // CATEGORIA

        if (categoria) {

            resultado =
                resultado.filter(
                    item =>
                        item.categoria === categoria
                );

        }


        // PERÍODO

        if (periodo !== "todos") {

            const hoje =
                new Date();

            hoje.setHours(
                23,
                59,
                59,
                999
            );


            resultado =
                resultado.filter(item => {

                    if (!item.data) {
                        return false;
                    }


                    const data =
                        new Date(
                            `${item.data}T00:00:00`
                        );


                    if (periodo === "hoje") {

                        return (
                            data.getFullYear() ===
                                hoje.getFullYear()
                            &&
                            data.getMonth() ===
                                hoje.getMonth()
                            &&
                            data.getDate() ===
                                hoje.getDate()
                        );

                    }


                    if (
                        periodo === "7"
                        ||
                        periodo === "30"
                    ) {

                        const dias =
                            Number(periodo);


                        const inicio =
                            new Date(hoje);

                        inicio.setDate(
                            inicio.getDate() -
                            dias +
                            1
                        );

                        inicio.setHours(
                            0,
                            0,
                            0,
                            0
                        );


                        return (
                            data >= inicio &&
                            data <= hoje
                        );

                    }


                    if (periodo === "mes") {

                        return (
                            data.getFullYear() ===
                                hoje.getFullYear()
                            &&
                            data.getMonth() ===
                                hoje.getMonth()
                        );

                    }


                    if (periodo === "ano") {

                        return (
                            data.getFullYear() ===
                            hoje.getFullYear()
                        );

                    }


                    return true;

                });

        }


        return resultado;

    }


    // =====================================================
    // ATUALIZAR TELA
    // =====================================================

    function atualizarTela() {

        const filtradas =
            obterMovimentacoesFiltradas();


        atualizarResumo();

        renderizarLista(
            filtradas
        );

    }


    // =====================================================
    // RESUMO
    // =====================================================

    function atualizarResumo() {

        let entradas = 0;

        let saidas = 0;


        movimentacoes.forEach(item => {

            const valor =
                Number(item.valor) || 0;


            if (item.tipo === "entrada") {

                entradas += valor;

            } else if (item.tipo === "saida") {

                saidas += valor;

            }

        });


        const saldo =
            entradas - saidas;


        if (totalEntradas) {

            totalEntradas.textContent =
                formatarMoeda(entradas);

        }


        if (totalSaidas) {

            totalSaidas.textContent =
                formatarMoeda(saidas);

        }


        if (saldoAtual) {

            saldoAtual.textContent =
                formatarMoeda(saldo);

        }

    }


    // =====================================================
    // RENDERIZAR LISTA
    // =====================================================

    function renderizarLista(lista) {

        if (!listaFinanceiro) return;


        listaFinanceiro.innerHTML = "";


        if (contadorMovimentacoes) {

            contadorMovimentacoes.textContent =
                `${lista.length} ${
                    lista.length === 1
                        ? "movimentação"
                        : "movimentações"
                }`;

        }


        if (lista.length === 0) {

            listaFinanceiro.innerHTML = "";

            if (estadoVazio) {

                estadoVazio.hidden = false;

            }

            return;

        }


        if (estadoVazio) {

            estadoVazio.hidden = true;

        }


        lista.forEach(item => {

            const elemento =
                document.createElement("article");


            elemento.className =
                `movimentacao ${item.tipo}`;


            const sinal =
                item.tipo === "entrada"
                    ? "+"
                    : "−";


            elemento.innerHTML = `

                <div class="movimentacao-esquerda">

                    <div class="movimentacao-icone">
                        ${sinal}
                    </div>

                    <div class="movimentacao-info">

                        <h3>
                            ${escaparHTML(
                                item.descricao ||
                                "Sem descrição"
                            )}
                        </h3>

                        <p>
                            ${nomeCategoria(
                                item.categoria
                            )}
                            •
                            ${formatarData(
                                item.data
                            )}
                        </p>

                    </div>

                </div>


                <div class="movimentacao-direita">

                    <strong class="movimentacao-valor">

                        ${item.tipo === "entrada"
                            ? "+"
                            : "−"}

                        ${formatarMoeda(
                            item.valor
                        )}

                    </strong>

                    <span class="movimentacao-data">

                        ${nomePagamento(
                            item.forma_pagamento
                        )}

                    </span>

                </div>

            `;


            elemento.addEventListener(
                "click",
                () => abrirDetalhes(item)
            );


            listaFinanceiro.appendChild(
                elemento
            );

        });

    }


    // =====================================================
    // ESCAPAR HTML
    // =====================================================

    function escaparHTML(valor) {

        return String(valor)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    // =====================================================
    // ABRIR DETALHES
    // =====================================================

    function abrirDetalhes(item) {

        movimentacaoSelecionada =
            item;


        detalheDescricao.textContent =
            item.descricao ||
            "Sem descrição";


        detalheTipo.textContent =
            nomeTipo(item.tipo);


        detalheCategoria.textContent =
            nomeCategoria(
                item.categoria
            );


        detalheValor.textContent =
            formatarMoeda(
                item.valor
            );


        detalheData.textContent =
            formatarData(
                item.data
            );


        detalhePagamento.textContent =
            nomePagamento(
                item.forma_pagamento
            );


        detalheObservacoes.textContent =
            item.observacoes ||
            "Nenhuma observação.";


        if (
            item.tipo === "entrada"
        ) {

            detalheTipo.style.color =
                "var(--entrada)";

            detalheValor.style.color =
                "var(--entrada)";

        } else {

            detalheTipo.style.color =
                "var(--saida)";

            detalheValor.style.color =
                "var(--saida)";

        }


        modalDetalhes.classList.add(
            "show"
        );

        modalDetalhes.style.display =
            "flex";

        modalDetalhes.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    // =====================================================
    // FECHAR DETALHES
    // =====================================================

    function fecharDetalhes() {

        if (!modalDetalhes) return;


        modalDetalhes.classList.remove(
            "show"
        );

        modalDetalhes.style.display =
            "none";

        modalDetalhes.setAttribute(
            "aria-hidden",
            "true"
        );

        movimentacaoSelecionada =
            null;

    }


    if (btnFecharDetalhes) {

        btnFecharDetalhes.addEventListener(
            "click",
            fecharDetalhes
        );

    }


    document
        .querySelectorAll("[data-fechar-detalhes]")
        .forEach(elemento => {

            elemento.addEventListener(
                "click",
                fecharDetalhes
            );

        });


    // =====================================================
    // EDITAR
    // =====================================================

    if (btnEditarMovimentacao) {

        btnEditarMovimentacao.addEventListener(
            "click",
            () => {

                if (!movimentacaoSelecionada) {
                    return;
                }


                fecharDetalhes();

                abrirModal(
                    movimentacaoSelecionada
                );

            }
        );

    }


    // =====================================================
    // EXCLUIR
    // =====================================================

    if (btnExcluirMovimentacao) {

        btnExcluirMovimentacao.addEventListener(
            "click",
            async () => {

                if (!movimentacaoSelecionada) {
                    return;
                }


                const confirmar =
                    confirm(
                        "Deseja realmente excluir esta movimentação?"
                    );


                if (!confirmar) {
                    return;
                }


                try {

                    const {
                        error
                    } = await supabaseClient

                        .from("financeiro")

                        .delete()

                        .eq(
                            "id",
                            movimentacaoSelecionada.id
                        );


                    if (error) {
                        throw error;
                    }


                    fecharDetalhes();


                    mostrarToast(
                        "Movimentação excluída."
                    );


                    await carregarFinanceiro();


                } catch (erro) {

                    console.error(
                        "Erro ao excluir:",
                        erro
                    );


                    mostrarToast(
                        "Erro ao excluir movimentação."
                    );

                }

            }
        );

    }


    // =====================================================
    // SALVAR
    // =====================================================

    if (formFinanceiro) {

        formFinanceiro.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const tipo =
                    campoTipo.value;


                const descricao =
                    campoDescricao.value.trim();


                const categoria =
                    campoCategoria.value;


                const valor =
                    Number(
                        campoValor.value
                    );


                const data =
                    campoData.value;


                const formaPagamento =
                    campoFormaPagamento.value;


                const observacoes =
                    campoObservacoes.value.trim();


                if (!descricao) {

                    mostrarToast(
                        "Informe uma descrição."
                    );

                    campoDescricao.focus();

                    return;

                }


                if (!categoria) {

                    mostrarToast(
                        "Selecione uma categoria."
                    );

                    campoCategoria.focus();

                    return;

                }


                if (
                    !valor ||
                    valor <= 0
                ) {

                    mostrarToast(
                        "Informe um valor válido."
                    );

                    campoValor.focus();

                    return;

                }


                if (!data) {

                    mostrarToast(
                        "Informe a data."
                    );

                    campoData.focus();

                    return;

                }


                btnSalvar.disabled = true;

                btnSalvar.textContent =
                    "Salvando...";


                try {

                    const dados = {

                        tipo,
                        descricao,
                        categoria,
                        valor,
                        data,
                        forma_pagamento:
                            formaPagamento || null,
                        observacoes:
                            observacoes || null

                    };


                    let resultado;


                    if (
                        movimentacaoSelecionada
                    ) {

                        resultado =
                            await supabaseClient

                                .from("financeiro")

                                .update(dados)

                                .eq(
                                    "id",
                                    movimentacaoSelecionada.id
                                );


                    } else {

                        resultado =
                            await supabaseClient

                                .from("financeiro")

                                .insert([
                                    dados
                                ]);

                    }


                    if (resultado.error) {
                        throw resultado.error;
                    }


                    fecharModal();


                    mostrarToast(
                        movimentacaoSelecionada
                            ? "Movimentação atualizada."
                            : "Movimentação adicionada."
                    );


                    await carregarFinanceiro();


                } catch (erro) {

                    console.error(
                        "Erro ao salvar:",
                        erro
                    );


                    mostrarToast(
                        "Erro ao salvar movimentação."
                    );

                } finally {

                    btnSalvar.disabled =
                        false;

                    btnSalvar.textContent =
                        movimentacaoSelecionada
                            ? "Salvar alterações"
                            : "Salvar movimentação";

                }

            }
        );

    }


    // =====================================================
    // FILTROS
    // =====================================================

    if (campoBusca) {

        campoBusca.addEventListener(
            "input",
            atualizarTela
        );

    }


    if (filtroTipo) {

        filtroTipo.addEventListener(
            "change",
            atualizarTela
        );

    }


    if (filtroCategoria) {

        filtroCategoria.addEventListener(
            "change",
            atualizarTela
        );

    }


    if (filtroPeriodo) {

        filtroPeriodo.addEventListener(
            "change",
            atualizarTela
        );

    }


    // =====================================================
    // TECLA ESC
    // =====================================================

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            fecharModal();

            fecharDetalhes();

        }
    );


    // =====================================================
    // INICIAR
    // =====================================================

    async function iniciar() {

        console.log(
            "Iniciando módulo Financeiro..."
        );


        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            console.error(
                "supabaseClient não encontrado."
            );


            mostrarToast(
                "Erro: Supabase não carregado."
            );

            return;

        }


        await carregarFinanceiro();

    }


    iniciar();

});