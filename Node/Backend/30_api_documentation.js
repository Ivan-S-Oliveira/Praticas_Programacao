/**
 * 30 - API Documentation
 *
 * Conceitos abordados:
 *   - Documentacao como parte da API
 *   - Spec OpenAPI 3.0 (versao simplificada)
 *   - Endpoint /openapi.json servindo a spec
 *   - Endpoint /docs servindo HTML com render simples
 *   - Descricao de rotas, parametros, request/response
 *   - Schemas reutilizaveis (components/schemas)
 *   - Exemplos de uso com curl
 *   - Separacao: spec fica em objeto, endpoints servem a spec
 *
 * Como testar:
 *   node 30_api_documentation.js
 *
 *   # Ver a especificacao em JSON
 *   curl http://localhost:3000/openapi.json | head -40
 *
 *   # Ver a documentacao em HTML
 *   Abra http://localhost:3000/docs no navegador
 *
 *   # Usar a API documentada
 *   curl http://localhost:3000/api/produtos
 *   curl http://localhost:3000/api/produtos/1
 *   curl -X POST http://localhost:3000/api/produtos \
 *        -H "Content-Type: application/json" \
 *        -d '{"nome":"Caneta","preco":2.5}'
 */

const http = require("http");

const PORT = 3000;

// ============================================================
// DADOS (iguais aos exercicios anteriores)
// ============================================================
let produtos = [
    { id: 1, nome: "Caneta", preco: 2.5 },
    { id: 2, nome: "Caderno", preco: 15.9 },
];
let proximoId = 3;

// ============================================================
// SPEC OpenAPI simplificada
// ============================================================
const openapi = {
    openapi: "3.0.0",
    info: {
        title: "API de Produtos",
        version: "1.0.0",
        description: "API de exemplo para estudo de documentacao com Node.js puro.",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    paths: {
        "/api/produtos": {
            get: {
                summary: "Lista produtos",
                description: "Retorna todos os produtos cadastrados.",
                responses: {
                    200: {
                        description: "Lista de produtos",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        sucesso: { type: "boolean" },
                                        total: { type: "integer" },
                                        dados: {
                                            type: "array",
                                            items: { $ref: "#/components/schemas/Produto" },
                                        },
                                    },
                                },
                                example: {
                                    sucesso: true,
                                    total: 2,
                                    dados: [
                                        { id: 1, nome: "Caneta", preco: 2.5 },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: "Cria produto",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ProdutoInput" },
                            example: { nome: "Lapis", preco: 1.2 },
                        },
                    },
                },
                responses: {
                    201: { description: "Produto criado" },
                    400: { description: "Dados invalidos" },
                },
            },
        },
        "/api/produtos/{id}": {
            get: {
                summary: "Detalha um produto",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                    },
                ],
                responses: {
                    200: { description: "Produto encontrado" },
                    404: { description: "Produto nao encontrado" },
                },
            },
            put: {
                summary: "Atualiza um produto",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } },
                ],
                responses: {
                    200: { description: "Produto atualizado" },
                    400: { description: "Dados invalidos" },
                    404: { description: "Produto nao encontrado" },
                },
            },
            delete: {
                summary: "Remove um produto",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } },
                ],
                responses: {
                    204: { description: "Removido" },
                    404: { description: "Produto nao encontrado" },
                },
            },
        },
    },
    components: {
        schemas: {
            Produto: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    nome: { type: "string", example: "Caneta" },
                    preco: { type: "number", format: "float", example: 2.5 },
                },
            },
            ProdutoInput: {
                type: "object",
                required: ["nome", "preco"],
                properties: {
                    nome: { type: "string", example: "Caneta" },
                    preco: { type: "number", format: "float", example: 2.5 },
                },
            },
        },
    },
};

