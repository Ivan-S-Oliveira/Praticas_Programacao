"""
26 - Organizador de Arquivos
Conceitos: os, shutil, pathlib, agrupamento por extensao, movimentacao

Cria uma pasta de teste com arquivos variados e organiza tudo
em subpastas por categoria (imagens, documentos, etc.).
"""

import os
import shutil
from collections import defaultdict
from pathlib import Path

PASTA_TESTE = "pasta_teste"
PASTA_ORGANIZADA = "pasta_organizada"
LOG = "log_organizacao.txt"

CATEGORIAS = {
    "imagens":     [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"],
    "documentos":  [".txt", ".pdf", ".doc", ".docx", ".odt", ".md"],
    "planilhas":   [".xls", ".xlsx", ".csv", ".ods"],
    "videos":      [".mp4", ".avi", ".mkv", ".mov", ".wmv"],
    "audios":      [".mp3", ".wav", ".flac", ".ogg", ".m4a"],
    "compactados": [".zip", ".rar", ".7z", ".tar", ".gz"],
    "codigos":     [".py", ".js", ".java", ".c", ".cpp", ".cs", ".php", ".rb"],
}


def criar_pasta_teste(caminho):
    """Cria uma pasta com arquivos falsos para demonstracao."""
    if os.path.exists(caminho):
        return
    os.makedirs(caminho)
    arquivos = [
        "foto1.jpg", "foto2.png", "banner.gif",
        "contrato.pdf", "anotacoes.txt", "readme.md",
        "relatorio.xlsx", "dados.csv",
        "filme.mp4", "clipe.avi",
        "musica.mp3", "podcast.wav",
        "backup.zip", "arquivos.rar",
        "script.py", "app.js", "Main.java",
        "arquivo_sem_extensao",
    ]
    for nome in arquivos:
        caminho_arquivo = os.path.join(caminho, nome)
        with open(caminho_arquivo, "w", encoding="utf-8") as f:
            f.write(f"conteudo de {nome}\n")
    print(f"Pasta '{caminho}' criada com {len(arquivos)} arquivos.")


def obter_categoria(extensao):
    """Retorna a categoria de uma extensao ou 'outros'."""
    ext = extensao.lower()
    for categoria, extensoes in CATEGORIAS.items():
        if ext in extensoes:
            return categoria
    return "outros"


def planejar_organizacao(pasta_origem):
    """Retorna um dicionario: categoria -> lista de arquivos."""
    plano = defaultdict(list)
    for item in os.listdir(pasta_origem):
        caminho = os.path.join(pasta_origem, item)
        if os.path.isfile(caminho):
            _, ext = os.path.splitext(item)
            categoria = obter_categoria(ext)
            plano[categoria].append(item)
    return dict(plano)


def organizar(pasta_origem, pasta_destino, log_path):
    """Move cada arquivo para a subpasta correspondente."""
    if os.path.exists(pasta_destino):
        shutil.rmtree(pasta_destino)
    os.makedirs(pasta_destino)

    plano = planejar_organizacao(pasta_origem)
    linhas_log = []

    for categoria, arquivos in sorted(plano.items()):
        subpasta = os.path.join(pasta_destino, categoria)
        os.makedirs(subpasta, exist_ok=True)

        for nome in arquivos:
            origem = os.path.join(pasta_origem, nome)
            destino = os.path.join(subpasta, nome)
            shutil.copy2(origem, destino)
            linha = f"{nome} -> {categoria}/"
            linhas_log.append(linha)
            print(f"  {linha}")

    with open(log_path, "w", encoding="utf-8") as f:
        f.write("\n".join(linhas_log))

    return plano


def relatorio_final(pasta_destino):
    print(f"\n--- Estrutura de '{pasta_destino}' ---")
    for raiz, dirs, arquivos in os.walk(pasta_destino):
        nivel = raiz.replace(pasta_destino, "").count(os.sep)
        indent = "  " * nivel
        nome_pasta = os.path.basename(raiz) or pasta_destino
        print(f"{indent}{nome_pasta}/")
        for arq in sorted(arquivos):
            print(f"{indent}  {arq}")


def estatisticas(pasta):
    """Conta arquivos por categoria."""
    contagem = defaultdict(int)
    for raiz, dirs, arquivos in os.walk(pasta):
        categoria = os.path.basename(raiz)
        if categoria == pasta:
            continue
        contagem[categoria] += len(arquivos)
    return dict(contagem)


def main():
    print("=== ORGANIZADOR DE ARQUIVOS ===\n")

    criar_pasta_teste(PASTA_TESTE)

    print("\n--- Arquivos antes da organizacao ---")
    for nome in sorted(os.listdir(PASTA_TESTE)):
        print(f"  {nome}")

    print("\n--- Organizando ---")
    organizar(PASTA_TESTE, PASTA_ORGANIZADA, LOG)

    relatorio_final(PASTA_ORGANIZADA)

    print("\n--- Estatisticas ---")
    for categoria, qtd in sorted(estatisticas(PASTA_ORGANIZADA).items()):
        print(f"  {categoria:<15}: {qtd} arquivo(s)")

    print(f"\nLog salvo em '{LOG}'.")


if __name__ == "__main__":
    main()