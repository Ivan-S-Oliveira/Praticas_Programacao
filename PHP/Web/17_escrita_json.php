<?php
/**
 * 17 - Escrita de JSON
 * Conceitos abordados:
 *   - json_encode() e suas flags
 *   - file_put_contents() para gravar
 *   - Ler → modificar → gravar (padrão comum)
 *   - Adicionar, editar e remover itens
 *   - Validação básica antes de gravar
 *   - LOCK_EX para evitar corrupção em concorrência
 */

$caminho = __DIR__ . '/contatos.json';

// Inicializa arquivo se não existir
if (!file_exists($caminho)) {
    file_put_contents($caminho, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Lê os contatos atuais
$contatos = json_decode(file_get_contents($caminho), true) ?? [];

$mensagem = '';

// ---------- Ação: adicionar ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['acao'] ?? '') === 'adicionar') {
    $nome  = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');

    if ($nome === '' || $email === '') {
        $mensagem = "Preencha nome e e-mail.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $mensagem = "E-mail inválido.";
    } else {
        $contatos[] = [
            'id'    => uniqid(),
            'nome'  => $nome,
            'email' => $email,
            'data'  => date('d/m/Y H:i'),
        ];
        file_put_contents(
            $caminho,
            json_encode($contatos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
            LOCK_EX
        );
        $mensagem = "Contato adicionado.";
    }
}

// ---------- Ação: remover ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['acao'] ?? '') === 'remover') {
    $id = $_POST['id'] ?? '';
    $contatos = array_values(array_filter($contatos, fn($c) => $c['id'] !== $id));
    file_put_contents(
        $caminho,
        json_encode($contatos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );
    $mensagem = "🗑 Contato removido.";
    header('Location: 17_escrita_json.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>17 - Escrita de JSON</title>
    <style>
        body { font-family: sans-serif; max-width: 700px; margin: 20px auto; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
        th { background: #eee; }
        input { padding: 6px; margin-right: 6px; }
        .msg { padding: 10px; background: #eef; margin: 10px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>Contatos (JSON)</h1>

    <?php if ($mensagem): ?>
        <div class="msg"><?= $mensagem ?></div>
    <?php endif; ?>

    <form method="POST" action="">
        <input type="hidden" name="acao" value="adicionar">
        <input type="text" name="nome" placeholder="Nome" required>
        <input type="text" name="email" placeholder="E-mail" required>
        <button type="submit">Adicionar</button>
    </form>

    <?php if (empty($contatos)): ?>
        <p><em>Nenhum contato cadastrado.</em></p>
    <?php else: ?>
        <table>
            <tr><th>Nome</th><th>E-mail</th><th>Data</th><th>Ação</th></tr>
            <?php foreach ($contatos as $c): ?>
                <tr>
                    <td><?= htmlspecialchars($c['nome']) ?></td>
                    <td><?= htmlspecialchars($c['email']) ?></td>
                    <td><?= htmlspecialchars($c['data']) ?></td>
                    <td>
                        <form method="POST" action="" style="display:inline">
                            <input type="hidden" name="acao" value="remover">
                            <input type="hidden" name="id" value="<?= htmlspecialchars($c['id']) ?>">
                            <button type="submit">Remover</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>

    <h2>Conteúdo do arquivo</h2>
    <pre style="background:#222;color:#eee;padding:10px;overflow-x:auto;"><?= htmlspecialchars(file_get_contents($caminho)) ?></pre>
</body>
</html>