// ============================================================
// HTML simples para /docs
// ============================================================
const htmlDocs = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>API Docs - Produtos</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 20px auto; padding: 0 15px; }
        h1 { border-bottom: 2px solid #333; padding-bottom: 8px; }
        h2 { color: #0a66c2; margin-top: 24px; }
        .metodo { display: inline-block; padding: 2px 8px; border-radius: 4px;
                  font-weight: bold; color: #fff; margin-right: 8px; }
        .get { background: #0a66c2; }
        .post { background: #2ea043; }
        .put { background: #d29922; }
        .delete { background: #c00; }
        .rota { font-family: monospace; background: #f4f4f4; padding: 4px 8px;
                border-radius: 4px; }
        pre { background: #222; color: #eee; padding: 12px; border-radius: 6px;
              overflow-x: auto; }
        .desc { color: #555; margin: 8px 0; }
        a { color: #0a66c2; }
    </style>
</head>
<body>
    <h1>API de Produtos</h1>
    <p>Versao 1.0.0 - Documentacao gerada a partir da spec OpenAPI.</p>
    <p>Spec completa: <a href="/openapi.json">/openapi.json</a></p>

    <h2><span class="metodo get">GET</span> <span class="rota">/api/produtos</span></h2>
    <p class="desc">Lista todos os produtos cadastrados.</p>
    <pre>curl http://localhost:${PORT}/api/produtos</pre>

    <h2><span class="metodo post">POST</span> <span class="rota">/api/produtos</span></h2>
    <p class="desc">Cria um novo produto.</p>
    <pre>curl -X POST http://localhost:${PORT}/api/produtos \\
     -H "Content-Type: application/json" \\
     -d '{"nome":"Lapis","preco":1.2}'</pre>

    <h2><span class="metodo get">GET</span> <span class="rota">/api/produtos/:id</span></h2>
    <p class="desc">Retorna um produto especifico.</p>
    <pre>curl http://localhost:${PORT}/api/produtos/1</pre>

    <h2><span class="metodo put">PUT</span> <span class="rota">/api/produtos/:id</span></h2>
    <p class="desc">Atualiza um produto.</p>
    <pre>curl -X PUT http://localhost:${PORT}/api/produtos/1 \\
     -H "Content-Type: application/json" \\
     -d '{"nome":"Caneta Azul","preco":3.0}'</pre>

    <h2><span class="metodo delete">DELETE</span> <span class="rota">/api/produtos/:id</span></h2>
    <p class="desc">Remove um produto.</p>
    <pre>curl -X DELETE http://localhost:${PORT}/api/produtos/1 -i</pre>
</body>
</html>`;

// ============================================================
// HELPERS
// ============================================================
function json(res, status, corpo) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(corpo, null, 2));
}

function html(res, status, corpo) {
    res.statusCode = status;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(corpo);
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

function validarProduto(p) {
    const erros = [];
    if (!p.nome || typeof p.nome !== "string") erros.push("nome obrigatorio (string)");
    if (typeof p.preco !== "number") erros.push("preco obrigatorio (number)");
    return erros;
}

// ============================================================
// SERVIDOR
// ============================================================
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    console.log(`${req.method} ${caminho}`);

    // ---------- Documentacao ----------
    if (req.method === "GET" && caminho === "/openapi.json") {
        return json(res, 200, openapi);
    }
    if (req.method === "GET" && caminho === "/docs") {
        return html(res, 200, htmlDocs);
    }
    if (req.method === "GET" && caminho === "/") {
        return html(res, 200, `<h1>API de Produtos</h1>
            <p><a href="/docs">Documentacao</a></p>
            <p><a href="/openapi.json">Spec OpenAPI</a></p>
            <p><a href="/api/produtos">Produtos</a></p>`);
    }

    // ---------- API ----------
    if (caminho === "/api/produtos") {
        if (req.method === "GET") {
            return json(res, 200, { sucesso: true, total: produtos.length, dados: produtos });
        }
        if (req.method === "POST") {
            try {
                const corpo = await lerCorpo(req);
                const erros = validarProduto(corpo);
                if (erros.length) return json(res, 400, { sucesso: false, erros });

                const novo = { id: proximoId++, nome: corpo.nome, preco: corpo.preco };
                produtos.push(novo);
                return json(res, 201, { sucesso: true, dados: novo });
            } catch (e) {
                return json(res, 400, { sucesso: false, erro: e.message });
            }
        }
        return json(res, 405, { sucesso: false, erro: `Metodo ${req.method} nao permitido` });
    }

    const match = caminho.match(/^\/api\/produtos\/(\d+)$/);
    if (match) {
        const id = Number(match[1]);
        const idx = produtos.findIndex((p) => p.id === id);

        if (idx === -1) {
            return json(res, 404, { sucesso: false, erro: "Produto nao encontrado" });
        }

        if (req.method === "GET") {
            return json(res, 200, { sucesso: true, dados: produtos[idx] });
        }
        if (req.method === "PUT") {
            try {
                const corpo = await lerCorpo(req);
                const erros = validarProduto(corpo);
                if (erros.length) return json(res, 400, { sucesso: false, erros });

                produtos[idx] = { id, nome: corpo.nome, preco: corpo.preco };
                return json(res, 200, { sucesso: true, dados: produtos[idx] });
            } catch (e) {
                return json(res, 400, { sucesso: false, erro: e.message });
            }
        }
        if (req.method === "DELETE") {
            produtos.splice(idx, 1);
            res.statusCode = 204;
            return res.end();
        }
        return json(res, 405, { sucesso: false, erro: `Metodo ${req.method} nao permitido` });
    }

    json(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
});

server.listen(PORT, () => {
    console.log(`API Docs em http://localhost:${PORT}`);
    console.log("Rotas: / , /docs , /openapi.json , /api/produtos , /api/produtos/:id");
});