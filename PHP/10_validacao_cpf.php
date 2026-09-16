<?php
/**
 * 10 - Validação de CPF
 * Conceitos: strings, regex, laços, cálculo de dígitos verificadores
 *
 * Regra: um CPF tem 11 dígitos. Os 9 primeiros são a base,
 * os 2 últimos são dígitos verificadores calculados por um algoritmo.
 */

function validarCpf($cpf) {
    // Remove tudo que não for dígito
    $cpf = preg_replace('/\D/', '', $cpf);

    // Deve ter 11 dígitos
    if (strlen($cpf) !== 11) {
        return false;
    }

    // Rejeita sequências repetidas (000.000.000-00, 111.111.111-11, etc.)
    if (preg_match('/^(\d)\1{10}$/', $cpf)) {
        return false;
    }

    // Cálculo do 1º dígito verificador
    $soma = 0;
    for ($i = 0; $i < 9; $i++) {
        $soma += (int) $cpf[$i] * (10 - $i);
    }
    $resto = $soma % 11;
    $digito1 = ($resto < 2) ? 0 : 11 - $resto;

    if ((int) $cpf[9] !== $digito1) {
        return false;
    }

    // Cálculo do 2º dígito verificador
    $soma = 0;
    for ($i = 0; $i < 10; $i++) {
        $soma += (int) $cpf[$i] * (11 - $i);
    }
    $resto = $soma % 11;
    $digito2 = ($resto < 2) ? 0 : 11 - $resto;

    if ((int) $cpf[10] !== $digito2) {
        return false;
    }

    return true;
}

function formatarCpf($cpf) {
    $cpf = preg_replace('/\D/', '', $cpf);
    if (strlen($cpf) !== 11) return $cpf;
    return substr($cpf, 0, 3) . '.' .
           substr($cpf, 3, 3) . '.' .
           substr($cpf, 6, 3) . '-' .
           substr($cpf, 9, 2);
}

echo "Digite um CPF (com ou sem pontuação): ";
$cpf = trim(fgets(STDIN));

if (validarCpf($cpf)) {
    echo "✅ CPF VÁLIDO: " . formatarCpf($cpf) . "\n";
} else {
    echo "❌ CPF INVÁLIDO.\n";
}

// Exemplos prontos
echo "\n--- Testes ---\n";
$exemplos = [
    "529.982.247-25",  // válido
    "111.444.777-35",  // válido
    "111.111.111-11",  // inválido (repetição)
    "123.456.789-00",  // inválido
    "52998224725",     // válido (sem pontuação)
    "123",             // inválido (curto)
];

foreach ($exemplos as $ex) {
    $status = validarCpf($ex) ? "✅ válido" : "❌ inválido";
    echo str_pad($ex, 20) . " → $status\n";
}