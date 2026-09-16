<?php
/**
 * 02 - Calculadora
 * Conceitos: if/elseif, switch, operadores, validação
 */

function somar($a, $b) { return $a + $b; }
function subtrair($a, $b) { return $a - $b; }
function multiplicar($a, $b) { return $a * $b; }

function dividir($a, $b) {
    if ($b == 0) {
        return "Erro: divisão por zero!";
    }
    return $a / $b;
}

echo "=== CALCULADORA ===\n";
echo "1 - Somar\n";
echo "2 - Subtrair\n";
echo "3 - Multiplicar\n";
echo "4 - Dividir\n";
echo "Escolha uma opção (1-4): ";
$opcao = trim(fgets(STDIN));

echo "Digite o primeiro número: ";
$num1 = (float) trim(fgets(STDIN));

echo "Digite o segundo número: ";
$num2 = (float) trim(fgets(STDIN));

switch ($opcao) {
    case "1":
        echo "Resultado: " . somar($num1, $num2) . "\n";
        break;
    case "2":
        echo "Resultado: " . subtrair($num1, $num2) . "\n";
        break;
    case "3":
        echo "Resultado: " . multiplicar($num1, $num2) . "\n";
        break;
    case "4":
        echo "Resultado: " . dividir($num1, $num2) . "\n";
        break;
    default:
        echo "Opção inválida!\n";
}