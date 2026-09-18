/**
 * 27 - Paginacao
 *
 * Conceitos abordados:
 *   - Paginacao no cliente (sem recarregar)
 *   - Array.slice para recortar por pagina
 *   - Calculo de total de paginas com Math.ceil
 *   - Controle de estado (paginaAtual, itensPorPagina)
 *   - Botoes Anterior/Proxima com disabled
 *   - Geracao de botoes numerados
 *   - Renderizacao somente da fatia atual
 */

// ---------- Estado ----------
const estado = {
    itens: [],
    paginaAtual: 1,
    itensPorPagina: 5,
};

// ---------- Elementos ----------
const listaEl = document.querySelector("#lista");
const infoEl = document.querySelector("#info");
const paginacaoEl = document.querySelector("#paginacao");
const porPaginaEl = document.querySelector("#por-pagina");

// ---------- Gera dados ficticios ----------
function gerarItens(total) {
    return Array.from({ length: total }, (_, i) => ({
        id: i + 1,
        titulo: `Item ${String(i + 1).padStart(2, "0")}`,
        valor: Math.floor(Math.random() * 500) + 10,
    }));
}

// ---------- Calculo ----------
function totalPaginas() {
    return Math.max(1, Math.ceil(estado.itens.length / estado.itensPorPagina));
}

function fatiaAtual() {
    const inicio = (estado.paginaAtual - 1) * estado.itensPorPagina;
    const fim = inicio + estado.itensPorPagina;
    return estado.itens.slice(inicio, fim);
}

// ---------- Renderizacao ----------
function renderizarLista() {
    const itens = fatiaAtual();
    listaEl.innerHTML = "";

    itens.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.titulo} - R$ ${item.valor}`;
        listaEl.append(li);
    });

    const inicio = (estado.paginaAtual - 1) * estado.itensPorPagina + 1;
    const fim = Math.min(estado.paginaAtual * estado.itensPorPagina, estado.itens.length);
    infoEl.textContent =
        `Mostrando ${inicio}-${fim} de ${estado.itens.length} itens ` +
        `(pagina ${estado.paginaAtual} de ${totalPaginas()})`;
}

function renderizarControles() {
    paginacaoEl.innerHTML = "";

    // Botao Anterior
    const btnPrev = document.createElement("button");
    btnPrev.textContent = "Anterior";
    btnPrev.disabled = estado.paginaAtual === 1;
    btnPrev.addEventListener("click", () => irPara(estado.paginaAtual - 1));
    paginacaoEl.append(btnPrev);

    // Botoes numerados
    const total = totalPaginas();
    const inicio = Math.max(1, estado.paginaAtual - 2);
    const fim = Math.min(total, estado.paginaAtual + 2);

    for (let i = inicio; i <= fim; i++) {
        const btn = document.createElement("button");
        btn.textContent = String(i);
        if (i === estado.paginaAtual) btn.classList.add("atual");
        btn.addEventListener("click", () => irPara(i));
        paginacaoEl.append(btn);
    }

    // Botao Proxima
    const btnNext = document.createElement("button");
    btnNext.textContent = "Proxima";
    btnNext.disabled = estado.paginaAtual === total;
    btnNext.addEventListener("click", () => irPara(estado.paginaAtual + 1));
    paginacaoEl.append(btnNext);
}

function renderizarTudo() {
    renderizarLista();
    renderizarControles();
}

function irPara(pagina) {
    const total = totalPaginas();
    estado.paginaAtual = Math.max(1, Math.min(pagina, total));
    renderizarTudo();
}

// ---------- Eventos ----------
porPaginaEl.addEventListener("change", (evento) => {
    estado.itensPorPagina = Number(evento.target.value);
    estado.paginaAtual = 1;
    renderizarTudo();
});

// ---------- Inicializacao ----------
estado.itens = gerarItens(47);
renderizarTudo();