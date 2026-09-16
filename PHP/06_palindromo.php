<?php
/**
 * 06 - Palíndromo
 * Conceitos: strings, strrev, strtolower, regex simples
 */

// Versão 1: usando strrev (nativo do PHP)
function ehPalindromo($texto) {
    return $texto === strrev($texto);
}

// Versão 2: comparando pontas
function ehPalindromoPontas($texto) {
    $inicio = 0;
    $fim = strlen($texto) - 1;
    while ($inicio < $fim) {
        if ($texto[$inicio] !== $texto[$fim]) {
            return false;
        }
        $inicio++;
        $fim--;
    }
    return true;
}

// Versão 3: ignorando espaços, pontuação e maiúsculas
function ehPalindromoLimpo($texto) {
    $limpo = preg_replace('/[^a-zA-Z0-9]/', '', $texto);
    $limpo = strtolower($limpo);
    return ehPalindromoPontas($limpo);
}

echo "Digite uma palavra ou frase: ";
$texto = trim(fgets(STDIN));

echo "\n\"$texto\" é palíndromo (direto)? " . (ehPalindromo($texto) ? "Sim" : "Não") . "\n";
echo "\"$texto\" é palíndromo (pontas)? " . (ehPalindromoPontas($texto) ? "Sim" : "Não") . "\n";
echo "\"$texto\" é palíndromo (limpo)?  " . (ehPalindromoLimpo($texto) ? "Sim" : "Não") . "\n";

// Exemplos prontos
echo "\n--- Exemplos ---\n";
$exemplos = ["arara", "Python", "A base do teto desaba", "ovo", "radar"];
foreach ($exemplos as $ex) {
    $marca = ehPalindromoLimpo($ex) ? "✅" : "❌";
    echo "$marca $ex\n";
}