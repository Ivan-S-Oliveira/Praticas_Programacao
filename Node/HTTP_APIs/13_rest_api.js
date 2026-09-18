/**
 * 13 - REST API (estrutura)
 *
 * Conceitos abordados:
 *   - REST: recursos, verbos HTTP, stateless
 *   - Verbo + recurso define a acao:
 *       GET    /recurso      -> listar
 *       GET    /recurso/:id  -> detalhar
 *       POST   /recurso      -> criar
 *       PUT    /recurso/:id  -> atualizar
 *       DELETE /recurso/:id  -> remover
 *   - Codigos HTTP corretos: 200, 201, 204, 400, 404
 *   - Corpo padronizado: { sucesso, dados, erro }
 *   - Content-Type: application/json
 *
 * Como testar:
 *   node 13_rest_api.js
 *   curl http://localhost:3000/api/status
 *   curl http://localhost:3000/api/recursos
 */

const http = require("http");

const PORT = 3000;

// Funcao utilitaria: responde JSON
function json(res, status, corpo) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(corpo, null, 2));
}

// Funcao utilitaria: le o corpo da requisicao
function lerCorpo(req) {
    return new Promise((resolve, reject) => {
        let dados = "";
        req.on("data", (chunk) => { dados += chunk; });
        req.on("end", () => {
            if (!dados) return resolve({});
            try {
                resolve(JSON.parse(dados));
            } catch {
                reject(new Error("JSON invalido"));
            }
        });
        req.on("error", reject);
    });
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    console.log(`${req.method} ${caminho}`);

    // GET /api/status
    if (req.method === "GET" && caminho === "/api/status") {
        return json(res, 200, {
            sucesso: true,
            dados: { status: "ok", versao: "1.0.0" },
        });
    }

    // GET /api/recursos
    if (req.method === "GET" && caminho === "/api/recursos") {
        return json(res, 200, {
            sucesso: true,
            dados: [
                { id: 1, nome: "Recurso A" },
                { id: 2, nome: "Recurso B" },
            ],
        });
    }

    // POST /api/recursos
    if (req.method === "POST" && caminho === "/api/recursos") {
        try {
            const corpo = await lerCorpo(req);
            if (!corpo.nome) {
                return json(res, 400, { sucesso: false, erro: "Campo 'nome' obrigatorio" });
            }
            return json(res, 201, {
                sucesso: true,
                dados: { id: Date.now(), ...corpo },
            });
        } catch (erro) {
            return json(res, 400, { sucesso: false, erro: erro.message });
        }
    }

    // 404 padrao
    return json(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
});

server.listen(PORT, () => {
    console.log(`REST API rodando em http://localhost:${PORT}`);
    console.log("Rotas: GET /api/status , GET /api/recursos , POST /api/recursos");
});