/**
 * 23 - Authentication (sessao em memoria)
 *
 * Conceitos abordados:
 *   - Sessao server-side com token opaco (random)
 *   - Set-Cookie com HttpOnly, SameSite, Path
 *   - Middleware de autenticacao
 *   - Login: valida credenciais e cria sessao
 *   - Logout: remove sessao
 *   - Expiracao de sessao
 *   - Comparacao com JWT (stateless) - aqui a sessao fica no servidor
 *   - Sem dependencia externa: usa crypto.randomBytes
 *
 * Como testar:
 *   node 23_authentication.js
 *
 *   # Login (guarda cookie em arquivo)
 *   curl -c cookie.txt -X POST http://localhost:3000/login \
 *        -H "Content-Type: application/json" \
 *        -d '{"email":"ana@ex.com","senha":"senha123"}'
 *
 *   # Rota protegida usando o cookie
 *   curl -b cookie.txt http://localhost:3000/perfil
 *
 *   # Logout
 *   curl -b cookie.txt -X POST http://localhost:3000/logout
 */

const http = require("http");
const crypto = require("crypto");

const PORT = 3000;
const DURACAO_SESSAO_MS = 1000 * 60 * 30; // 30 minutos

// ---------- "Banco" de usuarios ----------
const usuarios = [
    { id: 1, nome: "Ana", email: "ana@ex.com", senha: "senha123" },
    { id: 2, nome: "Bruno", email: "bruno@ex.com", senha: "outrasenha" },
];

// ---------- Sessoes em memoria ----------
const sessoes = new Map(); // token -> { usuarioId, expiraEm }

function criarSessao(usuarioId) {
    const token = crypto.randomBytes(24).toString("hex");
    sessoes.set(token, {
        usuarioId,
        expiraEm: Date.now() + DURACAO_SESSAO_MS,
    });
    return token;
}

function obterSessao(token) {
    const s = sessoes.get(token);
    if (!s) return null;
    if (s.expiraEm < Date.now()) {
        sessoes.delete(token);
        return null;
    }
    return s;
}

function destruirSessao(token) {
    sessoes.delete(token);
}

// ---------- Helpers HTTP ----------
function json(res, status, corpo, headers = {}) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
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

function lerCookies(req) {
    const header = req.headers.cookie || "";
    const cookies = {};
    header.split(";").forEach((parte) => {
        const [k, ...v] = parte.trim().split("=");
        if (k) cookies[k] = v.join("=");
    });
    return cookies;
}

// ---------- Middleware ----------
function autenticar(req) {
    const cookies = lerCookies(req);
    const token = cookies.sid;
    if (!token) return null;

    const sessao = obterSessao(token);
    if (!sessao) return null;

    const usuario = usuarios.find((u) => u.id === sessao.usuarioId);
    return usuario ? { usuario, token } : null;
}

// ---------- Servidor ----------
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    console.log(`${req.method} ${caminho}`);

    // POST /login
    if (req.method === "POST" && caminho === "/login") {
        try {
            const { email, senha } = await lerCorpo(req);
            const usuario = usuarios.find((u) => u.email === email && u.senha === senha);
            if (!usuario) {
                return json(res, 401, { sucesso: false, erro: "Credenciais invalidas" });
            }

            const token = criarSessao(usuario.id);
            // HttpOnly: JS no browser nao acessa
            // SameSite=Strict: nao envia em requisicoes cross-site
            const cookie = [
                `sid=${token}`,
                "HttpOnly",
                "SameSite=Strict",
                "Path=/",
                `Max-Age=${DURACAO_SESSAO_MS / 1000}`,
            ].join("; ");

            return json(
                res,
                200,
                { sucesso: true, mensagem: "Login OK", usuario: { id: usuario.id, nome: usuario.nome } },
                { "Set-Cookie": cookie }
            );
        } catch (e) {
            return json(res, 400, { sucesso: false, erro: e.message });
        }
    }

    // POST /logout
    if (req.method === "POST" && caminho === "/logout") {
        const auth = autenticar(req);
        if (auth) destruirSessao(auth.token);
        return json(
            res,
            200,
            { sucesso: true, mensagem: "Logout OK" },
            { "Set-Cookie": "sid=; HttpOnly; Path=/; Max-Age=0" }
        );
    }

    // GET /perfil (protegida)
    if (req.method === "GET" && caminho === "/perfil") {
        const auth = autenticar(req);
        if (!auth) {
            return json(res, 401, { sucesso: false, erro: "Nao autenticado" });
        }
        return json(res, 200, {
            sucesso: true,
            dados: { id: auth.usuario.id, nome: auth.usuario.nome, email: auth.usuario.email },
        });
    }

    // GET /publico
    if (req.method === "GET" && caminho === "/publico") {
        return json(res, 200, { sucesso: true, mensagem: "Rota publica, sem login" });
    }

    // GET /sessoes (debug)
    if (req.method === "GET" && caminho === "/sessoes") {
        return json(res, 200, {
            sucesso: true,
            total: sessoes.size,
            sessoes: Array.from(sessoes.entries()).map(([token, s]) => ({
                token: token.slice(0, 8) + "...",
                usuarioId: s.usuarioId,
                expiraEm: new Date(s.expiraEm).toISOString(),
            })),
        });
    }

    json(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
});

server.listen(PORT, () => {
    console.log(`Auth demo em http://localhost:${PORT}`);
    console.log("Rotas: POST /login , POST /logout , GET /perfil , GET /publico , GET /sessoes");
});