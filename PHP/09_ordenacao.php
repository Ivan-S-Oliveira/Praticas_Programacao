<?php
/**
 * 09 - Algoritmos de Ordenação
 * Conceitos: bubble sort, selection sort, funções nativas
 */

// Bubble Sort manual
function bubbleSort($arr) {
    $n = count($arr);
    for ($i = 0; $i < $n - 1; $i++) {
        for ($j = 0; $j < $n - 1 - $i; $j++) {
            if ($arr[$j] > $arr[$j + 1]) {
                $temp = $arr[$j];
                $arr[$j] = $arr[$j + 1];
                $arr[$j + 1] = $temp;
            }
        }
    }
    return $arr;
}

// Selection Sort manual
function selectionSort($arr) {
    $n = count($arr);
    for ($i = 0; $i < $n - 1; $i++) {
        $minIdx = $i;
        for ($j = $i + 1; $j < $n; $j++) {
            if ($arr[$j] < $arr[$minIdx]) {
                $minIdx = $j;
            }
        }
        if ($minIdx != $i) {
            $temp = $arr[$i];
            $arr[$i] = $arr[$minIdx];
            $arr[$minIdx] = $temp;
        }
    }
    return $arr;
}

$numeros = [64, 25, 12, 22, 11, 90, 45, 3, 78, 1];

echo "Original:        " . implode(", ", $numeros) . "\n";
echo "Bubble Sort:     " . implode(", ", bubbleSort($numeros)) . "\n";
echo "Selection Sort:  " . implode(", ", selectionSort($numeros)) . "\n";

// Função nativa
$nativo = $numeros;
sort($nativo);
echo "sort() nativo:   " . implode(", ", $nativo) . "\n";

// Ordenação de strings
$nomes = ["Carlos", "Ana", "Beatriz", "Daniel", "Eduardo", "Alice"];
$nomesOrdenados = $nomes;
sort($nomesOrdenados);
echo "\nNomes originais: " . implode(", ", $nomes) . "\n";
echo "Nomes ordenados: " . implode(", ", $nomesOrdenados) . "\n";

// Ordenação customizada (por comprimento da string)
$porTamanho = $nomes;
usort($porTamanho, fn($a, $b) => strlen($a) - strlen($b));
echo "Por tamanho:     " . implode(", ", $porTamanho) . "\n";

// Ordenação de array associativo por valor
$idades = [
    "Carlos" => 32,
    "Ana" => 25,
    "Beatriz" => 41,
    "Daniel" => 19,
];
asort($idades); // ordena mantendo as chaves
echo "\n--- Idades ordenadas ---\n";
foreach ($idades as $nome => $idade) {
    echo "$nome: $idade anos\n";
}