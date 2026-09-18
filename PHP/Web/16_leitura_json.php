<?php
/**
 * 16 - Leitura de JSON
 * Conceitos abordados:
 *   - file_get_contents() para ler arquivo
 *   - json_decode() com e sem assoc=true
 *   - json_last_error() e json_last_error_msg()
 *   - Diferença entre object e array associativo
 *   - Acesso a propriedades / chaves
 *   - Tratamento de erro de JSON inválido
 */

$caminho = __DIR__ . '/dados.json';

// Cria um JSON de exemplo caso não exista
if (!file_exists($caminho)) {
    $exemplo = [
        'empresa' => 'Tech Solutions',
        'funcionarios' => [
            ['nome' => 'Ana', 'idade' => 28, 'cargo' => 'Dev'],
            ['nome' => 'Bruno', 'idade' => 34, 'cargo' => 'Designer'],
            ['nome' => 'Carla', 'idade' => 41, 'cargo' => 'Gerente'],
        ],
        'ativo' => true,
    ];
    file_put_contents($caminho, json_encode($exemplo, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// ---------- 1) Lê o conteúdo bruto ----------
$conteudoBruto = file_get_contents($caminho);

// ---------- 2) Decodifica como OBJETO (padrão) ----------
$dados = json_decode($conteudoBruto);

if (json_last_error() !== JSON_ERROR_NONE) {
    die('Erro ao decodificar JSON: ' . json_last_error_msg());
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>16 - Leitura de JSON</title>
    <style>
        body { font-family: sans-serif; max-width: 700px; margin: 20px auto; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
        th { background: #eee; }
        .box { background: #f4f4f4; padding: 10px; border-radius: 4px; }
        pre { background: #222; color: #eee; padding: 10px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>Leitura de JSON</h1>

    <div class="box">
        <p><strong>Empresa:</strong> <?= htmlspecialchars($dados->empresa) ?></p>
        <p><strong>Ativo:</strong> <?= $dados->ativo ? 'Sim' : 'Não' ?></p>
        <p><strong>Total de funcionários:</strong> <?= count($dados->funcionarios) ?></p>
    </div>

    <h2>Funcionários (modo objeto)</h2>
    <table>
        <tr><th>Nome</th><th>Idade</th><th>Cargo</th></tr>
        <?php foreach ($dados->funcionarios as $f): ?>
            <tr>
                <td><?= htmlspecialchars($f->nome) ?></td>
                <td><?= $f->idade ?></td>
                <td><?= htmlspecialchars($f->cargo) ?></td>
            </tr>
        <?php endforeach; ?>
    </table>

    <?php
    // ---------- 3) Decodifica como ARRAY associativo ----------
    $dadosArray = json_decode($conteudoBruto, true);
    ?>
    <h2>Modo array associativo</h2>
    <div class="box">
        <p>Primeiro funcionário: <strong><?= htmlspecialchars($dadosArray['funcionarios'][0]['nome']) ?></strong></p>
        <p>Cargo: <?= htmlspecialchars($dadosArray['funcionarios'][0]['cargo']) ?></p>
    </div>

    <h2>JSON bruto</h2>
    <pre><?= htmlspecialchars($conteudoBruto) ?></pre>
</body>
</html>