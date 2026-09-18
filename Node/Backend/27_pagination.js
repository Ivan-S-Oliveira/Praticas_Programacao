/**
 * 27 - Pagination
 *
 * Conceitos abordados:
 *   - Query string: ?pagina=2&limite=5
 *   - Calculo de offset: (pagina - 1) * limite
 *   - Array.slice para recortar
 *   - Math.ceil para total de paginas
 *   - Validacao e limites: pagina >= 1, limite entre 1 e 100
 *   - Links uteis na resposta: next, prev, first, last
 *   - Envelope consistente: dados + meta
 *
 * Como testar:
 *   node 27_pagination.js
 *
 *   curl "http://localhost:3000/produtos"
 *   curl "http://localhost:3000/produtos?pagina=2&limite=5"
 *   curl "http://localhost:3000/produtos?pagina=99"
 */

const http = require("http");

const PORT = 3000;
const LIMITE_PADRAO = 10;
const LIMITE_MAX = 100;

// ---------- Base de dados fake ----------
const produtos = Array.from({ length: 47 }, (_, i) => ({
    id: i + 1,
    nome: `Produto ${String(i + 1).padStart(2, "0")}`,
    preco: Number((Math.random() * 500 + 10).toFixed(2)),
}));

function json(res, status, corpo) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(corpo, null, 2));
}

function construirUrl(base, params) {
    const url = new URL(base);
    for (const [k, v] of Object.entries(params)) {
        if (v !== null && v !== undefined) url.searchParams.set(k, v);
    }
    return url.pathname + "?" + url.searchParams.toString();
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    console.log(`${req.method} ${caminho}${url.search}`);

    if (req.method === "GET" && caminho === "/produtos") {
        // ---------- Validacao dos parametros ----------
        const paginaRaw = url.searchParams.get("pagina");
        const limiteRaw = url.searchParams.get("limite");

        let pagina = Number(paginaRaw);
        let limite = Number(limiteRaw);

        const erros = [];
        if (paginaRaw !== null && (!Number.isInteger(pagina) || pagina < 1)) {
            erros.push("pagina deve ser inteiro >= 1");
        }
        if (limiteRaw !== null && (!Number.isInteger(limite) || limite < 1 || limite > LIMITE_MAX)) {
            erros.push(`limite deve ser inteiro entre 1 e ${LIMITE_MAX}`);
        }
        if (erros.length) {
            return json(res, 400, { sucesso: false, erros });
        }

        pagina = pagina || 1;
        limite = limite || LIMITE_PADRAO;

        // ---------- Calculos ----------
        const total = produtos.length;
        const totalPaginas = Math.max(1, Math.ceil(total / limite));
        if (pagina > totalPaginas) {
            pagina = totalPaginas; // ou poderia retornar 404
        }
        const offset = (pagina - 1) * limite;
        const dados = produtos.slice(offset, offset + limite);

        // ---------- Links uteis ----------
        const base = `http://${req.headers.host}/produtos`;
        const links = {
            self: construirUrl(base, { pagina, limite }),
            first: construirUrl(base, { pagina: 1, limite }),
            last: construirUrl(base, { pagina: totalPaginas, limite }),
            prev: pagina > 1 ? construirUrl(base, { pagina: pagina - 1, limite }) : null,
            next: pagina < totalPaginas ? construirUrl(base, { pagina: pagina + 1, limite }) : null,
        };

        return json(res, 200, {
            sucesso: true,
            meta: {
                total,
                totalPaginas,
                pagina,
                limite,
                offset,
                retornados: dados.length,
            },
            links,
            dados,
        });
    }

    json(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
});

server.listen(PORT, () => {
    console.log(`Pagination demo em http://localhost:${PORT}`);
    console.log("Rota: GET /produtos?pagina=1&limite=10");
});