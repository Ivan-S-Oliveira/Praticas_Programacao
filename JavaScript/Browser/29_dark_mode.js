/**
 * 29 - Dark Mode
 *
 * Conceitos abordados:
 *   - Toggle de classe no <body> ou <html>
 *   - Persistencia do tema com localStorage
 *   - Deteccao de preferencia do sistema (prefers-color-scheme)
 *   - CSS variables para trocar tema de forma limpa
 *   - Atualizacao de icone/texto do botao
 *   - Sincronizacao entre abas com storage event
 */

// ---------- Constantes ----------
const CHAVE = "tema";
const TEMA_CLARO = "claro";
const TEMA_ESCURO = "escuro";

// ---------- Elementos ----------
const botao = document.querySelector("#toggle-tema");
const status = document.querySelector("#status-tema");

// ---------- Deteccao ----------
function preferenciaDoSistema() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? TEMA_ESCURO
        : TEMA_CLARO;
}

function temaSalvo() {
    return localStorage.getItem(CHAVE);
}

function temaAtual() {
    return temaSalvo() || preferenciaDoSistema();
}

// ---------- Aplicacao ----------
function aplicarTema(tema) {
    document.documentElement.dataset.tema = tema;

    if (tema === TEMA_ESCURO) {
        botao.textContent = "Ativar tema claro";
    } else {
        botao.textContent = "Ativar tema escuro";
    }

    status.textContent = `Tema atual: ${tema}`;
}

function alternarTema() {
    const novo = temaAtual() === TEMA_ESCURO ? TEMA_CLARO : TEMA_ESCURO;
    localStorage.setItem(CHAVE, novo);
    aplicarTema(novo);
}

// ---------- Eventos ----------
botao.addEventListener("click", alternarTema);

// Sincroniza entre abas (abrir a mesma pagina em duas abas)
window.addEventListener("storage", (evento) => {
    if (evento.key === CHAVE) {
        aplicarTema(evento.newValue || preferenciaDoSistema());
    }
});

// Sincroniza com o sistema (se o usuario nao escolheu manualmente)
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!temaSalvo()) {
        aplicarTema(preferenciaDoSistema());
    }
});

// ---------- Inicializacao ----------
aplicarTema(temaAtual());