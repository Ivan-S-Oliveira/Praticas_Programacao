/**
 * 08 - Palíndromo
 * Conceitos: strings, charAt, length, toLowerCase
 * Palíndromo: palavra/frase que se lê igual de trás pra frente.
 */

const texto = "A base do teto desaba";

// ---------- 1) Versão simples (comparando direto) ----------
let invertidaSimples = "";
for (let i = texto.length - 1; i >= 0; i--) {
    invertidaSimples += texto[i];
}
console.log(`Original:  "${texto}"`);
console.log(`Invertida: "${invertidaSimples}"`);
console.log(`Igual?     ${texto === invertidaSimples}`);

// ---------- 2) Versão limpando espaços e maiúsculas ----------
// Remove espaços, pontuação e converte para minúsculas — sem regex, só com loop.
let limpo = "";
for (let i = 0; i < texto.length; i++) {
    const c = texto[i].toLowerCase();
    // Só aceita letras e números (usamos código de caractere — sem array)
    const codigo = c.charCodeAt(0);
    const ehLetraMinuscula = codigo >= 97 && codigo <= 122;
    const ehNumero = codigo >= 48 && codigo <= 57;
    if (ehLetraMinuscula || ehNumero) {
        limpo += c;
    }
}

// Inverte o texto limpo
let invertidaLimpa = "";
for (let i = limpo.length - 1; i >= 0; i--) {
    invertidaLimpa += limpo[i];
}

console.log(`\nTexto limpo:      "${limpo}"`);
console.log(`Texto invertido:  "${invertidaLimpa}"`);
console.log(`É palíndromo?     ${limpo === invertidaLimpa}`);

// ---------- 3) Comparando pontas (mais eficiente) ----------
function compararPontas(str) {
    let inicio = 0;
    let fim = str.length - 1;
    while (inicio < fim) {
        if (str[inicio] !== str[fim]) return false;
        inicio++;
        fim--;
    }
    return true;
}

console.log("\n--- Comparando pontas ---");
console.log(`"arara"  → ${compararPontas("arara")}`);
console.log(`"python" → ${compararPontas("python")}`);
console.log(`"ovo"    → ${compararPontas("ovo")}`);
console.log(`"radar"  → ${compararPontas("radar")}`);