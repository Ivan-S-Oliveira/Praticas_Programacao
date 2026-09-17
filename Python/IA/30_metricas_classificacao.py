"""
30 - Metricas de Classificacao
Conceitos: acuracia, precisao, recall, F1, macro e micro media

As metricas mais usadas para avaliar classificadores:

  Acuracia  = (VP + VN) / Total
  Precisao  = VP / (VP + FP)      -> dos que previ positivo, quantos acertou?
  Recall    = VP / (VP + FN)      -> dos que eram positivo, quantos encontrou?
  F1        = 2 * (P * R) / (P + R)

Em problemas multiclasse usamos macro (media das metricas por classe)
ou micro (agrega tudo em uma unica conta) ou weighted (ponderada pelo
numero de amostras por classe).
"""

from collections import Counter


# ------------------------------------------------------------------
# Matriz de confusao multiclasse
# ------------------------------------------------------------------
def matriz_confusao(reais, previstos, classes=None):
    if classes is None:
        classes = sorted(set(reais) | set(previstos))
    indice = {c: i for i, c in enumerate(classes)}
    n = len(classes)
    matriz = [[0] * n for _ in range(n)]
    for r, p in zip(reais, previstos):
        matriz[indice[r]][indice[p]] += 1
    return classes, matriz


def imprimir_matriz(classes, matriz):
    largura = max(len(str(c)) for c in classes) + 2
    print(" " * (largura + 3) + "PREVISTO")
    linha = " " * (largura + 3)
    for c in classes:
        linha += f"{str(c):>{largura}}"
    print(linha)

    print(" " * (largura + 1) + "REAL")
    for i, c in enumerate(classes):
        texto = f"{str(c):>{largura}} |"
        for j in range(len(classes)):
            texto += f"{matriz[i][j]:>{largura}}"
        print(texto)


# ------------------------------------------------------------------
# Metricas binarias
# ------------------------------------------------------------------
def acuracia(vp, fp, fn, vn):
    total = vp + fp + fn + vn
    return (vp + vn) / total if total else 0.0


def precisao(vp, fp):
    return vp / (vp + fp) if (vp + fp) > 0 else 0.0


def recall(vp, fn):
    return vp / (vp + fn) if (vp + fn) > 0 else 0.0


def f1(precisao_valor, recall_valor):
    if precisao_valor + recall_valor == 0:
        return 0.0
    return 2 * (precisao_valor * recall_valor) / (precisao_valor + recall_valor)


# ------------------------------------------------------------------
# Metricas por classe (multiclasse)
# ------------------------------------------------------------------
def metricas_por_classe(classes, matriz):
    """Retorna dict: classe -> {precisao, recall, f1, suporte}."""
    resultado = {}
    n = len(classes)
    for i, c in enumerate(classes):
        vp = matriz[i][i]
        # Suporte: quantas amostras realmente sao dessa classe
        suporte = sum(matriz[i])
        # Falsos positivos: previu essa classe mas era outra
        fp = sum(matriz[k][i] for k in range(n) if k != i)
        # Falsos negativos: era essa classe mas previu outra
        fn = sum(matriz[i][j] for j in range(n) if j != i)

        p = precisao(vp, fp)
        r = recall(vp, fn)
        resultado[c] = {
            "precisao": p,
            "recall": r,
            "f1": f1(p, r),
            "suporte": suporte,
        }
    return resultado


def macro_media(metricas):
    """Media simples das metricas de todas as classes."""
    n = len(metricas)
    if n == 0:
        return {"precisao": 0, "recall": 0, "f1": 0}
    return {
        "precisao": sum(m["precisao"] for m in metricas.values()) / n,
        "recall": sum(m["recall"] for m in metricas.values()) / n,
        "f1": sum(m["f1"] for m in metricas.values()) / n,
    }


def weighted_media(metricas):
    """Media ponderada pelo suporte (numero de amostras por classe)."""
    total = sum(m["suporte"] for m in metricas.values())
    if total == 0:
        return {"precisao": 0, "recall": 0, "f1": 0}
    return {
        "precisao": sum(m["precisao"] * m["suporte"] for m in metricas.values()) / total,
        "recall": sum(m["recall"] * m["suporte"] for m in metricas.values()) / total,
        "f1": sum(m["f1"] * m["suporte"] for m in metricas.values()) / total,
    }


def acuracia_global(classes, matriz):
    """Soma da diagonal dividida pelo total."""
    total = sum(sum(linha) for linha in matriz)
    acertos = sum(matriz[i][i] for i in range(len(classes)))
    return acertos / total if total else 0.0


# ------------------------------------------------------------------
# Relatorio
# ------------------------------------------------------------------
def imprimir_relatorio(classes, matriz):
    print("\n--- Matriz de confusao ---")
    imprimir_matriz(classes, matriz)

    print("\n--- Metricas por classe ---")
    print(f"{'Classe':<12} {'Precisao':>10} {'Recall':>10} {'F1':>10} {'Suporte':>10}")
    print("-" * 56)

    metricas = metricas_por_classe(classes, matriz)
    for c in classes:
        m = metricas[c]
        print(f"{c:<12} {m['precisao']:>10.4f} {m['recall']:>10.4f} "
              f"{m['f1']:>10.4f} {m['suporte']:>10}")

    macro = macro_media(metricas)
    weighted = weighted_media(metricas)
    acc = acuracia_global(classes, matriz)

    print("\n--- Medias ---")
    print(f"{'':<12} {'Precisao':>10} {'Recall':>10} {'F1':>10}")
    print("-" * 46)
    print(f"{'Macro':<12} {macro['precisao']:>10.4f} {macro['recall']:>10.4f} "
          f"{macro['f1']:>10.4f}")
    print(f"{'Weighted':<12} {weighted['precisao']:>10.4f} {weighted['recall']:>10.4f} "
          f"{weighted['f1']:>10.4f}")
    print(f"\nAcuracia global: {acc:.4f} ({acc:.2%})")


# ------------------------------------------------------------------
# Exemplos de uso
# ------------------------------------------------------------------
def exemplo_binario():
    print("=== EXEMPLO BINARIO ===\n")
    reais =     [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1]
    previstos = [1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1]

    vp = fp = fn = vn = 0
    for r, p in zip(reais, previstos):
        if r == 1 and p == 1:
            vp += 1
        elif r == 0 and p == 1:
            fp += 1
        elif r == 1 and p == 0:
            fn += 1
        else:
            vn += 1

    p = precisao(vp, fp)
    r = recall(vp, fn)
    f = f1(p, r)
    a = acuracia(vp, fp, fn, vn)

    print(f"VP = {vp}   FP = {fp}   FN = {fn}   VN = {vn}\n")
    print(f"Acuracia: {a:.4f}")
    print(f"Precisao: {p:.4f}")
    print(f"Recall:   {r:.4f}")
    print(f"F1:       {f:.4f}")


def exemplo_multiclasse():
    print("\n=== EXEMPLO MULTICLASSE ===\n")
    reais =     ["gato", "gato", "cachorro", "cachorro", "passaro",
                 "passaro", "gato", "cachorro", "passaro", "gato",
                 "cachorro", "passaro", "gato", "cachorro", "passaro"]
    previstos = ["gato", "cachorro", "cachorro", "cachorro", "passaro",
                 "gato", "gato", "passaro", "passaro", "gato",
                 "cachorro", "passaro", "cachorro", "cachorro", "passaro"]

    classes, matriz = matriz_confusao(reais, previstos)
    imprimir_relatorio(classes, matriz)


def main():
    exemplo_binario()
    exemplo_multiclasse()


if __name__ == "__main__":
    main()