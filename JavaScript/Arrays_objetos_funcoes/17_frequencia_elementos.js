/**
 * 17 - Frequencia de elementos
 *
 * Conceitos abordados:
 *   - Contar ocorrencias com reduce e com Map
 *   - Diferenca entre objeto simples e Map
 *   - Ordenar por frequencia
 *   - Encontrar a moda (elemento mais frequente)
 *   - Frequencia em strings (caracteres) e arrays (numeros/objetos)
 *   - Object.entries e Object.fromEntries
 *   - Estatisticas: total, unicos, mais/menos frequentes
 */

// ---------- 1) Contagem com reduce e objeto ----------
const numeros = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5];

const contagemReduce = numeros.reduce((acc, n) => {
    acc[n] = (acc[n] || 0) + 1;
    return acc;
}, {});
console.log("Contagem com reduce:", contagemReduce);

// ---------- 2) Contagem com Map ----------
const contagemMap = new Map();
for (const n of numeros) {
    contagemMap.set(n, (contagemMap.get(n) || 0) + 1);
}
console.log("\nContagem com Map:");
for (const [valor, qtd] of contagemMap) {
    console.log(`  ${valor}: ${qtd}`);
}

// ---------- 3) Ordenar por frequencia ----------
const ordenado = Object.entries(contagemReduce)
    .sort((a, b) => b[1] - a[1]);

console.log("\nOrdenado por frequencia (decrescente):");
ordenado.forEach(([valor, qtd]) => console.log(`  ${valor}: ${qtd}`));

// ---------- 4) Moda (elemento mais frequente) ----------
const moda = ordenado[0][0];
const freqModa = ordenado[0][1];
console.log(`\nModa: ${moda} (aparece ${freqModa} vezes)`);

// ---------- 5) Frequencia de caracteres em texto ----------
const texto = "javascript eh uma linguagem muito usada";

const freqCaracteres = texto
    .replace(/\s/g, "")     // remove espacos
    .split("")
    .reduce((acc, c) => {
        acc[c] = (acc[c] || 0) + 1;
        return acc;
    }, {});

console.log("\nFrequencia de caracteres:", freqCaracteres);

// Top 5 caracteres
const top5 = Object.entries(freqCaracteres)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

console.log("Top 5 caracteres:");
top5.forEach(([c, qtd]) => console.log(`  '${c}': ${qtd}`));

// ---------- 6) Frequencia de palavras ----------
const frase = "o rato roeu a roupa do rei de roma o rato roeu";
const freqPalavras = frase.split(" ").reduce((acc, p) => {
    acc[p] = (acc[p] || 0) + 1;
    return acc;
}, {});
console.log("\nFrequencia de palavras:", freqPalavras);

// ---------- 7) Agrupar objetos por campo ----------
const vendas = [
    { produto: "Caneta", mes: "Jan" },
    { produto: "Caderno", mes: "Jan" },
    { produto: "Caneta", mes: "Fev" },
    { produto: "Mochila", mes: "Fev" },
    { produto: "Caneta", mes: "Fev" },
];

const porMes = vendas.reduce((acc, v) => {
    acc[v.mes] = (acc[v.mes] || 0) + 1;
    return acc;
}, {});
console.log("\nVendas por mes:", porMes);

// ---------- 8) Estatisticas gerais ----------
const valores = Object.values(contagemReduce);
const total = numeros.length;
const unicos = valores.length;
const maxFreq = Math.max(...valores);
const minFreq = Math.min(...valores);

console.log("\n--- Estatisticas ---");
console.log("Total de elementos:", total);
console.log("Elementos unicos:  ", unicos);
console.log("Maior frequencia:  ", maxFreq);
console.log("Menor frequencia:  ", minFreq);

// ---------- 9) Object.fromEntries para reconstruir ----------
const pares = [["a", 1], ["b", 2], ["c", 3]];
const objReconstruido = Object.fromEntries(pares);
console.log("\nfromEntries:", objReconstruido);