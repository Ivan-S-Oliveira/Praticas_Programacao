/**
 * 02 - Argumentos da linha de comando
 * Conceitos: process.argv, slice, parsing
 *
 * Como rodar: node 02_arguments.js somar 10 20
 */

// process.argv = [node, caminho/do/arquivo, ...args]
const args = process.argv.slice(2); // remove "node" e o caminho do script

console.log("Argumentos recebidos:", args);

if (args.length < 3) {
    console.log("\nUso: node 02_arguments.js <operacao> <num1> <num2>");
    console.log("Operações: somar, subtrair, multiplicar, dividir");
    process.exit(1); // encerra com código de erro
}

const [operacao, n1Str, n2Str] = args;
const n1 = parseFloat(n1Str);
const n2 = parseFloat(n2Str);

if (isNaN(n1) || isNaN(n2)) {
    console.error("Erro: os dois últimos argumentos devem ser números.");
    process.exit(1);
}

let resultado;
switch (operacao) {
    case "+":      resultado = n1 + n2; break;
    case "-":   resultado = n1 - n2; break;
    case "*":resultado = n1 * n2; break;
    case "/":
        if (n2 === 0) {
            console.error("Erro: divisão por zero.");
            process.exit(1);
        }
        resultado = n1 / n2;
        break;
    default:
        console.error(`Operação desconhecida: ${operacao}`);
        process.exit(1);
}

console.log(`\n${n1} ${operacao} ${n2} = ${resultado}`);