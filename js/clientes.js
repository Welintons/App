/* =========================================================
   WS SOLUÇÕES — CLIENTES
   CRUD completo
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

    const totalClientes = document.getElementById("totalClientes");
    const clientesAtivos = document.getElementById("clientesAtivos");
    const clientesInativos = document.getElementById("clientesInativos");

    let clientes = [];


    /* =====================================================
       TOAST
    ===================================================== */

    function mostrarMensagem(mensagem) {

        const toast = document.getElementById("toast");
        const toastMessage = document.getElementById("toastMessage");

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
       MODAL
    ===================================================== */

    function abrirModal(cliente = null) {

        if (!modal) return;

        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");

        if (cliente) {

            modalTitulo.textContent = "Editar cliente";

            document.getElementById("clienteId").value =
                cliente.id || "";

            document.getElementById("nome").value =
                cliente.nome || "";

            document.getElementById("whatsapp").value =
                cliente.whatsapp || "";

            document.getElementById("cpf").value =
                cliente.cpf || "";

            document.getElementById("email").value =
                cliente.email || "";

            document.getElementById("endereco").value =
                cliente.endereco || "";

            document.getElementById("numero").value =
                cliente.numero || "";

            document.getElementById("complemento").value =
                cliente.complemento || "";

            document.getElementById("bairro").value =
                cliente.bairro || "";

            document.getElementById("cidade").value =
                cliente.cidade || "";

            document.getElementById("estado").value =
                cliente.estado || "";

            document.getElementById("cep").value =
                cliente.cep || "";

            document.getElementById("status").value =
                cliente.status || "ativo";

            document.getElementById("observacoes").value =
                cliente.observacoes || "";

        } else {

            modalTitulo.textContent = "Novo cliente";

            form.reset();

            document.getElementById("clienteId").value = "";

            document.getElementById("status").value = "ativo";

        }

    }


    function fecharModal() {

        if (!modal) return;

        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");

    }


    /* =====================================================
       CARREGAR CLIENTES
    ===================================================== */

    async function carregarClientes() {

        lista.innerHTML = `
            <div class="clients-loading">
                Carregando clientes...
            </div>
        `;

        try {

            const { data, error } = await supabaseClient
                .from("clientes")
                .select("*")
                .order("nome", { ascending: true });

            if (error) {
                throw error;
            }

            clientes = data || [];

            atualizarEstatisticas();

            renderizarClientes();

        } catch (erro) {

            console.error("Erro ao carregar clientes:", erro);

            lista.innerHTML = `
                <div class="clients-empty">
                    <div class="clients-empty-icon">⚠️</div>
                    <strong>Erro ao carregar clientes</strong>
                    <p>Verifique a conexão com o Supabase.</p>
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

        const ativos =
            clientes.filter(
                cliente => cliente.status === "ativo"
            ).length;

        const inativos =
            clientes.filter(
                cliente => cliente.status === "inativo"
            ).length;

        if (totalClientes) {
            totalClientes.textContent =
                clientes.length;
        }

        if (clientesAtivos) {
            clientesAtivos.textContent =
                ativos;
        }

        if (clientesInativos) {
            clientesInativos.textContent =
                inativos;
        }

    }


    /* =====================================================
       RENDERIZAR LISTA
    ===================================================== */

    function renderizarClientes() {

        const termo =
            (busca?.value || "")
                .trim()
                .toLowerCase();

        const filtrados = clientes.filter(cliente => {

            const nome =
                (cliente.nome || "").toLowerCase();

            const whatsapp =
                (cliente.whatsapp || "").toLowerCase();

            const codigo =
                (cliente.codigo || "").toLowerCase();

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
                        ${termo
                            ? "Nenhum cliente encontrado"
                            : "Nenhum cliente cadastrado"}
                    </strong>

                    <p>
                        ${termo
                            ? "Tente outro nome, WhatsApp ou código."
                            : 'Clique em "Novo cliente" para começar.'}
                    </p>

                </div>
            `;

            return;
        }


        lista.innerHTML = filtrados.map(cliente => {

            const status =
                cliente.status || "ativo";

            return `

                <div class="client-item">

                    <div class="client-main">

                        <span class="client-code">
                            ${escapar(cliente.codigo)}
                        </span>

                        <div class="client-name">
                            ${escapar(cliente.nome)}
                        </div>

                        <div class="client-info">

                            ${
                                cliente.whatsapp
                                    ? `<span>📱 ${escapar(cliente.whatsapp)}</span>`
                                    : ""
                            }

                            ${
                                cliente.email
                                    ? `<span>✉️ ${escapar(cliente.email)}</span>`
                                    : ""
                            }

                            <span class="client-status ${status}">
                                ${status === "ativo"
                                    ? "ATIVO"
                                    : "INATIVO"}
                            </span>

                        </div>

                    </div>


                    <div class="client-actions">

                        <button
                            type="button"
                            class="client-action"
                            data-action="edit"
                            data-id="${cliente.id}">
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="client-action"
                            data-action="delete"
                            data-id="${cliente.id}">
                            🗑️ Excluir
                        </button>

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

        const dados = {

            nome:
                document.getElementById("nome").value.trim(),

            whatsapp:
                document.getElementById("whatsapp").value.trim() || null,

            cpf:
                document.getElementById("cpf").value.trim() || null,

            email:
                document.getElementById("email").value.trim() || null,

            endereco:
                document.getElementById("endereco").value.trim() || null,

            numero:
                document.getElementById("numero").value.trim() || null,

            complemento:
                document.getElementById("complemento").value.trim() || null,

            bairro:
                document.getElementById("bairro").value.trim() || null,

            cidade:
                document.getElementById("cidade").value.trim() || null,

            estado:
                document.getElementById("estado").value.trim().toUpperCase() || null,

            cep:
                document.getElementById("cep").value.trim() || null,

            status:
                document.getElementById("status").value,

            observacoes:
                document.getElementById("observacoes").value.trim() || null

        };


        if (!dados.nome) {

            mostrarMensagem(
                "Informe o nome do cliente."
            );

            return;
        }


        const botao =
            document.getElementById("btnSalvarCliente");

        if (botao) {
            botao.disabled = true;
            botao.textContent = "Salvando...";
        }


        try {

            if (id) {

                /* ===============================
                   ATUALIZAR
                =============================== */

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

            } else {

                /* ===============================
                   NOVO CLIENTE
                =============================== */

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
                botao.textContent = "Salvar cliente";
            }

        }

    }


    /* =====================================================
       EXCLUIR CLIENTE
    ===================================================== */

    async function excluirCliente(id) {

        const cliente =
            clientes.find(
                item => item.id === id
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
       EVENTOS DA LISTA
    ===================================================== */

    lista.addEventListener("click", event => {

        const botao =
            event.target.closest("[data-action]");

        if (!botao) return;

        const id =
            botao.dataset.id;

        const acao =
            botao.dataset.action;


        if (acao === "edit") {

            const cliente =
                clientes.find(
                    item => item.id === id
                );

            if (cliente) {
                abrirModal(cliente);
            }

        }


        if (acao === "delete") {

            excluirCliente(id);

        }

    });


    /* =====================================================
       EVENTOS
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

                if (
                    event.target.classList.contains(
                        "client-modal-overlay"
                    )
                ) {
                    fecharModal();
                }

            }
        );

    }


    /* =====================================================
       SEGURANÇA — ESCAPAR HTML
    ===================================================== */

    function escapar(valor) {

        if (valor === null || valor === undefined) {
            return "";
        }

        return String(valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       MODO NOTURNO
    ===================================================== */

    const themeToggle =
        document.getElementById("themeToggle");


    function atualizarBotaoTema() {

        if (!themeToggle) return;

        if (document.body.classList.contains("dark")) {

            themeToggle.textContent = "☀";

        } else {

            themeToggle.textContent = "☾";

        }

    }


    const modoSalvo =
        localStorage.getItem("ws_modo_noturno");


    if (modoSalvo === "true") {

        document.body.classList.add("dark");

    }


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle("dark");

                localStorage.setItem(
                    "ws_modo_noturno",
                    document.body.classList.contains("dark")
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