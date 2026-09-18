/**
 * 20 - Spread operator
 *
 * Conceitos abordados:
 *   - Spread em arrays: copia, concatena, insere
 *   - Spread em objetos: copia, sobrescreve, mescla
 *   - Spread em chamadas de funcao: espalhar argumentos
 *   - Math.max(...arr) e Math.min(...arr)
 *   - Copia RASA (nao confundir com copia profunda)
 *   - Rest vs Spread: mesma sintaxe, contextos diferentes
 *   - Remover propriedade com destructuring + spread
 *   - Spread com strings e Sets
 */

// ---------- 1) Copiar array ----------
const original = [1, 2, 3];
const copia = [...original];
copia.push(4);
console.log("Original:", original); // [1, 2, 3]
console.log("Copia:   ", copia);    // [1, 2, 3, 4]

// ---------- 2) Concatenar arrays ----------
const a = [1, 2, 3];
const b = [4, 5, 6];
const unido = [...a, ...b];
console.log("\nConcatenado:", unido);

// ---------- 3) Inserir no meio ----------
const inserido = [0, ...a, 99, ...b];
console.log("Inserindo elementos:", inserido);

// ---------- 4) Copiar strings ----------
const letras = [..."JavaScript"];
console.log("\nString espalhada:", letras);

// ---------- 5) Set para array ----------
const semDuplicados = [...new Set([1, 2, 2, 3, 3, 3])];
console.log("Set para array:", semDuplicados);

// ---------- 6) Spread em chamada de funcao ----------
const numeros = [5, 2, 9, 1, 7];
console.log("\nMath.max com spread:", Math.max(...numeros));
console.log("Math.min com spread:", Math.min(...numeros));

function somarTres(x, y, z) {
    return x + y + z;
}
console.log("somarTres com spread:", somarTres(...[10, 20, 30]));

// ---------- 7) Copiar objeto ----------
const usuario = { nome: "Ana", idade: 28 };
const copiaUsuario = { ...usuario };
copiaUsuario.idade = 29;

console.log("\nUsuario original:", usuario);
console.log("Copia alterada:  ", copiaUsuario);

// ---------- 8) Sobrescrever propriedade ----------
const atualizado = { ...usuario, idade: 30, cidade: "Sao Paulo" };
console.log("\nAtualizado:", atualizado);

// ---------- 9) Mesclar objetos ----------
const base = { a: 1, b: 2 };
const extras = { b: 99, c: 3 };
const mesclado = { ...base, ...extras };
console.log("\nMesclado (b sobrescrito):", mesclado);

// ---------- 10) Remover propriedade com destructuring + spread ----------
const { idade: _idade, ...semIdade } = usuario;
console.log("\nSem idade:", semIdade);

// ---------- 11) Spread em arrays de objetos ----------
const produtos = [
    { nome: "Caneta", preco: 2.5 },
    { nome: "Caderno", preco: 15.9 },
];
const produtosComEstoque = produtos.map((p) => ({ ...p, estoque: 100 }));
console.log("\nCom estoque:", produtosComEstoque);

// ---------- 12) Copia RASA (atencao) ----------
const obj = { dados: { valor: 10 } };
const copiaRasa = { ...obj };
copiaRasa.dados.valor = 999;

console.log("\nCopia rasa alterou o original:");
console.log("Original:", obj.dados.valor);       // 999
console.log("Copia:   ", copiaRasa.dados.valor);  // 999

// Solucao: copia profunda com structuredClone
const copiaProfunda = structuredClone(obj);
copiaProfunda.dados.valor = 111;
console.log("Copia profunda nao afeta:", obj.dados.valor);

// ---------- 13) Rest vs Spread ----------
// Spread: expande um array/objeto
// Rest: coleta multiplos elementos em um array

function somarTudo(...valores) {   // REST: coleta em array
    return valores.reduce((acc, n) => acc + n, 0);
}
console.log("\nRest como parametro:", somarTudo(1, 2, 3, 4, 5));

const arr = [1, 2, 3];
console.log("Spread como argumento:", somarTudo(...arr)); // SPREAD: espalha

// ---------- 14) Juntando as duas coisas ----------
function primeiroEResto(primeiro, ...outros) {
    return { primeiro, outros };
}
console.log("\nPrimeiro e resto:", primeiroEResto("a", "b", "c", "d"));