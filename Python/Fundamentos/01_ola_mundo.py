"""
01 - Olá Mundo
Conceitos: print, variáveis, input, f-strings
"""

# 1. Olá Mundo
print("Olá, Mundo!")

# 2. Variáveis
nome = "Estudante"
idade = 25
print(f"Olá, {nome}! Você tem {idade} anos.")

# 3. Entrada do usuário
nome_usuario = input("Digite seu nome: ")
print(f"Bem-vindo(a), {nome_usuario}!")

# 4. Operações simples com variáveis
ano_atual = 2026
ano_nascimento = int(input("Em que ano você nasceu? "))
idade_usuario = ano_atual - ano_nascimento
print(f"Você tem aproximadamente {idade_usuario} anos.")