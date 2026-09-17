"""
10 - Palíndromo
Conceitos: strings, slicing, manipulação de texto
Palíndromo: palavra/frase que se lê igual de trás pra frente.
Ex: "arara", "ovo", "A base do teto desaba"
"""

def eh_palindromo(texto):
    """Versão simples com slicing."""
    return texto == texto[::-1]

def eh_palindromo_limpo(texto):
    """Ignora espaços, pontuação e maiúsculas."""
    limpo = "".join(c.lower() for c in texto if c.isalnum())
    return limpo == limpo[::-1]

def main():
    texto = input("Digite uma palavra ou frase: ")

    # Versão simples
    if eh_palindromo(texto):
        print(f'"{texto}" é palíndromo (comparação direta).')
    else:
        print(f'"{texto}" não é palíndromo (comparação direta).')

    # Versão "limpa" (ignora espaços/capitalização)
    if eh_palindromo_limpo(texto):
        print(f'"{texto}" é palíndromo (ignorando espaços/maiúsculas).')
    else:
        print(f'"{texto}" não é palíndromo (ignorando espaços/maiúsculas).')

    # Exemplos prontos
    print("\n--- Exemplos ---")
    exemplos = ["arara", "Python", "A base do teto desaba", "ovo", "radar"]
    for ex in exemplos:
        marca = "é palíndromo" if eh_palindromo_limpo(ex) else "não é palíndromo"
        print(f"{marca} {ex}")

if __name__ == "__main__":
    main()