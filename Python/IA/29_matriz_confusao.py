"""
29 - Matriz de Confusao
Conceitos: matriz de confusao, VP, FP, FN, VN, multiclasse

A matriz de confusao mostra o desempenho de um classificador:
cada linha representa a classe REAL, cada coluna a classe PREVISTA.

Caso binario:
  - VP (verdadeiro positivo): previsto positivo, era positivo
  - FP (falso positivo):      previsto positivo, era negativo
  - FN (falso negativo):      previsto negativo, era positivo
  - VN (verdadeiro negativo): previsto negativo, era negativo
"""

from collections import Counter


def matriz_confusao_binaria(reais, previstos, positivo=1, negativo=0):
    """Retorna (VP, FP, FN, VN) para um problema binario."""
    vp = fp = fn = vn = 0
    for r, p in zip(reais, previstos):
        if r == positivo and p == positivo:
            vp += 1
        elif r == negativo and p == positivo:
            fp += 1
        elif r == positivo and p == negativo:
            fn += 1
        elif r == negativo and p == negativo:
            vn += 1
    return vp, fp, fn, vn


def matriz_confusao_multiclasse(reais, previstos, classes=None):
    """Retorna matriz NxN: linhas = classe real, colunas = classe prevista."""
    if classes is None:
        classes = sorted(set(reais) | set(previstos))
    indice = {c: i for i, c in enumerate(classes)}
    n = len(classes)
    matriz = [[0] * n for _ in range(n)]
    for r, p in zip(reais, previstos):
        matriz[indice[r]][indice[p]] += 1
    return classes, matriz


def imprimir_matriz_binaria(vp, fp, fn, vn):
    print("                    PREVISTO")
    print("                 Positivo   Negativo")
    print(f"  REAL Positivo    {vp:^8}   {fn:^8}")
    print(f"       Negativo    {fp:^8}   {vn:^8}")


def imprimir_matriz_multiclasse(classes, matriz):
    largura = max(len(str(c)) for c in classes) + 2
    cabecalho = " " * (largura + 2) + "PREVISTO"
    print(cabecalho)

    linha_classes = " " * (largura + 2)
    for c in classes:
        linha_classes += f"{str(c):>{largura}}"
    print(linha_classes)

    print(" " * (largura + 1) + "REAL")
    for i, c in enumerate(classes):
        linha = f"{str(c):>{largura}} |"
        for j in range(len(classes)):
            linha += f"{matriz[i][j]:>{largura}}"
        print(linha)


def acuracia(vp, fp, fn, vn):
    total = vp + fp + fn + vn
    return (vp + vn) / total if total else 0.0


def interpretar(vp, fp, fn, vn):
    """Retorna um dicionario com interpretacao dos valores."""
    return {
        "verdadeiros_positivos": vp,
        "falsos_positivos": fp,
        "falsos_negativos": fn,
        "verdadeiros_negativos": vn,
        "total": vp + fp + fn + vn,
        "acuracia": acuracia(vp, fp, fn, vn),
    }


def main():
    print("=== MATRIZ DE CONFUSAO ===\n")

    # Exemplo binario: 1 = doente, 0 = saudavel
    reais =     [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1]
    previstos = [1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1]

    vp, fp, fn, vn = matriz_confusao_binaria(reais, previstos, 1, 0)

    print("--- Matriz de confusao (binaria) ---")
    imprimir_matriz_binaria(vp, fp, fn, vn)

    print("\n--- Interpretacao ---")
    info = interpretar(vp, fp, fn, vn)
    for chave, valor in info.items():
        if chave == "acuracia":
            print(f"  {chave:<25}: {valor:.2%}")
        else:
            print(f"  {chave:<25}: {valor}")

    # Comparacao com a contagem de rotulos
    print("\n--- Distribuicao das classes ---")
    print(f"  Reais:     {dict(Counter(reais))}")
    print(f"  Previstos: {dict(Counter(previstos))}")

    # Exemplo multiclasse
    print("\n--- Matriz de confusao (multiclasse) ---")
    reais_mc =     ["gato", "gato", "cachorro", "cachorro", "passaro",
                    "passaro", "gato", "cachorro", "passaro", "gato"]
    previstos_mc = ["gato", "cachorro", "cachorro", "cachorro", "passaro",
                    "gato", "gato", "passaro", "passaro", "gato"]

    classes, matriz = matriz_confusao_multiclasse(reais_mc, previstos_mc)
    imprimir_matriz_multiclasse(classes, matriz)

    # Contagem por classe
    print("\n--- Desempenho por classe ---")
    for i, c in enumerate(classes):
        total_real = sum(matriz[i])
        acertos = matriz[i][i]
        acc = acertos / total_real if total_real else 0.0
        print(f"  {c:<10}: {acertos}/{total_real} corretos ({acc:.1%})")


if __name__ == "__main__":
    main()