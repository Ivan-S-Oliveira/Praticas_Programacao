/**
 * 06 - Fibonacci
 * Conceitos: for, variáveis auxiliares
 * Sequência: 0, 1, 1, 2, 3, 5, 8, 13, 21, ...
 */

const quantidade = 15;

// ---------- 1) Imprimindo os N primeiros ----------
console.log(`--- ${quantidade} primeiros números de Fibonacci ---`);
let a = 0;
let b = 1;

for (let i = 0; i < quantidade; i++) {
    console.log(`F(${i}) = ${a}`);
    const temp = a + b;
    a = b;
    b = temp;
}

// ---------- 2) Encontrando o n-ésimo ----------
const n = 20;
let x = 0;
let y = 1;

for (let i = 0; i < n; i++) {
    const temp = x + y;
    x = y;
    y = temp;
}
console.log(`\nO ${n}º número de Fibonacci é: ${x}`);

// ---------- 3) Mesma coisa com while ----------
console.log("\n--- Com while (10 primeiros) ---");
let p = 0;
let q = 1;
let cont = 0;

while (cont < 10) {
    console.log(`F(${cont}) = ${p}`);
    const t = p + q;
    p = q;
    q = t;
    cont++;
}