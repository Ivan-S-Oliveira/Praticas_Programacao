"""
07 - Fatorial
Conceitos: loops (for/while), recursão, função math.factorial
"""

import math

def fatorial_iterativo(n):
    """Calcula n! usando laço for."""
    if n < 0:
        return None
    resultado = 1
    for i in range(2, n + 1):
        resultado *= i
    return resultado

def fatorial_while(n):
    """Mesma coisa, mas com while."""
    if n < 0:
        return None
    resultado = 1
    while n > 1:
        resultado *= n
        n -= 1
    return resultado

def fatorial_recursivo(n):
    """Versão recursiva: n! = n * (n-1)!"""
    if n < 0:
        return None
    if n == 0 or n == 1:
        return 1
    return n * fatorial_recursivo(n - 1)

def main():
    try:
        n = int(input("Digite um número inteiro não-negativo: "))
    except ValueError:
        print("Valor inválido!")
        return

    print(f"\n{n}! (iterativo): {fatorial_iterativo(n)}")
    print(f"{n}! (while):     {fatorial_while(n)}")
    print(f"{n}! (recursivo): {fatorial_recursivo(n)}")
    print(f"{n}! (math):      {math.factorial(n)}")

if __name__ == "__main__":
    main()