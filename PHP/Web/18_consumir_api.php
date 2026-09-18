<?php
/**
 * 18 - Consumir API (sem ser backend)
 * Conceitos abordados:
 *   - file_get_contents() com URL HTTP
 *   - cURL (extensão cURL do PHP)
 *   - json_decode() da resposta da API
 *   - Tratamento de erro (timeout, status HTTP, resposta vazia)
 *   - Envio de headers (User-Agent, Accept)
 *   - Variáveis de ambiente para chaves de API
 *   - Cache simples em arquivo (opcional)
 *
 * API usada: ViaCEP (gratuita, sem chave) — https://viacep.com.br
 */

// ---------- Função auxiliar: buscar via cURL ----------
function buscarCep(string $cep): array
{
    $cep = preg_replace('/\D/', '', $cep);
    if (strlen($cep) !== 8) {
        return ['erro' => 'CEP deve ter 8 dígitos.'];
    }

    $url = "https://viacep.com.br/ws/{$cep}/json/";

    // Se cURL estiver disponível, usa (mais robusto)
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_USERAGENT      => 'ExercicioPHP/1.0',
            CURLOPT_HTTPHEADER     => ['Accept: application/json'],
        ]);
        $resposta = curl_exec($ch);
        $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $erroCurl = curl_error($ch);
        unset($ch);

        if ($resposta === false) {
            return ['erro' => "Falha no cURL: $erroCurl"];
        }
        if ($status !== 200) {
            return ['erro' => "HTTP $status"];
        }
    } else {
        // Fallback: file_get_contents (requer allow_url_fopen=On)
        $contexto = stream_context_create([
            'http' => [
                'timeout' => 10,
                'header'  => "User-Agent: ExercicioPHP/1.0\r\nAccept: application/json\r\n",
            ],
        ]);
        $resposta = @file_get_contents($url, false, $contexto);
        if ($resposta === false) {
            return ['erro' => 'Falha ao acessar a API.'];
        }
    }

    $dados = json_decode($resposta, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        return ['erro' => 'JSON inválido: ' . json_last_error_msg()];
    }
    if (isset($dados['erro'])) {
        return ['erro' => 'CEP não encontrado.'];
    }

    return $dados;
}

// ---------- Processa o formulário ----------
$resultado = null;
$cep = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cep'])) {
    $cep = preg_replace('/\D/', '', $_POST['cep']);
    $resultado = buscarCep($cep);
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>18 - Consumir API (ViaCEP)</title>
    <style>
        body { font-family: sans-serif; max-width: 600px; margin: 20px auto; }
        input { padding: 8px; font-size: 16px; width: 200px; }
        button { padding: 8px 16px; }
        .box { background: #f4f4f4; padding: 15px; border-radius: 6px; margin-top: 15px; }
        .erro { background: #fdd; color: #900; padding: 10px; border-radius: 4px; margin-top: 15px; }
        dt { font-weight: bold; margin-top: 8px; }
        dd { margin-left: 0; }
    </style>
</head>
<body>
    <h1>Consulta de CEP</h1>
    <p>Consome a API pública <a href="https://viacep.com.br" target="_blank">ViaCEP</a>.</p>

    <form method="POST" action="">
        <label>Digite o CEP:</label>
        <input type="text" name="cep" placeholder="01310-100"
               value="<?= htmlspecialchars($cep) ?>" required>
        <button type="submit">Buscar</button>
    </form>

    <?php if ($resultado !== null): ?>
        <?php if (isset($resultado['erro'])): ?>
            <div class="erro">❌ <?= htmlspecialchars($resultado['erro']) ?></div>
        <?php else: ?>
            <div class="box">
                <h2>Resultado</h2>
                <dl>
                    <dt>CEP</dt>          <dd><?= htmlspecialchars($resultado['cep'] ?? '-') ?></dd>
                    <dt>Logradouro</dt>   <dd><?= htmlspecialchars($resultado['logradouro'] ?? '-') ?></dd>
                    <dt>Complemento</dt>  <dd><?= htmlspecialchars($resultado['complemento'] ?? '-') ?></dd>
                    <dt>Bairro</dt>       <dd><?= htmlspecialchars($resultado['bairro'] ?? '-') ?></dd>
                    <dt>Cidade</dt>       <dd><?= htmlspecialchars($resultado['localidade'] ?? '-') ?></dd>
                    <dt>UF</dt>           <dd><?= htmlspecialchars($resultado['uf'] ?? '-') ?></dd>
                    <dt>DDD</dt>          <dd><?= htmlspecialchars($resultado['ddd'] ?? '-') ?></dd>
                </dl>
            </div>
        <?php endif; ?>
    <?php endif; ?>

    <h2>Exemplos de CEP</h2>
    <ul>
        <li>01310-100 (Av. Paulista)</li>
        <li>20040-020 (Centro RJ)</li>
        <li>70040-010 (Esplanada dos Ministérios)</li>
    </ul>

    <p><em>Se não funcionar, verifique se <code>allow_url_fopen</code> está ativo ou se a extensão cURL está habilitada no php.ini.</em></p>
</body>
</html>