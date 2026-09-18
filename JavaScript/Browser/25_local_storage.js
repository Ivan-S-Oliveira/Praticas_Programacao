/**
 * 25 - Local Storage
 *
 * Conceitos abordados:
 *   - localStorage: persistente entre sessoes
 *   - sessionStorage: dura somente a sessao da aba
 *   - setItem, getItem, removeItem, clear
 *   - Armazenamento somente de strings
 *   - JSON.stringify e JSON.parse para objetos
 *   - Iterar sobre as chaves
 *   - Verificar suporte a Storage
 *   - Remocao por prefixo (limpar so o que e seu)
 */

// ---------- 1) Verificacao de suporte ----------
function temLocalStorage() {
    try {
        const teste = "__teste__";
        localStorage.setItem(teste, teste);
        localStorage.removeItem(teste);
        return true;
    } catch {
        return false;
    }
}

console.log("Suporta localStorage?", temLocalStorage());

// ---------- 2) Salvar e ler strings ----------
localStorage.setItem("nome", "Ana");
console.log("Nome salvo:", localStorage.getItem("nome"));

// ---------- 3) Salvar objetos (precisa serializar) ----------
const usuario = { id: 1, nome: "Ana", idade: 28, ativo: true };
localStorage.setItem("usuario", JSON.stringify(usuario));

const lido = JSON.parse(localStorage.getItem("usuario"));
console.log("Usuario lido:", lido);
console.log("Nome do usuario:", lido.nome);

// ---------- 4) Remover ----------
localStorage.removeItem("nome");
console.log("Nome apos remove:", localStorage.getItem("nome"));

// ---------- 5) Contador persistente ----------
const visitas = Number(localStorage.getItem("visitas") || 0);
localStorage.setItem("visitas", String(visitas + 1));
console.log("Visitas:", localStorage.getItem("visitas"));

// ---------- 6) Iterando ----------
console.log("\n--- Chaves armazenadas ---");
for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i);
    console.log(`  ${chave}: ${localStorage.getItem(chave)}`);
}

// ---------- 7) Remover apenas chaves com prefixo ----------
localStorage.setItem("app:tema", "escuro");
localStorage.setItem("app:idioma", "pt-BR");

function limparPrefixo(prefixo) {
    const chaves = Object.keys(localStorage).filter((k) => k.startsWith(prefixo));
    chaves.forEach((k) => localStorage.removeItem(k));
    return chaves;
}

// Descomente para testar:
// console.log("Removidas:", limparPrefixo("app:"));

// ---------- 8) Interface ----------
const input = document.querySelector("#nome-input");
const lista = document.querySelector("#lista-nomes");

function carregarNomes() {
    return JSON.parse(localStorage.getItem("nomes") || "[]");
}

function salvarNomes(nomes) {
    localStorage.setItem("nomes", JSON.stringify(nomes));
}

function renderizar() {
    const nomes = carregarNomes();
    lista.innerHTML = "";
    nomes.forEach((n, i) => {
        const li = document.createElement("li");
        li.textContent = `${n} `;
        const btn = document.createElement("button");
        btn.textContent = "Remover";
        btn.addEventListener("click", () => {
            const atual = carregarNomes();
            atual.splice(i, 1);
            salvarNomes(atual);
            renderizar();
        });
        li.append(btn);
        lista.append(li);
    });
}

document.querySelector("#add").addEventListener("click", () => {
    const valor = input.value.trim();
    if (!valor) return;
    const nomes = carregarNomes();
    nomes.push(valor);
    salvarNomes(nomes);
    input.value = "";
    renderizar();
});

document.querySelector("#limpar-tudo").addEventListener("click", () => {
    localStorage.clear();
    renderizar();
});

renderizar();