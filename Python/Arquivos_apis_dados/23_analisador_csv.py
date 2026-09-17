"""
23 - Analisador de CSV
Conceitos: agrupamento, estatisticas, defaultdict, relatorios
"""

import csv
import os
from collections import defaultdict
from statistics import mean, median, stdev

ARQUIVO = "vendas.csv"
RELATORIO = "relatorio_vendas.txt"


def criar_csv_exemplo(caminho):
    if os.path.exists(caminho):
        return
    dados = [
        ["data", "vendedor", "produto", "quantidade", "preco_unitario"],
        ["2026-01-05", "Ana", "Notebook", 2, 3500.00],
        ["2026-01-05", "Bruno", "Mouse", 10, 89.90],
        ["2026-01-06", "Ana", "Monitor", 3, 1200.00],
        ["2026-01-07", "Carla", "Teclado", 5, 250.00],
        ["2026-01-08", "Bruno", "Notebook", 1, 3500.00],
        ["2026-01-08", "Ana", "Mouse", 20, 89.90],
        ["2026-01-09", "Carla", "Monitor", 2, 1200.00],
        ["2026-01-10", "Bruno", "Webcam", 4, 320.50],
        ["2026-01-11", "Ana", "Teclado", 6, 250.00],
        ["2026-01-12", "Carla", "Notebook", 1, 3500.00],
        ["2026-01-12", "Bruno", "Mouse", 15, 89.90],
        ["2026-01-13", "Ana", "Monitor", 1, 1200.00],
    ]
    with open(caminho, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(dados)
    print(f"CSV '{caminho}' criado com {len(dados) - 1} vendas.")


def carregar_vendas(caminho):
    """Le o CSV e converte tipos numericos."""
    vendas = []
    with open(caminho, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for linha in reader:
            linha["quantidade"] = int(linha["quantidade"])
            linha["preco_unitario"] = float(linha["preco_unitario"])
            linha["total"] = linha["quantidade"] * linha["preco_unitario"]
            vendas.append(linha)
    return vendas


def total_geral(vendas):
    return sum(v["total"] for v in vendas)


def por_vendedor(vendas):
    """Agrupa total por vendedor."""
    agregado = defaultdict(lambda: {"total": 0.0, "quantidade": 0, "vendas": 0})
    for v in vendas:
        agregado[v["vendedor"]]["total"] += v["total"]
        agregado[v["vendedor"]]["quantidade"] += v["quantidade"]
        agregado[v["vendedor"]]["vendas"] += 1
    return dict(agregado)


def por_produto(vendas):
    agregado = defaultdict(lambda: {"total": 0.0, "quantidade": 0})
    for v in vendas:
        agregado[v["produto"]]["total"] += v["total"]
        agregado[v["produto"]]["quantidade"] += v["quantidade"]
    return dict(agregado)


def estatisticas_vendas(vendas):
    totais = [v["total"] for v in vendas]
    return {
        "quantidade_vendas": len(totais),
        "total": sum(totais),
        "media": mean(totais),
        "mediana": median(totais),
        "desvio_padrao": stdev(totais) if len(totais) > 1 else 0.0,
        "maior_venda": max(totais),
        "menor_venda": min(totais),
    }


def gerar_relatorio(vendas, caminho_saida):
    linhas = []
    linhas.append("=" * 50)
    linhas.append("RELATORIO DE VENDAS")
    linhas.append("=" * 50)

    stats = estatisticas_vendas(vendas)
    linhas.append("\n--- Estatisticas Gerais ---")
    linhas.append(f"Quantidade de vendas: {stats['quantidade_vendas']}")
    linhas.append(f"Faturamento total:    R$ {stats['total']:,.2f}")
    linhas.append(f"Ticket medio:         R$ {stats['media']:,.2f}")
    linhas.append(f"Mediana:              R$ {stats['mediana']:,.2f}")
    linhas.append(f"Desvio padrao:        R$ {stats['desvio_padrao']:,.2f}")
    linhas.append(f"Maior venda:          R$ {stats['maior_venda']:,.2f}")
    linhas.append(f"Menor venda:          R$ {stats['menor_venda']:,.2f}")

    linhas.append("\n--- Por Vendedor ---")
    vendedores = por_vendedor(vendas)
    for nome, dados in sorted(vendedores.items(),
                              key=lambda x: x[1]["total"], reverse=True):
        linhas.append(
            f"{nome:<10} | "
            f"Vendas: {dados['vendas']:>2} | "
            f"Itens: {dados['quantidade']:>3} | "
            f"Total: R$ {dados['total']:>10,.2f}"
        )

    linhas.append("\n--- Por Produto ---")
    produtos = por_produto(vendas)
    for nome, dados in sorted(produtos.items(),
                              key=lambda x: x[1]["total"], reverse=True):
        linhas.append(
            f"{nome:<10} | "
            f"Qtd: {dados['quantidade']:>3} | "
            f"Total: R$ {dados['total']:>10,.2f}"
        )

    texto = "\n".join(linhas)
    with open(caminho_saida, "w", encoding="utf-8") as f:
        f.write(texto)
    return texto


def main():
    criar_csv_exemplo(ARQUIVO)
    vendas = carregar_vendas(ARQUIVO)
    print(f"Carregadas {len(vendas)} vendas do arquivo.\n")

    relatorio = gerar_relatorio(vendas, RELATORIO)
    print(relatorio)
    print(f"\nRelatorio salvo em '{RELATORIO}'.")


if __name__ == "__main__":
    main()