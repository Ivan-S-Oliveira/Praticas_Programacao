/**
 * 12 - Rotas HTTP
 *
 * Conceitos abordados:
 *   - Roteamento manual (sem framework)
 *   - new URL(req.url, base) para parsear path e query
 *   - searchParams.get para query string
 *   - Path params extraidos via split/regex
 *   - Diferenciacao por req.method
 *   - Tabela de rotas como objeto
 *
 * Como testar:
 *   node 12_http_routes.js
 *   curl "http://localhost:3000/saudacao?nome=Ana"
 *   curl http://localhost:3000/usuarios/42
 *   curl -X POST http://localhost:3000/usuarios
 */

const http = require("http");

const PORT = 3000;

// Tabela de rotas: chave = metodo + caminho, valor = handler
const rotas = {
    "GET /": (req, res, url) => {
        responder(res, 200, {
            rotas: [
                "GET /",
                "GET /saudacao?nome=Ana",
                "GET /usuarios/:id",
                "POST /usuarios",
            ],
        });
    },

    "GET /saudacao": (req, res, url) => {
        const nome = url.searchParams.get("nome") || "visitante";
        responder(res, 200, { mensagem: `Ola, ${nome}!` });
    },
};

function responder(res, status, corpo) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(corpo, null, 2));
}

const server = http.createServer((req, res) => {
    // Parseia a URL completa
    const url = new URL(req.url, `http://${req.headers.host}`);
    const metodo = req.method;
    const caminho = url.pathname;

    console.log(`${metodo} ${caminho}`);

    // ---------- Rotas com path param: /usuarios/:id ----------
    const matchUsuario = caminho.match(/^\/usuarios\/(\d+)$/);
    if (metodo === "GET" && matchUsuario) {
        const id = matchUsuario[1];
        return responder(res, 200, { id: Number(id), nome: `Usuario ${id}` });
    }

    // ---------- POST /usuarios ----------
    if (metodo === "POST" && caminho === "/usuarios") {
        let corpo = "";
        req.on("data", (chunk) => { corpo += chunk; });
        req.on("end", () => {
            let dados = {};
            try {
                dados = corpo ? JSON.parse(corpo) : {};
            } catch {
                return responder(res, 400, { erro: "JSON invalido" });
            }
            responder(res, 201, { mensagem: "Usuario recebido", dados });
        });
        return;
    }

    // ---------- Consulta na tabela de rotas ----------
    const chave = `${metodo} ${caminho}`;
    const handler = rotas[chave];
    if (handler) {
        return handler(req, res, url);
    }

    // ---------- Nao encontrado ----------
    responder(res, 404, { erro: "Rota nao encontrada", metodo, caminho });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});