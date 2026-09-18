<?php
/**
 * 14 - Cookies
 * Conceitos abordados:
 *   - setcookie(nome, valor, expiração, path, domínio, secure, httponly)
 *   - Superglobal $_COOKIE
 *   - Diferença entre sessão (servidor) e cookie (cliente)
 *   - Cookie de preferência do usuário (tema, idioma, nome)
 *   - Expiração com time() + segundos
 *   - Remoção de cookie (expiração no passado)
 *
 * ATENÇÃO: setcookie() deve vir ANTES de qualquer saída HTML.
 */

// ---------- Ações ----------
// Salvar preferências
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['tema'], $_POST['idioma'])) {
    setcookie('tema',    $_POST['tema'],    time() + 60 * 60 * 24 * 30, '/'); // 30 dias
    setcookie('idioma',  $_POST['idioma'],  time() + 60 * 60 * 24 * 30, '/');
    header('Location: 14_cookies.php');
    exit;
}

// Salvar nome
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['nome'])) {
    $nome = trim($_POST['nome']);
    if ($nome !== '') {
        setcookie('nome', $nome, time() + 60 * 60 * 24 * 30, '/');
        header('Location: 14_cookies.php');
        exit;
    }
}

// Remover cookie
if (isset($_GET['acao']) && $_GET['acao'] === 'limpar') {
    setcookie('tema',   '', time() - 3600, '/');
    setcookie('idioma', '', time() - 3600, '/');
    setcookie('nome',   '', time() - 3600, '/');
    header('Location: 14_cookies.php');
    exit;
}

// ---------- Lê preferências atuais ----------
$tema   = $_COOKIE['tema']   ?? 'claro';
$idioma = $_COOKIE['idioma'] ?? 'pt';
$nome   = $_COOKIE['nome']   ?? '';

$background = $tema === 'escuro' ? '#222' : '#fff';
$color      = $tema === 'escuro' ? '#eee' : '#000';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>14 - Cookies</title>
    <style>
        body { font-family: sans-serif; max-width: 600px; margin: 20px auto;
               background: <?= $background ?>; color: <?= $color ?>; }
        .box { background: rgba(128,128,128,0.15); padding: 15px;
               border-radius: 6px; margin: 10px 0; }
        a { color: inherit; margin-right: 10px; }
    </style>
</head>
<body>
    <h1>Cookies em PHP</h1>

    <?php if ($nome): ?>
        <div class="box">Olá, <strong><?= htmlspecialchars($nome) ?></strong>! Suas preferências foram salvas.</div>
    <?php endif; ?>

    <div class="box">
        <p><strong>Preferências atuais:</strong></p>
        <p>Tema: <?= htmlspecialchars($tema) ?></p>
        <p>Idioma: <?= htmlspecialchars($idioma) ?></p>
        <p>Nome: <?= htmlspecialchars($nome ?: "(não definido)") ?></p>
    </div>

    <h2>Definir preferências</h2>
    <form method="POST" action="">
        <label>Tema:</label>
        <select name="tema">
            <option value="claro"  <?= $tema === 'claro'  ? 'selected' : '' ?>>Claro</option>
            <option value="escuro" <?= $tema === 'escuro' ? 'selected' : '' ?>>Escuro</option>
        </select>

        <label>Idioma:</label>
        <select name="idioma">
            <option value="pt" <?= $idioma === 'pt' ? 'selected' : '' ?>>Português</option>
            <option value="en" <?= $idioma === 'en' ? 'selected' : '' ?>>English</option>
            <option value="es" <?= $idioma === 'es' ? 'selected' : '' ?>>Español</option>
        </select>

        <button type="submit">Salvar</button>
    </form>

    <h2>Salvar nome</h2>
    <form method="POST" action="">
        <input type="text" name="nome" placeholder="Seu nome" required>
        <button type="submit">Salvar nome</button>
    </form>

    <hr>
    <a href="?acao=limpar">Limpar cookies</a>

    <p><em>Feche o navegador e volte — as preferências continuam (diferente da sessão).</em></p>
</body>
</html>