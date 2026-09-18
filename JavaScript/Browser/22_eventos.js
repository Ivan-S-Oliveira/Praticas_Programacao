/**
 * 22 - Eventos
 *
 * Conceitos abordados:
 *   - addEventListener e o objeto event
 *   - Tipos comuns: click, input, change, submit, keydown, mouseover
 *   - preventDefault e stopPropagation
 *   - Delegacao de eventos (listener no pai)
 *   - removeEventListener
 *   - Diferenca entre input e change
 *   - Captura do valor de inputs com event.target
 */

// ---------- 1) Click basico ----------
const botao1 = document.querySelector("#btn1");
botao1.addEventListener("click", (evento) => {
    console.log("Botao 1 clicado. Tipo:", evento.type);
    console.log("Elemento alvo:", evento.target.tagName);
});

// ---------- 2) Input em tempo real ----------
const campo = document.querySelector("#campo");
const saida = document.querySelector("#saida");

campo.addEventListener("input", (evento) => {
    saida.textContent = `Voce digitou: ${evento.target.value}`;
});

// ---------- 3) Change (dispara ao sair do campo) ----------
campo.addEventListener("change", (evento) => {
    console.log("Valor final do campo:", evento.target.value);
});

// ---------- 4) Submit com preventDefault ----------
const form = document.querySelector("#form");
form.addEventListener("submit", (evento) => {
    evento.preventDefault(); // impede recarregamento da pagina
    console.log("Formulario interceptado pelo JS.");
});

// ---------- 5) Teclado ----------
const teclado = document.querySelector("#teclado");
teclado.addEventListener("keydown", (evento) => {
    console.log("Tecla pressionada:", evento.key, "| codigo:", evento.code);
    if (evento.key === "Enter") {
        console.log("Enter detectado!");
    }
});

// ---------- 6) Delegacao de eventos ----------
const lista = document.querySelector("#lista-delegada");
lista.addEventListener("click", (evento) => {
    // Verifica se o clique foi em um LI
    if (evento.target.matches("li")) {
        console.log("Item clicado:", evento.target.textContent);
        evento.target.classList.toggle("ativo");
    }
});

// ---------- 7) removeEventListener ----------
function handlerTemporario() {
    console.log("Handler temporario disparado uma vez.");
    document.querySelector("#btn-temp").removeEventListener("click", handlerTemporario);
}
document.querySelector("#btn-temp").addEventListener("click", handlerTemporario);

// ---------- 8) Multiplos eventos no mesmo elemento ----------
const multi = document.querySelector("#multi");
["mouseenter", "mouseleave"].forEach((tipo) => {
    multi.addEventListener(tipo, (evento) => {
        multi.textContent = `Evento: ${evento.type}`;
    });
});