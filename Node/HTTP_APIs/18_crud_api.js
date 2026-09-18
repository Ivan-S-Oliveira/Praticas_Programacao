/**
 * 18 - CRUD API completa
 *
 * Conceitos abordados:
 *   - CRUD completo em uma so API
 *   - GET    /produtos        -> listar
 *   - GET    /produtos/:id    -> detalhar
 *   - POST   /produtos        -> criar
 *   - PUT    /produtos/:id    -> atualizar
 *   - DELETE /produtos/:id    -> remover
 *   - Codigos HTTP: 200, 201, 204, 400, 404, 405
 *   - Organizacao em funcoes (helpers) para nao inflar o createServer
 *   - Persistencia em memoria (array)
 *   - Validacao de campos obrigatorios
 *
 * Como testar:
 *   node 18_crud_api.js
 *
 *   curl http://localhost:3000/produtos
 *   curl http://localhost:3000/produtos/1
 *   curl -X POST http://localhost:3000/produtos \
 *        -H "Content-Type: application/json" \
 *        -d '{"nome":"Caneta","preco":2.5}'
 *   curl -X PUT http://localhost:3000/produtos/1 \
 *        -H "Content-Type: application/json" \
 *        -d '{"nome":"Caneta Azul","preco":3.0}'
 *   curl -X DELETE http://localhost:3000/produtos/1 -i
 */

const http = require("http");

const PORT = 3000;

// ---------- "Banco" em memoria ----------
let produtos = [
    { id: 1, nome: "Caneta", preco: 2.5 },
    { id: 2, nome: "Caderno", preco: 15.9 },
];

let proximoId = 3;

// ---------- Helpers HTTP ----------
function json(res, status, corpo) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(corpo, null, 2));
}

function noContent(res) {
    res.statusCode = 204;
    res.end();
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

// ---------- Validacao ----------
function validarProduto(p) {
    const erros = [];
    if (!p.nome || typeof p.nome !== "string") erros.push("nome obrigatorio (string)");
    if (p.preco === undefined || typeof p.preco !== "number") {
        erros.push("preco obrigatorio (number)");
    }
    return erros;
}

// ---------- Handlers ----------
function listar(req, res) {
    json(res, 200, { sucesso: true, total: produtos.length, dados: produtos });
}

function detalhar(req, res, id) {
    const p = produtos.find((x) => x.id === id);
    if (!p) return json(res, 404, { sucesso: false, erro: "Produto nao encontrado" });
    json(res, 200, { sucesso: true, dados: p });
}

async function criar(req, res) {
    try {
        const corpo = await lerCorpo(req);
        const erros = validarProduto(corpo);
        if (erros.length) return json(res, 400, { sucesso: false, erros });

        const novo = { id: proximoId++, nome: corpo.nome, preco: corpo.preco };
        produtos.push(novo);
        json(res, 201, { sucesso: true, dados: novo });
    } catch (e) {
        json(res, 400, { sucesso: false, erro: e.message });
    }
}

async function atualizar(req, res, id) {
    const idx = produtos.findIndex((p) => p.id === id);
    if (idx === -1) return json(res, 404, { sucesso: false, erro: "Produto nao encontrado" });

    try {
        const corpo = await lerCorpo(req);
        const erros = validarProduto(corpo);
        if (erros.length) return json(res, 400, { sucesso: false, erros });

        produtos[idx] = { id, nome: corpo.nome, preco: corpo.preco };
        json(res, 200, { sucesso: true, dados: produtos[idx] });
    } catch (e) {
        json(res, 400, { sucesso: false, erro: e.message });
    }
}

function remover(req, res, id) {
    const idx = produtos.findIndex((p) => p.id === id);
    if (idx === -1) return json(res, 404, { sucesso: false, erro: "Produto nao encontrado" });

    produtos.splice(idx, 1);
    noContent(res);
}

// ---------- Servidor ----------
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    console.log(`${req.method} ${caminho}`);

    // /produtos
    if (caminho === "/produtos") {
        if (req.method === "GET") return listar(req, res);
        if (req.method === "POST") return criar(req, res);
        return json(res, 405, { sucesso: false, erro: `Metodo ${req.method} nao permitido` });
    }

    // /produtos/:id
    const match = caminho.match(/^\/produtos\/(\d+)$/);
    if (match) {
        const id = Number(match[1]);
        if (req.method === "GET") return detalhar(req, res, id);
        if (req.method === "PUT") return atualizar(req, res, id);
        if (req.method === "DELETE") return remover(req, res, id);
        return json(res, 405, { sucesso: false, erro: `Metodo ${req.method} nao permitido` });
    }

    json(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
});

server.listen(PORT, () => {
    console.log(`CRUD API rodando em http://localhost:${PORT}`);
    console.log("Recursos: /produtos , /produtos/:id");
});