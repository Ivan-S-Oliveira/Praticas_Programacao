<?php
/**
 * 04 - Fatorial
 * Conceitos: for, while, recursão
 */

function fatorialIterativo(int $n): int {
    if ($n < 0) return -1;
    $resultado = 1;
    for ($i = 2; $i <= $n; $i++) {
        $resultado *= $i;
    }
    return $resultado;
}

function fatorialWhile(int $n): int {
    if ($n < 0) return -1;
    $resultado = 1;
    while ($n > 1) {
        $resultado *= $n;
        $n--;
    }
    return $resultado;
}

function fatorialRecursivo(int $n): int {
    if ($n < 0) return -1;
    if ($n == 0 || $n == 1) return 1;
    return $n * fatorialRecursivo($n - 1);
}

echo "Digite um número inteiro não-negativo: ";
$n = (int) trim(fgets(STDIN));

echo "\n$n! (for):      " . fatorialIterativo($n) . "\n";
echo "$n! (while):    " . fatorialWhile($n) . "\n";
echo "$n! (recursivo): " . fatorialRecursivo($n) . "\n";