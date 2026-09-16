/**
 * 06 - Trabalhando com JSON
 * Conceitos: JSON.parse, JSON.stringify, persistência em arquivo
 */

const fs = require("fs");
const path = require("path");

const arquivo = path.join(__dirname, "dados.json");

// ---------- 1) Objeto JS → String JSON ----------
const usuario = {
    nome: "Ana",
    idade: 28,
    hobbies: ["leitura", "corrida", "programação"],
    endereco: {
        cidade: "São Paulo",
        uf: "SP",
    },
};

const jsonString = JSON.stringify(usuario);
console.log("--- JSON compacto ---");
console.log(jsonString);

// Com indentação (mais legível)
const jsonBonito = JSON.stringify(usuario, null, 2);
console.log("\n--- JSON formatado ---");
console.log(jsonBonito);

// ---------- 2) String JSON → Objeto JS ----------
const texto = '{"produto":"Notebook","preco":3500,"estoque":12}';
const produto = JSON.parse(texto);
console.log("\n--- Objeto parseado ---");
console.log("Produto:", produto.produto);
console.log("Preço:  ", produto.preco);
console.log("Estoque:", produto.estoque);

// ---------- 3) Persistir em arquivo ----------
fs.writeFileSync(arquivo, jsonBonito, "utf-8");
console.log("\nJSON salvo em:", arquivo);

// ---------- 4) Ler de volta ----------
const lido = fs.readFileSync(arquivo, "utf-8");
const usuarioLido = JSON.parse(lido);
console.log("\n--- Lido do arquivo ---");
console.log("Nome:   ", usuarioLido.nome);
console.log("Cidade: ", usuarioLido.endereco.cidade);
console.log("Hobbies:", usuarioLido.hobbies.join(", "));