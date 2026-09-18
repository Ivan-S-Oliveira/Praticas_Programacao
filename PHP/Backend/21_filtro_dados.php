<?php
declare(strict_types=1);

/**
 * 21 - Filtro de Dados
 *
 * Conceitos abordados:
 *   - Filtros combinados (busca textual + categoria + faixa de preco)
 *   - array_filter com multiplas condicoes
 *   - Busca case-insensitive com stripos
 *   - Ordenacao com usort
 *   - Preservacao dos filtros na URL (http_build_query)
 *   - Validacao e saneamento dos parametros de filtro
 */

$arquivo = __DIR__ . '/produtos_filtro.json';

// Cria base de exemplo caso nao exista
if (!file_exists($arquivo)) {
    $categorias = ['Eletronicos', 'Livros', 'Roupas', 'Alimentos', 'Brinquedos'];
    $produtos = [];
    for ($i = 1; $i <= 50; $i++) {
        $produtos[] = [
            'id'        => $i,
            'nome'      => "Produto " . str_pad((string)$i, 3, '0', STR_PAD_LEFT),
            'categoria' => $categorias[array_rand($categorias)],
            'preco'     => rand(10, 500),
        ];
    }
    file_put_contents($arquivo, json_encode($produtos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$produtos = json_decode(file_get_contents($arquivo), true) ?? [];

// ---------- Le os filtros da URL ----------
$filtroBusca      = trim($_GET['busca'] ?? '');
$filtroCategoria  = trim($_GET['categoria'] ?? '');
$filtroPrecoMin   = $_GET['preco_min'] ?? '';
$filtroPrecoMax   = $_GET['preco_max'] ?? '';
$filtroOrdem      = $_GET['ordem'] ?? 'id_asc';

// Lista de categorias disponiveis (para o select)
$categorias = array_values(array_unique(array_column($produtos, 'categoria')));
sort($categorias);

// ---------- Aplica filtros ----------
$filtrados = array_filter($produtos, function ($p) use ($filtroBusca, $filtroCategoria, $filtroPrecoMin, $filtroPrecoMax) {
    if ($filtroBusca !== '' && stripos($p['nome'], $filtroBusca) === false) {
        return false;
    }
    if ($filtroCategoria !== '' && $p['categoria'] !== $filtroCategoria) {
        return false;
    }
    if ($filtroPrecoMin !== '' && $p['preco'] < (float) $filtroPrecoMin) {
        return false;
    }
    if ($filtroPrecoMax !== '' && $p['preco'] > (float) $filtroPrecoMax) {
        return false;
    }
    return true;
});
$filtrados = array_values($filtrados);

// ---------- Ordenacao ----------
usort($filtrados, function ($a, $b) use ($filtroOrdem) {
    switch ($filtroOrdem) {
        case 'nome_asc':   return strcasecmp($a['nome'], $b['nome']);
        case 'nome_desc':  return strcasecmp($b['nome'], $a['nome']);
        case 'preco_asc':  return $a['preco'] <=> $b['preco'];
        case 'preco_desc': return $b['preco'] <=> $a['preco'];
        default:           return $a['id'] <=> $b['id'];
    }
});

// Parametros atuais para preservar na URL
$parametros = array_filter([
    'busca'     => $filtroBusca,
    'categoria' => $filtroCategoria,
    'preco_min' => $filtroPrecoMin,
    'preco_max' => $filtroPrecoMax,
    'ordem'     => $filtroOrdem,
], fn($v) => $v !== '');
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>21 - Filtro de Dados</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 20px auto; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
        th { background: #eee; }
        form.filtros { display: flex; flex-wrap: wrap; gap: 8px; align-items: end;
                       background: #f4f4f4; padding: 12px; border-radius: 6px; }
        form.filtros label { display: flex; flex-direction: column; font-size: 0.85em; }
        input, select { padding: 6px; }
        button { padding: 6px 14px; }
    </style>
</head>
<body>
    <h1>Filtro de Produtos</h1>

    <form class="filtros" method="GET" action="">
        <label>Busca por nome
            <input type="text" name="busca" value="<?= htmlspecialchars($filtroBusca) ?>">
        </label>

        <label>Categoria
            <select name="categoria">
                <option value="">Todas</option>
                <?php foreach ($categorias as $c): ?>
                    <option value="<?= htmlspecialchars($c) ?>"
                        <?= $filtroCategoria === $c ? 'selected' : '' ?>>
                        <?= htmlspecialchars($c) ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </label>

        <label>Preco minimo
            <input type="number" name="preco_min" value="<?= htmlspecialchars((string)$filtroPrecoMin) ?>">
        </label>

        <label>Preco maximo
            <input type="number" name="preco_max" value="<?= htmlspecialchars((string)$filtroPrecoMax) ?>">
        </label>

        <label>Ordenar por
            <select name="ordem">
                <option value="id_asc"     <?= $filtroOrdem === 'id_asc'     ? 'selected' : '' ?>>ID</option>
                <option value="nome_asc"   <?= $filtroOrdem === 'nome_asc'   ? 'selected' : '' ?>>Nome (A-Z)</option>
                <option value="nome_desc"  <?= $filtroOrdem === 'nome_desc'  ? 'selected' : '' ?>>Nome (Z-A)</option>
                <option value="preco_asc"  <?= $filtroOrdem === 'preco_asc'  ? 'selected' : '' ?>>Preco (menor)</option>
                <option value="preco_desc" <?= $filtroOrdem === 'preco_desc' ? 'selected' : '' ?>>Preco (maior)</option>
            </select>
        </label>

        <button type="submit">Filtrar</button>
        <a href="21_filtro_dados.php">Limpar</a>
    </form>

    <p><strong><?= count($filtrados) ?></strong> produto(s) encontrado(s).</p>

    <?php if (empty($filtrados)): ?>
        <p><em>Nenhum produto corresponde aos filtros.</em></p>
    <?php else: ?>
        <table>
            <tr><th>ID</th><th>Nome</th><th>Categoria</th><th>Preco</th></tr>
            <?php foreach ($filtrados as $p): ?>
                <tr>
                    <td><?= (int) $p['id'] ?></td>
                    <td><?= htmlspecialchars($p['nome']) ?></td>
                    <td><?= htmlspecialchars($p['categoria']) ?></td>
                    <td>R$ <?= number_format((float) $p['preco'], 2, ',', '.') ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>
</body>
</html>