"""
15 - Ordenar Lista
Conceitos: sorted, sort, key, lambda, ordenação customizada
"""

def ordenar_crescente(lista):
    return sorted(lista)

def ordenar_decrescente(lista):
    return sorted(lista, reverse=True)

def ordenar_por_par_impar(lista):
    """Pares primeiro, depois ímpares. Dentro de cada grupo, ordem crescente."""
    return sorted(lista, key=lambda x: (x % 2, x))

def ordenar_por_valor_absoluto(lista):
    return sorted(lista, key=abs)

def ordenar_strings_por_tamanho(lista):
    return sorted(lista, key=len)

def ordenar_sem_funcoes_nativas(lista):
    """Bubble sort manual — para entender o algoritmo."""
    arr = lista.copy()
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

def main():
    numeros = [45, -12, 78, 3, -99, 23, 56, -7, 88, 34]
    print(f"Original:               {numeros}")
    print(f"Crescente:              {ordenar_crescente(numeros)}")
    print(f"Decrescente:            {ordenar_decrescente(numeros)}")
    print(f"Pares depois ímpares:   {ordenar_por_par_impar(numeros)}")
    print(f"Por valor absoluto:     {ordenar_por_valor_absoluto(numeros)}")
    print(f"Bubble sort manual:     {ordenar_sem_funcoes_nativas(numeros)}")

    palavras = ["python", "c", "javascript", "go", "rust", "java"]
    print(f"\nPalavras originais:     {palavras}")
    print(f"Por tamanho:            {ordenar_strings_por_tamanho(palavras)}")
    print(f"Alfabética:             {ordenar_crescente(palavras)}")

if __name__ == "__main__":
    main()