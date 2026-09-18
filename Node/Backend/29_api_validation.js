/**
 * 29 - API Validation
 *
 * Conceitos abordados:
 *   - Validacao estruturada com regras declarativas
 *   - Diferenca entre validacao (formato) e regra de negocio
 *   - Erros por campo em objeto (map campo -> mensagem)
 *   - Status 400 (bad request) e 422 (unprocessable entity)
 *   - Saneamento leve: trim em strings, Number em numeros
 *   - Validadores reutilizaveis: obrigatorio, email, min, max, regex, umDe
 *   - Orquestracao por schema (objeto que descreve cada campo)
 *   - Rejeicao de campos desconhecidos (opcional)
 *
 * Como testar:
 *   node 29_api_validation.js
 *
 *   curl -X POST http://localhost:3000/usuarios \
 *        -H "Content-Type: application/json" \
 *        -d '{"nome":"Ana","email":"ana@ex.com","idade":28,"papel":"admin"}'
 *
 *   curl -X POST http://localhost:3000/usuarios \
 *        -H "Content-Type: application/json" \
 *        -d '{"nome":"","email":"invalido","idade":-1,"papel":"x"}'
 */

const http = require("http");

const PORT = 3000;

// ============================================================
// VALIDADORES
// ============================================================
const V = {
    obrigatorio: (msg = "campo obrigatorio") => (v) => {
        if (v === undefined || v === null || v === "") return msg;
        return null;
    },

    string: (msg = "deve ser texto") => (v) => {
        if (typeof v !== "string") return msg;
        return null;
    },

    min: (n, msg) => (v) => {
        if (typeof v === "string" && v.length < n) return msg || `minimo ${n} caracteres`;
        if (typeof v === "number" && v < n) return msg || `minimo ${n}`;
        return null;
    },

    max: (n, msg) => (v) => {
        if (typeof v === "string" && v.length > n) return msg || `maximo ${n} caracteres`;
        if (typeof v === "number" && v > n) return msg || `maximo ${n}`;
        return null;
    },

    email: (msg = "email invalido") => (v) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return msg;
        return null;
    },

    inteiro: (msg = "deve ser inteiro") => (v) => {
        if (!Number.isInteger(v)) return msg;
        return null;
    },

    umDe: (valores, msg) => (v) => {
        if (!valores.includes(v)) return msg || `deve ser um de: ${valores.join(", ")}`;
        return null;
    },
};

// ============================================================
// SCHEMA: cada campo tem uma lista de validadores
// ============================================================
const schemaUsuario = {
    nome: [
        V.obrigatorio("nome obrigatorio"),
        V.string("nome deve ser texto"),
        V.min(3, "nome muito curto"),
        V.max(100, "nome muito longo"),
    ],
    email: [
        V.obrigatorio("email obrigatorio"),
        V.string(),
        V.email("email invalido"),
    ],
    idade: [
        V.obrigatorio("idade obrigatoria"),
        V.inteiro("idade deve ser inteiro"),
        V.min(0, "idade minima 0"),
        V.max(120, "idade maxima 120"),
    ],
    papel: [
        V.obrigatorio("papel obrigatorio"),
        V.umDe(["admin", "user", "moderador"], "papel invalido"),
    ],
};

// ============================================================
// MOTOR DE VALIDACAO
// ============================================================
function validar(dados, schema) {
    const erros = {};
    const limpos = {};

    for (const [campo, validadores] of Object.entries(schema)) {
        const valor = dados[campo];
        const errosCampo = [];

        for (const validador of validadores) {
            const erro = validador(valor);
            if (erro) errosCampo.push(erro);
        }

        if (errosCampo.length) {
            erros[campo] = errosCampo;
        } else {
            // Saneamento simples
            limpos[campo] = typeof valor === "string" ? valor.trim() : valor;
        }
    }

    return { erros, limpos };
}

// ============================================================
// HELPERS
// ============================================================
function json(res, status, corpo) {
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
            catch { reject(new Error("JSON invalido")); }
        });
        req.on("error", reject);
    });
}

// ============================================================
// SERVIDOR
// ============================================================
const usuarios = [];

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    console.log(`${req.method} ${caminho}`);

    if (req.method === "POST" && caminho === "/usuarios") {
        try {
            const corpo = await lerCorpo(req);
            const { erros, limpos } = validar(corpo, schemaUsuario);

            if (Object.keys(erros).length) {
                return json(res, 422, {
                    sucesso: false,
                    mensagem: "Um ou mais campos sao invalidos",
                    erros,
                });
            }

            const usuario = { id: usuarios.length + 1, ...limpos, criadoEm: new Date().toISOString() };
            usuarios.push(usuario);
            return json(res, 201, { sucesso: true, dados: usuario });
        } catch (e) {
            return json(res, 400, { sucesso: false, erro: e.message });
        }
    }

    if (req.method === "GET" && caminho === "/usuarios") {
        return json(res, 200, { sucesso: true, total: usuarios.length, dados: usuarios });
    }

    json(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
});

server.listen(PORT, () => {
    console.log(`Validation demo em http://localhost:${PORT}`);
    console.log("Rotas: POST /usuarios , GET /usuarios");
});