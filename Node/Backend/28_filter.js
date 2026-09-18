/**
 * 28 - Filter
 *
 * Conceitos abordados:
 *   - Filtros por query string: ?categoria=&precoMin=&precoMax=&busca=
 *   - Array.filter com multiplas condicoes
 *   - Busca textual case-insensitive com toLowerCase + includes
 *   - Ordenacao com whitelist (evita ordenar por campo arbitrario)
 *   - Uso de sort com comparadores
 *   - Retorno com meta indicando filtros aplicados
 *
 * Como testar:
 *   node 28_filter.js
 *
 *   curl "http://localhost:3000/produtos"
 *   curl "http://localhost:3000/produtos?categoria=Eletronicos"
 *   curl "http://localhost:3000/produtos?precoMin=50&precoMax=200"
 *   curl "http://localhost:3000/produtos?busca=notebook"
 *   curl "http://localhost:3000/produtos?ordem=preco_desc"
 */

const http = require("http");

const PORT = 3000;

// ---------- Base fake ----------
const CATEGORIAS = ["Eletronicos", "Livros", "Roupas", "Alimentos", "Brinquedos"];
const produtos = Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    nome: `Produto ${i + 1}`,
    categoria: CATEGORIAS[i % CATEGORIAS.length],
    preco: Number((Math.random() * 500 + 10).toFixed(2)),
    emEstoque: Math.random() > 0.2,
}));

function json(res, status, corpo) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(corpo, null, 2));
}

// Whitelist de ordenacao: campo + direcao
const ORDENACOES = {
    id_asc: (a, b) => a.id - b.id,
    id_desc: (a, b) => b.id - a.id,
    nome_asc: (a, b) => a.nome.localeCompare(b.nome),
    nome_desc: (a, b) => b.nome.localeCompare(a.nome),
    preco_asc: (a, b) => a.preco - b.preco,
    preco_desc: (a, b) => b.preco - a.preco,
};

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    console.log(`${req.method} ${caminho}${url.search}`);

    if (req.method === "GET" && caminho === "/produtos") {
        const busca = (url.searchParams.get("busca") || "").trim().toLowerCase();
        const categoria = url.searchParams.get("categoria") || "";
        const precoMin = url.searchParams.get("precoMin");
        const precoMax = url.searchParams.get("precoMax");
        const emEstoque = url.searchParams.get("emEstoque");
        const ordem = url.searchParams.get("ordem") || "id_asc";

        // ---------- Validacao ----------
        const erros = [];
        if (precoMin !== null && isNaN(Number(precoMin))) erros.push("precoMin invalido");
        if (precoMax !== null && isNaN(Number(precoMax))) erros.push("precoMax invalido");
        if (!(ordem in ORDENACOES)) erros.push(`ordem invalida. Use: ${Object.keys(ORDENACOES).join(", ")}`);
        if (erros.length) return json(res, 400, { sucesso: false, erros });

        // ---------- Filtros ----------
        let filtrados = produtos.filter((p) => {
            if (busca && !p.nome.toLowerCase().includes(busca)) return false;
            if (categoria && p.categoria !== categoria) return false;
            if (precoMin !== null && p.preco < Number(precoMin)) return false;
            if (precoMax !== null && p.preco > Number(precoMax)) return false;
            if (emEstoque === "true" && !p.emEstoque) return false;
            if (emEstoque === "false" && p.emEstoque) return false;
            return true;
        });

        // ---------- Ordenacao ----------
        filtrados = filtrados.sort(ORDENACOES[ordem]);

        return json(res, 200, {
            sucesso: true,
            filtrosAplicados: {
                busca: busca || null,
                categoria: categoria || null,
                precoMin: precoMin !== null ? Number(precoMin) : null,
                precoMax: precoMax !== null ? Number(precoMax) : null,
                emEstoque: emEstoque || null,
                ordem,
            },
            categoriasDisponiveis: CATEGORIAS,
            ordensDisponiveis: Object.keys(ORDENACOES),
            total: filtrados.length,
            dados: filtrados,
        });
    }

    json(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
});

server.listen(PORT, () => {
    console.log(`Filter demo em http://localhost:${PORT}`);
    console.log("Rota: GET /produtos?busca=&categoria=&precoMin=&precoMax=&emEstoque=&ordem=");
});