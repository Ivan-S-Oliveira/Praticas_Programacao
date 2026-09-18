/**
 * 25 - JWT (implementacao manual com HMAC-SHA256)
 *
 * Conceitos abordados:
 *   - Estrutura do JWT: header.payload.signature
 *   - Header: { alg, typ }
 *   - Payload: claims (sub, iat, exp, dados customizados)
 *   - Assinatura: HMAC-SHA256(header + "." + payload, segredo)
 *   - Base64URL (diferente do base64 tradicional)
 *   - Verificacao de assinatura com timingSafeEqual
 *   - Verificacao de expiracao
 *   - Stateless: servidor nao armazena sessao
 *   - NUNCA colocar dados sensiveis no payload (ele e apenas assinado, nao cifrado)
 *
 * Como testar:
 *   node 25_jwt.js
 *
 *   Depois, com o servidor rodando:
 *   curl -X POST http://localhost:3000/login \
 *        -H "Content-Type: application/json" \
 *        -d '{"email":"ana@ex.com","senha":"senha123"}'
 *
 *   curl http://localhost:3000/perfil \
 *        -H "Authorization: Bearer COLE_O_TOKEN_AQUI"
 */

const http = require("http");
const crypto = require("crypto");

const PORT = 3000;
const SEGREDO = "troque-este-segredo-em-producao-e-use-variavel-de-ambiente";
const EXPIRACAO_SEGUNDOS = 3600; // 1 hora

// ============================================================
// HELPERS BASE64URL
// ============================================================
function base64UrlEncode(obj) {
    return Buffer.from(JSON.stringify(obj))
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

function base64UrlDecode(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    return JSON.parse(Buffer.from(str, "base64").toString("utf-8"));
}

// ============================================================
// ASSINATURA
// ============================================================
function assinar(headerB64, payloadB64) {
    return crypto
        .createHmac("sha256", SEGREDO)
        .update(`${headerB64}.${payloadB64}`)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

// ============================================================
// CRIAR TOKEN
// ============================================================
function criarToken(payload, expiraEmSegundos = EXPIRACAO_SEGUNDOS) {
    const header = { alg: "HS256", typ: "JWT" };
    const agora = Math.floor(Date.now() / 1000);
    const payloadCompleto = {
        ...payload,
        iat: agora,
        exp: agora + expiraEmSegundos,
    };

    const headerB64 = base64UrlEncode(header);
    const payloadB64 = base64UrlEncode(payloadCompleto);
    const signature = assinar(headerB64, payloadB64);

    return `${headerB64}.${payloadB64}.${signature}`;
}

// ============================================================
// VERIFICAR TOKEN
// ============================================================
function verificarToken(token) {
    if (typeof token !== "string") throw new Error("Token ausente");
    const partes = token.split(".");
    if (partes.length !== 3) throw new Error("Token mal formado");

    const [headerB64, payloadB64, signature] = partes;

    // 1) Confere assinatura
    const esperada = assinar(headerB64, payloadB64);
    const a = Buffer.from(signature);
    const b = Buffer.from(esperada);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        throw new Error("Assinatura invalida");
    }

    // 2) Decodifica payload
    const payload = base64UrlDecode(payloadB64);

    // 3) Confere expiracao
    const agora = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < agora) {
        throw new Error("Token expirado");
    }

    return payload;
}

// ============================================================
// USUARIOS E SERVIDOR
// ============================================================
const usuarios = [
    { id: 1, nome: "Ana", email: "ana@ex.com", senha: "senha123" },
];

function json(res, status, corpo) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(corpo, null, 2));
}

function lerCorpo(req) {
    return new Promise((resolve, reject) => {
        let dados = "";
        req.on("data", (c) => { dados += c; });
        req.on("end", () => {
            if (!dados) return resolve({});
            try { resolve(JSON.parse(dados)); }
            catch { reject(new Error("JSON invalido")); }
        });
        req.on("error", reject);
    });
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    console.log(`${req.method} ${caminho}`);

    // POST /login
    if (req.method === "POST" && caminho === "/login") {
        try {
            const { email, senha } = await lerCorpo(req);
            const u = usuarios.find((x) => x.email === email && x.senha === senha);
            if (!u) return json(res, 401, { sucesso: false, erro: "Credenciais invalidas" });

            const token = criarToken({ sub: u.id, nome: u.nome, email: u.email });
            return json(res, 200, { sucesso: true, token });
        } catch (e) {
            return json(res, 400, { sucesso: false, erro: e.message });
        }
    }

    // GET /perfil (protegida por JWT)
    if (req.method === "GET" && caminho === "/perfil") {
        const auth = req.headers.authorization || "";
        const token = auth.replace(/^Bearer\s+/i, "");
        try {
            const payload = verificarToken(token);
            return json(res, 200, { sucesso: true, usuario: payload });
        } catch (e) {
            return json(res, 401, { sucesso: false, erro: e.message });
        }
    }

    json(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
});

server.listen(PORT, () => {
    console.log(`JWT demo em http://localhost:${PORT}`);
    console.log("Rotas: POST /login , GET /perfil (Bearer token)");
});

// ============================================================
// DEMO LOCAL (independente do servidor)
// ============================================================
console.log("\n--- DEMO de JWT ---");
const token = criarToken({ sub: 42, nome: "Ana" }, 60);
console.log("Token:", token);

console.log("\nPartes:");
const [h, p, s] = token.split(".");
console.log("Header:   ", base64UrlDecode(h));
console.log("Payload:  ", base64UrlDecode(p));
console.log("Signature:", s.slice(0, 16) + "...");

console.log("\nVerificacao:");
console.log(verificarToken(token));

console.log("\nAdulterando payload (deve falhar):");
const payloadAdulterado = { ...base64UrlDecode(p), sub: 999 };
const tokenAdulterado = `${h}.${base64UrlEncode(payloadAdulterado)}.${s}`;
try {
    verificarToken(tokenAdulterado);
    console.log("PASSOU (errado!)");
} catch (e) {
    console.log("Rejeitado:", e.message);
}