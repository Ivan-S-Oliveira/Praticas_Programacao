"""
09 - Número Primo
Conceitos: loops, break, otimização com raiz quadrada
Primo: divisível apenas por 1 e por ele mesmo (>1).
"""

import math

def eh_primo(n):
    """Verifica se n é primo (versão otimizada)."""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    # Só precisamos testar até a raiz quadrada de n
    limite = int(math.sqrt(n)) + 1
    for i in range(3, limite, 2):
        if n % i == 0:
            return False
    return True

def primos_ate(limite):
    """Retorna lista de primos até um limite."""
    return [n for n in range(2, limite + 1) if eh_primo(n)]

def main():
    try:
        n = int(input("Digite um número: "))
    except ValueError:
        print("Valor inválido!")
        return

    if eh_primo(n):
        print(f"{n} é Primo!")
    else:
        print(f"{n} Não é Primo!")

    # Mostrar primos até 50
    print(f"\nPrimos até 50: {primos_ate(50)}")

if __name__ == "__main__":
    main()