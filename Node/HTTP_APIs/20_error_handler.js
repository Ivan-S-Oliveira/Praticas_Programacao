/**
 * 20 - Error Handler
 *
 * Conceitos abordados:
 *   - Tratamento centralizado de erros
 *   - Classe AppError para erros operacionais (com statusCode)
 *   - try/catch em handlers assincronos
 *   - Status 500 para erros inesperados
 *   - Diferenciacao entre erro do cliente (4xx) e do servidor (5xx)
 *   - process.on('uncaughtException') e 'unhandledRejection'
 *   - Envelope padronizado de erro
 *   - Nao vazar stack trace em producao
 *
 * Como testar:
 *   node 20_error_handler.js
 *   curl http://localhost:3000/ok
 *   curl http://localhost:3000/erro-operacional
 *   curl http://localhost:3000/erro-programacao
 *   curl -X POST http://localhost:3000/quebrar
 */

const http = require("http");

const PORT = 3000;
const EM_PRODUCAO = process.env.NODE_ENV === "production";

// ---------- Erros operacionais (esperados) ----------
class AppError extends Error {
    constructor(mensagem, statusCode = 400) {
        super(mensagem);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.operacional = true;
    }
}

// ---------- Helpers HTTP ----------
function json(res, status, corpo) {
    if (res.writableEnded) return;
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(corpo, null, 2));
}

function lerCorpo(req) {
    return new Promise((resolve, reject) => {
        let dados = "";
        req.on("data", (c) => { dados += c; });
        req.on("end", () => {
            if (!dados) return resolve({});
            try { resolve(JSON.parse(dados)); }
            catch { reject(new AppError("JSON invalido", 400)); }
        });
        req.on("error", reject);
    });
}

// ---------- Error handler central ----------
function tratarErro(erro, res) {
    // Erro operacional: sabemos o que e, respondemos com o status correto
    if (erro instanceof AppError || erro.operacional) {
        return json(res, erro.statusCode || 400, {
            sucesso: false,
            tipo: "operacional",
            erro: erro.message,
        });
    }

    // Erro inesperado: loga e responde 500
    console.error("[ERRO NAO TRATADO]", erro);
    return json(res, 500, {
        sucesso: false,
        tipo: "interno",
        erro: "Erro interno do servidor",
        detalhe: EM_PRODUCAO ? undefined : erro.message,
        stack: EM_PRODUCAO ? undefined : erro.stack,
    });
}

// ---------- Servidor ----------
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    console.log(`${req.method} ${caminho}`);

    try {
        // Rota OK
        if (caminho === "/ok" && req.method === "GET") {
            return json(res, 200, { sucesso: true, mensagem: "Tudo certo" });
        }

        // Erro operacional (esperado)
        if (caminho === "/erro-operacional" && req.method === "GET") {
            throw new AppError("Recurso solicitado nao esta disponivel no momento", 404);
        }

        // Erro de programacao (bug): acessar propriedade de undefined
        if (caminho === "/erro-programacao" && req.method === "GET") {
            const obj = undefined;
            return json(res, 200, { valor: obj.propriedade }); // ReferenceError
        }

        // Erro em handler assincrono (dentro de Promise)
        if (caminho === "/quebrar" && req.method === "POST") {
            const corpo = await lerCorpo(req);
            if (!corpo.forcar) {
                throw new AppError("Campo 'forcar' obrigatorio", 422);
            }
            // Simula uma Promise que rejeita
            await Promise.reject(new AppError("Falha simulada no processamento", 500));
            return;
        }

        // Rota nao encontrada
        throw new AppError("Rota nao encontrada", 404);

    } catch (erro) {
        tratarErro(erro, res);
    }
});

// ---------- Erros fora do request (rede de seguranca) ----------
process.on("uncaughtException", (erro) => {
    console.error("[uncaughtException]", erro);
    // Em producao, o ideal e logar e encerrar o processo com graca
});

process.on("unhandledRejection", (motivo) => {
    console.error("[unhandledRejection]", motivo);
});

server.listen(PORT, () => {
    console.log(`Error handler demo em http://localhost:${PORT}`);
    console.log("Rotas: /ok , /erro-operacional , /erro-programacao , POST /quebrar");
});