<?php
/**
 * 07 - Contador de Palavras
 * Conceitos: explode, str_word_count, arrays associativos
 */

echo "Digite um texto: ";
$texto = trim(fgets(STDIN));

// Total de palavras (método nativo)
$totalNativo = str_word_count($texto);
echo "\nTotal de palavras (str_word_count): $totalNativo\n";

// Total de palavras (explode)
$palavras = preg_split('/\s+/', trim($texto));
$palavras = array_filter($palavras); // remove vazios
echo "Total de palavras (explode):        " . count($palavras) . "\n";

// Total de caracteres
echo "Total de caracteres (com espaços):  " . strlen($texto) . "\n";
echo "Total de caracteres (sem espaços):  " . strlen(str_replace(' ', '', $texto)) . "\n";

// Frequência de cada palavra
$frequencia = [];
foreach ($palavras as $palavra) {
    $limpa = strtolower(preg_replace('/[^a-zA-ZÀ-ÿ0-9]/u', '', $palavra));
    if ($limpa === '') continue;
    if (isset($frequencia[$limpa])) {
        $frequencia[$limpa]++;
    } else {
        $frequencia[$limpa] = 1;
    }
}

// Ordena do mais frequente para o menos
arsort($frequencia);

echo "\n--- Frequência das palavras ---\n";
foreach ($frequencia as $palavra => $qtd) {
    echo str_pad($palavra, 15) . " → $qtd vez(es)\n";
}