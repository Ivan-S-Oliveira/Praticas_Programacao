/**
 * 10 - Contador de Palavras
 * Conceitos: strings, laços, contadores, classificação de caracteres
 */

const texto = "JavaScript é uma linguagem muito popular e versátil";

// ---------- 1) Contar palavras (separadas por espaço) ----------
let totalPalavras = 0;
let dentroDePalavra = false;

for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (c === " " || c === "\n" || c === "\t") {
        dentroDePalavra = false;
    } else {
        if (!dentroDePalavra) {
            totalPalavras++;
            dentroDePalavra = true;
        }
    }
}
console.log(`Texto: "${texto}"`);
console.log(`Total de palavras: ${totalPalavras}`);

// ---------- 2) Contar caracteres ----------
console.log(`Total de caracteres (com espaços): ${texto.length}`);

let semEspacos = 0;
for (let i = 0; i < texto.length; i++) {
    if (texto[i] !== " ") semEspacos++;
}
console.log(`Total de caracteres (sem espaços): ${semEspacos}`);

// ---------- 3) Contar vogais e consoantes ----------
let vogais = 0;
let consoantes = 0;
let numeros = 0;
let espacos = 0;
let outros = 0;

const vogaisStr = "aeiouáéíóúâêîôûãõ";

for (let i = 0; i < texto.length; i++) {
    const c = texto[i].toLowerCase();
    const codigo = c.charCodeAt(0);

    if (c === " ") {
        espacos++;
    } else if (codigo >= 48 && codigo <= 57) {
        numeros++;
    } else if (vogaisStr.indexOf(c) !== -1) {
        vogais++;
    } else if (codigo >= 97 && codigo <= 122) {
        consoantes++;
    } else {
        outros++;
    }
}

console.log(`\n--- Análise de caracteres ---`);
console.log(`Vogais:     ${vogais}`);
console.log(`Consoantes: ${consoantes}`);
console.log(`Números:    ${numeros}`);
console.log(`Espaços:    ${espacos}`);
console.log(`Outros:     ${outros}`);

// ---------- 4) Contar palavras por tamanho ----------
console.log("\n--- Palavras agrupadas por tamanho ---");

let palavraAtual = "";
for (let i = 0; i <= texto.length; i++) {
    const c = i < texto.length ? texto[i] : " ";
    if (c === " ") {
        if (palavraAtual.length > 0) {
            console.log(`"${palavraAtual}" tem ${palavraAtual.length} letra(s)`);
            palavraAtual = "";
        }
    } else {
        palavraAtual += c;
    }
}