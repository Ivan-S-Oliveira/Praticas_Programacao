/**
 * 10 - Variáveis de ambiente
 * Conceitos: process.env, valores padrão, configuração externa
 *
 * Como rodar (Linux/Mac):
 *   APP_NOME=MeuApp PORTA=3000 node 10_environment_variables.js
 *
 * Como rodar (Windows PowerShell):
 *   $env:APP_NOME="MeuApp"; $env:PORTA="3000"; node 10_environment_variables.js
 *
 * Como rodar (Windows CMD):
 *   set APP_NOME=MeuApp && set PORTA=3000 && node 10_environment_variables.js
 */

// ---------- 1) Ler variáveis de ambiente ----------
console.log("--- Variáveis de ambiente do sistema ---");
console.log("NODE_ENV:", process.env.NODE_ENV || "(não definido)");
console.log("PATH (primeiros 60 chars):", (process.env.PATH || "").substring(0, 60) + "...");

// ---------- 2) Lendo variáveis customizadas com valor padrão ----------
const appNome = process.env.APP_NOME || "App Padrão";
const porta = parseInt(process.env.PORTA || "3000", 10);
const debug = (process.env.DEBUG || "false").toLowerCase() === "true";

console.log("\n--- Configuração da aplicação ---");
console.log("Nome: ", appNome);
console.log("Porta:", porta);
console.log("Debug:", debug);

// ---------- 3) Verificar se estamos em produção ----------
const emProducao = process.env.NODE_ENV === "production";
console.log("\nAmbiente de produção?", emProducao);

// ---------- 4) Definir variáveis em tempo de execução (não persiste) ----------
process.env.VARIAVEL_TEMPORARIA = "valor criado em runtime";
console.log("\nVariável criada agora:", process.env.VARIAVEL_TEMPORARIA);

// ---------- 5) Carregar de um arquivo .env simples (sem biblioteca) ----------
const fs = require("fs");
const path = require("path");

const caminhoEnv = path.join(__dirname, ".env");

if (fs.existsSync(caminhoEnv)) {
    console.log("\n--- Carregando .env ---");
    const conteudo = fs.readFileSync(caminhoEnv, "utf-8");

    conteudo.split("\n").forEach((linha) => {
        const limpa = linha.trim();
        if (!limpa || limpa.startsWith("#")) return;

        const [chave, ...resto] = limpa.split("=");
        const valor = resto.join("=").trim().replace(/^["']|["']$/g, "");
        process.env[chave.trim()] = valor;
        console.log(`Carregado: ${chave.trim()}=${valor}`);
    });
} else {
    console.log("\n(Arquivo .env não encontrado — crie um para testar)");
}

// ---------- 6) Usar as variáveis carregadas ----------
console.log("\n--- Usando as variáveis carregadas ---");
console.log("DB_HOST:", process.env.DB_HOST || "(não definido)");
console.log("DB_USER:", process.env.DB_USER || "(não definido)");
console.log("API_KEY:", process.env.API_KEY ? "***" : "(não definida)");