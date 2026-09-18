/**
 * 21 - DOM
 *
 * Conceitos abordados:
 *   - Selecao de elementos: querySelector e querySelectorAll
 *   - Leitura e escrita: textContent, innerHTML, value
 *   - Manipulacao de classes: classList.add/remove/toggle/contains
 *   - Criacao dinamica: createElement + append/appendChild
 *   - Remocao: remove()
 *   - Atributos: setAttribute, getAttribute, dataset
 *   - Iteracao sobre NodeList com forEach
 *   - Diferenca entre NodeList (estatico) e HTMLCollection (vivo)
 */

// ---------- 1) Selecao ----------
const titulo = document.querySelector("#titulo");
const itens = document.querySelectorAll(".item");

console.log("Titulo:", titulo.textContent);
console.log("Total de itens:", itens.length);

// ---------- 2) Alterando conteudo ----------
titulo.textContent = "DOM manipulado com JavaScript";
titulo.classList.add("destaque");

// ---------- 3) Iterando sobre NodeList ----------
itens.forEach((item, indice) => {
    item.textContent = `Item ${indice + 1} - atualizado`;
    item.dataset.indice = indice; // atributo data-indice
});

// ---------- 4) Criando elementos ----------
const lista = document.querySelector("#lista");

function criarItem(texto) {
    const li = document.createElement("li");
    li.className = "item";
    li.textContent = texto;
    li.dataset.criado = "true";
    return li;
}

const novoItem = criarItem("Item 4 - criado dinamicamente");
lista.append(novoItem);

// ---------- 5) Inserindo varios de uma vez ----------
const fragmento = document.createDocumentFragment();
["Item 5", "Item 6", "Item 7"].forEach((txt) => {
    fragmento.append(criarItem(txt));
});
lista.append(fragmento);

// ---------- 6) Removendo elementos ----------
const primeiro = lista.querySelector(".item");
if (primeiro) {
    primeiro.remove();
    console.log("Primeiro item removido.");
}

// ---------- 7) Alternando classe ----------
const botao = document.querySelector("#btn-toggle");
botao.addEventListener("click", () => {
    titulo.classList.toggle("destaque");
    const tem = titulo.classList.contains("destaque");
    console.log("Destaque ativo?", tem);
});

// ---------- 8) innerHTML vs textContent ----------
const box = document.querySelector("#box");
box.innerHTML = "<strong>Texto em negrito</strong>";
// Cuidado: innerHTML interpreta HTML. textContent nao.