"""
08 - Fibonacci
Conceitos: sequências, listas, loops, recursão
Sequência: 0, 1, 1, 2, 3, 5, 8, 13, ...
"""

def fib_iterativo(n):
    """Retorna o n-ésimo número de Fibonacci (iterativo)."""
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

def fib_recursivo(n):
    """Versão recursiva (ineficiente para n grande)."""
    if n <= 1:
        return n
    return fib_recursivo(n - 1) + fib_recursivo(n - 2)

def fib_sequencia(quantidade):
    """Retorna uma lista com os primeiros N números."""
    sequencia = []
    a, b = 0, 1
    for _ in range(quantidade):
        sequencia.append(a)
        a, b = b, a + b
    return sequencia

def main():
    try:
        n = int(input("Quantos números de Fibonacci deseja ver? "))
    except ValueError:
        print("Valor inválido!")
        return

    if n <= 0:
        print("Digite um número positivo.")
        return

    print(f"\nSequência com {n} termos:")
    print(fib_sequencia(n))

    print(f"\nO {n}º número de Fibonacci é: {fib_iterativo(n)}")

    # Comparar com recursivo (só para n pequeno)
    if n <= 20:
        print(f"(recursivo) {fib_recursivo(n)}")

if __name__ == "__main__":
    main()