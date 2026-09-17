"""
05 - Maior de Três
Conceitos: comparações, função max(), lógica condicional
"""

def maior_de_tres(a, b, c):
    """Retorna o maior entre três números."""
    if a >= b and a >= c:
        return a
    elif b >= a and b >= c:
        return b
    else:
        return c

def maior_de_tres_pythonico(a, b, c):
    """Usa a função embutida max()."""
    return max(a, b, c)

def main():
    try:
        n1 = float(input("Digite o 1º número: "))
        n2 = float(input("Digite o 2º número: "))
        n3 = float(input("Digite o 3º número: "))
    except ValueError:
        print("Entrada inválida!")
        return

    # Duas formas de fazer a mesma coisa
    resultado1 = maior_de_tres(n1, n2, n3)
    resultado2 = maior_de_tres_pythonico(n1, n2, n3)

    print(f"\nMaior (lógica manual): {resultado1}")
    print(f"Maior (usando max()):  {resultado2}")

if __name__ == "__main__":
    main()