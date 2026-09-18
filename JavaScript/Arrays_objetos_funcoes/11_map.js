/**
 * 11 - map
 *
 * Conceitos abordados:
 *   - Array.prototype.map: transforma cada elemento e retorna NOVO array
 *   - Imutabilidade: o array original nao e alterado
 *   - Callback recebe (elemento, indice, array)
 *   - Arrow functions como callback
 *   - Encadeamento de map com outros metodos
 *   - Diferenca entre map (transforma) e forEach (itera)
 */

// ---------- Array base ----------
const numeros = [1, 2, 3, 4, 5];

// ---------- 1) map basico: dobrar valores ----------
const dobrados = numeros.map((n) => n * 2);
console.log("Original:", numeros);
console.log("Dobrados:", dobrados);

// ---------- 2) map com indice ----------
const comIndice = numeros.map((n, i) => `[${i}] = ${n}`);
console.log("\nCom indice:", comIndice);

// ---------- 3) map em strings ----------
const nomes = ["ana", "bruno", "carla"];
const nomesCapitalizados = nomes.map((nome) =>
    nome.charAt(0).toUpperCase() + nome.slice(1)
);
console.log("\nNomes originais:      ", nomes);
console.log("Nomes capitalizados: ", nomesCapitalizados);

// ---------- 4) map em objetos ----------
const produtos = [
    { nome: "Caneta", preco: 2.5 },
    { nome: "Caderno", preco: 15.9 },
    { nome: "Mochila", preco: 89.9 },
];

// Extrai apenas os nomes
const apenasNomes = produtos.map((p) => p.nome);
console.log("\nApenas nomes:", apenasNomes);

// Adiciona um campo calculado
const comDesconto = produtos.map((p) => ({
    ...p,
    precoComDesconto: +(p.preco * 0.9).toFixed(2),
}));
console.log("Com desconto de 10%:", comDesconto);

// ---------- 5) Encadeamento com filter ----------
const precosCaros = produtos
    .filter((p) => p.preco > 10)
    .map((p) => p.preco);

console.log("\nPrecos acima de 10:", precosCaros);

// ---------- 6) map em matriz (array de arrays) ----------
const matriz = [
    [1, 2],
    [3, 4],
    [5, 6],
];
const somaLinhas = matriz.map((linha) => linha.reduce((s, n) => s + n, 0));
console.log("\nSoma de cada linha:", somaLinhas);