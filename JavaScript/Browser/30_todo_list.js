/**
 * 30 - Todo List
 *
 * Conceitos abordados:
 *   - Estado centralizado em um array de objetos
 *   - CRUD completo no DOM (criar, ler, atualizar, deletar)
 *   - Renderizacao a partir do estado (state-driven UI)
 *   - Persistencia com localStorage
 *   - Filtros: todas, ativas, concluidas
 *   - Delegacao de eventos no <ul>
 *   - Contadores dinâmicos
 *   - IDs unicos com Date.now()
 */

// ---------- Estado ----------
let tarefas = [];
let filtroAtual = "todas";

// ---------- Elementos ----------
const form = document.querySelector("#form-tarefa");
const input = document.querySelector("#input-tarefa");
const listaEl = document.querySelector("#lista");
const contadorEl = document.querySelector("#contador");
const botoesFiltro = document.querySelectorAll("[data-filtro]");
const btnLimpar = document.querySelector("#limpar-concluidas");

// ---------- Persistencia ----------
const CHAVE = "tarefas";

function carregar() {
    try {
        tarefas = JSON.parse(localStorage.getItem(CHAVE) || "[]");
    } catch {
        tarefas = [];
    }
}

function salvar() {
    localStorage.setItem(CHAVE, JSON.stringify(tarefas));
}

// ---------- Helpers ----------
function tarefaPorId(id) {
    return tarefas.find((t) => t.id === id);
}

function filtradas() {
    if (filtroAtual === "ativas") return tarefas.filter((t) => !t.concluida);
    if (filtroAtual === "concluidas") return tarefas.filter((t) => t.concluida);
    return tarefas;
}

// ---------- Acoes ----------
function adicionar(texto) {
    const t = texto.trim();
    if (t === "") return;

    tarefas.push({
        id: Date.now(),
        texto: t,
        concluida: false,
        criadaEm: new Date().toISOString(),
    });
    salvar();
    renderizar();
}

function alternar(id) {
    const t = tarefaPorId(id);
    if (!t) return;
    t.concluida = !t.concluida;
    salvar();
    renderizar();
}

function remover(id) {
    tarefas = tarefas.filter((t) => t.id !== id);
    salvar();
    renderizar();
}

function limparConcluidas() {
    tarefas = tarefas.filter((t) => !t.concluida);
    salvar();
    renderizar();
}

// ---------- Render ----------
function renderizarLista() {
    listaEl.innerHTML = "";
    const lista = filtradas();

    if (lista.length === 0) {
        const li = document.createElement("li");
        li.className = "vazio";
        li.textContent = "Nenhuma tarefa para mostrar.";
        listaEl.append(li);
        return;
    }

    lista.forEach((t) => {
        const li = document.createElement("li");
        li.className = t.concluida ? "concluida" : "";
        li.dataset.id = t.id;

        // Checkbox
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = t.concluida;
        cb.dataset.acao = "toggle";

        // Texto
        const span = document.createElement("span");
        span.textContent = t.texto;

        // Botao remover
        const btn = document.createElement("button");
        btn.textContent = "Remover";
        btn.dataset.acao = "remover";

        li.append(cb, span, btn);
        listaEl.append(li);
    });
}

function renderizarContador() {
    const total = tarefas.length;
    const concluidas = tarefas.filter((t) => t.concluida).length;
    const ativas = total - concluidas;

    contadorEl.textContent = `${total} total | ${ativas} ativa(s) | ${concluidas} concluida(s)`;
}

function renderizarFiltros() {
    botoesFiltro.forEach((b) => {
        b.classList.toggle("ativo", b.dataset.filtro === filtroAtual);
    });
}

function renderizar() {
    renderizarLista();
    renderizarContador();
    renderizarFiltros();
}

// ---------- Eventos ----------
form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    adicionar(input.value);
    input.value = "";
    input.focus();
});

// Delegacao de eventos
listaEl.addEventListener("click", (evento) => {
    const alvo = evento.target;
    const acao = alvo.dataset.acao;
    if (!acao) return;

    const id = Number(alvo.closest("li").dataset.id);
    if (acao === "toggle") alternar(id);
    if (acao === "remover") remover(id);
});

// Filtros
botoesFiltro.forEach((b) => {
    b.addEventListener("click", () => {
        filtroAtual = b.dataset.filtro;
        renderizar();
    });
});

// Limpar concluidas
btnLimpar.addEventListener("click", limparConcluidas);

// ---------- Inicializacao ----------
carregar();
renderizar();