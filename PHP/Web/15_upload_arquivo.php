<?php
/**
 * 15 - Upload de Arquivo
 * Conceitos abordados:
 *   - Formulário com enctype="multipart/form-data"
 *   - Superglobal $_FILES (name, type, tmp_name, error, size)
 *   - move_uploaded_file() para salvar no destino
 *   - Validação de extensão (whitelist)
 *   - Validação de tamanho máximo
 *   - Criação de pasta de uploads
 *   - Renomeação para evitar conflitos/segurança
 */

// Configurações
$pastaUpload = __DIR__ . '/uploads';
$tamanhoMax  = 2 * 1024 * 1024; // 2 MB
$extensoesPermitidas = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt'];

$mensagens = [];
$arquivoSalvo = null;

// Cria pasta de uploads, se não existir
if (!is_dir($pastaUpload)) {
    mkdir($pastaUpload, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['arquivo'])) {
    $arquivo = $_FILES['arquivo'];

    // Trata erros de upload nativos
    if ($arquivo['error'] !== UPLOAD_ERR_OK) {
        $errosUpload = [
            UPLOAD_ERR_INI_SIZE   => 'Arquivo maior que o limite do php.ini.',
            UPLOAD_ERR_FORM_SIZE  => 'Arquivo maior que o limite do formulário.',
            UPLOAD_ERR_PARTIAL    => 'Upload incompleto.',
            UPLOAD_ERR_NO_FILE    => 'Nenhum arquivo enviado.',
            UPLOAD_ERR_NO_TMP_DIR => 'Pasta temporária ausente.',
            UPLOAD_ERR_CANT_WRITE => 'Falha ao escrever no disco.',
        ];
        $mensagens[] = $errosUpload[$arquivo['error']] ?? 'Erro desconhecido.';
    } else {
        // Valida tamanho
        if ($arquivo['size'] > $tamanhoMax) {
            $mensagens[] = "Arquivo maior que 2 MB.";
        } else {
            // Valida extensão
            $ext = strtolower(pathinfo($arquivo['name'], PATHINFO_EXTENSION));
            if (!in_array($ext, $extensoesPermitidas, true)) {
                $mensagens[] = "Extensão .$ext não permitida.";
            } else {
                // Gera nome único e seguro
                $nomeSeguro = bin2hex(random_bytes(8)) . '.' . $ext;
                $destino = $pastaUpload . '/' . $nomeSeguro;

                if (move_uploaded_file($arquivo['tmp_name'], $destino)) {
                    $mensagens[] = "Arquivo enviado com sucesso!";
                    $arquivoSalvo = [
                        'nome_original' => htmlspecialchars($arquivo['name']),
                        'nome_salvo'    => $nomeSeguro,
                        'tamanho'       => round($arquivo['size'] / 1024, 2) . ' KB',
                        'tipo'          => htmlspecialchars($arquivo['type']),
                    ];
                } else {
                    $mensagens[] = "Falha ao mover arquivo.";
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>15 - Upload de Arquivo</title>
    <style>
        body { font-family: sans-serif; max-width: 600px; margin: 20px auto; }
        .msg { padding: 10px; margin: 5px 0; border-radius: 4px; background: #eef; }
        .info { background: #efe; padding: 10px; border-radius: 4px; }
        input[type=file] { margin: 10px 0; }
    </style>
</head>
<body>
    <h1>Upload de Arquivo</h1>

    <form method="POST" action="" enctype="multipart/form-data">
        <label>Escolha um arquivo (máx 2 MB):</label><br>
        <input type="file" name="arquivo" required>
        <br>
        <button type="submit">Enviar</button>
    </form>

    <?php foreach ($mensagens as $m): ?>
        <div class="msg"><?= $m ?></div>
    <?php endforeach; ?>

    <?php if ($arquivoSalvo): ?>
        <div class="info">
            <p><strong>Detalhes:</strong></p>
            <p>Nome original: <?= $arquivoSalvo['nome_original'] ?></p>
            <p>Nome salvo:    <?= $arquivoSalvo['nome_salvo'] ?></p>
            <p>Tamanho:       <?= $arquivoSalvo['tamanho'] ?></p>
            <p>Tipo MIME:     <?= $arquivoSalvo['tipo'] ?></p>
            <p><a href="uploads/<?= $arquivoSalvo['nome_salvo'] ?>" target="_blank">Abrir arquivo</a></p>
        </div>
    <?php endif; ?>

    <p><em>Extensões permitidas: <?= implode(', ', $extensoesPermitidas) ?></em></p>
</body>
</html>