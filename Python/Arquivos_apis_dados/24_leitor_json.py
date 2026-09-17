"""
24 - Leitor de JSON
Conceitos: json.load, json.dump, json.dumps, indentacao, aninhamento
"""

import json
import os

ARQUIVO = "biblioteca.json"


def criar_json_exemplo(caminho):
    if os.path.exists(caminho):
        return
    biblioteca = {
        "nome": "Biblioteca Central",
        "endereco": {
            "rua": "Rua das Letras, 42",
            "cidade": "Sao Paulo",
            "uf": "SP",
        },
        "livros": [
            {
                "id": 1,
                "titulo": "Dom Casmurro",
                "autor": "Machado de Assis",
                "ano": 1899,
                "genero": "Romance",
                "disponivel": True,
            },
            {
                "id": 2,
                "titulo": "O Cortico",
                "autor": "Aluisio Azevedo",
                "ano": 1890,
                "genero": "Naturalismo",
                "disponivel": False,
            },
            {
                "id": 3,
                "titulo": "Grande Sertao: Veredas",
                "autor": "Joao Guimaraes Rosa",
                "ano": 1956,
                "genero": "Romance",
                "disponivel": True,
            },
            {
                "id": 4,
                "titulo": "Memorias Postumas de Bras Cubas",
                "autor": "Machado de Assis",
                "ano": 1881,
                "genero": "Romance",
                "disponivel": True,
            },
        ],
        "total_livros": 4,
    }
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(biblioteca, f, ensure_ascii=False, indent=2)
    print(f"JSON '{caminho}' criado.")


def carregar_json(caminho):
    with open(caminho, "r", encoding="utf-8") as f:
        return json.load(f)


def salvar_json(caminho, dados):
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
    print(f"JSON salvo em '{caminho}'.")


def listar_livros(biblioteca):
    print(f"\n--- Livros em '{biblioteca['nome']}' ---")
    for livro in biblioteca["livros"]:
        status = "disponivel" if livro["disponivel"] else "emprestado"
        print(
            f"  [{livro['id']}] {livro['titulo']:<40} "
            f"({livro['ano']}) - {livro['autor']:<25} [{status}]"
        )


def buscar_por_autor(biblioteca, autor):
    autor_lower = autor.lower()
    return [l for l in biblioteca["livros"] if autor_lower in l["autor"].lower()]


def buscar_por_genero(biblioteca, genero):
    genero_lower = genero.lower()
    return [l for l in biblioteca["livros"] if genero_lower == l["genero"].lower()]


def livros_disponiveis(biblioteca):
    return [l for l in biblioteca["livros"] if l["disponivel"]]


def estatisticas(biblioteca):
    livros = biblioteca["livros"]
    anos = [l["ano"] for l in livros]
    generos = {}
    for l in livros:
        generos[l["genero"]] = generos.get(l["genero"], 0) + 1
    return {
        "total": len(livros),
        "disponiveis": sum(1 for l in livros if l["disponivel"]),
        "emprestados": sum(1 for l in livros if not l["disponivel"]),
        "ano_mais_antigo": min(anos),
        "ano_mais_recente": max(anos),
        "generos": generos,
    }


def main():
    criar_json_exemplo(ARQUIVO)
    bib = carregar_json(ARQUIVO)

    print(f"Biblioteca: {bib['nome']}")
    print(f"Endereco:   {bib['endereco']['rua']}, "
          f"{bib['endereco']['cidade']} - {bib['endereco']['uf']}")

    listar_livros(bib)

    print("\n--- Livros do autor 'Machado' ---")
    for l in buscar_por_autor(bib, "Machado"):
        print(f"  {l['titulo']} ({l['ano']})")

    print("\n--- Livros do genero 'Romance' ---")
    for l in buscar_por_genero(bib, "Romance"):
        print(f"  {l['titulo']}")

    print("\n--- Disponiveis ---")
    for l in livros_disponiveis(bib):
        print(f"  {l['titulo']}")

    print("\n--- Estatisticas ---")
    stats = estatisticas(bib)
    for chave, valor in stats.items():
        print(f"  {chave:<20}: {valor}")

    # Modificando e salvando
    bib["livros"][1]["disponivel"] = True
    bib["total_livros"] = len(bib["livros"])
    salvar_json("biblioteca_atualizada.json", bib)


if __name__ == "__main__":
    main()