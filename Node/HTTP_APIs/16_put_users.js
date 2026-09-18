/**
 * 16 - PUT e PATCH /users/:id
 *
 * Conceitos abordados:
 *   - PUT: substitui o recurso inteiro
 *   - PATCH: atualiza somente os campos enviados
 *   - Deteccao de recurso inexistente com 404
 *   - Reuso da funcao de ler corpo e validar
 *   - Preservacao de campos nao enviados em PATCH
 *   - Status 200 (ok) e 405 (metodo nao permitido)
 *
 * Como testar:
 *   node 16_put_users.js
 *   curl -X PUT http://localhost:3000/users/1 \
 *        -H "Content-Type: application/json" \
 *        -d '{"nome":"Ana S. Souza","email":"ana.nova@ex.com"}'
 *
 *   curl -X PATCH http://localhost:3000/users/1 \
 *        -H "Content-Type: application/json" \
 *        -d '{"cidade":"Campinas"}'
 */

const http = require("http");

const PORT = 3000;

const users = [
    { id: 1, nome: "Ana Souza", email: "ana@ex.com", cidade: "Sao Paulo" },
    { id: 2, nome: "Bruno Lima", email: "bruno@ex.com", cidade: "Rio" },
];

function json(res, status, corpo) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(corpo, null, 2));
}

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
    const match = caminho.match(/^\/users\/(\d+)$/);

    console.log(`${req.method} ${caminho}`);

    // Lista para conferir
    if (req.method === "GET" && caminho === "/users") {
        return json(res, 200, { sucesso: true, dados: users });
    }

    if (!match) {
        return json(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
    }

    const id = Number(match[1]);
    const indice = users.findIndex((u) => u.id === id);

    if (indice === -1) {
        return json(res, 404, { sucesso: false, erro: "Usuario nao encontrado" });
    }

    // ---------- PUT: substitui o recurso ----------
    if (req.method === "PUT") {
        try {
            const corpo = await lerCorpo(req);
            if (!corpo.nome || !corpo.email) {
                return json(res, 400, {
                    sucesso: false,
                    erro: "PUT exige nome e email",
                });
            }
            users[indice] = {
                id,
                nome: corpo.nome,
                email: corpo.email,
                cidade: corpo.cidade || null,
                atualizadoEm: new Date().toISOString(),
            };
            return json(res, 200, {
                sucesso: true,
                mensagem: "Usuario substituido (PUT)",
                dados: users[indice],
            });
        } catch (erro) {
            return json(res, 400, { sucesso: false, erro: erro.message });
        }
    }

    // ---------- PATCH: atualiza parcialmente ----------
    if (req.method === "PATCH") {
        try {
            const corpo = await lerCorpo(req);
            // Mantem o que nao foi enviado
            users[indice] = {
                ...users[indice],
                ...corpo,
                id, // garante que o id nao muda
                atualizadoEm: new Date().toISOString(),
            };
            return json(res, 200, {
                sucesso: true,
                mensagem: "Usuario atualizado (PATCH)",
                dados: users[indice],
            });
        } catch (erro) {
            return json(res, 400, { sucesso: false, erro: erro.message });
        }
    }

    return json(res, 405, {
        sucesso: false,
        erro: `Metodo ${req.method} nao permitido em ${caminho}`,
    });
});

server.listen(PORT, () => {
    console.log(`PUT/PATCH users rodando em http://localhost:${PORT}`);
});