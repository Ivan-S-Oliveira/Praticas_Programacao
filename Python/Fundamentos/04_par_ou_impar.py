"""
04 - Par ou Ímpar
Conceitos: operador módulo (%), if/else
"""

def eh_par(numero):
    """Retorna True se o número for par, False se for ímpar."""
    return numero % 2 == 0

def main():
    try:
        numero = int(input("Digite um número inteiro: "))
    except ValueError:
        print("Entrada inválida!")
        return

    if eh_par(numero):
        print(f"O número {numero} é Par!")
    else:
        print(f"O número {numero} é Ímpar!")

    # Bônus: verificar vários números
    print("\n--- Verificando de 1 a 10 ---")
    for i in range(1, 11):
        tipo = "par" if eh_par(i) else "ímpar"
        print(f"{i} é {tipo}")

if __name__ == "__main__":
    main()