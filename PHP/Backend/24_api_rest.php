<?php
declare(strict_types=1);

/**
 * 24 - API REST
 *
 * Conceitos abordados:
 *   - API REST com JSON
 *   - Metodos HTTP: GET, POST, PUT, DELETE
 *   - Header Content-Type: application/json
 *   - Leitura do corpo da requisicao via php://input
 *   - Codigos de status HTTP (200, 201, 204, 400, 404, 405)
 *   - Roteamento simples por metodo + recurso
 *   - Respostas JSON com json_encode
 *   - Persistencia em arquivo JSON
 *
 * Como testar:
 *   GET    /24_api_rest.php/produtos        -> lista
 *   GET    /24_api_rest.php/produtos/1      -> detalhe
 *   POST   /24_api_rest.php/produtos        -> cria (body JSON)
 *   PUT    /24_api_rest.php/produtos/1      -> atualiza
 *   DELETE /24_api_rest.php/produtos/1      -> remove
 *
 * No servidor embutido do PHP:
 *   php -S localhost:8000 24_api_rest.php
 */

// ---------- Configuracao ----------
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responde imediatamente requisicoes OPTIONS (pre-flight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------- Persistencia ----------
$arquivo = __DIR__ . '/api_produtos.json';
if (!file_exists($arquivo)) {
    file_put_contents($arquivo, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function lerDados(string $arquivo): array
{
    return json_decode(file_get_contents($arquivo), true) ?? [];
}

function gravarDados(string $arquivo, array $dados): void
{
    file_put_contents(
        $arquivo,
        json_encode(array_values($dados), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );
}

function responder(int $status, array $corpo): void
{
    http_response_code($status);
    echo json_encode($corpo, JSON_UNESCAPED_UNICODE);
    exit;
}

function lerCorpoJson(): array
{
    $bruto = file_get_contents('php://input');
    if ($bruto === '' || $bruto === false) {
        return [];
    }
    $dados = json_decode($bruto, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        responder(400, ['erro' => 'JSON invalido no corpo da requisicao.']);
    }
    return is_array($dados) ? $dados : [];
}

// ---------- Roteamento simples ----------
// Ex.: /24_api_rest.php/produtos/5  -> partes = ['produtos', '5']
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = trim(str_replace(basename(__FILE__), '', $uri), '/');
$partes = $uri === '' ? [] : explode('/', $uri);

$recurso = $partes[0] ?? '';
$id      = $partes[1] ?? null;
$metodo  = $_SERVER['REQUEST_METHOD'];

// Só aceitamos o recurso "produtos" neste exemplo
if ($recurso !== 'produtos') {
    responder(404, ['erro' => 'Recurso nao encontrado. Use /produtos.']);
}

$produtos = lerDados($arquivo);

// ---------- GET ----------
if ($metodo === 'GET') {
    if ($id === null) {
        responder(200, ['dados' => $produtos, 'total' => count($produtos)]);
    }
    foreach ($produtos as $p) {
        if ((string)$p['id'] === (string)$id) {
            responder(200, ['dados' => $p]);
        }
    }
    responder(404, ['erro' => 'Produto nao encontrado.']);
}

// ---------- POST ----------
if ($metodo === 'POST') {
    $corpo = lerCorpoJson();
    if (empty($corpo['nome']) || !isset($corpo['preco'])) {
        responder(400, ['erro' => 'Campos obrigatorios: nome e preco.']);
    }

    $novo = [
        'id'        => time(), // ID simples baseado em timestamp
        'nome'      => (string) $corpo['nome'],
        'preco'     => (float) $corpo['preco'],
        'criado_em' => date('c'),
    ];
    $produtos[] = $novo;
    gravarDados($arquivo, $produtos);

    responder(201, ['mensagem' => 'Produto criado.', 'dados' => $novo]);
}

// ---------- PUT ----------
if ($metodo === 'PUT') {
    if ($id === null) {
        responder(400, ['erro' => 'Informe o ID na URL: /produtos/{id}.']);
    }
    $corpo = lerCorpoJson();
    $encontrado = false;

    foreach ($produtos as &$p) {
        if ((string)$p['id'] === (string)$id) {
            if (isset($corpo['nome']))  $p['nome']  = (string) $corpo['nome'];
            if (isset($corpo['preco'])) $p['preco'] = (float) $corpo['preco'];
            $p['atualizado_em'] = date('c');
            $encontrado = true;
            $atualizado = $p;
            break;
        }
    }
    unset($p);

    if (!$encontrado) {
        responder(404, ['erro' => 'Produto nao encontrado.']);
    }

    gravarDados($arquivo, $produtos);
    responder(200, ['mensagem' => 'Produto atualizado.', 'dados' => $atualizado]);
}

// ---------- DELETE ----------
if ($metodo === 'DELETE') {
    if ($id === null) {
        responder(400, ['erro' => 'Informe o ID na URL: /produtos/{id}.']);
    }
    $antes = count($produtos);
    $produtos = array_values(array_filter($produtos, fn($p) => (string)$p['id'] !== (string)$id));

    if (count($produtos) === $antes) {
        responder(404, ['erro' => 'Produto nao encontrado.']);
    }
    gravarDados($arquivo, $produtos);
    responder(200, ['mensagem' => 'Produto removido.']);
}

// ---------- Metodo nao suportado ----------
responder(405, ['erro' => "Metodo $metodo nao permitido."]);