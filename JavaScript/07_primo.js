/**
 * 07 - Primo
 * Conceitos: for, break, Math.sqrt, booleanos
 * Primo: divisível apenas por 1 e por ele mesmo (>1).
 */

const numero = 29;

// ---------- 1) Verificando um número ----------
let ehPrimo = true;

if (numero < 2) {
    ehPrimo = false;
} else {
    const limite = Math.floor(Math.sqrt(numero));
    for (let i = 2; i <= limite; i++) {
        if (numero % i === 0) {
            ehPrimo = false;
            console.log(`${numero} é divisível por ${i}.`);
            break;
        }
    }
}

if (ehPrimo) {
    console.log(`\n${numero} é PRIMO. ✅`);
} else {
    console.log(`\n${numero} NÃO é primo.`);
}

// ---------- 2) Listando primos até 50 ----------
console.log("\n--- Primos até 50 ---");
for (let k = 2; k <= 50; k++) {
    let primo = true;
    const lim = Math.floor(Math.sqrt(k));
    for (let i = 2; i <= lim; i++) {
        if (k % i === 0) {
            primo = false;
            break;
        }
    }
    if (primo) console.log(k);
}