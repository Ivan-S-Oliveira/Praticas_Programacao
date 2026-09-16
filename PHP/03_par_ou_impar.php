<?php
/**
 * 03 - Par ou Ímpar
 * Conceitos: %, if/else, for, ternário
 */

echo "Digite um número inteiro: ";
$numero = (int) trim(fgets(STDIN));

if ($numero % 2 == 0) {
    echo "O número $numero é PAR.\n";
} else {
    echo "O número $numero é ÍMPAR.\n";
}

// Bônus: verificar de 1 a 10
echo "\n--- Verificando de 1 a 10 ---\n";
for ($i = 1; $i <= 10; $i++) {
    $tipo = ($i % 2 == 0) ? "par" : "ímpar";
    echo "$i é $tipo\n";
}