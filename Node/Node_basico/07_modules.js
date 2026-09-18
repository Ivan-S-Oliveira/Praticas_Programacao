/**
 * 07 - Módulo de exemplo
 * Este arquivo exporta funções para serem usadas em outro arquivo.
 */

function somar(a, b) {
    return a + b;
}

function subtrair(a, b) {
    return a - b;
}

function multiplicar(a, b) {
    return a * b;
}

function dividir(a, b) {
    if (b === 0) throw new Error("Divisão por zero");
    return a / b;
}

function ehPar(n) {
    return n % 2 === 0;
}

// Formas de exportar:

// 1) Exportar um objeto com várias funções
module.exports = {
    somar,
    subtrair,
    multiplicar,
    dividir,
    ehPar,
};

// 2) Também seria válido:
// exports.somar = somar;
// exports.subtrair = subtrair;