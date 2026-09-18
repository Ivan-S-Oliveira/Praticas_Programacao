<?php
/**
 * 08 - Operações com Arrays
 * Conceitos: funções nativas de array
 */

$numeros = [45, 12, 78, 3, 99, 23, 56, 7, 88, 34];

echo "Array original: " . implode(", ", $numeros) . "\n\n";

// Soma e média
$soma = array_sum($numeros);
$media = $soma / count($numeros);
echo "Soma:  $soma\n";
echo "Média: " . number_format($media, 2, ',', '.') . "\n";

// Maior e menor (sem usar max/min direto — só pra treinar)
$maior = $numeros[0];
$menor = $numeros[0];
foreach ($numeros as $n) {
    if ($n > $maior) $maior = $n;
    if ($n < $menor) $menor = $n;
}
echo "Maior: $maior\n";
echo "Menor: $menor\n";

// Usando funções nativas
echo "Maior (max): " . max($numeros) . "\n";
echo "Menor (min): " . min($numeros) . "\n";

// Pares e ímpares
$pares = array_filter($numeros, fn($n) => $n % 2 == 0);
$impares = array_filter($numeros, fn($n) => $n % 2 != 0);
echo "\nPares:   " . implode(", ", $pares) . "\n";
echo "Ímpares: " . implode(", ", $impares) . "\n";

// Dobro de cada número (array_map)
$dobro = array_map(fn($n) => $n * 2, $numeros);
echo "\nDobro:   " . implode(", ", $dobro) . "\n";

// Ordenação
$crescente = $numeros;
sort($crescente);
echo "\nCrescente:  " . implode(", ", $crescente) . "\n";

$decrescente = $numeros;
rsort($decrescente);
echo "Decrescente: " . implode(", ", $decrescente) . "\n";

// Busca
$procurado = 99;
if (in_array($procurado, $numeros)) {
    echo "\n$procurado está no array (índice: " . array_search($procurado, $numeros) . ")\n";
}

// Remover duplicatas (exemplo com array extra)
$comDuplicatas = [1, 2, 2, 3, 4, 4, 4, 5, 5];
$unicos = array_values(array_unique($comDuplicatas));
echo "\nCom duplicatas: " . implode(", ", $comDuplicatas) . "\n";
echo "Sem duplicatas: " . implode(", ", $unicos) . "\n";