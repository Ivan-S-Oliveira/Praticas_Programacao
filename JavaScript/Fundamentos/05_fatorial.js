/**
 * 05 - Fatorial
 * Conceitos: for, while, operadores, tipo Number
 *
 * Fatorial de n = n * (n-1) * (n-2) * ... * 1
 * Convenção: 0! = 1
 */

const n = 5;

// ---------- 1) Com for ----------
let fatorialFor = 1;
if (n < 0) {
    console.log("Fatorial não definido para números negativos.");
} else {
    for (let i = 2; i <= n; i++) {
        fatorialFor *= i;
    }
    console.log(`${n}! (com for)   = ${fatorialFor}`);
}

// ---------- 2) Com while ----------
let fatorialWhile = 1;
let contador = n;
if (n >= 0) {
    while (contador > 1) {
        fatorialWhile *= contador;
        contador--;
    }
    console.log(`${n}! (com while) = ${fatorialWhile}`);
}

// ---------- 3) Mostrando a sequência de cálculo ----------
if (n >= 0) {
    let sequencia = `${n}! = `;
    for (let i = n; i >= 1; i--) {
        sequencia += i;
        if (i > 1) sequencia += " × ";
    }
    console.log(sequencia);
}

// ---------- Bônus: fatoriais de 0 a 10 ----------
console.log("\n--- Fatoriais de 0 a 10 ---");
for (let k = 0; k <= 10; k++) {
    let fat = 1;
    for (let i = 2; i <= k; i++) {
        fat *= i;
    }
    console.log(`${k}! = ${fat}`);
}