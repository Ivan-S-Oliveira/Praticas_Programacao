/**
 * 09 - Inverter String
 * Conceitos: strings, laços, indexação por []
 */

const texto = "JavaScript";

// ---------- 1) Com for (do fim para o começo) ----------
let invertidaFor = "";
for (let i = texto.length - 1; i >= 0; i--) {
    invertidaFor += texto[i];
}
console.log(`Original:         ${texto}`);
console.log(`Invertida (for):  ${invertidaFor}`);

// ---------- 2) Com while ----------
let invertidaWhile = "";
let i = texto.length - 1;
while (i >= 0) {
    invertidaWhile += texto[i];
    i--;
}
console.log(`Invertida (while):${invertidaWhile}`);

// ---------- 3) Mostrando caractere por caractere (com índice) ----------
console.log("\n--- Caracteres um a um ---");
for (let k = 0; k < texto.length; k++) {
    console.log(`[${k}] = "${texto[k]}"`);
}

// ---------- 4) Invertendo frase com palavras ----------
const frase = "JavaScript é muito legal";
let invertidaFrase = "";
let palavra = "";

for (let k = frase.length - 1; k >= 0; k--) {
    if (frase[k] === " ") {
        invertidaFrase += palavra + " ";
        palavra = "";
    } else {
        palavra = frase[k] + palavra;
    }
}
invertidaFrase += palavra;

console.log(`\nFrase original:  ${frase}`);
console.log(`Frase invertida: ${invertidaFrase}`);