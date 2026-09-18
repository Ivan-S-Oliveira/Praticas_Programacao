<?php
/**
 * 12 - Validação de Formulário
 * Conceitos abordados:
 *   - Validação server-side (nunca confiar só no HTML)
 *   - filter_var() com FILTER_VALIDATE_EMAIL e FILTER_VALIDATE_INT
 *   - preg_match() para regex (nome, telefone)
 *   - trim() para remover espaços
 *   - Array de erros
 *   - Repopulação do formulário após erro
 *   - Exibição condicional de erros
 */

$erros = [];
$dados = ['nome' => '', 'email' => '', 'idade' => '', 'telefone' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitiza entradas
    $dados['nome']     = trim($_POST['nome'] ?? '');
    $dados['email']    = trim($_POST['email'] ?? '');
    $dados['idade']    = trim($_POST['idade'] ?? '');
    $dados['telefone'] = trim($_POST['telefone'] ?? '');

    // Validação do nome: mínimo 3 caracteres, só letras e espaços
    if ($dados['nome'] === '') {
        $erros['nome'] = "Nome é obrigatório.";
    } elseif (!preg_match('/^[A-Za-zÀ-ÿ ]{3,}$/u', $dados['nome'])) {
        $erros['nome'] = "Nome deve ter pelo menos 3 letras (sem números).";
    }

    // Validação de e-mail com filtro nativo
    if ($dados['email'] === '') {
        $erros['email'] = "E-mail é obrigatório.";
    } elseif (!filter_var($dados['email'], FILTER_VALIDATE_EMAIL)) {
        $erros['email'] = "E-mail inválido.";
    }

    // Validação de idade
    if ($dados['idade'] === '') {
        $erros['idade'] = "Idade é obrigatória.";
    } elseif (!filter_var($dados['idade'], FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1, 'max_range' => 120]
    ])) {
        $erros['idade'] = "Idade deve ser um número entre 1 e 120.";
    }

    // Validação de telefone (formato: (11) 91234-5678 ou 11912345678)
    if ($dados['telefone'] === '') {
        $erros['telefone'] = "Telefone é obrigatório.";
    } elseif (!preg_match('/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/', $dados['telefone'])) {
        $erros['telefone'] = "Telefone inválido. Use (11) 91234-5678.";
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>12 - Validação de Formulário</title>
    <style>
        body { font-family: sans-serif; max-width: 500px; margin: 20px auto; }
        label { display: block; margin-top: 10px; font-weight: bold; }
        input { width: 100%; padding: 6px; box-sizing: border-box; }
        .erro { color: #c00; font-size: 0.9em; }
        .sucesso { background: #cfc; padding: 10px; margin-top: 15px; border-radius: 4px; }
        button { margin-top: 15px; padding: 8px 16px; }
        input.invalido { border: 2px solid #c00; }
    </style>
</head>
<body>
    <h1>Cadastro</h1>

    <?php if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($erros)): ?>
        <div class="sucesso">
            <strong>Cadastro válido!</strong><br>
            Nome: <?= htmlspecialchars($dados['nome']) ?><br>
            E-mail: <?= htmlspecialchars($dados['email']) ?><br>
            Idade: <?= htmlspecialchars($dados['idade']) ?><br>
            Telefone: <?= htmlspecialchars($dados['telefone']) ?>
        </div>
    <?php endif; ?>

    <form method="POST" action="">
        <label>Nome:</label>
        <input type="text" name="nome"
               class="<?= isset($erros['nome']) ? 'invalido' : '' ?>"
               value="<?= htmlspecialchars($dados['nome']) ?>">
        <?php if (isset($erros['nome'])): ?>
            <div class="erro"><?= $erros['nome'] ?></div>
        <?php endif; ?>

        <label>E-mail:</label>
        <input type="text" name="email"
               class="<?= isset($erros['email']) ? 'invalido' : '' ?>"
               value="<?= htmlspecialchars($dados['email']) ?>">
        <?php if (isset($erros['email'])): ?>
            <div class="erro"><?= $erros['email'] ?></div>
        <?php endif; ?>

        <label>Idade:</label>
        <input type="text" name="idade"
               class="<?= isset($erros['idade']) ? 'invalido' : '' ?>"
               value="<?= htmlspecialchars($dados['idade']) ?>">
        <?php if (isset($erros['idade'])): ?>
            <div class="erro"><?= $erros['idade'] ?></div>
        <?php endif; ?>

        <label>Telefone:</label>
        <input type="text" name="telefone"
               class="<?= isset($erros['telefone']) ? 'invalido' : '' ?>"
               value="<?= htmlspecialchars($dados['telefone']) ?>">
        <?php if (isset($erros['telefone'])): ?>
            <div class="erro"><?= $erros['telefone'] ?></div>
        <?php endif; ?>

        <button type="submit">Enviar</button>
    </form>
</body>
</html>