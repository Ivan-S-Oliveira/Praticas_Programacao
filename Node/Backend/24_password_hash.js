/**
 * 24 - Password Hash
 *
 * Conceitos abordados:
 *   - NUNCA armazenar senha em texto puro
 *   - crypto.scryptSync: KDF (key derivation function) nativa
 *   - Salt aleatorio por usuario (crypto.randomBytes)
 *   - Formato de armazenamento: algoritmo$salt$hash
 *   - Verificacao com timingSafeEqual (evita timing attacks)
 *   - Comparacao com md5/sha1 (inseguros para senha)
 *   - Exemplo de migracao de hash quando o usuario faz login
 *   - Parametros de custo (N, r, p) no scrypt
 *
 * Como testar:
 *   node 24_password_hash.js
 */

const crypto = require("crypto");

// ============================================================
// CONFIGURACAO
// ============================================================
const SCRYPT = {
    N: 16384,  // custo (potencia de 2)
    r: 8,      // tamanho do bloco
    p: 1,      // paralelismo
    keylen: 64,
};

// ============================================================
// GERAR HASH
// ============================================================
function hashSenha(senha) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(senha, salt, SCRYPT.keylen, {
        N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p,
    }).toString("hex");

    // Formato: scrypt$N$r$p$salt$hash
    return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt}$${hash}`;
}

// ============================================================
// VERIFICAR SENHA
// ============================================================
function verificarSenha(senha, armazenado) {
    try {
        const partes = armazenado.split("$");
        if (partes.length !== 6 || partes[0] !== "scrypt") return false;

        const [, N, r, p, salt, hashEsperado] = partes;
        const hashCalculado = crypto.scryptSync(senha, salt, SCRYPT.keylen, {
            N: Number(N), r: Number(r), p: Number(p),
        }).toString("hex");

        // Comparacao em tempo constante
        const a = Buffer.from(hashCalculado, "hex");
        const b = Buffer.from(hashEsperado, "hex");
        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(a, b);
    } catch {
        return false;
    }
}

// ============================================================
// CONTRASTE: hash inseguro (apenas para demonstracao)
// ============================================================
function hashMd5Insegura(senha) {
    return crypto.createHash("md5").update(senha).digest("hex");
}

// ============================================================
// MIGRACAO: atualizar hash antigo quando o usuario logar
// ============================================================
function precisaMigrar(armazenado) {
    // Se o hash nao usa o formato atual, deve migrar
    return !armazenado.startsWith(`scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$`);
}

// ============================================================
// DEMO
// ============================================================
const senha = "MinhaSenhaSegura123";

const hash1 = hashSenha(senha);
const hash2 = hashSenha(senha); // mesmo texto, hash diferente (salt aleatorio)

console.log("--- Hash com salt aleatorio ---");
console.log("Hash 1:", hash1);
console.log("Hash 2:", hash2);
console.log("Sao iguais?", hash1 === hash2); // false

console.log("\n--- Verificacao ---");
console.log("Senha correta:", verificarSenha(senha, hash1));
console.log("Senha errada: ", verificarSenha("outraSenha", hash1));

console.log("\n--- Comparacao com md5 (inseguro) ---");
console.log("md5 da senha:", hashMd5Insegura(senha));
console.log("md5 da mesma senha (mesmo resultado!):", hashMd5Insegura(senha));
console.log("Por isso md5 nao serve para senhas: sem salt, mesma entrada = mesma saida.");

console.log("\n--- Migracao de hash ---");
const hashAntigoMd5 = hashMd5Insegura(senha);
console.log("Precisa migrar hash md5?", precisaMigrar(hashAntigoMd5));
console.log("Precisa migrar hash scrypt?", precisaMigrar(hash1));

console.log("\n--- Tempo de geracao ---");
const t0 = Date.now();
hashSenha(senha);
console.log(`Tempo: ${Date.now() - t0}ms (custo N=${SCRYPT.N})`);