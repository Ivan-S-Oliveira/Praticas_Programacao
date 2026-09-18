/**
 * 12 - filter
 *
 * Conceitos abordados:
 *   - Array.prototype.filter: retorna NOVO array com elementos que passam no teste
 *   - Predicado: callback que retorna true/false
 *   - Combinacao de condicoes (&&, ||)
 *   - filter em objetos
 *   - filter + encadeamento com map
 *   - Remocao de valores falsy (0, "", null, undefined, NaN, false)
 */

// ---------- Array base ----------
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// ---------- 1) Filtro simples ----------
const pares = numeros.filter((n) => n % 2 === 0);
const impares = numeros.filter((n) => n % 2 !== 0);

console.log("Pares:  ", pares);
console.log("Impares:", impares);

// ---------- 2) Filtro por faixa ----------
const entre4e7 = numeros.filter((n) => n >= 4 && n <= 7);
console.log("\nEntre 4 e 7:", entre4e7);

// ---------- 3) Filtro com multiplas condicoes ----------
const maioresQue3EPares = numeros.filter((n) => n > 3 && n % 2 === 0);
console.log("Maiores que 3 e pares:", maioresQue3EPares);

// ---------- 4) Filtro em strings ----------
const palavras = ["casa", "carro", "caminhao", "bicicleta", "catavento"];
const comecamComCa = palavras.filter((p) => p.startsWith("ca"));
console.log("\nComecam com 'ca':", comecamComCa);

const comLetraO = palavras.filter((p) => p.includes("o"));
console.log("Contem 'o':", comLetraO);

// ---------- 5) Filtro em objetos ----------
const usuarios = [
    { nome: "Ana", idade: 17, ativo: true },
    { nome: "Bruno", idade: 25, ativo: false },
    { nome: "Carla", idade: 32, ativo: true },
    { nome: "Daniel", idade: 15, ativo: true },
];

const maioresDeIdade = usuarios.filter((u) => u.idade >= 18);
console.log("\nMaiores de idade:", maioresDeIdade.map((u) => u.nome));

const ativosEMaiores = usuarios.filter((u) => u.ativo && u.idade >= 18);
console.log("Ativos e maiores:", ativosEMaiores.map((u) => u.nome));

// ---------- 6) Remover valores falsy ----------
const bagunca = [0, 1, "", "texto", null, undefined, NaN, false, true, 42];
const limpos = bagunca.filter(Boolean);
console.log("\nArray bagunçado:", bagunca);
console.log("Somente truthy:", limpos);

// ---------- 7) Encadeamento filter + map ----------
const nomesDeMaiores = usuarios
    .filter((u) => u.idade >= 18)
    .map((u) => u.nome.toUpperCase());

console.log("\nNomes de maiores (maiusculo):", nomesDeMaiores);

// ---------- 8) filter + reduce (soma dos pares) ----------
const somaPares = numeros
    .filter((n) => n % 2 === 0)
    .reduce((acc, n) => acc + n, 0);

console.log("\nSoma dos pares:", somaPares);