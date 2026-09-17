"""
16 - Média de Notas
Conceitos: listas, sum, len, max, min, round, classificação
"""

def calcular_media(notas):
    if not notas:
        return 0
    return sum(notas) / len(notas)

def calcular_mediana(notas):
    """Mediana: valor do meio quando ordenado."""
    if not notas:
        return 0
    ordenadas = sorted(notas)
    n = len(ordenadas)
    meio = n // 2
    if n % 2 == 0:
        return (ordenadas[meio - 1] + ordenadas[meio]) / 2
    return ordenadas[meio]

def classificar_aluno(media):
    """Converte média em conceito."""
    if media >= 9:
        return "A (Excelente)"
    elif media >= 7:
        return "B (Bom)"
    elif media >= 5:
        return "C (Regular)"
    elif media >= 3:
        return "D (Ruim)"
    else:
        return "F (Reprovado)"

def analisar_notas(nome, notas):
    print(f"\n=== Aluno: {nome} ===")
    print(f"Notas:     {notas}")
    print(f"Média:     {calcular_media(notas):.2f}")
    print(f"Mediana:   {calcular_mediana(notas):.2f}")
    print(f"Maior:     {max(notas)}")
    print(f"Menor:     {min(notas)}")
    print(f"Conceito:  {classificar_aluno(calcular_media(notas))}")

def main():
    alunos = {
        "Ana":     [9.5, 8.0, 7.5, 10.0],
        "Bruno":   [5.5, 6.0, 4.5, 6.5],
        "Carla":   [7.0, 7.5, 8.0, 7.0],
        "Daniel":  [3.0, 4.5, 2.5, 3.5],
        "Eduarda": [10.0, 9.5, 9.0, 10.0],
    }

    for nome, notas in alunos.items():
        analisar_notas(nome, notas)

    # Média geral da turma
    todas_notas = []
    for notas in alunos.values():
        todas_notas.extend(notas)

    print("\n=== Estatísticas da Turma ===")
    print(f"Média geral: {calcular_media(todas_notas):.2f}")
    print(f"Total de notas avaliadas: {len(todas_notas)}")

if __name__ == "__main__":
    main()