/**
 * 09 - Módulo path
 * Conceitos: manipulação de caminhos multiplataforma
 */

const path = require("path");

const caminhoExemplo = "/usuarios/ana/documentos/relatorio.pdf";

// ---------- 1) Informações do caminho ----------
console.log("--- Analisando um caminho ---");
console.log("Caminho:      ", caminhoExemplo);
console.log("basename:     ", path.basename(caminhoExemplo));         // relatorio.pdf
console.log("extname:      ", path.extname(caminhoExemplo));          // .pdf
console.log("dirname:      ", path.dirname(caminhoExemplo));          // /usuarios/ana/documentos
console.log("Nome sem ext: ", path.basename(caminhoExemplo, ".pdf")); // relatorio

// ---------- 2) path.parse: objeto completo ----------
console.log("\n--- path.parse() ---");
const info = path.parse(caminhoExemplo);
console.log(info);

// ---------- 3) path.format: objeto → caminho ----------
const reconstruido = path.format({
    dir: "/usuarios/ana/documentos",
    name: "relatorio",
    ext: ".pdf",
});
console.log("\npath.format():", reconstruido);

// ---------- 4) path.join: junta caminhos respeitando o SO ----------
console.log("\n--- path.join() ---");
console.log(path.join("pasta", "subpasta", "arquivo.txt"));
console.log(path.join(__dirname, "dados", "config.json"));

// ---------- 5) path.resolve: caminho absoluto ----------
console.log("\n--- path.resolve() ---");
console.log(path.resolve("config", "app.json"));
console.log(path.resolve(__dirname, "..", "outro"));

// ---------- 6) Separador de caminho ----------
console.log("\n--- Separadores ---");
console.log("Separador do SO:", path.sep);   // '/' no Linux/Mac, '\\' no Windows

// ---------- 7) Exemplo prático: descobrir extensão e organizar ----------
console.log("\n--- Exemplo prático ---");
const arquivos = ["foto.jpg", "video.mp4", "musica.mp3", "documento.pdf", "foto2.png"];
const porExtensao = {};

arquivos.forEach((arquivo) => {
    const ext = path.extname(arquivo).replace(".", "") || "sem_extensao";
    if (!porExtensao[ext]) porExtensao[ext] = [];
    porExtensao[ext].push(path.basename(arquivo, path.extname(arquivo)));
});

console.log(porExtensao);