<?php
/**
 * 11 - Formulário
 * Conceitos abordados:
 *   - Formulário HTML com métodos GET e POST
 *   - Superglobais $_GET e $_POST
 *   - Diferença entre GET (URL) e POST (corpo)
 *   - htmlspecialchars() para escapar saída (evitar XSS)
 *   - Verificação com isset() e $_SERVER['REQUEST_METHOD']
 */

// Verifica se o formulário foi enviado via POST
$mensagem = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // isset() verifica se a chave existe (evita warning)
    if (isset($_POST['nome'], $_POST['email'], $_POST['mensagem'])) {
        // htmlspecialchars() escapa caracteres perigosos (<, >, &, ", ')
        $nome     = htmlspecialchars($_POST['nome']);
        $email    = htmlspecialchars($_POST['email']);
        $mensagem = htmlspecialchars($_POST['mensagem']);

        $mensagem = "Recebido via POST: $nome ($email) disse: $mensagem";
    }
}

// Exemplo de GET: valores passados na URL (?busca=algo)
$busca = isset($_GET['busca']) ? htmlspecialchars($_GET['busca']) : "";
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>11 - Formulário</title>
    <style>
        body { font-family: sans-serif; max-width: 600px; margin: 20px auto; }
        label { display: block; margin-top: 10px; }
        input, textarea { width: 100%; padding: 6px; }
        button { margin-top: 10px; padding: 8px 16px; }
        .resultado { background: #eef; padding: 10px; margin-top: 15px; }
    </style>
</head>
<body>
    <h1>Formulário de Contato</h1>

    <!-- Formulário com POST -->
    <form method="POST" action="">
        <label>Nome:</label>
        <input type="text" name="nome" required>

        <label>E-mail:</label>
        <input type="email" name="email" required>

        <label>Mensagem:</label>
        <textarea name="mensagem" rows="4" required></textarea>

        <button type="submit">Enviar</button>
    </form>

    <?php if ($mensagem !== ""): ?>
        <div class="resultado">
            <strong>Resultado:</strong> <?= $mensagem ?>
        </div>
    <?php endif; ?>

    <hr>
    <h2>Exemplo com GET</h2>
    <form method="GET" action="">
        <label>Buscar:</label>
        <input type="text" name="busca" value="<?= $busca ?>">
        <button type="submit">Buscar</button>
    </form>

    <?php if ($busca !== ""): ?>
        <p>Você buscou por: <strong><?= $busca ?></strong></p>
    <?php endif; ?>
</body>
</html>