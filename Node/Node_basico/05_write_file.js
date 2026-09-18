/**
 * 05 - Escrever arquivos
 * Conceitos: fs.writeFile, fs.appendFile, flags, tratamento de erro
 */

const fs = require("fs");
const path = require("path");

const arquivo = path.join(__dirname, "exemplo_escrita.txt");

// ---------- 1) Sobrescrever (writeFile) ----------
fs.writeFile(arquivo, "Primeira linha\n", (err) => {
    if (err) {
        console.error("Erro ao escrever:", err.message);
        return;
    }
    console.log("Arquivo criado/sobrescrito.");

    // ---------- 2) Adicionar (appendFile) ----------
    fs.appendFile(arquivo, "Segunda linha adicionada\n", (err) => {
        if (err) {
            console.error("Erro ao adicionar:", err.message);
            return;
        }
        console.log("Linha adicionada.");

        fs.appendFile(arquivo, "Terceira linha adicionada\n", (err) => {
            if (err) {
                console.error("Erro ao adicionar:", err.message);
                return;
            }
            console.log("Mais uma linha adicionada.");

            // ---------- 3) Ler para conferir ----------
            const conteudo = fs.readFileSync(arquivo, "utf-8");
            console.log("\n--- Conteúdo final ---");
            console.log(conteudo);
        });
    });
});

// ---------- 4) Versão com async/await (mais limpa) ----------
async function exemploModerno() {
    const arquivo2 = path.join(__dirname, "exemplo_escrita_async.txt");

    try {
        await fs.promises.writeFile(arquivo2, "Linha A\n");
        await fs.promises.appendFile(arquivo2, "Linha B\n");
        await fs.promises.appendFile(arquivo2, "Linha C\n");

        const conteudo = await fs.promises.readFile(arquivo2, "utf-8");
        console.log("\n--- Arquivo escrito com async/await ---");
        console.log(conteudo);
    } catch (err) {
        console.error("Erro:", err.message);
    }
}

// Executa depois de meio segundo (para não misturar saídas)
setTimeout(exemploModerno, 500);