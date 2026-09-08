/* =========================================================
   WS SOLUÇÕES — ORDENS DE SERVIÇO
   CRUD COMPLETO
   Código automático
   Clientes vinculados
   Lista compacta + Modal de detalhes
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const btnNovaOS =
        document.getElementById("btnNovaOS");

    const btnFecharModal =
        document.getElementById("btnFecharModal");

    const btnCancelar =
        document.getElementById("btnCancelar");

    const modalOS =
        document.getElementById("modalOS");

    const formOS =
        document.getElementById("formOS");

    const modalTitulo =
        document.getElementById("modalTitulo");

    const buscaOS =
        document.getElementById("buscaOS");

    const listaOS =
        document.getElementById("listaOS");

    const totalOS =
        document.getElementById("totalOS");


    /* =====================================================
       MODAL DE DETALHES
    ===================================================== */

    const modalDetalhesOS =
        document.getElementById("modalDetalhesOS");

    const btnFecharDetalhes =
        document.getElementById("btnFecharDetalhes");

    const btnEditarDetalhes =
        document.getElementById("btnEditarDetalhes");

    const btnExcluirDetalhes =
        document.getElementById("btnExcluirDetalhes");


    /* =====================================================
       DADOS
    ===================================================== */

    let ordens = [];

    let clientes = [];

    let osSelecionada = null;


    /* =====================================================
       TOAST
    ===================================================== */

    function mostrarMensagem(mensagem) {

        const toast =
            document.getElementById("toast");

        const toastMessage =
            document.getElementById("toastMessage");


        if (!toast || !toastMessage) {

            alert(mensagem);

            return;

        }


        toastMessage.textContent =
            mensagem;

        toast.classList.add("show");


        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

    }


    /* =====================================================
       GERAR CÓDIGO DA OS
    ===================================================== */

    function gerarProximoCodigo() {

        let maiorNumero = 0;


        ordens.forEach(os => {

            const codigo =
                String(os.codigo || "");


            const resultado =
                codigo.match(
                    /^(?:WS-)?OS-(\d+)$/i
                );


            if (resultado) {

                const numero =
                    parseInt(
                        resultado[1],
                        10
                    );


                if (
                    !isNaN(numero) &&
                    numero > maiorNumero
                ) {

                    maiorNumero = numero;

                }

            }

        });


        return `WS-OS-${String(
            maiorNumero + 1
        ).padStart(6, "0")}`;

    }


    /* =====================================================
       FORMATAÇÃO
    ===================================================== */

    function formatarMoeda(valor) {

        const numero =
            Number(valor || 0);


        return numero.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }


    function formatarData(data) {

        if (!data) return "—";


        const partes =
            String(data).split("-");


        if (partes.length === 3) {

            return `${partes[2]}/${partes[1]}/${partes[0]}`;

        }


        return data;

    }


    function textoStatus(status) {

        const nomes = {

            aberta:
                "Aberta",

            em_andamento:
                "Em andamento",

            aguardando_aprovacao:
                "Aguardando aprovação",

            aguardando_peca:
                "Aguardando peça",

            concluida:
                "Concluída",

            cancelada:
                "Cancelada"

        };


        return nomes[status] ||
            status ||
            "—";

    }


    function textoPrioridade(prioridade) {

        const nomes = {

            baixa:
                "Baixa",

            normal:
                "Normal",

            alta:
                "Alta",

            urgente:
                "Urgente"

        };


        return nomes[prioridade] ||
            prioridade ||
            "—";

    }


    function classeStatus(status) {

        return String(status || "")
            .toLowerCase()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            );

    }


    /* =====================================================
       CARREGAR CLIENTES
    ===================================================== */

    async function carregarClientes() {

        const selectCliente =
            document.getElementById(
                "cliente_id"
            );


        if (!selectCliente) return;


        try {

            const { data, error } =
                await supabaseClient
                    .from("clientes")
                    .select(
                        "id, codigo, nome"
                    )
                    .order(
                        "nome",
                        {
                            ascending: true
                        }
                    );


            if (error) {

                throw error;

            }


            clientes =
                data || [];


            selectCliente.innerHTML = `
                <option value="">
                    Selecione o cliente
                </option>
            `;


            clientes.forEach(cliente => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    cliente.id;


                option.textContent =
                    `${cliente.codigo || ""} — ${cliente.nome}`;


                selectCliente.appendChild(
                    option
                );

            });


        } catch (erro) {

            console.error(
                "Erro ao carregar clientes:",
                erro
            );


            mostrarMensagem(
                "Erro ao carregar clientes."
            );

        }

    }


    /* =====================================================
       ABRIR MODAL DE OS
    ===================================================== */

    function abrirModalOS(os = null) {

        if (!modalOS || !formOS) return;


        modalOS.classList.add("show");

        modalOS.setAttribute(
            "aria-hidden",
            "false"
        );


        if (os) {

            modalTitulo.textContent =
                "Editar OS";


            preencherFormulario(os);

        } else {

            modalTitulo.textContent =
                "Nova OS";


            formOS.reset();


            document.getElementById(
                "osId"
            ).value = "";


            document.getElementById(
                "codigo"
            ).value =
                gerarProximoCodigo();


            document.getElementById(
                "status"
            ).value =
                "aberta";


            document.getElementById(
                "prioridade"
            ).value =
                "normal";


            document.getElementById(
                "desconto"
            ).value =
                "0";


            document.getElementById(
                "valor_total"
            ).value =
                "0.00";


            const dataHoje =
                new Date()
                    .toISOString()
                    .split("T")[0];


            document.getElementById(
                "data_entrada"
            ).value =
                dataHoje;


            setTimeout(() => {

                document.getElementById(
                    "cliente_id"
                )?.focus();

            }, 100);

        }

    }


    /* =====================================================
       PREENCHER FORMULÁRIO
    ===================================================== */

    function preencherFormulario(os) {

        document.getElementById(
            "osId"
        ).value =
            os.id || "";


        document.getElementById(
            "codigo"
        ).value =
            os.codigo || "";


        document.getElementById(
            "cliente_id"
        ).value =
            os.cliente_id || "";


        document.getElementById(
            "equipamento_id"
        ).value =
            os.equipamento_id || "";


        document.getElementById(
            "tipo_servico"
        ).value =
            os.tipo_servico || "";


        document.getElementById(
            "aparelho"
        ).value =
            os.aparelho || "";


        document.getElementById(
            "marca"
        ).value =
            os.marca || "";


        document.getElementById(
            "modelo"
        ).value =
            os.modelo || "";


        document.getElementById(
            "defeito"
        ).value =
            os.defeito || "";


        document.getElementById(
            "diagnostico"
        ).value =
            os.diagnostico || "";


        document.getElementById(
            "servico_realizado"
        ).value =
            os.servico_realizado || "";


        document.getElementById(
            "valor"
        ).value =
            os.valor ?? "";


        document.getElementById(
            "desconto"
        ).value =
            os.desconto ?? 0;


        document.getElementById(
            "valor_total"
        ).value =
            os.valor_total ?? 0;


        document.getElementById(
            "status"
        ).value =
            os.status || "aberta";


        document.getElementById(
            "prioridade"
        ).value =
            os.prioridade || "normal";


        document.getElementById(
            "data_entrada"
        ).value =
            os.data_entrada || "";


        document.getElementById(
            "data_conclusao"
        ).value =
            os.data_conclusao || "";


        document.getElementById(
            "observacoes"
        ).value =
            os.observacoes || "";

    }


    /* =====================================================
       FECHAR MODAL DE OS
    ===================================================== */

    function fecharModalOS() {

        if (!modalOS) return;


        modalOS.classList.remove("show");


        modalOS.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       ABRIR DETALHES
    ===================================================== */

    function abrirDetalhesOS(os) {

        if (
            !modalDetalhesOS ||
            !os
        ) return;


        osSelecionada =
            os;


        const cliente =
            clientes.find(
                item =>
                    String(item.id) ===
                    String(os.cliente_id)
            );


        document.getElementById(
            "detalheCodigo"
        ).textContent =
            os.codigo || "—";


        document.getElementById(
            "detalheCliente"
        ).textContent =
            cliente?.nome ||
            os.cliente_nome ||
            "—";


        document.getElementById(
            "detalheStatus"
        ).textContent =
            textoStatus(
                os.status
            );


        document.getElementById(
            "detalhePrioridade"
        ).textContent =
            textoPrioridade(
                os.prioridade
            );


        document.getElementById(
            "detalheTipoServico"
        ).textContent =
            os.tipo_servico || "—";


        document.getElementById(
            "detalheAparelho"
        ).textContent =
            os.aparelho || "—";


        document.getElementById(
            "detalheMarca"
        ).textContent =
            os.marca || "—";


        document.getElementById(
            "detalheModelo"
        ).textContent =
            os.modelo || "—";


        document.getElementById(
            "detalheDataEntrada"
        ).textContent =
            formatarData(
                os.data_entrada
            );


        document.getElementById(
            "detalheDataConclusao"
        ).textContent =
            formatarData(
                os.data_conclusao
            );


        document.getElementById(
            "detalheValor"
        ).textContent =
            formatarMoeda(
                os.valor
            );


        document.getElementById(
            "detalheDesconto"
        ).textContent =
            formatarMoeda(
                os.desconto
            );


        document.getElementById(
            "detalheValorTotal"
        ).textContent =
            formatarMoeda(
                os.valor_total
            );


        document.getElementById(
            "detalheDefeito"
        ).textContent =
            os.defeito || "—";


        document.getElementById(
            "detalheDiagnostico"
        ).textContent =
            os.diagnostico || "—";


        document.getElementById(
            "detalheServicoRealizado"
        ).textContent =
            os.servico_realizado || "—";


        document.getElementById(
            "detalheObservacoes"
        ).textContent =
            os.observacoes || "—";


        modalDetalhesOS.classList.add(
            "show"
        );


        modalDetalhesOS.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    /* =====================================================
       FECHAR DETALHES
    ===================================================== */

    function fecharDetalhesOS() {

        if (!modalDetalhesOS) return;


        modalDetalhesOS.classList.remove(
            "show"
        );


        modalDetalhesOS.setAttribute(
            "aria-hidden",
            "true"
        );


        osSelecionada =
            null;

    }


    /* =====================================================
       CARREGAR ORDENS
    ===================================================== */

    async function carregarOS() {

        if (!listaOS) return;


        listaOS.innerHTML = `
            <div class="os-loading">
                Carregando ordens de serviço...
            </div>
        `;


        try {

            const { data, error } =
                await supabaseClient
                    .from("ordens_servico")
                    .select("*")
                    .order(
                        "criado_em",
                        {
                            ascending: false
                        }
                    );


            if (error) {

                throw error;

            }


            ordens =
                data || [];


            atualizarTotal();

            renderizarOS();


        } catch (erro) {

            console.error(
                "Erro ao carregar OS:",
                erro
            );


            listaOS.innerHTML = `
                <div class="os-empty">

                    <div class="os-empty-icon">
                        ⚠️
                    </div>

                    <strong>
                        Erro ao carregar as OS
                    </strong>

                    <p>
                        Verifique a conexão com o Supabase.
                    </p>

                </div>
            `;


            mostrarMensagem(
                "Erro ao carregar ordens de serviço."
            );

        }

    }


    /* =====================================================
       TOTAL
    ===================================================== */

    function atualizarTotal() {

        if (totalOS) {

            totalOS.textContent =
                ordens.length;

        }

    }


    /* =====================================================
       RENDERIZAR LISTA
    ===================================================== */

    function renderizarOS() {

        if (!listaOS) return;


        const termo =
            (
                buscaOS?.value ||
                ""
            )
                .trim()
                .toLowerCase();


        const filtradas =
            ordens.filter(os => {

                const cliente =
                    clientes.find(
                        item =>
                            String(item.id) ===
                            String(os.cliente_id)
                    );


                const nomeCliente =
                    String(
                        cliente?.nome ||
                        os.cliente_nome ||
                        ""
                    )
                        .toLowerCase();


                const codigo =
                    String(
                        os.codigo || ""
                    )
                        .toLowerCase();


                const aparelho =
                    String(
                        os.aparelho || ""
                    )
                        .toLowerCase();


                const status =
                    String(
                        textoStatus(
                            os.status
                        )
                    )
                        .toLowerCase();


                return (
                    codigo.includes(termo) ||
                    nomeCliente.includes(termo) ||
                    aparelho.includes(termo) ||
                    status.includes(termo)
                );

            });


        if (!filtradas.length) {

            listaOS.innerHTML = `
                <div class="os-empty">

                    <div class="os-empty-icon">
                        🛠️
                    </div>

                    <strong>
                        ${
                            termo
                                ? "Nenhuma OS encontrada"
                                : "Nenhuma ordem de serviço cadastrada"
                        }
                    </strong>

                    <p>
                        ${
                            termo
                                ? "Tente outro código, cliente, aparelho ou status."
                                : 'Clique em "Nova OS" para começar.'
                        }
                    </p>

                </div>
            `;

            return;

        }


        listaOS.innerHTML =
            filtradas.map(os => {

                const cliente =
                    clientes.find(
                        item =>
                            String(item.id) ===
                            String(os.cliente_id)
                    );


                const nomeCliente =
                    cliente?.nome ||
                    os.cliente_nome ||
                    "Cliente não informado";


                const classe =
                    classeStatus(
                        os.status
                    );


                return `

                    <div
                        class="os-item"
                        data-os-id="${escapar(os.id)}">

                        <div class="os-main">

                            <span class="os-code">
                                ${escapar(os.codigo)}
                            </span>

                            <div class="os-client">
             