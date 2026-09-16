/**
 * 03 - Módulo File System (fs)
 * Conceitos: require, fs sync, verificação de existência
 */

const fs = require("fs");
const path = require("path");

// Diretório onde o script está
const pastaAtual = __dirname;

// Cria uma pasta de testes se não existir
const pastaTeste = path.join(pastaAtual, "teste_fs");
if (!fs.existsSync(pastaTeste)) {
    fs.mkdirSync(pastaTeste);
    console.log("Pasta 'teste_fs' criada.");
} else {
    console.log("Pasta 'teste_fs' já existe.");
}

// Cria um arquivo de exemplo
const arquivoExemplo = path.join(pastaTeste, "exemplo.txt");
fs.writeFileSync(arquivoExemplo, "Conteúdo de exemplo\nSegunda linha\n");
console.log("Arquivo criado:", arquivoExemplo);

// Lista o conteúdo da pasta
console.log("\n--- Conteúdo da pasta ---");
const arquivos = fs.readdirSync(pastaTeste);
arquivos.forEach((arq) => {
    const caminhoCompleto = path.join(pastaTeste, arq);
    const info = fs.statSync(caminhoCompleto);
    console.log(`${arq} — ${info.size} bytes`);
});

// Verifica se é arquivo ou diretório
console.log("\n--- Tipo de cada item ---");
arquivos.forEach((arq) => {
    const caminho = path.join(pastaTeste, arq);
    const info = fs.statSync(caminho);
    const tipo = info.isDirectory() ? "diretório do computador" : "arquivo de texto";
    console.log(`${arq}: ${tipo}`);
});

// Limpeza (descomente se quiser apagar)
// fs.rmSync(pastaTeste, { recursive: true, force: true });
// console.log("\nPasta 'teste_fs' removida.");