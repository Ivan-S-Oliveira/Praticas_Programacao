"""
18 - Agenda de Contatos
Conceitos: listas de dicionários, busca, ordenação, CRUD em memória
"""

agenda = []  # [{"nome": ..., "telefone": ..., "email": ...}]

def adicionar_contato(nome, telefone, email=""):
    for contato in agenda:
        if contato["nome"].lower() == nome.lower():
            print(f"Contato '{nome}' já existe.")
            return
    agenda.append({"nome": nome, "telefone": telefone, "email": email})
    print(f"Contato '{nome}' adicionado.")

def buscar_contato(termo):
    """Busca por nome (case-insensitive) e retorna lista."""
    termo = termo.lower()
    return [c for c in agenda if termo in c["nome"].lower()]

def listar_contatos():
    if not agenda:
        print("Agenda vazia.")
        return
    print(f"\n{'Nome':<20} {'Telefone':<15} {'Email':<25}")
    print("-" * 60)
    for c in sorted(agenda, key=lambda x: x["nome"].lower()):
        print(f"{c['nome']:<20} {c['telefone']:<15} {c['email']:<25}")

def remover_contato(nome):
    global agenda
    antes = len(agenda)
    agenda = [c for c in agenda if c["nome"].lower() != nome.lower()]
    if len(agenda) < antes:
        print(f"Contato '{nome}' removido.")
    else:
        print(f"Contato '{nome}' não encontrado.")

def menu():
    while True:
        print("\n=== AGENDA DE CONTATOS ===")
        print("1 - Adicionar contato")
        print("2 - Buscar contato")
        print("3 - Listar todos")
        print("4 - Remover contato")
        print("5 - Sair")

        opcao = input("Escolha: ").strip()

        if opcao == "1":
            nome = input("Nome: ").strip()
            tel = input("Telefone: ").strip()
            email = input("Email (opcional): ").strip()
            adicionar_contato(nome, tel, email)
        elif opcao == "2":
            termo = input("Buscar por: ").strip()
            resultados = buscar_contato(termo)
            if resultados:
                for c in resultados:
                    print(f"  {c['nome']} — {c['telefone']} — {c['email']}")
            else:
                print("Nenhum contato encontrado.")
        elif opcao == "3":
            listar_contatos()
        elif opcao == "4":
            nome = input("Nome a remover: ").strip()
            remover_contato(nome)
        elif opcao == "5":
            print("Encerrando...")
            break
        else:
            print("Opção inválida.")

if __name__ == "__main__":
    menu()