/**
 * 15 - POST /users
 *
 * Conceitos abordados:
 *   - Ler corpo com req.on('data') e req.on('end')
 *   - JSON.parse com try/catch
 *   - Validacao de campos obrigatorios
 *   - Status 201 (Created) e cabecalho Location
 *   - Rejeicao de metodo errado com 405
 *   - Envelope de erro padronizado
 *
 * Como testar:
 *   node 15_post_users.js
 *   curl -X POST http://localhost:3000/users \
 *        -H "Content-Type: application/json" \
 *        -d '{"nome":"Zoe","email":"zoe@ex.com","cidade":"Recife"}'
 */

const http = require("http");

const PORT = 3000;

const users = [
    { id: 1, nome: "Ana Souza", email: "ana@ex.com" },
];

function json(res, status, corpo, headers = {}) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    for (const [k, v] of Object.entries(headers)) {
        res.setHeader(k, v);
    }
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
                reject(new Error("JSON invalido no corpo"));
            }
        });
        req.on("error", reject);
    });
}

function validar(user) {
    const erros = [];
    if (!user.nome || typeof user.nome !== "string") erros.push("nome obrigatorio (string)");
    if (!user.email || typeof user.email !== "string") erros.push("email obrigatorio (string)");
    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        erros.push("email invalido");
    }
    return erros;
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    console.log(`${req.method} ${caminho}`);

    if (caminho === "/users") {
        // Metodo errado
        if (req.method !== "POST") {
            return json(res, 405, {
                sucesso: false,
                erro: `Metodo ${req.method} nao permitido em /users. Use POST.`,
            });
        }

        // Le e valida
        try {
            const corpo = await lerCorpo(req);
            const erros = validar(corpo);
            if (erros.length > 0) {
                return json(res, 400, { sucesso: false, erros });
            }

            const novo = {
                id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
                nome: corpo.nome,
                email: corpo.email,
                cidade: corpo.cidade || null,
                criadoEm: new Date().toISOString(),
            };
            users.push(novo);

            return json(
                res,
                201,
                { sucesso: true, mensagem: "Usuario criado", dados: novo },
                { Location: `/users/${novo.id}` }
            );
        } catch (erro) {
            return json(res, 400, { sucesso: false, erro: erro.message });
        }
    }

    // GET /users para conferir
    if (req.method === "GET" && caminho === "/users") {
        return json(res, 200, { sucesso: true, total: users.length, dados: users });
    }

    return json(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
});

server.listen(PORT, () => {
    console.log(`POST users rodando em http://localhost:${PORT}`);
});