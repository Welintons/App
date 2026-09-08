document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

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

    const btnFecharDetalhes = document.getElementById("btnFecharDetalhes");
    const btnEditarDetalhes = document.getElementById("btnEditarDetalhes");
    const btnExcluirDetalhes = document.getElementById("btnExcluirDetalhes");


    console.log("OS.js carregado");
    console.log("Elementos:", {
        btnNovaOS,
        btnFecharModal,
        btnCancelar,
        modalOS,
        modalDetalhesOS,
        formOS,
        buscaOS,
        listaOS,
        totalOS
    });


    /* =====================================================
       ESTADO
    ===================================================== */

    let ordens = [];
    let clientes = [];
    let osSelecionada = null;


    /* =====================================================
       TOAST
    ===================================================== */

    function mostrarToast(mensagem) {

        const toast = document.getElementById("toast");
        const toastMessage = document.getElementById("toastMessage");

        if (!toast || !toastMessage) return;

        toastMessage.textContent = mensagem;

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }


    /* =====================================================
       MODO NOTURNO
    ===================================================== */

    function aplicarTema() {

        const modoNoturno =
            localStorage.getItem("ws_modo_noturno") === "true";

        document.body.classList.toggle("dark", modoNoturno);

        if (themeToggle) {
            themeToggle.textContent = modoNoturno ? "☀" : "☾";
        }
    }

    aplicarTema();

    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            const modoAtual =
                document.body.classList.contains("dark");

            localStorage.setItem(
                "ws_modo_noturno",
                String(!modoAtual)
            );

            aplicarTema();
        });
    }


    /* =====================================================
       STATUS
    ===================================================== */

    const statusNomes = {
        aberta: "Aberta",
        aguardando: "Aguardando",
        em_andamento: "Em andamento",
        aguardando_peca: "Aguardando peça",
        concluida: "Concluída",
        entregue: "Entregue",
        cancelada: "Cancelada"
    };


    /* =====================================================
       PRIORIDADE
    ===================================================== */

    const prioridadeNomes = {
        baixa: "Baixa",
        normal: "Normal",
        alta: "Alta",
        urgente: "Urgente"
    };


    /* =====================================================
       FORMATAÇÕES
    ===================================================== */

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

        if (!data) return "-";

        const partes = String(data)
            .substring(0, 10)
            .split("-");

        if (partes.length !== 3) {
            return data;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }


    /* =====================================================
       CARREGAR CLIENTES
       
       USA O CÓDIGO JÁ EXISTENTE NA TABELA CLIENTES.
       
       EXEMPLO:
       CLI-000001 - João da Silva
    ===================================================== */

    async function carregarClientes() {

        const { data, error } = await supabase
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

        const selectCliente =
            document.getElementById("cliente_id");

        if (!selectCliente) return;

        selectCliente.innerHTML = `
            <option value="">
                Selecione o cliente
            </option>
        `;

        clientes.forEach(cliente => {

            const option =
                document.createElement("option");

            option.value = cliente.id;

            /*
             * NÃO GERAMOS CÓDIGO AQUI.
             * O código vem diretamente da tabela clientes.
             */

            option.textContent =
                `${cliente.codigo} - ${cliente.nome}`;

            selectCliente.appendChild(option);
        });
    }


    /* =====================================================
       CARREGAR EQUIPAMENTOS DO CLIENTE
    ===================================================== */

    async function carregarEquipamentos(clienteId) {

        const selectEquipamento =
            document.getElementById("equipamento_id");

        if (!selectEquipamento) return;

        selectEquipamento.innerHTML = `
            <option value="">
                Selecione o equipamento
            </option>
        `;

        if (!clienteId) return;

        const { data, error } = await supabase
            .from("equipamentos")
            .select(
                "id,nome,aparelho,marca,modelo"
            )
            .eq("cliente_id", clienteId)
            .order("nome", {
                ascending: true
            });

        if (error) {

            console.error(
                "Erro ao carregar equipamentos:",
                error
            );

            mostrarToast(
                "Erro ao carregar equipamentos."
            );

            return;
        }

        (data || []).forEach(equipamento => {

            const option =
                document.createElement("option");

            option.value = equipamento.id;

            let descricao =
                equipamento.nome ||
                equipamento.aparelho ||
                "Equipamento";

            if (
                equipamento.marca ||
                equipamento.modelo
            ) {

                descricao += " - ";

                descricao += [
                    equipamento.marca,
                    equipamento.modelo
                ]
                .filter(Boolean)
                .join(" ");
            }

            option.textContent = descricao;

            selectEquipamento.appendChild(option);
        });
    }


    /* =====================================================
       EVENTO CLIENTE
    ===================================================== */

    const selectCliente =
        document.getElementById("cliente_id");

    if (selectCliente) {

        selectCliente.addEventListener(
            "change",
            () => {

                carregarEquipamentos(
                    selectCliente.value
                );
            }
        );
    }


    /* =====================================================
       GERAR PRÓXIMO CÓDIGO DA OS
    ===================================================== */

    function gerarProximoCodigo() {

        let maiorNumero = 0;

        ordens.forEach(os => {

            if (!os.codigo) return;

            const match =
                String(os.codigo).match(
                    /OS-(\d+)/
                );

            if (match) {

                const numero =
                    parseInt(match[1], 10);

                if (numero > maiorNumero) {
                    maiorNumero = numero;
                }
            }
        });

        const proximo =
            maiorNumero + 1;

        return (
            "WS-OS-" +
            String(proximo).padStart(6, "0")
        );
    }


    /* =====================================================
       ABRIR MODAL OS
    ===================================================== */

    async function abrirModalOS(os = null) {

        if (!modalOS || !formOS) return;

        await carregarClientes();

        osSelecionada = os;

        modalOS.classList.add("show");

        modalOS.style.display = "flex";

        modalOS.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-aberto"
        );


        /* =================================================
           NOVA OS
        ================================================= */

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
                new Date()
                    .toISOString()
                    .split("T")[0];

            document.getElementById(
                "data_entrada"
            ).value = hoje;

            const equipamento =
                document.getElementById(
                    "equipamento_id"
                );

            if (equipamento) {

                equipamento.innerHTML = `
                    <option value="">
                        Selecione o equipamento
                    </option>
                `;
            }

            const titulo =
                document.getElementById(
                    "modalTitulo"
                );

            if (titulo) {
                titulo.textContent = "Nova OS";
            }

            calcularValorTotal();

            return;
        }


        /* =================================================
           EDITAR OS
        ================================================= */

        preencherFormulario(os);

        const titulo =
            document.getElementById(
                "modalTitulo"
            );

        if (titulo) {
            titulo.textContent = "Editar OS";
        }
    }


    /* =====================================================
       PREENCHER FORMULÁRIO
    ===================================================== */

    async function preencherFormulario(os) {

        document.getElementById(
            "osId"
        ).value = os.id || "";

        document.getElementById(
            "codigo"
        ).value = os.codigo || "";

        document.getElementById(
            "cliente_id"
        ).value = os.cliente_id || "";

        await carregarEquipamentos(
            os.cliente_id
        );

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
            os.valor ?? 0;

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

        calcularValorTotal();
    }


    /* =====================================================
       FECHAR MODAL OS
    ===================================================== */

    function fecharModalOS() {

        if (!modalOS) return;

        modalOS.classList.remove("show");

        modalOS.style.display = "none";

        modalOS.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-aberto"
        );

        osSelecionada = null;
    }


    if (btnNovaOS) {

        btnNovaOS.addEventListener(
            "click",
            () => abrirModalOS()
        );
    }


    if (btnFecharModal) {

        btnFecharModal.addEventListener(
            "click",
            fecharModalOS
        );
    }


    if (btnCancelar) {

        btnCancelar.addEventListener(
            "click",
            fecharModalOS
        );
    }


    /* =====================================================
       FECHAR CLICANDO FORA
    ===================================================== */

    if (modalOS) {

        modalOS.addEventListener(
            "click",
            event => {

                if (
                    event.target === modalOS
                ) {
                    fecharModalOS();
                }
            }
        );
    }


    /* =====================================================
       CALCULAR VALOR TOTAL
    ===================================================== */

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

        const campoTotal =
            document.getElementById(
                "valor_total"
            );

        if (campoTotal) {

            campoTotal.value =
                total.toFixed(2);
        }
    }


    const campoValor =
        document.getElementById("valor");

    const campoDesconto =
        document.getElementById("desconto");


    if (campoValor) {

        campoValor.addEventListener(
            "input",
            calcularValorTotal
        );
    }


    if (campoDesconto) {

        campoDesconto.addEventListener(
            "input",
            calcularValorTotal
        );
    }


    /* =====================================================
       SALVAR OS
    ===================================================== */

    if (formOS) {

        formOS.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                const clienteId =
                    document.getElementById(
                        "cliente_id"
                    ).value;

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
                        ).value
                    ) || 0;


                const desconto =
                    parseFloat(
                        document.getElementById(
                            "desconto"
                        ).value
                    ) || 0;


                const dados = {

                    cliente_id:
                        clienteId,

                    equipamento_id:
                        document.getElementById(
                            "equipamento_id"
                        ).value || null,

                    orcamento_id:
                        null,

                    tipo_servico:
                        document.getElementById(
                            "tipo_servico"
                        ).value || null,

                    aparelho:
                        document.getElementById(
                            "aparelho"
                        ).value || null,

                    marca:
                        document.getElementById(
                            "marca"
                        ).value || null,

                    modelo:
                        document.getElementById(
                            "modelo"
                        ).value || null,

                    defeito:
                        document.getElementById(
                            "defeito"
                        ).value || null,

                    diagnostico:
                        document.getElementById(
                            "diagnostico"
                        ).value || null,

                    servico_realizado:
                        document.getElementById(
                            "servico_realizado"
                        ).value || null,

                    valor:
                        valor,

                    desconto:
                        desconto,

                    status:
                        document.getElementById(
                            "status"
                        ).value,

                    prioridade:
                        document.getElementById(
                            "prioridade"
                        ).value,

                    data_entrada:
                        document.getElementById(
                            "data_entrada"
                        ).value || null,

                    data_conclusao:
                        document.getElementById(
                            "data_conclusao"
                        ).value || null,

                    observacoes:
                        document.getElementById(
                            "observacoes"
                        ).value || null
                };


                const osId =
                    document.getElementById(
                        "osId"
                    ).value;


                let resultado;


                /* =========================================
                   ATUALIZAR
                ========================================= */

                if (osId) {

                    resultado =
                        await supabase
                            .from(
                                "ordens_servico"
                            )
                            .update(dados)
                            .eq(
                                "id",
                                osId
                            )
                            .select()
                            .single();

                }

                /* =========================================
                   INSERIR
                ========================================= */

                else {

                    resultado =
                        await supabase
                            .from(
                                "ordens_servico"
                            )
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
                        resultado.error.message ||
                        "Erro ao salvar OS."
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
    }


    /* =====================================================
       CARREGAR ORDENS
    ===================================================== */

    async function carregarOS() {

        if (!listaOS) return;

        listaOS.innerHTML = `
            <div class="loading">
                Carregando ordens...
            </div>
        `;


        const { data, error } =
            await supabase
                .from("ordens_servico")
                .select("*")
                .order(
                    "criado_em",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Erro ao carregar OS:",
                error
            );

            listaOS.innerHTML = `
                <div class="empty">
                    Erro ao carregar ordens.
                </div>
            `;

            mostrarToast(
                "Erro ao carregar ordens."
            );

            return;
        }


        ordens = data || [];


        if (totalOS) {

            totalOS.textContent =
                ordens.length;
        }


        renderizarOS();
    }


    /* =====================================================
       RENDERIZAR OS
    ===================================================== */

    function renderizarOS() {

        if (!listaOS) return;

        const termo =
            String(
                buscaOS?.value || ""
            )
            .trim()
            .toLowerCase();


        const filtradas =
            ordens.filter(os => {

                const cliente =
                    clientes.find(
                        cliente =>
                            String(
                                cliente.id
                            ) ===
                            String(
                                os.cliente_id
                            )
                    );


                const nomeCliente =
                    cliente?.nome || "";


                const codigoCliente =
                    cliente?.codigo || "";


                const status =
                    statusNomes[
                        os.status
                    ] || os.status || "";


                const texto = [

                    os.codigo,

                    nomeCliente,

                    codigoCliente,

                    os.aparelho,

                    os.marca,

                    os.modelo,

                    status

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


                return texto.includes(
                    termo
                );
            });


        if (!filtradas.length) {

            listaOS.innerHTML = `
                <div class="empty">
                    Nenhuma ordem de serviço encontrada.
                </div>
            `;

            return;
        }


        listaOS.innerHTML =
            filtradas
                .map(os => {

                    const cliente =
                        clientes.find(
                            cliente =>
                                String(
                                    cliente.id
                                ) ===
                                String(
                                    os.cliente_id
                                )
                        );


                    const nomeCliente =
                        cliente?.nome ||
                        "Cliente não encontrado";


                    const codigoCliente =
                        cliente?.codigo ||
                        "";


                    const nomeStatus =
                        statusNomes[
                            os.status
                        ] ||
                        os.status ||
                        "-";


                    return `
                        <div
                            class="os-item"
                            data-id="${os.id}"
                        >

                            <div class="os-info">

                                <strong>
                                    ${os.codigo || "-"}
                                </strong>

                                <span>
                                    ${codigoCliente
                                        ? codigoCliente + " - "
                                        : ""
                                    }${nomeCliente}
                                </span>

                                <small>
                                    ${os.aparelho || "-"}
                                    ${os.marca
                                        ? " • " + os.marca
                                        : ""
                                    }
                                    ${os.modelo
                                        ? " • " + os.modelo
                                        : ""
                                    }
                                </small>

                            </div>


                            <div class="os-status">

                                <span class="status-badge">
                                    ${nomeStatus}
                                </span>

                            </div>

                        </div>
                    `;
                })
                .join("");


        document
            .querySelectorAll(".os-item")
            .forEach(item => {

                item.addEventListener(
                    "click",
                    () => {

                        const id =
                            item.dataset.id;

                        const os =
                            ordens.find(
                                os =>
                                    String(
                                        os.id
                                    ) ===
                                    String(id)
                            );

                        if (os) {
                            abrirDetalhesOS(os);
                        }
                    }
                );
            });
    }


    /* =====================================================
       BUSCA
    ===================================================== */

    if (buscaOS) {

        buscaOS.addEventListener(
            "input",
            renderizarOS
        );
    }


    /* =====================================================
       ABRIR DETALHES
    ===================================================== */

    function abrirDetalhesOS(os) {

        osSelecionada = os;


        const cliente =
            clientes.find(
                cliente =>
                    String(
                        cliente.id
                    ) ===
                    String(
                        os.cliente_id
                    )
            );


        const nomeCliente =
            cliente?.nome ||
            "Cliente não encontrado";


        const codigoCliente =
            cliente?.codigo || "";


        document.getElementById(
            "detalheCodigo"
        ).textContent =
            os.codigo || "-";


        document.getElementById(
            "detalheCliente"
        ).textContent =
            codigoCliente
                ? `${codigoCliente} - ${nomeCliente}`
                : nomeCliente;


        document.getElementById(
            "detalheStatus"
        ).textContent =
            statusNomes[
                os.status
            ] ||
            os.status ||
            "-";


        document.getElementById(
            "detalhePrioridade"
        ).textContent =
            prioridadeNomes[
                os.prioridade
            ] ||
            os.prioridade ||
            "-";


        document.getElementById(
            "detalheTipoServico"
        ).textContent =
            os.tipo_servico ||
            "-";


        document.getElementById(
            "detalheAparelho"
        ).textContent =
            os.aparelho ||
            "-";


        document.getElementById(
            "detalheMarca"
        ).textContent =
            os.marca ||
            "-";


        document.getElementById(
            "detalheModelo"
        ).textContent =
            os.modelo ||
            "-";


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
            os.defeito ||
            "-";


        document.getElementById(
            "detalheDiagnostico"
        ).textContent =
            os.diagnostico ||
            "-";


        document.getElementById(
            "detalheServicoRealizado"
        ).textContent =
            os.servico_realizado ||
            "-";


        document.getElementById(
            "detalheObservacoes"
        ).textContent =
            os.observacoes ||
            "-";


        if (modalDetalhesOS) {

            modalDetalhesOS.classList.add(
                "show"
            );

            modalDetalhesOS.style.display =
                "flex";

            modalDetalhesOS.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "modal-aberto"
            );
        }
    }


    /* =====================================================
       FECHAR DETALHES
    ===================================================== */

    function fecharDetalhesOS() {

        if (!modalDetalhesOS) return;

        modalDetalhesOS.classList.remove(
            "show"
        );

        modalDetalhesOS.style.display =
            "none";

        modalDetalhesOS.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-aberto"
        );

        osSelecionada = null;
    }


    if (btnFecharDetalhes) {

        btnFecharDetalhes.addEventListener(
            "click",
            fecharDetalhesOS
        );
    }


    /* =====================================================
       EDITAR PELOS DETALHES
    ===================================================== */

    if (btnEditarDetalhes) {

        btnEditarDetalhes.addEventListener(
            "click",
            () => {

                if (!osSelecionada) return;

                const os =
                    osSelecionada;

                fecharDetalhesOS();

                abrirModalOS(os);
            }
        );
    }


    /* =====================================================
       EXCLUIR OS
    ===================================================== */

    if (btnExcluirDetalhes) {

        btnExcluirDetalhes.addEventListener(
            "click",
            async () => {

                if (!osSelecionada) return;


                const confirmar =
                    confirm(
                        `Deseja realmente excluir a OS ${osSelecionada.codigo}?`
                    );


                if (!confirmar) return;


                const { error } =
                    await supabase
                        .from(
                            "ordens_servico"
                        )
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
                        "Erro ao excluir OS."
                    );

                    return;
                }


                mostrarToast(
                    "OS excluída com sucesso!"
                );


                fecharDetalhesOS();

                await carregarOS();
            }
        );
    }


    /* =====================================================
       FECHAR MODAL CLICANDO FORA
    ===================================================== */

    if (modalDetalhesOS) {

        modalDetalhesOS.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modalDetalhesOS
                ) {

                    fecharDetalhesOS();
                }
            }
        );
    }


    /* =====================================================
       ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            if (
                modalDetalhesOS?.classList.contains(
                    "show"
                )
            ) {

                fecharDetalhesOS();

                return;
            }


            if (
                modalOS?.classList.contains(
                    "show"
                )
            ) {

                fecharModalOS();
            }
        }
    );


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    async function inicializar() {

        console.log(
            "Inicializando módulo de OS..."
        );

        await carregarClientes();

        await carregarOS();

        console.log(
            "Módulo de OS inicializado."
        );
    }


    inicializar();

});