document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const btnNovaOS = document.getElementById("btnNovaOS");
    const btnFecharModal = document.getElementById("btnFecharModal");
    const btnCancelar = document.getElementById("btnCancelar");

    const modalOS = document.getElementById("modalOS");
    const modalDetalhesOS = document.getElementById("modalDetalhesOS");

    const formOS = document.getElementById("formOS");

    const buscaOS = document.getElementById("buscaOS");
    const listaOS = document.getElementById("listaOS");
    const totalOS = document.getElementById("totalOS");

    const themeToggle = document.getElementById("themeToggle");

    const btnFecharDetalhes =
        document.getElementById("btnFecharDetalhes");

    const btnEditarDetalhes =
        document.getElementById("btnEditarDetalhes");

    const btnExcluirDetalhes =
        document.getElementById("btnExcluirDetalhes");


    /* =====================================================
       ESTADO
    ====================================================== */

    let ordens = [];
    let clientes = [];
    let osSelecionada = null;


    /* =====================================================
       TOAST
    ====================================================== */

    function mostrarToast(mensagem) {

        const toast = document.getElementById("toast");
        const toastMessage =
            document.getElementById("toastMessage");

        if (!toast || !toastMessage) return;

        toastMessage.textContent = mensagem;

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }


    /* =====================================================
       TEMA
    ====================================================== */

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


    themeToggle?.addEventListener("click", () => {

        const estaDark =
            document.body.classList.contains("dark");

        if (estaDark) {

            document.body.classList.remove("dark");

            localStorage.setItem(
                "ws_modo_noturno",
                "light"
            );

            themeToggle.textContent = "☾";

        } else {

            document.body.classList.add("dark");

            localStorage.setItem(
                "ws_modo_noturno",
                "dark"
            );

            themeToggle.textContent = "☀";
        }

    });


    aplicarTema();


    /* =====================================================
       STATUS
    ====================================================== */

    function textoStatus(status) {

        const mapa = {

            aberta: "Aberta",

            aguardando: "Aguardando",

            em_andamento: "Em andamento",

            aguardando_peca: "Aguardando peça",

            concluida: "Concluída",

            entregue: "Entregue",

            cancelada: "Cancelada"

        };

        return mapa[status] || status || "—";
    }


    function classeStatus(status) {

        return "os-status-" +
            String(status || "")
                .toLowerCase()
                .replace(/_/g, "-");
    }


    function textoPrioridade(prioridade) {

        const mapa = {

            baixa: "Baixa",

            normal: "Normal",

            alta: "Alta",

            urgente: "Urgente"

        };

        return mapa[prioridade] ||
            prioridade ||
            "—";
    }


    /* =====================================================
       FORMATAÇÃO
    ====================================================== */

    function formatarMoeda(valor) {

        return Number(valor || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }


    function formatarData(data) {

        if (!data) return "—";

        const somenteData =
            String(data).substring(0, 10);

        const partes =
            somenteData.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }


    /* =====================================================
       CLIENTES
    ====================================================== */

    async function carregarClientes() {

        const selectCliente =
            document.getElementById("cliente_id");

        if (!selectCliente) return;

        const { data, error } =
            await supabaseClient
                .from("clientes")
                .select("id,codigo,nome")
                .order("nome", {
                    ascending: true
                });

        if (error) {

            console.error(
                "Erro ao carregar clientes:",
                error
            );

            mostrarToast(
                "Erro ao carregar clientes."
            );

            return;
        }

        clientes = data || [];

        selectCliente.innerHTML = `
            <option value="">
                Selecione o cliente
            </option>
        `;

        clientes.forEach(cliente => {

            const option =
                document.createElement("option");

            option.value = cliente.id;

            option.textContent =
                `${cliente.codigo || ""} - ${cliente.nome}`;

            selectCliente.appendChild(option);

        });
    }


    /* =====================================================
       EQUIPAMENTOS
    ====================================================== */

    async function carregarEquipamentos(clienteId = null) {

        const select =
            document.getElementById("equipamento_id");

        if (!select) return;

        select.innerHTML = `
            <option value="">
                Selecione o equipamento
            </option>
        `;

        if (!clienteId) return;

        /*
         * Só tenta carregar equipamentos se
         * a tabela existir no banco.
         */

        const { data, error } =
            await supabaseClient
                .from("equipamentos")
                .select("id,nome,aparelho,marca,modelo")
                .eq("cliente_id", clienteId)
                .order("nome", {
                    ascending: true
                });

        if (error) {

            console.warn(
                "Equipamentos não carregados:",
                error
            );

            return;
        }

        (data || []).forEach(equipamento => {

            const option =
                document.createElement("option");

            option.value = equipamento.id;

            const nome =
                equipamento.nome ||
                equipamento.aparelho ||
                "Equipamento";

            const marca =
                equipamento.marca || "";

            const modelo =
                equipamento.modelo || "";

            option.textContent =
                [nome, marca, modelo]
                    .filter(Boolean)
                    .join(" - ");

            select.appendChild(option);

        });
    }


    document
        .getElementById("cliente_id")
        ?.addEventListener(
            "change",
            event => {

                carregarEquipamentos(
                    event.target.value || null
                );

            }
        );


    /* =====================================================
       CÓDIGO DA OS
    ====================================================== */

    function gerarProximoCodigo() {

        let maior = 0;

        ordens.forEach(os => {

            const codigo =
                String(os.codigo || "");

            const match =
                codigo.match(/OS-(\d+)/i);

            if (match) {

                const numero =
                    parseInt(match[1], 10);

                if (numero > maior) {
                    maior = numero;
                }
            }

        });

        return "WS-OS-" +
            String(maior + 1).padStart(6, "0");
    }


    /* =====================================================
       ABRIR MODAL
    ====================================================== */

    async function abrirModalOS(os = null) {

        if (!modalOS || !formOS) return;

        await carregarClientes();

        osSelecionada = os;

        modalOS.classList.add("show");
        modalOS.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-aberto"
        );

        if (!os) {

            formOS.reset();

            document.getElementById(
                "osId"
            ).value = "";

            document.getElementById(
                "codigo"
            ).value = gerarProximoCodigo();

            document.getElementById(
                "status"
            ).value = "aberta";

            document.getElementById(
                "prioridade"
            ).value = "normal";

            document.getElementById(
                "desconto"
            ).value = "0";

            document.getElementById(
                "valor_total"
            ).value = "0.00";

            const hoje =
                new Date().toISOString().split("T")[0];

            document.getElementById(
                "data_entrada"
            ).value = hoje;

            carregarEquipamentos(null);

            document.getElementById(
                "modalTitulo"
            ).textContent = "Nova OS";

        } else {

            preencherFormulario(os);

            document.getElementById(
                "modalTitulo"
            ).textContent = "Editar OS";

        }
    }


    /* =====================================================
       PREENCHER FORMULÁRIO
    ====================================================== */

    async function preencherFormulario(os) {

        const set = (id, valor) => {

            const elemento =
                document.getElementById(id);

            if (elemento) {
                elemento.value =
                    valor ?? "";
            }
        };

        set("osId", os.id);
        set("codigo", os.codigo);
        set("cliente_id", os.cliente_id);
        set("equipamento_id", os.equipamento_id);

        set("tipo_servico", os.tipo_servico);
        set("aparelho", os.aparelho);
        set("marca", os.marca);
        set("modelo", os.modelo);

        set("defeito", os.defeito);
        set("diagnostico", os.diagnostico);
        set(
            "servico_realizado",
            os.servico_realizado
        );

        set("valor", os.valor);
        set("desconto", os.desconto);

        set(
            "valor_total",
            os.valor_total
        );

        set(
            "status",
            os.status
        );

        set(
            "prioridade",
            os.prioridade
        );

        set(
            "data_entrada",
            os.data_entrada
                ? String(os.data_entrada)
                    .substring(0, 10)
                : ""
        );

        set(
            "data_conclusao",
            os.data_conclusao
                ? String(os.data_conclusao)
                    .substring(0, 10)
                : ""
        );

        set(
            "observacoes",
            os.observacoes
        );

        await carregarEquipamentos(
            os.cliente_id
        );

        set(
            "equipamento_id",
            os.equipamento_id
        );
    }


    /* =====================================================
       FECHAR MODAL
    ====================================================== */

    function fecharModalOS() {

        if (!modalOS) return;

        modalOS.classList.remove("show");

        modalOS.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-aberto"
        );

        osSelecionada = null;
    }


    btnNovaOS?.addEventListener(
        "click",
        () => abrirModalOS()
    );

    btnFecharModal?.addEventListener(
        "click",
        fecharModalOS
    );

    btnCancelar?.addEventListener(
        "click",
        fecharModalOS
    );


    /* =====================================================
       CLIQUE NO FUNDO DO MODAL
    ====================================================== */

    modalOS?.addEventListener(
        "click",
        event => {

            if (
                event.target.classList.contains(
                    "modal-overlay"
                )
            ) {

                fecharModalOS();

            }

        }
    );


    /* =====================================================
       VALOR TOTAL
    ====================================================== */

    function calcularValorTotal() {

        const valor =
            parseFloat(
                document.getElementById(
                    "valor"
                )?.value
            ) || 0;

        const desconto =
            parseFloat(
                document.getElementById(
                    "desconto"
                )?.value
            ) || 0;

        const total =
            Math.max(
                valor - desconto,
                0
            );

        const campo =
            document.getElementById(
                "valor_total"
            );

        if (campo) {

            campo.value =
                total.toFixed(2);

        }
    }


    document
        .getElementById("valor")
        ?.addEventListener(
            "input",
            calcularValorTotal
        );

    document
        .getElementById("desconto")
        ?.addEventListener(
            "input",
            calcularValorTotal
        );


    /* =====================================================
       SALVAR OS
    ====================================================== */

    formOS?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const clienteId =
                document.getElementById(
                    "cliente_id"
                )?.value || null;

            if (!clienteId) {

                mostrarToast(
                    "Selecione um cliente."
                );

                return;
            }


            const valor =
                parseFloat(
                    document.getElementById(
                        "valor"
                    )?.value
                ) || 0;


            const desconto =
                parseFloat(
                    document.getElementById(
                        "desconto"
                    )?.value
                ) || 0;


            /*
             * IMPORTANTE:
             *
             * valor_total NÃO é enviado.
             *
             * Ele é uma coluna GENERATED
             * no banco de dados.
             */


            const dados = {

                cliente_id: clienteId,

                equipamento_id:
                    document.getElementById(
                        "equipamento_id"
                    )?.value || null,

                orcamento_id: null,

                tipo_servico:
                    document.getElementById(
                        "tipo_servico"
                    )?.value.trim() || null,

                aparelho:
                    document.getElementById(
                        "aparelho"
                    )?.value.trim() || null,

                marca:
                    document.getElementById(
                        "marca"
                    )?.value.trim() || null,

                modelo:
                    document.getElementById(
                        "modelo"
                    )?.value.trim() || null,

                defeito:
                    document.getElementById(
                        "defeito"
                    )?.value.trim() || null,

                diagnostico:
                    document.getElementById(
                        "diagnostico"
                    )?.value.trim() || null,

                servico_realizado:
                    document.getElementById(
                        "servico_realizado"
                    )?.value.trim() || null,

                valor: valor,

                desconto: desconto,

                status:
                    document.getElementById(
                        "status"
                    )?.value || "aberta",

                prioridade:
                    document.getElementById(
                        "prioridade"
                    )?.value || "normal",

                data_entrada:
                    document.getElementById(
                        "data_entrada"
                    )?.value || null,

                data_conclusao:
                    document.getElementById(
                        "data_conclusao"
                    )?.value || null,

                observacoes:
                    document.getElementById(
                        "observacoes"
                    )?.value.trim() || null

            };


            /*
             * Código:
             *
             * Se for uma OS nova, deixamos o
             * banco gerar o código.
             *
             * Se for edição, mantemos o código.
             */

            const osId =
                document.getElementById(
                    "osId"
                )?.value;


            let resultado;


            if (osId) {

                resultado =
                    await supabaseClient
                        .from("ordens_servico")
                        .update(dados)
                        .eq("id", osId)
                        .select()
                        .single();

            } else {

                resultado =
                    await supabaseClient
                        .from("ordens_servico")
                        .insert(dados)
                        .select()
                        .single();

            }


            if (resultado.error) {

                console.error(
                    "Erro ao salvar OS:",
                    resultado.error
                );

                mostrarToast(
                    "Erro ao salvar OS: " +
                    resultado.error.message
                );

                return;
            }


            mostrarToast(
                osId
                    ? "OS atualizada com sucesso!"
                    : "OS criada com sucesso!"
            );


            fecharModalOS();

            await carregarOS();

        }
    );


    /* =====================================================
       CARREGAR ORDENS
    ====================================================== */

    async function carregarOS() {

        const { data, error } =
            await supabaseClient
                .from("ordens_servico")
                .select("*")
                .order("criado_em", {
                    ascending: false
                });


        if (error) {

            console.error(
                "Erro ao carregar OS:",
                error
            );

            listaOS.innerHTML = `
                <div class="os-loading">
                    Erro ao carregar ordens de serviço.
                </div>
            `;

            mostrarToast(
                "Erro ao carregar ordens de serviço."
            );

            return;
        }


        ordens = data || [];

        totalOS.textContent =
            ordens.length;

        renderizarOS();

    }


    /* =====================================================
       RENDERIZAR LISTA
    ====================================================== */

    function renderizarOS() {

        const termo =
            (buscaOS?.value || "")
                .toLowerCase()
                .trim();


        const filtradas =
            ordens.filter(os => {

                const cliente =
                    clientes.find(
                        c => c.id === os.cliente_id
                    );

                const texto = [

                    os.codigo,

                    cliente?.nome,

                    os.aparelho,

                    os.marca,

                    os.modelo,

                    textoStatus(os.status)

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return texto.includes(termo);

            });


        if (!filtradas.length) {

            listaOS.innerHTML = `
                <div class="os-loading">
                    Nenhuma ordem de serviço encontrada.
                </div>
            `;

            return;
        }


        listaOS.innerHTML = "";


        filtradas.forEach(os => {

            const cliente =
                clientes.find(
                    c => c.id === os.cliente_id
                );


            const item =
                document.createElement("div");

            item.className = "os-item";


            item.innerHTML = `

                <div class="os-item-main">

                    <strong class="os-code">
                        ${os.codigo || "—"}
                    </strong>

                    <span class="os-client">
                        ${cliente?.nome || "Cliente não encontrado"}
                    </span>

                    <span class="os-device">
                        ${
                            [
                                os.aparelho,
                                os.marca,
                                os.modelo
                            ]
                            .filter(Boolean)
                            .join(" • ") || "Sem equipamento"
                        }
                    </span>

                </div>

                <span class="os-status ${classeStatus(os.status)}">
                    ${textoStatus(os.status)}
                </span>

            `;


            item.addEventListener(
                "click",
                () => abrirDetalhesOS(os)
            );


            listaOS.appendChild(item);

        });

    }


    buscaOS?.addEventListener(
        "input",
        renderizarOS
    );


    /* =====================================================
       MODAL DETALHES
    ====================================================== */

    function abrirDetalhesOS(os) {

        osSelecionada = os;


        const cliente =
            clientes.find(
                c => c.id === os.cliente_id
            );


        const set = (id, valor) => {

            const elemento =
                document.getElementById(id);

            if (elemento) {

                elemento.textContent =
                    valor ?? "—";

            }

        };


        set(
            "detalheCodigo",
            os.codigo
        );

        set(
            "detalheCliente",
            cliente?.nome || "—"
        );

        set(
            "detalheStatus",
            textoStatus(os.status)
        );

        set(
            "detalhePrioridade",
            textoPrioridade(os.prioridade)
        );

        set(
            "detalheTipoServico",
            os.tipo_servico
        );

        set(
            "detalheAparelho",
            os.aparelho
        );

        set(
            "detalheMarca",
            os.marca
        );

        set(
            "detalheModelo",
            os.modelo
        );

        set(
            "detalheDataEntrada",
            formatarData(os.data_entrada)
        );

        set(
            "detalheDataConclusao",
            formatarData(os.data_conclusao)
        );

        set(
            "detalheValor",
            formatarMoeda(os.valor)
        );

        set(
            "detalheDesconto",
            formatarMoeda(os.desconto)
        );

        set(
            "detalheValorTotal",
            formatarMoeda(os.valor_total)
        );

        set(
            "detalheDefeito",
            os.defeito
        );

        set(
            "detalheDiagnostico",
            os.diagnostico
        );

        set(
            "detalheServicoRealizado",
            os.servico_realizado
        );

        set(
            "detalheObservacoes",
            os.observacoes
        );


        modalDetalhesOS?.classList.add(
            "show"
        );

        modalDetalhesOS?.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-aberto"
        );

    }


    /* =====================================================
       FECHAR DETALHES
    ====================================================== */

    function fecharDetalhes() {

        modalDetalhesOS?.classList.remove(
            "show"
        );

        modalDetalhesOS?.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-aberto"
        );

        osSelecionada = null;

    }


    btnFecharDetalhes?.addEventListener(
        "click",
        fecharDetalhes
    );


    modalDetalhesOS?.addEventListener(
        "click",
        event => {

            if (
                event.target.classList.contains(
                    "modal-overlay"
                )
            ) {

                fecharDetalhes();

            }

        }
    );


    /* =====================================================
       EDITAR
    ====================================================== */

    btnEditarDetalhes?.addEventListener(
        "click",
        async () => {

            if (!osSelecionada) return;

            const os =
                osSelecionada;

            fecharDetalhes();

            await abrirModalOS(os);

        }
    );


    /* =====================================================
       EXCLUIR
    ====================================================== */

    btnExcluirDetalhes?.addEventListener(
        "click",
        async () => {

            if (!osSelecionada) return;

            const confirmar =
                confirm(
                    `Deseja realmente excluir a OS ${osSelecionada.codigo}?`
                );

            if (!confirmar) return;


            const { error } =
                await supabaseClient
                    .from("ordens_servico")
                    .delete()
                    .eq(
                        "id",
                        osSelecionada.id
                    );


            if (error) {

                console.error(
                    "Erro ao excluir OS:",
                    error
                );

                mostrarToast(
                    "Erro ao excluir OS: " +
                    error.message
                );

                return;
            }


            mostrarToast(
                "OS excluída com sucesso!"
            );


            fecharDetalhes();

            await carregarOS();

        }
    );


    /* =====================================================
       ESC
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") return;

            if (
                modalOS?.classList.contains(
                    "show"
                )
            ) {

                fecharModalOS();

            }

            if (
                modalDetalhesOS?.classList.contains(
                    "show"
                )
            ) {

                fecharDetalhes();

            }

        }
    );


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    async function iniciar() {

        await carregarClientes();

        await carregarOS();

    }


    iniciar();

});