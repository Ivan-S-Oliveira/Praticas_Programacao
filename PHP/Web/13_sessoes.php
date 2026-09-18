<?php
/**
 * 13 - Sessões
 * Conceitos abordados:
 *   - session_start() (obrigatório antes de qualquer saída)
 *   - Superglobal $_SESSION
 *   - Persistência de dados entre requisições
 *   - session_destroy() e unset() para logout
 *   - session_id() para identificar a sessão
 *   - Diferença entre sessão (servidor) e cookie (cliente)
 */

session_start();

// ---------- Ação: logout ----------
if (isset($_GET['acao']) && $_GET['acao'] === 'logout') {
    $_SESSION = [];              // limpa variáveis
    session_destroy();           // destrói a sessão no servidor
    header('Location: 13_sessoes.php');
    exit;
}

// ---------- Ação: limpar contador ----------
if (isset($_GET['acao']) && $_GET['acao'] === 'reset') {
    $_SESSION['contador'] = 0;
    header('Location: 13_sessoes.php');
    exit;
}

// ---------- Inicializa dados na sessão ----------
if (!isset($_SESSION['contador'])) {
    $_SESSION['contador'] = 0;
}
if (!isset($_SESSION['historico'])) {
    $_SESSION['historico'] = [];
}

// Incrementa a cada visita
$_SESSION['contador']++;
$_SESSION['historico'][] = date('H:i:s');

// Limita histórico às 5 últimas visitas
if (count($_SESSION['historico']) > 5) {
    array_shift($_SESSION['historico']);
}

// ---------- Login simulado ----------
$mensagemLogin = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['usuario'])) {
    $usuario = trim($_POST['usuario']);
    if ($usuario !== '') {
        $_SESSION['usuario'] = htmlspecialchars($usuario);
        $mensagemLogin = "Login realizado como " . $_SESSION['usuario'];
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>13 - Sessões</title>
    <style>
        body { font-family: sans-serif; max-width: 600px; margin: 20px auto; }
        .box { background: #f4f4f4; padding: 15px; border-radius: 6px; margin: 10px 0; }
        a { margin-right: 10px; }
    </style>
</head>
<body>
    <h1>Sessões em PHP</h1>

    <div class="box">
        <p>ID da sessão: <code><?= session_id() ?></code></p>
        <p>Visitas nesta sessão: <strong><?= $_SESSION['contador'] ?></strong></p>
        <p>Últimas visitas: <?= implode(", ", $_SESSION['historico']) ?></p>
    </div>

    <?php if (isset($_SESSION['usuario'])): ?>
        <div class="box">
            <p>👤 Logado como: <strong><?= $_SESSION['usuario'] ?></strong></p>
            <a href="?acao=logout">Sair</a>
        </div>
    <?php else: ?>
        <form method="POST" action="">
            <label>Digite seu nome para "login":</label><br>
            <input type="text" name="usuario" required>
            <button type="submit">Entrar</button>
        </form>
        <?php if ($mensagemLogin): ?>
            <p><?= $mensagemLogin ?></p>
        <?php endif; ?>
    <?php endif; ?>

    <hr>
    <a href="?acao=reset">Zerar contador</a>
    <a href="?acao=logout">Logout total</a>

    <p><em>Recarregue a página várias vezes e veja o contador subir. Feche o navegador e volte — a sessão continua ativa enquanto o servidor mantiver o arquivo.</em></p>
</body>
</html>