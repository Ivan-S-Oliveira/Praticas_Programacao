<?php
/**
 * 01 - Olá Mundo
 * Conceitos: echo, variáveis, concatenação, entrada do usuário
 */

// 1. O clássico
echo "Olá, Mundo!\n";

// 2. Variáveis
$nome = "Estudante";
$idade = 25;
echo "Olá, $nome! Você tem $idade anos.\n";

// 3. Entrada do usuário (via terminal)
echo "Digite seu nome: ";
$nomeUsuario = trim(fgets(STDIN));
echo "Bem-vindo(a), $nomeUsuario!\n";

// 4. Operação simples
echo "Em que ano você nasceu? ";
$anoNascimento = (int) trim(fgets(STDIN));
$anoAtual = 2026;
$idadeUsuario = $anoAtual - $anoNascimento;
echo "Você tem aproximadamente $idadeUsuario anos.\n";