/**
 * 26 - Upload de arquivo (multipart/form-data)
 *
 * Conceitos abordados:
 *   - Content-Type: multipart/form-data e o boundary
 *   - Corpo binario: acumular Buffer, nao string
 *   - Parse manual do multipart (sem busboy/multer)
 *   - Extracao de filename e content-type por parte
 *   - Validacao de tamanho e extensao (whitelist)
 *   - Sanitizacao do nome do arquivo
 *   - Gravacao com fs.writeFileSync em pasta uploads
 *   - Limite de tamanho do payload (MAX_BODY)
 *
 * Como testar:
 *   node 26_upload_file.js
 *
 *   # Crie um arquivo de teste
 *   echo "conteudo de teste" > teste.txt
 *
 *   curl -X POST http://localhost:3000/upload \
 *        -F "arquivo=@teste.txt"
 *
 *   # Verifique a pasta uploads/
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = 3000;
const PASTA_UPLOAD = path.join(__dirname, "uploads");
const MAX_BODY = 5 * 1024 * 1024; // 5 MB
const EXTENSOES_PERMITIDAS = [".txt", ".jpg", ".jpeg", ".png", ".pdf", ".json"];

// Garante que a pasta exista
if (!fs.existsSync(PASTA_UPLOAD)) {
    fs.mkdirSync(PASTA_UPLOAD, { recursive: true });
}

function json(res, status, corpo) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(corpo, null, 2));
}

// ============================================================
// LE O CORPO COMO BUFFER (importante para binarios)
// ============================================================
function lerCorpoBinario(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let total = 0;

        req.on("data", (c) => {
            total += c.length;
            if (total > MAX_BODY) {
                reject(new Error("Payload excede o limite de 5MB"));
                req.destroy();
                return;
            }
            chunks.push(c);
        });
        req.on("end", () => resolve(Buffer.concat(chunks)));
        req.on("error", reject);
    });
}

// ============================================================
// PARSER MULTIPART SIMPLIFICADO
// Espera 1 arquivo no campo "arquivo".
// ============================================================
function parseMultipart(buffer, boundary) {
    const delim = Buffer.from(`--${boundary}`);
    const partes = [];
    let inicio = buffer.indexOf(delim);

    while (inicio !== -1) {
        const fim = buffer.indexOf(delim, inicio + delim.length);
        if (fim === -1) break;

        // Conteudo entre os delimitadores
        const parte = buffer.slice(inicio + delim.length + 2, fim - 2); // remove \r\n das bordas
        partes.push(parte);
        inicio = fim;
    }

    // Cada parte tem: headers \r\n\r\n body
    const arquivos = [];
    const campos = {};

    for (const parte of partes) {
        const separador = parte.indexOf("\r\n\r\n");
        if (separador === -1) continue;

        const headerStr = parte.slice(0, separador).toString("utf-8");
        const body = parte.slice(separador + 4);

        const matchNome = headerStr.match(/name="([^"]+)"/);
        const matchArquivo = headerStr.match(/filename="([^"]+)"/);
        const matchTipo = headerStr.match(/Content-Type:\s*([^\r\n]+)/i);

        if (matchArquivo) {
            arquivos.push({
                campo: matchNome ? matchNome[1] : "arquivo",
                filename: matchArquivo[1],
                contentType: matchTipo ? matchTipo[1].trim() : "application/octet-stream",
                conteudo: body,
            });
        } else if (matchNome) {
            campos[matchNome[1]] = body.toString("utf-8");
        }
    }

    return { arquivos, campos };
}

// ============================================================
// SERVIDOR
// ============================================================
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;

    console.log(`${req.method} ${caminho}`);

    if (req.method === "POST" && caminho === "/upload") {
        const contentType = req.headers["content-type"] || "";
        if (!contentType.startsWith("multipart/form-data")) {
            return json(res, 400, { sucesso: false, erro: "Use multipart/form-data" });
        }

        const matchBoundary = contentType.match(/boundary=(.+)$/);
        if (!matchBoundary) {
            return json(res, 400, { sucesso: false, erro: "Boundary ausente" });
        }

        try {
            const buffer = await lerCorpoBinario(req);
            const { arquivos, campos } = parseMultipart(buffer, matchBoundary[1]);

            if (arquivos.length === 0) {
                return json(res, 400, { sucesso: false, erro: "Nenhum arquivo enviado" });
            }

            const resultados = [];

            for (const arq of arquivos) {
                // Sanitiza o nome: apenas o basename
                const nomeOriginal = path.basename(arq.filename);
                const ext = path.extname(nomeOriginal).toLowerCase();

                if (!EXTENSOES_PERMITIDAS.includes(ext)) {
                    resultados.push({
                        arquivo: nomeOriginal,
                        status: "rejeitado",
                        motivo: `Extensao ${ext} nao permitida`,
                    });
                    continue;
                }

                // Gera nome unico para evitar colisao
                const nomeSeguro = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
                const destino = path.join(PASTA_UPLOAD, nomeSeguro);
                fs.writeFileSync(destino, arq.conteudo);

                resultados.push({
                    arquivo: nomeOriginal,
                    salvoComo: nomeSeguro,
                    tamanho: arq.conteudo.length,
                    contentType: arq.contentType,
                    status: "ok",
                });
            }

            return json(res, 201, { sucesso: true, recebidos: arquivos.length, resultados, campos });
        } catch (e) {
            return json(res, 413, { sucesso: false, erro: e.message });
        }
    }

    // GET /uploads -> lista arquivos salvos
    if (req.method === "GET" && caminho === "/uploads") {
        const arquivos = fs.readdirSync(PASTA_UPLOAD).map((nome) => {
            const st = fs.statSync(path.join(PASTA_UPLOAD, nome));
            return { nome, tamanho: st.size, criadoEm: st.birthtime.toISOString() };
        });
        return json(res, 200, { sucesso: true, total: arquivos.length, arquivos });
    }

    json(res, 404, { sucesso: false, erro: "Rota nao encontrada" });
});

server.listen(PORT, () => {
    console.log(`Upload demo em http://localhost:${PORT}`);
    console.log(`Pasta de uploads: ${PASTA_UPLOAD}`);
    console.log("Rotas: POST /upload (multipart) , GET /uploads");
});