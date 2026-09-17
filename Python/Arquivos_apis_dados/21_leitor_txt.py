"""
21 - Leitor de TXT
Conceitos: open, with, encoding, read/readlines, escrita

Este script cria um arquivo de exemplo caso nao exista,
depois demonstra varias formas de ler o conteudo.
"""

import os

ARQUIVO = "exemplo_leitura.txt"


def criar_arquivo_exemplo(caminho):
    """Cria um arquivo de exemplo para os testes."""
    if os.path.exists(caminho):
        print(f"Arquivo '{caminho}' ja existe.")
        return
    linhas = [
        "Python e uma linguagem de programacao.",
        "Foi criada por Guido van Rossum.",
        "E muito usada em ciencia de dados.",
        "Tambem e usada em automacao e web.",
        "Esta e a quinta linha do arquivo.",
    ]
    with open(caminho, "w", encoding="utf-8") as f:
        for linha in linhas:
            f.write(linha + "\n")
    print(f"Arquivo '{caminho}' criado com {len(linhas)} linhas.")


def ler_tudo(caminho):
    """Le todo o conteudo de uma vez com .read()."""
    with open(caminho, "r", encoding="utf-8") as f:
        return f.read()


def ler_linha_a_linha(caminho):
    """Le linha por linha usando for (recomendado para arquivos grandes)."""
    linhas = []
    with open(caminho, "r", encoding="utf-8") as f:
        for linha in f:
            linhas.append(linha.rstrip("\n"))
    return linhas


def ler_com_readlines(caminho):
    """Le tudo de uma vez em uma lista de linhas."""
    with open(caminho, "r", encoding="utf-8") as f:
        return [linha.rstrip("\n") for linha in f.readlines()]


def contar_estatisticas(caminho):
    """Retorna um dicionario com estatisticas do arquivo."""
    with open(caminho, "r", encoding="utf-8") as f:
        conteudo = f.read()
    linhas = conteudo.splitlines()
    palavras = conteudo.split()
    return {
        "caracteres": len(conteudo),
        "linhas": len(linhas),
        "palavras": len(palavras),
        "linhas_vazias": sum(1 for l in linhas if not l.strip()),
    }


def escrever_anexando(caminho, texto):
    """Adiciona uma linha ao final do arquivo (modo 'a')."""
    with open(caminho, "a", encoding="utf-8") as f:
        f.write(texto + "\n")


def main():
    criar_arquivo_exemplo(ARQUIVO)

    print("\n--- Conteudo completo (read) ---")
    print(ler_tudo(ARQUIVO))

    print("--- Linha a linha (for) ---")
    for i, linha in enumerate(ler_linha_a_linha(ARQUIVO), 1):
        print(f"{i:>2}: {linha}")

    print("\n--- readlines ---")
    for i, linha in enumerate(ler_com_readlines(ARQUIVO), 1):
        print(f"{i:>2}: {linha}")

    print("\n--- Estatisticas ---")
    stats = contar_estatisticas(ARQUIVO)
    for chave, valor in stats.items():
        print(f"  {chave:<15}: {valor}")

    escrever_anexando(ARQUIVO, "Linha adicionada pelo script.")
    print("\nNova linha adicionada ao final do arquivo.")
    print(f"Total de linhas agora: {contar_estatisticas(ARQUIVO)['linhas']}")


if __name__ == "__main__":
    main()