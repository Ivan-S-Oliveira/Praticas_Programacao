<?php
declare(strict_types=1);

/**
 * 23 - Hash de Senha
 *
 * Conceitos abordados:
 *   - password_hash e password_verify (nunca use md5/sha1 para senhas)
 *   - PASSWORD_DEFAULT (hoje = bcrypt) e seu custo
 *   - Salt automatico gerado pela propria funcao
 *   - password_needs_rehash para atualizar hash antigo
 *   - password_get_info para inspecionar o hash
 *   - Comparacao com hashes inseguros (md5) apenas para contraste
 *   - Fluxo tipico: cadastro (hash) e login (verify)
 */

// ---------- 1) Gerar hash de uma senha ----------
$senha = 'MinhaSenhaSegura123';

// PASSWORD_DEFAULT (recomendado). Custo padrao = 10
$hash = password_hash($senha, PASSWORD_DEFAULT);

// Podemos ajustar o custo (mais alto = mais lento = mais seguro)
$hashCusto12 = password_hash($senha, PASSWORD_BCRYPT, ['cost' => 12]);

// ---------- 2) Verificar senha contra hash ----------
$senhaCorreta = password_verify($senha, $hash);
$senhaErrada  = password_verify('outraSenha', $hash);

// ---------- 3) Comparacao com md5 (inseguro) ----------
$md5 = md5($senha);

// ---------- 4) Inspecionar o hash ----------
$info = password_get_info($hash);

// ---------- 5) Verificar se o hash precisa ser atualizado ----------
$precisaRehash = password_needs_rehash($hash, PASSWORD_DEFAULT);

// ---------- 6) Simulacao de cadastro + login ----------
$cadastro = [];

// Cadastro
$senhaUsuario = 'abc12345';
$cadastro['joao'] = password_hash($senhaUsuario, PASSWORD_DEFAULT);

// Login
$loginOk  = password_verify('abc12345', $cadastro['joao']);
$loginErro = password_verify('12345abc', $cadastro['joao']);

// ---------- 7) Tempo de geracao (custo) ----------
$inicio = microtime(true);
password_hash($senha, PASSWORD_BCRYPT, ['cost' => 12]);
$tempoCusto12 = round((microtime(true) - $inicio) * 1000, 2);

$inicio = microtime(true);
password_hash($senha, PASSWORD_BCRYPT, ['cost' => 14]);
$tempoCusto14 = round((microtime(true) - $inicio) * 1000, 2);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>23 - Hash de Senha</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 20px auto; }
        .box { background: #f4f4f4; padding: 12px; border-radius: 6px; margin: 10px 0; }
        code { background: #eee; padding: 2px 6px; border-radius: 3px; word-break: break-all; }
        .ok { color: #060; }
        .erro { color: #900; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
        th { background: #eee; }
    </style>
</head>
<body>
    <h1>Hash de Senha</h1>

    <div class="box">
        <p><strong>Senha original:</strong> <code><?= htmlspecialchars($senha) ?></code></p>
        <p><strong>Hash gerado (PASSWORD_DEFAULT):</strong></p>
        <code><?= htmlspecialchars($hash) ?></code>
        <p><strong>Hash com custo 12:</strong></p>
        <code><?= htmlspecialchars($hashCusto12) ?></code>
    </div>

    <div class="box">
        <p>Verificar senha correta: <span class="<?= $senhaCorreta ? 'ok' : 'erro' ?>">
            <?= $senhaCorreta ? 'VALIDA' : 'INVALIDA' ?></span></p>
        <p>Verificar senha errada: <span class="<?= $senhaErrada ? 'erro' : 'ok' ?>">
            <?= $senhaErrada ? 'VALIDA' : 'INVALIDA' ?></span></p>
    </div>

    <div class="box">
        <p><strong>Por que nao usar md5?</strong></p>
        <p>md5 da mesma senha: <code><?= htmlspecialchars($md5) ?></code></p>
        <p>md5 e rapido, sem salt e quebrado por rainbow tables. Nunca use para senhas.</p>
    </div>

    <div class="box">
        <p><strong>Informacoes do hash:</strong></p>
        <table>
            <tr><th>Algoritmo</th><td><?= htmlspecialchars($info['algoName']) ?></td></tr>
            <tr><th>Custo</th><td><?= (int) ($info['options']['cost'] ?? 0) ?></td></tr>
            <tr><th>Precisa rehash?</th><td><?= $precisaRehash ? 'Sim' : 'Nao' ?></td></tr>
        </table>
    </div>

    <div class="box">
        <p><strong>Simulacao de cadastro e login:</strong></p>
        <p>Login com senha correta: <span class="<?= $loginOk ? 'ok' : 'erro' ?>">
            <?= $loginOk ? 'OK' : 'FALHOU' ?></span></p>
        <p>Login com senha errada: <span class="<?= !$loginErro ? 'ok' : 'erro' ?>">
            <?= $loginErro ? 'NAO DEVERIA PASSAR' : 'BLOQUEADO' ?></span></p>
    </div>

    <div class="box">
        <p><strong>Tempo de geracao por custo (ms):</strong></p>
        <table>
            <tr><th>Custo</th><th>Tempo aproximado</th></tr>
            <tr><td>12</td><td><?= $tempoCusto12 ?> ms</td></tr>
            <tr><td>14</td><td><?= $tempoCusto14 ?> ms</td></tr>
        </table>
        <p>Custo maior = mais lento para atacante, mas tambem para voce.
           Recomendado: ajustar para ~100-300ms no seu servidor.</p>
    </div>
</body>
</html>