/**
 * 04 - Maior Número
 * Conceitos: comparações, if/else if, Math.max
 */

const n1 = 12;
const n2 = 45;
const n3 = 27;

// ---------- Forma 1: lógica manual ----------
let maiorManual;
if (n1 >= n2 && n1 >= n3) {
    maiorManual = n1;
} else if (n2 >= n1 && n2 >= n3) {
    maiorManual = n2;
} else {
    maiorManual = n3;
}

console.log(`Maior (manual): ${maiorManual}`);

// ---------- Forma 2: Math.max ----------
const maiorMath = Math.max(n1, n2, n3);
console.log(`Maior (Math.max): ${maiorMath}`);

// ---------- Bônus: menor ----------
let menorManual;
if (n1 <= n2 && n1 <= n3) {
    menorManual = n1;
} else if (n2 <= n1 && n2 <= n3) {
    menorManual = n2;
} else {
    menorManual = n3;
}

console.log(`Menor (manual): ${menorManual}`);
console.log(`Menor (Math.min): ${Math.min(n1, n2, n3)}`);