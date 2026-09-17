"""
17 - Sistema de Notas (CRUD em memória)
Conceitos: dicionários aninhados, menu, while, funções
"""

alunos = {}  # {nome: [nota1, nota2, ...]}

def adicionar_aluno(nome):
    if nome in alunos:
        print(f"Aluno '{nome}' já existe.")
        return
    alunos[nome] = []
    print(f"Aluno '{nome}' adicionado.")

def adicionar_nota(nome, nota):
    if nome not in alunos:
        print(f"Aluno '{nome}' não encontrado.")
        return
    if not (0 <= nota <= 10):
        print("Nota inválida. Use valores de 0 a 10.")
        return
    alunos[nome].append(nota)
    print(f"Nota {nota} adicionada para {nome}.")

def calcular_media(notas):
    return sum(notas) / len(notas) if notas else 0

def listar_alunos():
    if not alunos:
        print("Nenhum aluno cadastrado.")
        return
    print(f"\n{'Nome':<15} {'Notas':<25} {'Média':>6}")
    print("-" * 50)
    for nome, notas in alunos.items():
        media = calcular_media(notas)
        print(f"{nome:<15} {str(notas):<25} {media:>6.2f}")

def remover_aluno(nome):
    if nome in alunos:
        del alunos[nome]
        print(f"Aluno '{nome}' removido.")
    else:
        print(f"Aluno '{nome}' não encontrado.")

def menu():
    while True:
        print("\n=== SISTEMA DE NOTAS ===")
        print("1 - Adicionar aluno")
        print("2 - Adicionar nota")
        print("3 - Listar alunos")
        print("4 - Remover aluno")
        print("5 - Sair")

        opcao = input("Escolha: ").strip()

        if opcao == "1":
            nome = input("Nome do aluno: ").strip()
            adicionar_aluno(nome)
        elif opcao == "2":
            nome = input("Nome do aluno: ").strip()
            try:
                nota = float(input("Nota (0-10): "))
                adicionar_nota(nome, nota)
            except ValueError:
                print("Valor inválido.")
        elif opcao == "3":
            listar_alunos()
        elif opcao == "4":
            nome = input("Nome do aluno a remover: ").strip()
            remover_aluno(nome)
        elif opcao == "5":
            print("Encerrando...")
            break
        else:
            print("Opção inválida.")

if __name__ == "__main__":
    menu()