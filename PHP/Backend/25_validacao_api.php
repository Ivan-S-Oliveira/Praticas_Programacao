<?php
declare(strict_types=1);

/**
 * 25 - Validacao de API
 *
 * Conceitos abordados:
 *   - Validacao server-side de payload JSON em API
 *   - filter_var (email, int, url) e preg_match (regex)
 *   - Array de erros por campo (retorno estruturado)
 *   - Status HTTP 400 (Bad Request) e 422 (Unprocessable Entity)
 *   - Status 200 (OK) quando valido
 *   - Leitura de JSON via php://input
 *   - Mensagens claras por campo
 *   - Diferenca entre erro de formato (400) e erro de regra (422)
 *
 * Como testar (com curl):
 *   curl -X POST http://localhost:8000/25_validacao_api.php \
 *        -H "Content-Type: application/json" \
 *        -d '{"nome":"","email":"invalido","idade":-1,"site":"abc"}'
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Use POST para validar.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// ---------- Le corpo bruto ----------
$bruto = file_get_contents('php://input');

if ($bruto === '' || $bruto === false) {
    http_response_code(400);
    echo json_encode(['erro' => 'Corpo da requisicao vazio.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$dados = json_decode($bruto, true);

// 400 = erro de formato (JSON invalido)
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'erro' => 'JSON invalido.',
        'detalhe' => json_last_error_msg(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!is_array($dados)) {
    http_response_code(400);
    echo json_encode(['erro' => 'Corpo deve ser um objeto JSON.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// ---------- Regras de validacao ----------
$erros = [];

// nome: obrigatorio, 3 a 100 caracteres, apenas letras e espacos
$nome = trim((string) ($dados['nome'] ?? ''));
if ($nome === '') {
    $erros['nome'] = 'Nome e obrigatorio.';
} elseif (mb_strlen($nome) < 3 || mb_strlen($nome) > 100) {
    $erros['nome'] = 'Nome deve ter entre 3 e 100 caracteres.';
} elseif (!preg_match('/^[\p{L} ]+$/u', $nome)) {
    $erros['nome'] = 'Nome deve conter apenas letras e espacos.';
}

// email: obrigatorio, formato valido
$email = trim((string) ($dados['email'] ?? ''));
if ($email === '') {
    $erros['email'] = 'E-mail e obrigatorio.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erros['email'] = 'E-mail invalido.';
}

// idade: opcional, se presente deve ser inteiro entre 0 e 120
if (array_key_exists('idade', $dados)) {
    $idadeBruta = $dados['idade'];
    if (!is_int($idadeBruta) && !ctype_digit((string) $idadeBruta)) {
        $erros['idade'] = 'Idade deve ser um numero inteiro.';
    } else {
        $idade = (int) $idadeBruta;
        if ($idade < 0 || $idade > 120) {
            $erros['idade'] = 'Idade deve estar entre 0 e 120.';
        }
    }
}

// site: opcional, se presente deve ser URL valida
if (array_key_exists('site', $dados) && $dados['site'] !== '') {
    $site = trim((string) $dados['site']);
    if (!filter_var($site, FILTER_VALIDATE_URL)) {
        $erros['site'] = 'Site deve ser uma URL valida.';
    }
}

// senha: obrigatoria, minimo 8, ao menos uma letra e um numero
$senha = (string) ($dados['senha'] ?? '');
if ($senha === '') {
    $erros['senha'] = 'Senha e obrigatoria.';
} elseif (strlen($senha) < 8) {
    $erros['senha'] = 'Senha deve ter no minimo 8 caracteres.';
} elseif (!preg_match('/[A-Za-z]/', $senha) || !preg_match('/\d/', $senha)) {
    $erros['senha'] = 'Senha deve conter ao menos uma letra e um numero.';
}

// ---------- Retorno ----------
if (!empty($erros)) {
    // 422 = formato correto, mas regra de negocio violada
    http_response_code(422);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Um ou mais campos sao invalidos.',
        'erros' => $erros,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Tudo valido
$resposta = [
    'sucesso' => true,
    'mensagem' => 'Dados validados com sucesso.',
    'dados' => [
        'nome'  => $nome,
        'email' => $email,
    ],
];

if (isset($idade)) {
    $resposta['dados']['idade'] = $idade;
}
if (isset($site) && $site !== '') {
    $resposta['dados']['site'] = $site;
}

echo json_encode($resposta, JSON_UNESCAPED_UNICODE);