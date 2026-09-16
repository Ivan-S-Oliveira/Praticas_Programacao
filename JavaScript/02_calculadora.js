/**
 * 02 - Calculadora
 * Conceitos: operadores aritméticos, if/else if, template strings
 *
 * Como valores fixos (sem input do usuário)
 */

const operacao = "dividir";  // troque para testar: somar, subtrair, multiplicar, dividir
const num1 = 10;
const num2 = 4;

let resultado;
let valido = true;

if (operacao === "somar") {
    resultado = num1 + num2;
} else if (operacao === "subtrair") {
    resultado = num1 - num2;
} else if (operacao === "multiplicar") {
    resultado = num1 * num2;
} else if (operacao === "dividir") {
    if (num2 === 0) {
        console.log("Erro: divisão por zero!");
        valido = false;
    } else {
        resultado = num1 / num2;
    }
} else {
    console.log("Operação desconhecida!");
    valido = false;
}

if (valido) {
    console.log(`${num1} ${operacao} ${num2} = ${resultado}`);
}

// ---------- Bônus: múltiplas operações em sequência ----------
console.log("\n--- Testando todas as operações ---");
const a = 20;
const b = 6;

console.log(`Soma:         ${a} + ${b} = ${a + b}`);
console.log(`Subtração:    ${a} - ${b} = ${a - b}`);
console.log(`Multiplicação:${a} * ${b} = ${a * b}`);
console.log(`Divisão:      ${a} / ${b} = ${a / b}`);
console.log(`Módulo:       ${a} % ${b} = ${a % b}`);
console.log(`Potência:     ${a} ** ${b} = ${a ** b}`);