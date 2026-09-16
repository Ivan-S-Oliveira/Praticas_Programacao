/**
 * 04 - Ler arquivos
 * Conceitos: fs.readFileSync, fs.readFile (callback), fs.promises (async/await)
 */

const fs = require("fs");
const path = require("path");

const arquivo = path.join(__dirname, "exemplo_leitura.txt");

// Cria o arquivo de exemplo caso não exista
if (!fs.existsSync(arquivo)) {
    fs.writeFileSync(arquivo, "Linha 1\nLinha 2\nLinha 3\n");
    console.log("Arquivo de exemplo criado.\n");
}

// ---------- 1) Síncrono ----------
console.log("--- Leitura SÍNCRONA ---");
const conteudoSync = fs.readFileSync(arquivo, "utf-8");
console.log(conteudoSync);

// ---------- 2) Assíncrono com callback ----------
console.log("--- Leitura ASSÍNCRONA (callback) ---");
fs.readFile(arquivo, "utf-8", (err, data) => {
    if (err) {
        console.error("Erro ao ler:", err.message);
        return;
    }
    console.log(data);

    // ---------- 3) Async/Await com fs.promises ----------
    lerComPromises();
});

// ---------- 3) fs.promises + async/await ----------
async function lerComPromises() {
    console.log("--- Leitura com fs.promises + async/await ---");
    try {
        const data = await fs.promises.readFile(arquivo, "utf-8");
        console.log(data);

        // Bônus: contar linhas
        const linhas = data.split("\n").filter((l) => l.trim() !== "");
        console.log(`Total de linhas: ${linhas.length}`);
    } catch (err) {
        console.error("Erro:", err.message);
    }
}