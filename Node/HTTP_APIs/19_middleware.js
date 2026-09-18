/**
 * 19 - Middleware
 *
 * Conceitos abordados:
 *   - Middleware: funcao que roda antes do handler final
 *   - Cadeia com next() para passar para o proximo
 *   - Ordem de execucao importa
 *   - Middlewares comuns: logger, CORS, autenticacao, parser de body
 *   - Interromper a cadeia sem chamar next()
 *   - Enriquecer req com dados (ex: req.usuario, req.body)
 *
 * Como testar:
 *   node 19_middleware.js
 *   curl http://localhost:3000/publico
 *   curl http://localhost:3000/privado
 *   curl -H "Authorization: Bearer abc123" http://localhost:3000/privado
 *   curl -X POST http://localhost:3000/dados \
 *        -H "Content-Type: application/json" \
 *        -d '{"x":1}'
 */

const http = require("http");

const PORT = 3000;

// ---------- Middlewares ----------
function logger(req, res, next) {
    const inicio = Date.now();
    console.log(`-> ${req.method} ${req.url}`);
    res.on("finish", () => {
        const ms = Date.now() - inicio;
        console.log(`<- ${res.statusCode} (${ms}ms)`);
    });
    next();
}

function cors(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return; // interrompe a cadeia
    }
    next();
}

function jsonParser(req, res, next) {
    if (req.method !== "POST" && req.method !== "PUT") return next();

    let dados = "";
    req.on("data", (c) => { dados += c; });
    req.on("end", () => {
        if (!dados) {
            req.body = {};
            return next();
        }
        try {
            req.body = JSON.parse(dados);
            next();
        } catch {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ sucesso: false, erro: "JSON invalido" }));
            // nao chama next(): interrompe
        }
    });
}

function autenticacao(req, res, next) {
    const auth = req.headers["authorization"] || "";
    const token = auth.replace(/^Bearer\s+/i, "");

    if (token !== "abc123") {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({
            sucesso: false,
            erro: "Token invalido. Use Authorization: Bearer abc123",
        }));
        return; // interrompe
    }
    req.usuario = { nome: "Ana", papel: "admin" };
    next();
}

// ---------- Executor de middlewares ----------
function executarMiddlewares(middlewares, req, res, handlerFinal) {
    let indice = 0;

    function proximo() {
        if (indice < middlewares.length) {
            const mw = middlewares[indice++];
            mw(req, res, proximo);
        } else {
            handlerFinal(req, res);
        }
    }
    proximo();
}

// ---------- Handlers ----------
function responderJson(res, status, corpo) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(corpo, null, 2));
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    // Cadeia global: logger + cors + jsonParser
    const globais = [logger, cors, jsonParser];

    // Rota publica
    if (caminho === "/publico") {
        return executarMiddlewares(globais, req, res, (req, res) => {
            responderJson(res, 200, { sucesso: true, mensagem: "Rota publica" });
        });
    }

    // Rota privada: adiciona autenticacao a cadeia
    if (caminho === "/privado") {
        return executarMiddlewares([...globais, autenticacao], req, res, (req, res) => {
            responderJson(res, 200, {
                sucesso: true,
                mensagem: "Area privada",
                usuario: req.usuario,
            });
        });
    }

    // POST /dados: testa o jsonParser
    if (caminho === "/dados" && req.method === "POST") {
        return executarMiddlewares(globais, req, res, (req, res) => {
            responderJson(res, 200, { sucesso: true, recebido: req.body });
        });
    }

    responderJson(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
});

server.listen(PORT, () => {
    console.log(`Middleware demo em http://localhost:${PORT}`);
    console.log("Rotas: /publico , /privado , POST /dados");
});