<?php
declare(strict_types=1);

/**
 * 19 - CRUD Simples
 *
 * Conceitos abordados:
 *   - CRUD: Create, Read, Update, Delete
 *   - Persistência em arquivo JSON (substitui o banco)
 *   - ID único por registro (uniqid)
 *   - Padrao PRG (Post/Redirect/Get) para evitar reenvio de formulario
 *   - array_filter e array_values para remover/atualizar itens
 *   - Uso de $_SERVER['REQUEST_METHOD'] para diferenciar acoes
 *   - htmlspecialchars em toda saida
 */

// ---------- Configuracao ----------
$arquivo = __DIR__ . '/produtos.json';

// Inicializa arquivo caso nao exista
if (!file_exists($arquivo)) {
    file_put_contents($arquivo, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// ---------- Funcoes auxiliares de persistencia ----------
function lerProdutos(string $arquivo): array
{
    $conteudo = file_get_contents($arquivo);
    $dados = json_decode($conteudo, true);
    return is_array($dados) ? $dados : [];
}

function gravarProdutos(string $arquivo, array $produtos): void
{
    file_put_contents(
        $arquivo,
        json_encode(array_values($produtos), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );
}

// ---------- Leitura inicial ----------
$produtos = lerProdutos($arquivo);
$mensagem = '';

// ---------- CREATE ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['acao'] ?? '') === 'criar') {
    $nome  = trim($_POST['nome'] ?? '');
    $preco = (float) ($_POST['preco'] ?? 0);
    $qtd   = (int) ($_POST['quantidade'] ?? 0);

    if ($nome === '' || $preco <= 0) {
        $mensagem = 'Preencha nome e preco corretamente.';
    } else {
        $produtos[] = [
            'id'         => uniqid('p_', true),
            'nome'       => $nome,
            'preco'      => $preco,
            'quantidade' => $qtd,
            'criado_em'  => date('d/m/Y H:i'),
        ];
        gravarProdutos($arquivo, $produtos);
        header('Location: 19_crud_simples.php?msg=criado');
        exit;
    }
}

// ---------- UPDATE ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['acao'] ?? '') === 'atualizar') {
    $id = $_POST['id'] ?? '';
    foreach ($produtos as &$p) {
        if ($p['id'] === $id) {
            $p['nome']       = trim($_POST['nome'] ?? $p['nome']);
            $p['preco']      = (float) ($_POST['preco'] ?? $p['preco']);
            $p['quantidade'] = (int) ($_POST['quantidade'] ?? $p['quantidade']);
            break;
        }
    }
    unset($p);
    gravarProdutos($arquivo, $produtos);
    header('Location: 19_crud_simples.php?msg=atualizado');
    exit;
}

// ---------- DELETE ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['acao'] ?? '') === 'deletar') {
    $id = $_POST['id'] ?? '';
    $produtos = array_values(array_filter($produtos, fn($p) => $p['id'] !== $id));
    gravarProdutos($arquivo, $produtos);
    header('Location: 19_crud_simples.php?msg=deletado');
    exit;
}

// Mensagens via query string (padrao PRG)
$msgParam = $_GET['msg'] ?? '';
$mensagens = [
    'criado'     => 'Produto criado com sucesso.',
    'atualizado' => 'Produto atualizado com sucesso.',
    'deletado'   => 'Produto removido com sucesso.',
];
if (isset($mensagens[$msgParam])) {
    $mensagem = $mensagens[$msgParam];
}

// ---------- READ: produto em edicao (opcional) ----------
$editando = null;
if (isset($_GET['editar'])) {
    foreach ($produtos as $p) {
        if ($p['id'] === $_GET['editar']) {
            $editando = $p;
            break;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>19 - CRUD Simples</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 20px auto; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
        th { background: #eee; }
        input { padding: 6px; margin-right: 6px; }
        .msg { background: #eef; padding: 10px; border-radius: 4px; margin: 10px 0; }
        form.inline { display: inline; }
    </style>
</head>
<body>
    <h1>CRUD de Produtos</h1>

    <?php if ($mensagem): ?>
        <div class="msg"><?= htmlspecialchars($mensagem) ?></div>
    <?php endif; ?>

    <h2><?= $editando ? 'Editar produto' : 'Novo produto' ?></h2>
    <form method="POST" action="">
        <input type="hidden" name="acao" value="<?= $editando ? 'atualizar' : 'criar' ?>">
        <?php if ($editando): ?>
            <input type="hidden" name="id" value="<?= htmlspecialchars($editando['id']) ?>">
        <?php endif; ?>

        <input type="text" name="nome" placeholder="Nome"
               value="<?= htmlspecialchars($editando['nome'] ?? '') ?>" required>
        <input type="number" step="0.01" name="preco" placeholder="Preco"
               value="<?= htmlspecialchars((string)($editando['preco'] ?? '')) ?>" required>
        <input type="number" name="quantidade" placeholder="Qtd"
               value="<?= htmlspecialchars((string)($editando['quantidade'] ?? '0')) ?>">

        <button type="submit"><?= $editando ? 'Salvar' : 'Adicionar' ?></button>
        <?php if ($editando): ?>
            <a href="19_crud_simples.php">Cancelar</a>
        <?php endif; ?>
    </form>

    <h2>Produtos cadastrados (<?= count($produtos) ?>)</h2>

    <?php if (empty($produtos)): ?>
        <p><em>Nenhum produto cadastrado.</em></p>
    <?php else: ?>
        <table>
            <tr><th>Nome</th><th>Preco</th><th>Qtd</th><th>Criado em</th><th>Acoes</th></tr>
            <?php foreach ($produtos as $p): ?>
                <tr>
                    <td><?= htmlspecialchars($p['nome']) ?></td>
                    <td>R$ <?= number_format((float)$p['preco'], 2, ',', '.') ?></td>
                    <td><?= (int)$p['quantidade'] ?></td>
                    <td><?= htmlspecialchars($p['criado_em']) ?></td>
                    <td>
                        <a href="?editar=<?= urlencode($p['id']) ?>">Editar</a>
                        <form class="inline" method="POST" action=""
                              onsubmit="return confirm('Remover este produto?');">
                            <input type="hidden" name="acao" value="deletar">
                            <input type="hidden" name="id" value="<?= htmlspecialchars($p['id']) ?>">
                            <button type="submit">Excluir</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>
</body>
</html>