/**
 * 14 - find e metodos de busca
 *
 * Conceitos abordados:
 *   - Array.prototype.find: retorna o PRIMEIRO elemento que satisfaz o predicado
 *   - Array.prototype.findIndex: retorna o indice do primeiro encontrado
 *   - Array.prototype.findLast e findLastIndex
 *   - Array.prototype.includes: verifica se um valor existe
 *   - Array.prototype.some: retorna true se ALGUM satisfaz
 *   - Array.prototype.every: retorna true se TODOS satisfazem
 *   - find retorna undefined quando nao encontra
 */

// ---------- Array base ----------
const usuarios = [
    { id: 1, nome: "Ana", idade: 28 },
    { id: 2, nome: "Bruno", idade: 34 },
    { id: 3, nome: "Carla", idade: 22 },
    { id: 4, nome: "Daniel", idade: 45 },
    { id: 5, nome: "Eva", idade: 22 },
];

// ---------- 1) find: primeiro que satisfaz ----------
const primeiroCom22 = usuarios.find((u) => u.idade === 22);
console.log("Primeiro com 22 anos:", primeiroCom22);

// ---------- 2) find por id ----------
const usuario3 = usuarios.find((u) => u.id === 3);
console.log("Usuario id 3:", usuario3);

// ---------- 3) find sem resultado retorna undefined ----------
const inexistente = usuarios.find((u) => u.id === 999);
console.log("Usuario id 999:", inexistente);

// ---------- 4) findIndex ----------
const indiceCarla = usuarios.findIndex((u) => u.nome === "Carla");
console.log("\nIndice da Carla:", indiceCarla);

const indiceInexistente = usuarios.findIndex((u) => u.nome === "Zeca");
console.log("Indice do Zeca:", indiceInexistente); // -1

// ---------- 5) findLast e findLastIndex ----------
const ultimoCom22 = usuarios.findLast((u) => u.idade === 22);
const ultimoIndiceCom22 = usuarios.findLastIndex((u) => u.idade === 22);
console.log("\nUltimo com 22 anos:", ultimoCom22);
console.log("Indice do ultimo com 22:", ultimoIndiceCom22);

// ---------- 6) includes (valor primitivo) ----------
const numeros = [10, 20, 30, 40];
console.log("\nInclui 30?", numeros.includes(30));
console.log("Inclui 99?", numeros.includes(99));

// ---------- 7) some: existe algum? ----------
const temMenorDeIdade = usuarios.some((u) => u.idade < 18);
console.log("\nTem menor de idade?", temMenorDeIdade);

const temMaior40 = usuarios.some((u) => u.idade > 40);
console.log("Tem alguem com mais de 40?", temMaior40);

// ---------- 8) every: todos satisfazem? ----------
const todosAdultos = usuarios.every((u) => u.idade >= 18);
console.log("\nTodos sao adultos?", todosAdultos);

const todosComId = usuarios.every((u) => typeof u.id === "number");
console.log("Todos tem id numerico?", todosComId);

// ---------- 9) Caso pratico: buscar e atualizar ----------
const idBusca = 2;
const idx = usuarios.findIndex((u) => u.id === idBusca);
if (idx !== -1) {
    usuarios[idx] = { ...usuarios[idx], idade: 35 };
    console.log("\nAtualizado:", usuarios[idx]);
}

// ---------- 10) Diferenca entre find e filter ----------
console.log("\n--- find vs filter ---");
console.log("find (um objeto):", usuarios.find((u) => u.idade === 22));
console.log("filter (array):  ", usuarios.filter((u) => u.idade === 22));