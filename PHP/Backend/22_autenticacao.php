<?php
declare(strict_types=1);

/**
 * 22 - Autenticacao
 *
 * Conceitos abordados:
 *   - Fluxo de login/logout com sessao
 *   - Verificacao de credenciais com password_verify
 *   - session_regenerate_id para evitar session fixation
 *   - Protecao de paginas (checagem de $_SESSION)
 *   - Redirecionamento com header Location
 *   - Mensagem generica de erro (evita enumeracao de usuarios)
 *   - Regeneracao de ID de sessao apos login
 */

session_start();

// ---------- "Banco" de usuarios (senha ja com hash) ----------
// Em producao, isso viria de um banco de dados.
$usuarios = [
    'admin' => [
        'nome' => 'Administrador',
        // senha: admin123
        'senha_hash' => '$2y$10$e0NRzQ0K3h9yO0m9.8s2y.oM2F9mF6o6x4c2M1eF1gH2iJ3kL4mN',
    ],
    'joao' => [
        'nome' => 'Joao Silva',
        // senha: senha456 (hash de exemplo - sera gerado por password_hash no exercicio 23)
        'senha_hash' => '$2y$10$exemploDeHashInvalidoParaFinsDidaticos1234567890',
    ],
];

// ---------- Logout ----------
if (isset($_GET['acao']) && $_GET['acao'] === 'logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
    header('Location: 22_autenticacao.php');
    exit;
}

$erro = '';

// ---------- Login ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['usuario'], $_POST['senha'])) {
    $usuario = trim($_POST['usuario']);
    $senha   = $_POST['senha'];

    // Verifica sem revelar se o usuario existe (mensagem generica)
    if (isset($usuarios[$usuario]) && password_verify($senha, $usuarios[$usuario]['senha_hash'])) {
        // Regenera ID da sessao para evitar session fixation
        session_regenerate_id(true);

        $_SESSION['usuario']     = $usuario;
        $_SESSION['nome']        = $usuarios[$usuario]['nome'];
        $_SESSION['logado_em']   = date('d/m/Y H:i');
        $_SESSION['ip']          = $_SERVER['REMOTE_ADDR'] ?? '';

        header('Location: 22_autenticacao.php');
        exit;
    } else {
        $erro = 'Usuario ou senha invalidos.';
    }
}

$logado = isset($_SESSION['usuario']);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>22 - Autenticacao</title>
    <style>
        body { font-family: sans-serif; max-width: 500px; margin: 20px auto; }
        .box { background: #f4f4f4; padding: 15px; border-radius: 6px; margin: 10px 0; }
        .erro { background: #fdd; color: #900; padding: 10px; border-radius: 4px; }
        label { display: block; margin-top: 10px; }
        input { width: 100%; padding: 8px; box-sizing: border-box; }
        button { margin-top: 12px; padding: 8px 16px; }
    </style>
</head>
<body>
    <h1>Autenticacao</h1>

    <?php if ($logado): ?>
        <div class="box">
            <p>Bem-vindo, <strong><?= htmlspecialchars($_SESSION['nome']) ?></strong></p>
            <p>Usuario: <?= htmlspecialchars($_SESSION['usuario']) ?></p>
            <p>Logado em: <?= htmlspecialchars($_SESSION['logado_em']) ?></p>
            <p>IP: <?= htmlspecialchars($_SESSION['ip']) ?></p>
            <p><a href="?acao=logout">Sair</a></p>
        </div>

        <h2>Area protegida</h2>
        <p>Este conteudo so aparece para usuarios autenticados.</p>

    <?php else: ?>
        <?php if ($erro): ?>
            <div class="erro"><?= htmlspecialchars($erro) ?></div>
        <?php endif; ?>

        <form method="POST" action="">
            <label>Usuario
                <input type="text" name="usuario" required>
            </label>
            <label>Senha
                <input type="password" name="senha" required>
            </label>
            <button type="submit">Entrar</button>
        </form>

        <p><em>Para testar, gere um hash real com o exercicio 23 e substitua no array $usuarios.</em></p>
    <?php endif; ?>
</body>
</html>