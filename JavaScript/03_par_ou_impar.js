/**
 * 03 - Par ou Ímpar
 * Conceitos: operador %, if/else, for, ternário
 */

const numero = 7;

if (numero % 2 === 0) {
    console.log(`O número ${numero} é PAR.`);
} else {
    console.log(`O número ${numero} é ÍMPAR.`);
}

// ---------- Bônus: de 1 a 10 ----------
console.log("\n--- Verificando de 1 a 10 ---");
for (let i = 1; i <= 10; i++) {
    const tipo = i % 2 === 0 ? "par" : "ímpar";
    console.log(`${i} é ${tipo}`);
}

// ---------- Bônus 2: usando while ----------
console.log("\n--- Mesma coisa com while ---");
let j = 1;
while (j <= 10) {
    const tipo = j % 2 === 0 ? "par" : "ímpar";
    console.log(`${j} é ${tipo}`);
    j++;
}