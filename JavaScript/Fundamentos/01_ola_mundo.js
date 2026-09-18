/**
 * 01 - Olá Mundo
 * Conceitos: console.log, let, const, tipos primitivos, template strings
 */

// 1. Olá Mundo
console.log("Olá, Mundo!");

// 2. Variáveis
const nome = "Estudante";
let idade = 25;
console.log(`Olá, ${nome}! Você tem ${idade} anos.`);

// 3. Tipos primitivos
const texto = "texto";
const numero = 42;
const decimal = 3.14;
const verdadeiro = true;
const nulo = null;
let indefinido;

console.log(`Tipo de "texto":      ${typeof texto}`);
console.log(`Tipo de 42:           ${typeof numero}`);
console.log(`Tipo de 3.14:         ${typeof decimal}`);
console.log(`Tipo de true:         ${typeof verdadeiro}`);
console.log(`Tipo de null:         ${typeof nulo}`);       // object (peculiaridade histórica)
console.log(`Tipo de indefinido:   ${typeof indefinido}`); // undefined

// 4. Alterando valores
idade = 26;
console.log(`Idade atualizada: ${idade}`);