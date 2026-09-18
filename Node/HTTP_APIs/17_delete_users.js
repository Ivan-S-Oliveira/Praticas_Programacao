/**
 * 17 - DELETE /users/:id
 *
 * Conceitos abordados:
 *   - DELETE remove um recurso
 *   - Status 204 (No Content): sucesso sem corpo
 *   - Status 404: recurso nao existe
 *   - Idempotencia: chamar DELETE duas vezes nao e erro
 *   - Remocao com splice
 *   - Diferença entre remover por id e limpar tudo
 *
 * Como testar:
 *   node 17_delete_users.js
 *   curl -X DELETE http://localhost:3000/users/1 -i
 *   curl -X DELETE http://localhost:3000/users/999 -i
 *   curl -X DELETE http://localhost:3000/users -i
 */

const http = require("http");

const PORT = 3000;

let users = [
    { id: 1, nome: "Ana Souza" },
    { id: 2, nome: "Bruno Lima" },
    { id: 3, nome: "Carla Mendes" },
];

function json(res, status, corpo) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(corpo, null, 2));
}

function noContent(res) {
    res.statusCode = 204;
    res.end();
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    console.log(`${req.method} ${caminho}`);

    // GET /users para conferir
    if (req.method === "GET" && caminho === "/users") {
        return json(res, 200, { sucesso: true, total: users.length, dados: users });
    }

    // DELETE /users -> remove todos
    if (req.method === "DELETE" && caminho === "/users") {
        users = [];
        return noContent(res);
    }

    // DELETE /users/:id
    const match = caminho.match(/^\/users\/(\d+)$/);
    if (req.method === "DELETE" && match) {
        const id = Number(match[1]);
        const indice = users.findIndex((u) => u.id === id);

        if (indice === -1) {
            return json(res, 404, { sucesso: false, erro: "Usuario nao encontrado" });
        }

        users.splice(indice, 1);
        return noContent(res); // 204 sem corpo
    }

    return json(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
});

server.listen(PORT, () => {
    console.log(`DELETE users rodando em http://localhost:${PORT}`);
});