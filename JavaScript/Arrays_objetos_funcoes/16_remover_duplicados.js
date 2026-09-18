/**
 * 16 - Remover duplicados
 *
 * Conceitos abordados:
 *   - Set: colecao de valores unicos
 *   - Spread de Set para array: [...new Set(arr)]
 *   - filter com indexOf para manter a primeira ocorrencia
 *   - reduce acumulando em array unico
 *   - Remover duplicados de objetos por chave
 *   - Uso de Map para chaves unicas
 *   - Comparacao de performance (breve)
 */

// ---------- 1) Metodo moderno: Set ----------
const numeros = [1, 2, 2, 3, 4, 4, 4, 5, 1];
const unicosSet = [...new Set(numeros)];
console.log("Original:", numeros);
console.log("Unicos (Set):", unicosSet);

// ---------- 2) Strings ----------
const frutas = ["maca", "banana", "maca", "laranja", "banana"];
const frutasUnicas = [...new Set(frutas)];
console.log("\nFrutas originais:", frutas);
console.log("Frutas unicas:", frutasUnicas);

// ---------- 3) Metodo classico: filter + indexOf ----------
const unicosFilter = numeros.filter((n, i) => numeros.indexOf(n) === i);
console.log("\nUnicos (filter + indexOf):", unicosFilter);

// ---------- 4) Metodo com reduce ----------
const unicosReduce = numeros.reduce((acc, n) => {
    if (!acc.includes(n)) acc.push(n);
    return acc;
}, []);
console.log("Unicos (reduce):", unicosReduce);

// ---------- 5) Objetos: Set NAO funciona diretamente ----------
// Objetos sao comparados por referencia, nao por valor
const objA = { id: 1, nome: "Ana" };
const objB = { id: 1, nome: "Ana" };
console.log("\nobjA === objB?", objA === objB); // false
console.log("Set com objetos (NAO remove):", [...new Set([objA, objB])].length);

// ---------- 6) Remover duplicados de objetos por chave ----------
const usuarios = [
    { id: 1, nome: "Ana" },
    { id: 2, nome: "Bruno" },
    { id: 1, nome: "Ana (duplicada)" },
    { id: 3, nome: "Carla" },
    { id: 2, nome: "Bruno (duplicado)" },
];

// Usando Map (chave -> valor unico)
const unicosPorId = [
    ...new Map(usuarios.map((u) => [u.id, u])).values(),
];
console.log("\nUsuarios originais:", usuarios.length);
console.log("Unicos por id:", unicosPorId);

// Alternativa: reduce
const unicosPorIdReduce = usuarios.reduce((acc, u) => {
    if (!acc.some((x) => x.id === u.id)) {
        acc.push(u);
    }
    return acc;
}, []);
console.log("Unicos por id (reduce):", unicosPorIdReduce);

// ---------- 7) Manter o ULTIMO em vez do primeiro ----------
const ultimoPorId = [
    ...new Map(usuarios.map((u) => [u.id, u])).values(),
];
// Nota: o Map acima sobrescreve pela ultima ocorrencia
console.log("\n(Com Map, o ultimo vence):", ultimoPorId);

// ---------- 8) Contar quantos duplicados existiam ----------
const total = usuarios.length;
const unicos = unicosPorId.length;
console.log(`\nTotal: ${total} | Unicos: ${unicos} | Removidos: ${total - unicos}`);