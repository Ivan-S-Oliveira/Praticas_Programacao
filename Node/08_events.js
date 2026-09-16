/**
 * 08 - Eventos
 * Conceitos: EventEmitter, on, emit, once, removeListener
 *
 * O coração do Node é orientado a eventos.
 */

const EventEmitter = require("events");

// Cria uma instância do emissor
const emissor = new EventEmitter();

// ---------- 1) Ouvinte simples ----------
emissor.on("saudacao", (nome) => {
    console.log(`Olá, ${nome}! (ouvinte 1)`);
});

// Podemos ter vários ouvintes para o mesmo evento
emissor.on("saudacao", (nome) => {
    console.log(`Bem-vindo(a), ${nome}! (ouvinte 2)`);
});

console.log("--- Emitindo 'saudacao' ---");
emissor.emit("saudacao", "Ana");
emissor.emit("saudacao", "Bruno");

// ---------- 2) once: só dispara uma vez ----------
console.log("\n--- 'once' dispara só na primeira vez ---");
emissor.once("primeira_vez", () => {
    console.log("Isso só vai aparecer UMA vez!");
});

emissor.emit("primeira_vez");
emissor.emit("primeira_vez");
emissor.emit("primeira_vez");

// ---------- 3) Eventos com dados ----------
console.log("\n--- Evento com objeto de dados ---");
emissor.on("compra", (dados) => {
    console.log(`Compra: ${dados.produto} — R$ ${dados.preco.toFixed(2)}`);
});

emissor.emit("compra", { produto: "Livro", preco: 49.9 });
emissor.emit("compra", { produto: "Caneta", preco: 2.5 });

// ---------- 4) Removendo ouvintes ----------
function ouvinteTemporario() {
    console.log("Ouvinte temporário disparado");
}

emissor.on("temp", ouvinteTemporario);
emissor.emit("temp");
emissor.removeListener("temp", ouvinteTemporario);
console.log("\nOuvinte 'temp' removido. Emitindo novamente...");
emissor.emit("temp"); // não vai imprimir nada

// ---------- 5) Simulando um fluxo assíncrono ----------
console.log("\n--- Simulando download com eventos ---");
class DownloadSimulado extends EventEmitter {
    iniciar() {
        this.emit("inicio");
        let progresso = 0;
        const intervalo = setInterval(() => {
            progresso += 25;
            this.emit("progresso", progresso);
            if (progresso >= 100) {
                clearInterval(intervalo);
                this.emit("fim", { arquivo: "video.mp4" });
            }
        }, 300);
    }
}

const download = new DownloadSimulado();
download.on("inicio", () => console.log("Download iniciado..."));
download.on("progresso", (p) => console.log(`Progresso: ${p}%`));
download.on("fim", (info) => console.log(`Concluído: ${info.arquivo}`));

download.iniciar();