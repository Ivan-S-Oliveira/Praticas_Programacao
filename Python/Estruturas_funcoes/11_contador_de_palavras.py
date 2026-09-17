"""
11 - Contador de Palavras
Conceitos: strings, split, dicionários, sorted, lambda
"""

def limpar_palavra(palavra):
    """Remove pontuação e converte para minúsculas."""
    return "".join(c.lower() for c in palavra if c.isalnum())

def contar_palavras(texto):
    """Retorna um dicionário com a frequência de cada palavra."""
    frequencia = {}
    for palavra in texto.split():
        limpa = limpar_palavra(palavra)
        if limpa:
            frequencia[limpa] = frequencia.get(limpa, 0) + 1
    return frequencia

def top_palavras(frequencia, n=5):
    """Retorna as N palavras mais frequentes como lista de tuplas."""
    return sorted(frequencia.items(), key=lambda item: item[1], reverse=True)[:n]

def exibir_relatorio(texto):
    freq = contar_palavras(texto)
    print(f"\nTexto analisado:\n  {texto}")
    print(f"\nTotal de palavras únicas: {len(freq)}")
    print(f"Total de palavras (com repetição): {sum(freq.values())}")

    print("\n--- Top 5 palavras ---")
    for palavra, qtd in top_palavras(freq, 5):
        print(f"  {palavra:<15} → {qtd}x")

def main():
    texto = input("Digite um texto: ")
    exibir_relatorio(texto)

if __name__ == "__main__":
    main()