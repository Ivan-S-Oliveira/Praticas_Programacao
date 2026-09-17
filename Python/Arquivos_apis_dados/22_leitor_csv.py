"""
22 - Leitor de CSV
Conceitos: csv.reader, csv.DictReader, csv.writer, delimitadores

Cria um CSV de exemplo e demonstra diferentes formas de ler.
"""

import csv
import os

ARQUIVO = "exemplo_produtos.csv"


def criar_csv_exemplo(caminho):
    if os.path.exists(caminho):
        print(f"Arquivo '{caminho}' ja existe.")
        return
    dados = [
        ["id", "produto", "preco", "quantidade"],
        [1, "Notebook", 3500.00, 12],
        [2, "Mouse", 89.90, 45],
        [3, "Teclado", 250.00, 30],
        [4, "Monitor", 1200.00, 8],
        [5, "Webcam", 320.50, 15],
    ]
    with open(caminho, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(dados)
    print(f"CSV '{caminho}' criado com {len(dados) - 1} produtos.")


def ler_com_reader(caminho):
    """Le com csv.reader: retorna lista de listas."""
    with open(caminho, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        return list(reader)


def ler_com_dictreader(caminho):
    """Le com csv.DictReader: cada linha vira dicionario."""
    with open(caminho, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)


def ler_como_tuplas(caminho):
    """Le apenas algumas colunas especificas."""
    resultados = []
    with open(caminho, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for linha in reader:
            resultados.append((linha["produto"], float(linha["preco"])))
    return resultados


def escrever_csv(caminho, dados, cabecalho):
    """Escreve uma lista de listas em CSV."""
    with open(caminho, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(cabecalho)
        writer.writerows(dados)
    print(f"Arquivo '{caminho}' gravado.")


def main():
    criar_csv_exemplo(ARQUIVO)

    print("\n--- csv.reader (lista de listas) ---")
    for linha in ler_com_reader(ARQUIVO):
        print(linha)

    print("\n--- csv.DictReader (lista de dicionarios) ---")
    for produto in ler_com_dictreader(ARQUIVO):
        print(produto)

    print("\n--- Apenas nome e preco ---")
    for nome, preco in ler_como_tuplas(ARQUIVO):
        print(f"  {nome:<10} R$ {preco:>8.2f}")

    # Filtrando produtos com preco acima de 300
    print("\n--- Produtos acima de R$ 300 ---")
    produtos = ler_com_dictreader(ARQUIVO)
    caros = [p for p in produtos if float(p["preco"]) > 300]
    for p in caros:
        print(f"  {p['produto']:<10} R$ {float(p['preco']):>8.2f}")

    # Escrevendo novo CSV com o filtro
    dados_saida = [
        [p["id"], p["produto"], p["preco"], p["quantidade"]] for p in caros
    ]
    escrever_csv("produtos_caros.csv", dados_saida,
                 ["id", "produto", "preco", "quantidade"])


if __name__ == "__main__":
    main()