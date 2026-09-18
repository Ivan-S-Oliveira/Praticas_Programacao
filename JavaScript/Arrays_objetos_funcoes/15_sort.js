/**
 * 15 - sort
 *
 * Conceitos abordados:
 *   - Array.prototype.sort MUTA o array original
 *   - Ordenacao padrao e lexicografica (como string)
 *   - Funcao comparadora (a, b) => numero
 *   - Ordenar numeros corretamente exige comparador
 *   - Ordenar objetos por campo
 *   - Ordenacao estavel (a partir do ES2019)
 *   - Copiar antes de ordenar: [...arr].sort(...)
 *   - reverse
 */

// ---------- 1) sort padrao (lexicografico) ----------
const letras = ["c", "a", "d", "b"];
console.log("Original:", letras);
console.log("Sort padrao:", [...letras].sort());

// CUIDADO: numeros como string
const numeros = [10, 2, 33, 4, 21];
console.log("\nNumeros originais:", numeros);
console.log("Sort padrao (ERRADO):", [...numeros].sort());

// ---------- 2) sort correto de numeros ----------
const crescente = [...numeros].sort((a, b) => a - b);
const decrescente = [...numeros].sort((a, b) => b - a);
console.log("Crescente:", crescente);
console.log("Decrescente:", decrescente);

// ---------- 3) Ordenar strings (case-insensitive) ----------
const nomes = ["Carlos", "ana", "Bruno", "Alice"];
console.log("\nSort de strings (sensivel a maiuscula):", [...nomes].sort());
console.log("Sort case-insensitive:", [...nomes].sort((a, b) => a.localeCompare(b)));
console.log("Sort com localeCompare pt-BR:",
    [...nomes].sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" })));

// ---------- 4) Ordenar objetos por campo numerico ----------
const produtos = [
    { nome: "Caneta", preco: 2.5 },
    { nome: "Mochila", preco: 89.9 },
    { nome: "Caderno", preco: 15.9 },
    { nome: "Lapis", preco: 1.2 },
];

const porPrecoAsc = [...produtos].sort((a, b) => a.preco - b.preco);
const porPrecoDesc = [...produtos].sort((a, b) => b.preco - a.preco);

console.log("\nPor preco (crescente):", porPrecoAsc.map((p) => `${p.nome}: ${p.preco}`));
console.log("Por preco (decrescente):", porPrecoDesc.map((p) => `${p.nome}: ${p.preco}`));

// ---------- 5) Ordenar objetos por campo string ----------
const porNome = [...produtos].sort((a, b) => a.nome.localeCompare(b.nome));
console.log("\nPor nome:", porNome.map((p) => p.nome));

// ---------- 6) Ordenacao estavel (ES2019+) ----------
// Empates mantem a ordem original
const pessoas = [
    { nome: "Ana", idade: 30 },
    { nome: "Bruno", idade: 25 },
    { nome: "Carla", idade: 30 },
    { nome: "Daniel", idade: 25 },
];
const porIdade = [...pessoas].sort((a, b) => a.idade - b.idade);
console.log("\nOrdenado por idade (estavel):");
porIdade.forEach((p) => console.log(`  ${p.nome} (${p.idade})`));

// ---------- 7) Ordenacao por criterio composto ----------
const porIdadeDepoisNome = [...pessoas].sort((a, b) => {
    if (a.idade !== b.idade) return a.idade - b.idade;
    return a.nome.localeCompare(b.nome);
});
console.log("\nIdade, depois nome:");
porIdadeDepoisNome.forEach((p) => console.log(`  ${p.nome} (${p.idade})`));

// ---------- 8) Mutacao vs copia ----------
console.log("\n--- Mutacao vs copia ---");
const original = [3, 1, 2];
const copiaOrdenada = [...original].sort((a, b) => a - b);

console.log("Original apos copia ordenada:", original); // [3, 1, 2]
console.log("Copia ordenada:", copiaOrdenada);

// Se quiser mutar de proposito:
original.sort((a, b) => a - b);
console.log("Original apos sort direto:", original);

// ---------- 9) reverse ----------
const invertido = [1, 2, 3, 4].reverse();
console.log("\nReverse:", invertido);