"""
06 - Ano Bissexto
Conceitos: operadores lógicos (and, or, not)
Regra: bissexto se divisível por 4,
       exceto séculos (divisíveis por 100),
       a menos que também seja por 400.
"""

def eh_bissexto(ano):
    if ano % 400 == 0:
        return True
    if ano % 100 == 0:
        return False
    if ano % 4 == 0:
        return True
    return False

def eh_bissexto_compacto(ano):
    """Versão de uma linha."""
    return (ano % 4 == 0 and ano % 100 != 0) or (ano % 400 == 0)

def main():
    try:
        ano = int(input("Digite um ano: "))
    except ValueError:
        print("Ano inválido!")
        return

    if eh_bissexto(ano):
        print(f"{ano} é Bissexto!")
    else:
        print(f"{ano} Não é Bissexto!")

    # Testando exemplos conhecidos
    print("\n--- Testes ---")
    for a in [1900, 2000, 2020, 2023, 2024, 2100]:
        status = "bissexto" if eh_bissexto_compacto(a) else "não bissexto"
        print(f"{a}: {status}")

if __name__ == "__main__":
    main()