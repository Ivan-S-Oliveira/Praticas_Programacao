"""
28 - k-NN Simples
Conceitos: k-NN do zero, distancia euclidiana, votacao majoritaria

O k-NN (k vizinhos mais proximos) e um dos algoritmos de classificacao
mais simples e intuitivos. A ideia:

1. Guardar todos os exemplos de treino com seus rotulos.
2. Para classificar um novo exemplo, calcular a distancia para todos
   os exemplos de treino.
3. Escolher os k mais proximos.
4. Retornar o rotulo mais frequente entre eles (votacao).
"""

import math
from collections import Counter


# ---------------------------------------------------------------
# Base de dados de exemplo
# Cada amostra: (features, rotulo)
# Features: [horas de estudo, horas de sono]
# Rotulos: "aprovado" / "reprovado"
# ---------------------------------------------------------------
DADOS = [
    ([8, 7], "aprovado"),
    ([7, 6], "aprovado"),
    ([9, 8], "aprovado"),
    ([6, 5], "aprovado"),
    ([2, 3], "reprovado"),
    ([1, 2], "reprovado"),
    ([3, 4], "reprovado"),
    ([2, 5], "reprovado"),
    ([5, 5], "aprovado"),
    ([4, 2], "reprovado"),
    ([8, 6], "aprovado"),
    ([1, 1], "reprovado"),
]


def distancia_euclidiana(p, q):
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(p, q)))


def normalizar_minmax(dados):
    """Normaliza cada coluna para o intervalo [0, 1]."""
    if not dados:
        return dados, None
    n_features = len(dados[0])
    minimos = [min(linha[i] for linha in dados) for i in range(n_features)]
    maximos = [max(linha[i] for linha in dados) for i in range(n_features)]

    normalizados = []
    for linha in dados:
        nova = []
        for i in range(n_features):
            intervalo = maximos[i] - minimos[i]
            if intervalo == 0:
                nova.append(0.0)
            else:
                nova.append((linha[i] - minimos[i]) / intervalo)
        normalizados.append(nova)

    parametros = {"minimos": minimos, "maximos": maximos}
    return normalizados, parametros


def aplicar_normalizacao(linha, parametros):
    minimos = parametros["minimos"]
    maximos = parametros["maximos"]
    resultado = []
    for i in range(len(linha)):
        intervalo = maximos[i] - minimos[i]
        if intervalo == 0:
            resultado.append(0.0)
        else:
            resultado.append((linha[i] - minimos[i]) / intervalo)
    return resultado


def calcular_distancias(alvo, treino):
    """Retorna lista de tuplas (distancia, rotulo) para cada amostra de treino."""
    distancias = []
    for features, rotulo in treino:
        d = distancia_euclidiana(alvo, features)
        distancias.append((d, rotulo))
    return distancias


def votar(vizinhos):
    """Votacao majoritaria com desempate simples (primeiro mais frequente)."""
    rotulos = [rotulo for _, rotulo in vizinhos]
    contagem = Counter(rotulos)
    return contagem.most_common(1)[0][0]


def classificar(alvo, treino, k=3):
    """Classifica um ponto usando k-NN."""
    if k <= 0:
        raise ValueError("k deve ser positivo.")
    if k > len(treino):
        k = len(treino)

    distancias = calcular_distancias(alvo, treino)
    distancias.sort(key=lambda x: x[0])
    vizinhos = distancias[:k]
    return votar(vizinhos), vizinhos


def classificar_com_normalizacao(alvo, treino, k=3):
    """Normaliza as features antes de classificar (recomendado)."""
    features_treino = [f for f, _ in treino]
    normalizados, params = normalizar_minmax(features_treino)
    treino_norm = [(normalizados[i], treino[i][1]) for i in range(len(treino))]

    alvo_norm = aplicar_normalizacao(alvo, params)
    return classificar(alvo_norm, treino_norm, k)


def avaliar(treino, teste, k=3):
    """Retorna acuracia do k-NN em um conjunto de teste."""
    acertos = 0
    for features, rotulo_real in teste:
        previsto, _ = classificar_com_normalizacao(features, treino, k)
        if previsto == rotulo_real:
            acertos += 1
    return acertos / len(teste) if teste else 0.0


def main():
    print("=== k-NN SIMPLES ===\n")
    print(f"Total de amostras de treino: {len(DADOS)}\n")

    # Separacao simples: 9 para treino, 3 para teste
    treino = DADOS[:9]
    teste = DADOS[9:]

    print("--- Conjunto de teste ---")
    for features, rotulo in teste:
        print(f"  Features: {features} -> Rotulo real: {rotulo}")

    print("\n--- Classificando cada amostra de teste (k=3) ---")
    for features, rotulo_real in teste:
        previsto, vizinhos = classificar_com_normalizacao(features, treino, k=3)
        marca = "OK" if previsto == rotulo_real else "ERRO"
        print(f"\n  Teste: {features}")
        print(f"    Rotulo real:    {rotulo_real}")
        print(f"    Rotulo previsto:{previsto}  [{marca}]")
        print(f"    Vizinhos mais proximos:")
        for d, r in vizinhos:
            print(f"      dist={d:.4f}  rotulo={r}")

    print("\n--- Acuracia para diferentes valores de k ---")
    for k in [1, 3, 5]:
        acc = avaliar(treino, teste, k)
        print(f"  k={k}: acuracia = {acc:.2%}")

    print("\n--- Classificando novo exemplo ---")
    novo = [7, 7]
    previsto, vizinhos = classificar_com_normalizacao(novo, treino, k=3)
    print(f"  Novo exemplo: {novo}")
    print(f"  Classe prevista: {previsto}")
    print(f"  Vizinhos:")
    for d, r in vizinhos:
        print(f"    dist={d:.4f}  rotulo={r}")


if __name__ == "__main__":
    main()