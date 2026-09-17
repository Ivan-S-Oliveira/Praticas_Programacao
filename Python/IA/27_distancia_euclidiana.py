"""
27 - Distancia Euclidiana
Conceitos: math.sqrt, listas, compreensao, normalizacao

A distancia euclidiana e a base de muitos algoritmos de IA,
incluindo o k-NN (k vizinhos mais proximos).
Formula: d(p, q) = sqrt( sum( (p_i - q_i)^2 ) )
"""

import math


def distancia_euclidiana(p, q):
    """Distancia euclidiana classica entre dois pontos de mesma dimensao."""
    if len(p) != len(q):
        raise ValueError("Os pontos precisam ter a mesma dimensao.")
    soma = 0.0
    for i in range(len(p)):
        soma += (p[i] - q[i]) ** 2
    return math.sqrt(soma)


def distancia_euclidiana_pythonica(p, q):
    """Mesma coisa com sum + generator."""
    if len(p) != len(q):
        raise ValueError("Os pontos precisam ter a mesma dimensao.")
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(p, q)))


def distancia_manhattan(p, q):
    """Distancia de Manhattan: soma dos valores absolutos das diferencas."""
    if len(p) != len(q):
        raise ValueError("Os pontos precisam ter a mesma dimensao.")
    return sum(abs(a - b) for a, b in zip(p, q))


def distancia_chebyshev(p, q):
    """Distancia de Chebyshev: maior diferenca absoluta em qualquer dimensao."""
    if len(p) != len(q):
        raise ValueError("Os pontos precisam ter a mesma dimensao.")
    return max(abs(a - b) for a, b in zip(p, q))


def distancia_minkowski(p, q, ordem=2):
    """Generalizacao: ordem=1 -> Manhattan, ordem=2 -> Euclidiana."""
    if len(p) != len(q):
        raise ValueError("Os pontos precisam ter a mesma dimensao.")
    soma = sum(abs(a - b) ** ordem for a, b in zip(p, q))
    return soma ** (1 / ordem)


def normalizar(vetor):
    """Normaliza um vetor para norma unitaria (comprimento 1)."""
    norma = math.sqrt(sum(x * x for x in vetor))
    if norma == 0:
        return list(vetor)
    return [x / norma for x in vetor]


def distancia_cosseno(p, q):
    """1 - similaridade do cosseno. Util para vetores de features."""
    produto = sum(a * b for a, b in zip(p, q))
    norma_p = math.sqrt(sum(a * a for a in p))
    norma_q = math.sqrt(sum(b * b for b in q))
    if norma_p == 0 or norma_q == 0:
        return 1.0
    similaridade = produto / (norma_p * norma_q)
    return 1 - similaridade


def matriz_distancias(pontos):
    """Retorna matriz NxN com distancia euclidiana entre todos os pares."""
    n = len(pontos)
    matriz = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(i + 1, n):
            d = distancia_euclidiana(pontos[i], pontos[j])
            matriz[i][j] = d
            matriz[j][i] = d
    return matriz


def ponto_mais_proximo(alvo, pontos):
    """Retorna (indice, distancia) do ponto mais proximo do alvo."""
    if not pontos:
        return None, None
    menor_dist = float("inf")
    menor_idx = -1
    for i, p in enumerate(pontos):
        d = distancia_euclidiana(alvo, p)
        if d < menor_dist:
            menor_dist = d
            menor_idx = i
    return menor_idx, menor_dist


def main():
    print("=== DISTANCIA EUCLIDIANA ===\n")

    p = [1, 2, 3]
    q = [4, 6, 8]

    print(f"Ponto P: {p}")
    print(f"Ponto Q: {q}\n")

    print(f"Euclidiana (manual):   {distancia_euclidiana(p, q):.4f}")
    print(f"Euclidiana (pythonica):{distancia_euclidiana_pythonica(p, q):.4f}")
    print(f"Manhattan:             {distancia_manhattan(p, q):.4f}")
    print(f"Chebyshev:             {distancia_chebyshev(p, q):.4f}")
    print(f"Minkowski (p=3):       {distancia_minkowski(p, q, 3):.4f}")
    print(f"Cosseno (1 - sim):     {distancia_cosseno(p, q):.4f}")

    print("\n--- Matriz de distancias ---")
    pontos = [[0, 0], [3, 4], [1, 1], [10, 10]]
    for i, linha in enumerate(matriz_distancias(pontos)):
        formatada = "  ".join(f"{d:>6.2f}" for d in linha)
        print(f"  [{i}] {formatada}")

    print("\n--- Ponto mais proximo ---")
    alvo = [2, 2]
    idx, dist = ponto_mais_proximo(alvo, pontos)
    print(f"Alvo: {alvo}")
    print(f"Mais proximo: {pontos[idx]} (indice {idx}), distancia {dist:.4f}")

    print("\n--- Normalizacao ---")
    v = [3, 4]
    print(f"Vetor:      {v}")
    print(f"Normalizado:{[round(x, 4) for x in normalizar(v)]}")


if __name__ == "__main__":
    main()