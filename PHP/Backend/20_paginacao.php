<?php
declare(strict_types=1);

/**
 * 20 - Paginacao
 *
 * Conceitos abordados:
 *   - Paginacao de resultados (LIMIT/OFFSET simulados)
 *   - array_slice para cortar pedaco do array
 *   - Calculo de total de paginas com ceil
 *   - Controle de pagina atual via query string (?pagina=N)
 *   - Links Anterior / Proxima
 *   - Validacao de limites com max e min
 *   - Preservacao de filtros na URL
 */

$arquivo = __DIR__ . '/itens_paginacao.json';

// Gera 100 itens ficticios caso o arquivo nao exista
if (!file_exists($arquivo)) {
    $itens = [];
    for ($i = 1; $i <= 100; $i++) {
        $itens[] = [
            'id'    => $i,
            'titulo'=> "Item numero $i",
            'valor' => rand(10, 999),
        ];
    }
    file_put_contents($arquivo, json_encode($itens, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$itens = json_decode(file_get_contents($arquivo), true) ?? [];

// ---------- Configuracao da paginacao ----------
$porPagina   = 10;
$totalItens  = count($itens);
$totalPaginas = (int) ceil($totalItens / $porPagina);

// Pagina atual: valida entre 1 e totalPaginas
$pagina = (int) ($_GET['pagina'] ?? 1);
$pagina = max(1, min($pagina, $totalPaginas > 0 ? $totalPaginas : 1));

// Offset e fatia atual
$offset = ($pagina - 1) * $porPagina;
$itensPagina = array_slice($itens, $offset, $porPagina);

// ---------- Links prev/next ----------
$temAnterior = $pagina > 1;
$temProxima  = $pagina < $totalPaginas;
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>20 - Paginacao</title>
    <style>
        body { font-family: sans-serif; max-width: 700px; margin: 20px auto; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
        th { background: #eee; }
        .paginacao { margin-top: 15px; display: flex; gap: 10px; align-items: center; }
        .paginacao a, .paginacao span {
            padding: 6px 12px; border: 1px solid #ccc;
            text-decoration: none; color: #333; border-radius: 4px;
        }
        .paginacao .atual { background: #333; color: #fff; }
        .paginacao .desabilitado { color: #aaa; border-color: #eee; }
    </style>
</head>
<body>
    <h1>Itens paginados</h1>

    <p>Total de itens: <strong><?= $totalItens ?></strong> |
       Pagina <strong><?= $pagina ?></strong> de <strong><?= $totalPaginas ?></strong> |
       Mostrando <?= count($itensPagina) ?> por pagina</p>

    <?php if (empty($itensPagina)): ?>
        <p><em>Nenhum item nesta pagina.</em></p>
    <?php else: ?>
        <table>
            <tr><th>ID</th><th>Titulo</th><th>Valor</th></tr>
            <?php foreach ($itensPagina as $item): ?>
                <tr>
                    <td><?= (int) $item['id'] ?></td>
                    <td><?= htmlspecialchars($item['titulo']) ?></td>
                    <td>R$ <?= number_format((float) $item['valor'], 2, ',', '.') ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>

    <div class="paginacao">
        <?php if ($temAnterior): ?>
            <a href="?pagina=<?= $pagina - 1 ?>">Anterior</a>
        <?php else: ?>
            <span class="desabilitado">Anterior</span>
        <?php endif; ?>

        <?php
        // Mostra no maximo 5 numeros ao redor da pagina atual
        $inicio = max(1, $pagina - 2);
        $fim    = min($totalPaginas, $pagina + 2);

        for ($i = $inicio; $i <= $fim; $i++):
            if ($i === $pagina): ?>
                <span class="atual"><?= $i ?></span>
            <?php else: ?>
                <a href="?pagina=<?= $i ?>"><?= $i ?></a>
            <?php endif;
        endfor;
        ?>

        <?php if ($temProxima): ?>
            <a href="?pagina=<?= $pagina + 1 ?>">Proxima</a>
        <?php else: ?>
            <span class="desabilitado">Proxima</span>
        <?php endif; ?>
    </div>
</body>
</html>