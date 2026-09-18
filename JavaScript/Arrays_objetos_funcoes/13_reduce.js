/**
 * 13 - reduce
 *
 * Conceitos abordados:
 *   - Array.prototype.reduce: reduz o array a um unico valor
 *   - Callback recebe (acumulador, elemento, indice, array)
 *   - Valor inicial do acumulador (segundo argumento do reduce)
 *   - Casos de uso: soma, media, max, min, contagem, agrupamento
 *   - reduce com objeto como acumulador
 *   - Diferenca entre com e sem valor inicial
 */

// ---------- 1) Soma ----------
const numeros = [1, 2, 3, 4, 5];

const soma = numeros.reduce((acc, n) => acc + n, 0);
console.log("Soma:", soma);

// ---------- 2) Produto ----------
const produto = numeros.reduce((acc, n) => acc * n, 1);
console.log("Produto:", produto);

// ---------- 3) Media ----------
const media = numeros.reduce((acc, n) => acc + n, 0) / numeros.length;
console.log("Media:", media);

// ---------- 4) Maior e menor ----------
const maior = numeros.reduce((acc, n) => (n > acc ? n : acc), numeros[0]);
const menor = numeros.reduce((acc, n) => (n < acc ? n : acc), numeros[0]);
console.log("Maior:", maior);
console.log("Menor:", menor);

// ---------- 5) Contar ocorrencias ----------
const frutas = ["maca", "banana", "maca", "laranja", "banana", "maca"];
const contagem = frutas.reduce((acc, fruta) => {
    acc[fruta] = (acc[fruta] || 0) + 1;
    return acc;
}, {});
console.log("\nContagem de frutas:", contagem);

// ---------- 6) Agrupar por propriedade ----------
const pessoas = [
    { nome: "Ana", time: "Azul" },
    { nome: "Bruno", time: "Vermelho" },
    { nome: "Carla", time: "Azul" },
    { nome: "Daniel", time: "Verde" },
    { nome: "Eva", time: "Vermelho" },
];

const porTime = pessoas.reduce((acc, p) => {
    if (!acc[p.time]) acc[p.time] = [];
    acc[p.time].push(p.nome);
    return acc;
}, {});
console.log("\nAgrupado por time:", porTime);

// ---------- 7) Somar campo de objetos ----------
const produtos = [
    { nome: "Caneta", preco: 2.5 },
    { nome: "Caderno", preco: 15.9 },
    { nome: "Mochila", preco: 89.9 },
];
const total = produtos.reduce((acc, p) => acc + p.preco, 0);
console.log("\nTotal dos produtos: R$", total.toFixed(2));

// ---------- 8) Achatando arrays (flatten) ----------
const matriz = [[1, 2], [3, 4], [5, 6]];
const achatado = matriz.reduce((acc, linha) => acc.concat(linha), []);
console.log("\nMatriz achatada:", achatado);

// ---------- 9) reduce sem valor inicial (cuidado) ----------
// Sem valor inicial, o primeiro elemento vira o acumulador inicial.
const somaSemInicial = numeros.reduce((acc, n) => acc + n);
console.log("\nSoma sem valor inicial:", somaSemInicial);

// ---------- 10) reduceRight (da direita para a esquerda) ----------
const letras = ["a", "b", "c", "d"];
const invertido = letras.reduceRight((acc, l) => acc + l, "");
console.log("Concatenado invertido:", invertido);