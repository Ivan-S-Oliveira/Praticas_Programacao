<?php
/**
 * 05 - Fibonacci
 * Conceitos: arrays, for, recursão, implode
 */

function fibIterativo(int $n): int {
    $a = 0; $b = 1;
    for ($i = 0; $i < $n; $i++) {
        $temp = $a + $b;
        $a = $b;
        $b = $temp;
    }
    return $a;
}

function fibRecursivo(int $n): int {
    if ($n <= 1) return $n;
    return fibRecursivo($n - 1) + fibRecursivo($n - 2);
}

function fibSequencia(int $quantidade): array {
    $sequencia = [];
    $a = 0; $b = 1;
    for ($i = 0; $i < $quantidade; $i++) {
        $sequencia[] = $a;
        $temp = $a + $b;
        $a = $b;
        $b = $temp;
    }
    return $sequencia;
}

echo "Quantos números de Fibonacci deseja ver? ";
$n = (int) trim(fgets(STDIN));

if ($n <= 0) {
    echo "Digite um número positivo.\n";
    exit;
}

echo "\nSequência com $n termos:\n";
echo implode(", ", fibSequencia($n)) . "\n";

echo "\nO {$n}º número de Fibonacci é: " . fibIterativo($n) . "\n";

if ($n <= 20) {
    echo "(recursivo) " . fibRecursivo($n) . "\n";
}