"""
19 - Gerador de Senhas
Conceitos: random, string, join, validação, compreensão de listas
"""

import random
import string

def gerar_senha(tamanho=12, usar_maiusculas=True, usar_minusculas=True,
                usar_numeros=True, usar_simbolos=True):
    """Gera uma senha aleatória com base nas opções."""
    caracteres = ""
    if usar_maiusculas:
        caracteres += string.ascii_uppercase
    if usar_minusculas:
        caracteres += string.ascii_lowercase
    if usar_numeros:
        caracteres += string.digits
    if usar_simbolos:
        caracteres += "!@#$%^&*()-_=+"

    if not caracteres:
        return "Erro: selecione pelo menos um tipo de caractere."
    if tamanho < 4:
        return "Erro: tamanho mínimo é 4."

    return "".join(random.choice(caracteres) for _ in range(tamanho))

def avaliar_forca(senha):
    """Classifica a força da senha de 0 a 4."""
    pontos = 0
    if len(senha) >= 8:
        pontos += 1
    if len(senha) >= 12:
        pontos += 1
    if any(c.isupper() for c in senha) and any(c.islower() for c in senha):
        pontos += 1
    if any(c.isdigit() for c in senha):
        pontos += 1
    if any(c in "!@#$%^&*()-_=+" for c in senha):
        pontos += 1

    if pontos <= 1:
        return "Fraca"
    elif pontos == 2:
        return "Razoável"
    elif pontos == 3:
        return "Boa"
    elif pontos == 4:
        return "Forte"
    else:
        return "Muito Forte"

def main():
    print("=== GERADOR DE SENHAS ===\n")

    try:
        tamanho = int(input("Tamanho da senha (padrão 12): ") or "12")
    except ValueError:
        tamanho = 12

    print("\n--- Gerando 5 senhas variadas ---\n")

    configuracoes = [
        ("Só minúsculas",       {"usar_maiusculas": False, "usar_numeros": False, "usar_simbolos": False}),
        ("Letras + números",    {"usar_simbolos": False}),
        ("Letras + símbolos",   {"usar_numeros": False}),
        ("Só números",          {"usar_maiusculas": False, "usar_minusculas": False, "usar_simbolos": False}),
        ("Completa",            {}),
    ]

    for nome, opcoes in configuracoes:
        senha = gerar_senha(tamanho, **opcoes)
        print(f"{nome:<22} | {senha:<20} | {avaliar_forca(senha)}")

if __name__ == "__main__":
    main()