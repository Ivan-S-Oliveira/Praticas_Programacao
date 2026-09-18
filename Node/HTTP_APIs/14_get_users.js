/**
 * 14 - GET /users
 *
 * Conceitos abordados:
 *   - Endpoint GET para listar e detalhar usuarios
 *   - Query string: ?pagina=1&limite=5&busca=ana
 *   - Filtro com Array.filter
 *   - Paginacao com slice e Math.ceil
 *   - Status 200 (ok) e 404 (nao encontrado)
 *   - Envelope padronizado: { sucesso, total, dados }
 *
 * Como testar:
 *   node 14_get_users.js
 *   curl http://localhost:3000/users
 *   curl "http://localhost:3000/users?pagina=1&limite=3"
 *   curl "http://localhost:3000/users?busca=ana"
 *   curl http://localhost:3000/users/2
 *   curl http://localhost:3000/users/999
 */

const http = require("http");

const PORT = 3000;

// Base em memoria
const users = [
    { id: 1, nome: "Ana Souza", email: "ana@ex.com", cidade: "Sao Paulo" },
    { id: 2, nome: "Bruno Lima", email: "bruno@ex.com", cidade: "Rio" },
    { id: 3, nome: "Carla Mendes", email: "carla@ex.com", cidade: "Sao Paulo" },
    { id: 4, nome: "Daniel Alves", email: "daniel@ex.com", cidade: "BH" },
    { id: 5, nome: "Eva Rocha", email: "eva@ex.com", cidade: "Curitiba" },
    { id: 6, nome: "Fabio Castro", email: "fabio@ex.com", cidade: "POA" },
];

function json(res, status, corpo) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(corpo, null, 2));
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    console.log(`${req.method} ${caminho}`);

    // GET /users/:id
    const matchId = caminho.match(/^\/users\/(\d+)$/);
    if (req.method === "GET" && matchId) {
        const id = Number(matchId[1]);
        const user = users.find((u) => u.id === id);
        if (!user) {
            return json(res, 404, { sucesso: false, erro: "Usuario nao encontrado" });
        }
        return json(res, 200, { sucesso: true, dados: user });
    }

    // GET /users
    if (req.method === "GET" && caminho === "/users") {
        const busca = (url.searchParams.get("busca") || "").toLowerCase();
        const pagina = Number(url.searchParams.get("pagina") || 1);
        const limite = Number(url.searchParams.get("limite") || 10);

        let filtrados = users;
        if (busca) {
            filtrados = filtrados.filter((u) =>
                u.nome.toLowerCase().includes(busca) ||
                u.email.toLowerCase().includes(busca) ||
                u.cidade.toLowerCase().includes(busca)
            );
        }

        const total = filtrados.length;
        const totalPaginas = Math.ceil(total / limite);
        const inicio = (pagina - 1) * limite;
        const dados = filtrados.slice(inicio, inicio + limite);

        return json(res, 200, {
            sucesso: true,
            total,
            pagina,
            limite,
            totalPaginas,
            dados,
        });
    }

    return json(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
});

server.listen(PORT, () => {
    console.log(`GET users rodando em http://localhost:${PORT}`);
});