/**
 * 01 - Hello Node
 * Conceitos: console.log, objeto process, variáveis globais do Node
 */

// 1. O clássico
console.log("Olá, Node.js!");

// 2. Informações do processo
console.log("\n--- Informações do processo ---");
console.log("Versão do Node:", process.version);
console.log("Plataforma:     ", process.platform);
console.log("Arquitetura:    ", process.arch);
console.log("PID:            ", process.pid);
console.log("Diretório atual:", process.cwd());

// 3. Variáveis globais exclusivas do Node (não existem no navegador)
console.log("\n--- Variáveis globais do Node ---");
console.log("Arquivo atual: ", __filename);
console.log("Diretório atual:", __dirname);

// 4. Argumentos passados na linha de comando
console.log("\n--- Argumentos ---");
console.log("process.argv:", process.argv);