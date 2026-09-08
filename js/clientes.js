/* =========================================================
   WS SOLUÇÕES — CLIENTES
   CRUD COMPLETO
   Código automático
   Lista compacta + Modal de detalhes
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const btnNovo = document.getElementById("btnNovoCliente");
    const btnFechar = document.getElementById("btnFecharModal");
    const btnCancelar = document.getElementById("btnCancelar");

    const modal = document.getElementById("modalCliente");
    const form = document.getElementById("formCliente");

    const modalTitulo = document.getElementById("modalTitulo");

    const busca = document.getElementById("buscaCliente");
    const lista = document.getElementById("listaClientes");

    const totalClientes =
        document.getElementById("totalClientes");


    /* =====================================================
       MODAL DE DETALHES
    ===================================================== */

    const modalDetalhes =
        document.getElementById("modalDetalhesCliente");

    const btnFecharDetalhes =
        document.getElementById("btnFecharDetalhes");

    const btnEditarDetalhes =
        document.getElementById("btnEditarDetalhes");

    const btnExcluirDetalhes =
        document.getElementById("btnExcluirDetalhes");


    let clientes = [];

    let clienteSelecionado = null;


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

        toastMessage.textContent = mensagem;

        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

    }


    /* =====================================================
       GERAR CÓDIGO DO CLIENTE
    ===================================================== */

    function gerarProximoCodigo() {

        let maiorNumero = 0;

        clientes.forEach(cliente => {

            const codigo =
                String(cliente.codigo || "");

            const resultado =
                codigo.match(/^CLI-(\d+)$/i);

            if (resultado) {

                const numero =
                    parseInt(resultado[1], 10);

                if (
                    !isNaN(numero) &&
                    numero > maiorNumero
                ) {

                    maiorNumero = numero;

                }

            }

        });

        const proximoNumero =
            maiorNumero + 1;

        return `CLI-${String(proximoNumero).padStart(6, "0")}`;

    }


    /* =====================================================
       ABRIR MODAL DE CADASTRO / EDIÇÃO
    ===================================================== */

    function abrirModal(cliente = null) {

        if (!modal || !form) return;

        modal.classList.add("show");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        if (cliente) {

            modalTitulo.textContent =
                "Editar cliente";


            document.getElementById("clienteId").value =
                cliente.id || "";


            document.getElementById("codigo").value =
                cliente.codigo || "";


            document.getElementById("nome").value =
                cliente.nome || "";


            document.getElementById("whatsapp").value =
                cliente.whatsapp || "";


            document.getElementById("cep").value =
                cliente.cep || "";


            document.getElementById("endereco").value =
                cliente.endereco || "";


            document.getElementById("numero").value =
                cliente.numero || "";


            document.getElementById("complemento").value =
                cliente.complemento || "";


            document.getElementById("bairro").value =
                cliente.bairro || "";


            document.getElementById("observacoes").value =
                cliente.observacoes || "";


        } else {

            modalTitulo.textContent =
                "Novo cliente";


            form.reset();


            document.getElementById("clienteId").value =
                "";


            document.getElementById("codigo").value =
                gerarProximoCodigo();


            document.getElementById("nome").focus();

        }

    }


    /* =====================================================
       FECHAR MODAL DE CADASTRO
    ===================================================== */

    function fecharModal() {

        if (!modal) return;

        modal.classList.remove("show");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       ABRIR MODAL DE DETALHES
    ===================================================== */

    function abrirDetalhes(cliente) {

        if (!modalDetalhes || !cliente) return;


        clienteSelecionado = cliente;


        document.getElementById("detalheCodigo").textContent =
            cliente.codigo || "—";


        document.getElementById("detalheNome").textContent =
            cliente.nome || "—";


        document.getElementById("detalheWhatsapp").textContent =
            cliente.whatsapp || "—";


        document.getElementById("detalheCep").textContent =
            cliente.cep || "—";


        document.getElementById("detalheEndereco").textContent =
            cliente.endereco || "—";


        document.getElementById("detalheNumero").textContent =
            cliente.numero || "—";


        document.getElementById("detalheComplemento").textContent =
            cliente.complemento || "—";


        document.getElementById("detalheBairro").textContent =
            cliente.bairro || "—";


        document.getElementById("detalheObservacoes").textContent =
            cliente.observacoes || "—";


        modalDetalhes.classList.add("show");

        modalDetalhes.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    /* =====================================================
       FECHAR MODAL DE DETALHES
    ===================================================== */

    function fecharDetalhes() {

        if (!modalDetalhes) return;

        modalDetalhes.classList.remove("show");

        modalDetalhes.setAttribute(
            "aria-hidden",
            "true"
        );

        clienteSelecionado = null;

    }


    /* =====================================================
       CARREGAR CLIENTES
    ===================================================== */

    async function carregarClientes() {

        if (!lista) return;


        lista.innerHTML = `
            <div class="clients-loading">
                Carregando clientes...
            </div>
        `;


        try {

            const { data, error } =
                await supabaseClient
                    .from("clientes")
                    .select("*")
                    .order(
                        "nome",
                        {
                            ascending: true
                        }
                    );


            if (error) {

                throw error;

            }


            clientes = data || [];


            atualizarEstatisticas();

            renderizarClientes();


        } catch (erro) {

            console.error(
                "Erro ao carregar clientes:",
                erro
            );


            lista.innerHTML = `
                <div class="clients-empty">

                    <div class="clients-empty-icon">
                        ⚠️
                    </div>

                    <strong>
                        Erro ao carregar clientes
                    </strong>

                    <p>
                        Verifique a conexão com o Supabase.
                    </p>

                </div>
            `;


            mostrarMensagem(
                "Erro ao carregar clientes."
            );

        }

    }


    /* =====================================================
       ESTATÍSTICAS
    ===================================================== */

    function atualizarEstatisticas() {

        if (totalClientes) {

            totalClientes.textContent =
                clientes.length;

        }

    }


    /* =====================================================
       RENDERIZAR LISTA
    ===================================================== */

    function renderizarClientes() {

        if (!lista) return;


        const termo =
            (busca?.value || "")
                .trim()
                .toLowerCase();


        const filtrados =
            clientes.filter(cliente => {

                const nome =
                    String(cliente.nome || "")
                        .toLowerCase();


                const whatsapp =
                    String(cliente.whatsapp || "")
                        .toLowerCase();


                const codigo =
                    String(cliente.codigo || "")
                        .toLowerCase();


                return (
                    nome.includes(termo) ||
                    whatsapp.includes(termo) ||
                    codigo.includes(termo)
                );

            });


        if (!filtrados.length) {

            lista.innerHTML = `
                <div class="clients-empty">

                    <div class="clients-empty-icon">
                        👥
                    </div>

                    <strong>
                        ${
                            termo
                                ? "Nenhum cliente encontrado"
                                : "Nenhum cliente cadastrado"
                        }
                    </strong>

                    <p>
                        ${
                            termo
                                ? "Tente outro nome, WhatsApp ou código."
                                : 'Clique em "Novo cliente" para começar.'
                        }
                    </p>

                </div>
            `;

            return;

        }


        /* =================================================
           LISTA COMPACTA
        ================================================= */

        lista.innerHTML =
            filtrados.map(cliente => {

                return `

                    <div
                        class="client-item client-clickable"
                        data-client-id="${escapar(cliente.id)}">

                        <div class="client-main">

                            <span class="client-code">
                                ${escapar(cliente.codigo)}
                            </span>

                            <div class="client-name">
                                ${escapar(cliente.nome)}
                            </div>

                        </div>

                    </div>

                `;

            }).join("");

    }


    /* =====================================================
       SALVAR CLIENTE
    ===================================================== */

    async function salvarCliente(event) {

        event.preventDefault();


        const id =
            document.getElementById("clienteId").value;


        const nome =
            document.getElementById("nome")
                .value
                .trim();


        if (!nome) {

            mostrarMensagem(
                "Informe o nome do cliente."
            );

            return;

        }


        let codigo =
            document.getElementById("codigo")
                .value
                .trim();


        if (!id && !codigo) {

            codigo =
                gerarProximoCodigo();

        }


        const dados = {

            codigo: codigo,

            nome: nome,

            whatsapp:
                document.getElementById("whatsapp")
                    .value
                    .trim() || null,

            cep:
                document.getElementById("cep")
                    .value
                    .trim() || null,

            endereco:
                document.getElementById("endereco")
                    .value
                    .trim() || null,

            numero:
                document.getElementById("numero")
                    .value
                    .trim() || null,

            complemento:
                document.getElementById("complemento")
                    .value
                    .trim() || null,

            bairro:
                document.getElementById("bairro")
                    .value
                    .trim() || null,

            observacoes:
                document.getElementById("observacoes")
                    .value
                    .trim() || null

        };


        const botao =
            document.getElementById(
                "btnSalvarCliente"
            );


        if (botao) {

            botao.disabled = true;

            botao.textContent =
                "Salvando...";

        }


        try {

            /* =============================================
               ATUALIZAR
            ============================================= */

            if (id) {

                const { error } =
                    await supabaseClient
                        .from("clientes")
                        .update(dados)
                        .eq("id", id);


                if (error) {

                    throw error;

                }


                mostrarMensagem(
                    "Cliente atualizado com sucesso."
                );

            }


            /* =============================================
               NOVO
            ============================================= */

            else {

                const { error } =
                    await supabaseClient
                        .from("clientes")
                        .insert(dados);


                if (error) {

                    throw error;

                }


                mostrarMensagem(
                    "Cliente cadastrado com sucesso."
                );

            }


            fecharModal();

            await carregarClientes();


        } catch (erro) {

            console.error(
                "Erro ao salvar cliente:",
                erro
            );


            mostrarMensagem(
                "Não foi possível salvar o cliente."
            );


        } finally {

            if (botao) {

                botao.disabled = false;

                botao.textContent =
                    "Salvar cliente";

            }

        }

    }


    /* =====================================================
       EXCLUIR CLIENTE
    ===================================================== */

    async function excluirCliente(id) {

        const cliente =
            clientes.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!cliente) return;


        const confirmar =
            confirm(
                `Excluir o cliente "${cliente.nome}"?\n\nEssa ação não poderá ser desfeita.`
            );


        if (!confirmar) return;


        try {

            const { error } =
                await supabaseClient
                    .from("clientes")
                    .delete()
                    .eq("id", id);


            if (error) {

                throw error;

            }


            if (
                clienteSelecionado &&
                String(clienteSelecionado.id) ===
                String(id)
            ) {

                fecharDetalhes();

            }


            mostrarMensagem(
                "Cliente excluído com sucesso."
            );


            await carregarClientes();


        } catch (erro) {

            console.error(
                "Erro ao excluir cliente:",
                erro
            );


            mostrarMensagem(
                "Não foi possível excluir o cliente. Ele pode possuir registros vinculados."
            );

        }

    }


    /* =====================================================
       EVENTO — CLIQUE NO CLIENTE
    ===================================================== */

    if (lista) {

        lista.addEventListener(
            "click",
            event => {

                const item =
                    event.target.closest(
                        "[data-client-id]"
                    );


                if (!item) return;


                const id =
                    item.dataset.clientId;


                const cliente =
                    clientes.find(
                        item =>
                            String(item.id) ===
                            String(id)
                    );


                if (cliente) {

                    abrirDetalhes(cliente);

                }

            }
        );

    }


    /* =====================================================
       EDITAR PELO MODAL DE DETALHES
    ===================================================== */

    if (btnEditarDetalhes) {

        btnEditarDetalhes.addEventListener(
            "click",
            () => {

                if (!clienteSelecionado) return;


                const cliente =
                    clienteSelecionado;


                fecharDetalhes();

                abrirModal(cliente);

            }
        );

    }


    /* =====================================================
       EXCLUIR PELO MODAL DE DETALHES
    ===================================================== */

    if (btnExcluirDetalhes) {

        btnExcluirDetalhes.addEventListener(
            "click",
            () => {

                if (!clienteSelecionado) return;


                excluirCliente(
                    clienteSelecionado.id
                );

            }
        );

    }


    /* =====================================================
       EVENTOS DO MODAL DE CADASTRO
    ===================================================== */

    if (btnNovo) {

        btnNovo.addEventListener(
            "click",
            () => abrirModal()
        );

    }


    if (btnFechar) {

        btnFechar.addEventListener(
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


    if (form) {

        form.addEventListener(
            "submit",
            salvarCliente
        );

    }


    if (busca) {

        busca.addEventListener(
            "input",
            renderizarClientes
        );

    }


    /* =====================================================
       FECHAR MODAL DE CADASTRO CLICANDO FORA
    ===================================================== */

    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target.classList.contains(
                        "modal-overlay"
                    )
                ) {

                    fecharModal();

                }

            }
        );

    }


    /* =====================================================
       FECHAR MODAL DE DETALHES CLICANDO FORA
    ===================================================== */

    if (modalDetalhes) {

        modalDetalhes.addEventListener(
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

    }


    /* =====================================================
       TECLA ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") return;


            if (
                modal?.classList.contains(
                    "show"
                )
            ) {

                fecharModal();

                return;

            }


            if (
                modalDetalhes?.classList.contains(
                    "show"
                )
            ) {

                fecharDetalhes();

            }

        }
    );


    /* =====================================================
       SEGURANÇA — ESCAPAR HTML
    ===================================================== */

    function escapar(valor) {

        if (
            valor === null ||
            valor === undefined
        ) {

            return "";

        }


        return String(valor)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       MODO NOTURNO
    ===================================================== */

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );


    function atualizarBotaoTema() {

        if (!themeToggle) return;


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            themeToggle.textContent = "☀";

        } else {

            themeToggle.textContent = "☾";

        }

    }


    const modoSalvo =
        localStorage.getItem(
            "ws_modo_noturno"
        );


    if (modoSalvo === "true") {

        document.body.classList.add(
            "dark"
        );

    }


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark"
                );


                localStorage.setItem(
                    "ws_modo_noturno",
                    document.body.classList.contains(
                        "dark"
                    )
                );


                atualizarBotaoTema();

            }
        );

    }


    /* =====================================================
       INICIAR
    ===================================================== */

    atualizarBotaoTema();

    carregarClientes();

});