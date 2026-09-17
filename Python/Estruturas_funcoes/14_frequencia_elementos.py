"""
14 - Frequência de Elementos
Conceitos: dicionários, collections.Counter, ordenação
"""

from collections import Counter

def frequencia_manual(lista):
    """Conta com dicionário puro."""
    contagem = {}
    for item in lista:
        contagem[item] = contagem.get(item, 0) + 1
    return contagem

def frequencia_counter(lista):
    """Usa Counter (mais idiomático)."""
    return dict(Counter(lista))

def elemento_mais_comum(lista):
    """Retorna o elemento que mais aparece."""
    if not lista:
        return None
    contagem = frequencia_manual(lista)
    return max(contagem, key=contagem.get)

def elementos_unicos(lista):
    """Retorna elementos que aparecem apenas uma vez."""
    contagem = frequencia_manual(lista)
    return [item for item, qtd in contagem.items() if qtd == 1]

def main():
    numeros = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]
    print(f"Lista: {numeros}")

    print(f"\n--- Frequência (manual) ---")
    freq = frequencia_manual(numeros)
    for item, qtd in sorted(freq.items()):
        print(f"  {item}: {qtd}x")

    print(f"\n--- Frequência (Counter) ---")
    print(f"  {frequencia_counter(numeros)}")

    print(f"\nMais comum: {elemento_mais_comum(numeros)}")
    print(f"Únicos:     {elementos_unicos(numeros)}")

    # Testando com strings
    letras = list("abracadabra")
    print(f"\nLetras de 'abracadabra':")
    for letra, qtd in sorted(frequencia_manual(letras).items()):
        print(f"  {letra}: {qtd}x")

if __name__ == "__main__":
    main()