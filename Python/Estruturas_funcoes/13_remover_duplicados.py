"""
13 - Remover Duplicados
Conceitos: set, dict.fromkeys, preservação de ordem
"""

def remover_com_set(lista):
    """Mais rápido, mas PERDE a ordem original."""
    return list(set(lista))

def remover_preservando_ordem(lista):
    """Usa dict.fromkeys — preserva a ordem (Python 3.7+)."""
    return list(dict.fromkeys(lista))

def remover_manual(lista):
    """Sem recursos mágicos: itera e checa."""
    vistos = []
    for item in lista:
        if item not in vistos:
            vistos.append(item)
    return vistos

def contar_duplicados(lista):
    """Retorna um dict com quantas vezes cada item aparece."""
    contagem = {}
    for item in lista:
        contagem[item] = contagem.get(item, 0) + 1
    return {k: v for k, v in contagem.items() if v > 1}

def main():
    numeros = [1, 3, 2, 3, 5, 1, 4, 2, 5, 5, 6, 7, 7, 8]
    print(f"Lista original: {numeros}")

    print(f"\nCom set (sem ordem): {remover_com_set(numeros)}")
    print(f"Preservando ordem:   {remover_preservando_ordem(numeros)}")
    print(f"Manual:              {remover_manual(numeros)}")

    duplicados = contar_duplicados(numeros)
    print(f"\n--- Duplicados ---")
    for item, qtd in duplicados.items():
        print(f"  {item} aparece {qtd}x")

    # Testando com strings
    palavras = ["python", "java", "python", "csharp", "java", "go"]
    print(f"\nPalavras originais: {palavras}")
    print(f"Sem duplicatas:     {remover_preservando_ordem(palavras)}")

if __name__ == "__main__":
    main()