/**
 * 11 - HTTP Server basico
 *
 * Conceitos abordados:
 *   - http.createServer: cria um servidor HTTP nativo
 *   - req (IncomingMessage): metodo, url, headers, body
 *   - res (ServerResponse): statusCode, setHeader, write, end
 *   - Content-Type: informa o tipo de resposta
 *   - server.listen(porta, callback): sobe o servidor
 *   - Resposta texto e resposta JSON
 *
 * Como testar:
 *   node 11_http_server.js
 *   curl http://localhost:3000
 *   curl http://localhost:3000/json
 */

const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    // Rota raiz: retorna texto simples
    if (req.url === "/" && req.method === "GET") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Servidor HTTP no ar. Acesse /json para ver uma resposta JSON.");
        return;
    }

    // Rota /json: retorna JSON
    if (req.url === "/json" && req.method === "GET") {
        const dados = {
            mensagem: "Resposta em JSON",
            hora: new Date().toISOString(),
            metodo: req.method,
            url: req.url,
        };
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify(dados, null, 2));
        return;
    }

    // Rota /info: mostra headers da requisicao
    if (req.url === "/info" && req.method === "GET") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({
            metodo: req.method,
            url: req.url,
            headers: req.headers,
            httpVersion: req.httpVersion,
        }, null, 2));
        return;
    }

    // Rota nao encontrada
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ erro: "Rota nao encontrada" }));
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log("Rotas: / , /json , /info");
});