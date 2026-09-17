package POO;

/**
 * 15 - Cadastro de Clientes
 * Conceitos: CRUD em array, busca linear, menu interativo
 */

import java.util.Scanner;

class Cliente {
    private int id;
    private String nome;
    private String email;
    private String telefone;

    public Cliente(int id, String nome, String email, String telefone) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }

    public int getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getTelefone() { return telefone; }

    public void setNome(String nome) { this.nome = nome; }
    public void setEmail(String email) { this.email = email; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    @Override
    public String toString() {
        return String.format("[%d] %-15s %-25s %s", id, nome, email, telefone);
    }
}

class Cadastro {
    private Cliente[] clientes;
    private int qtd;
    private int proximoId;

    public Cadastro(int capacidade) {
        this.clientes = new Cliente[capacidade];
        this.qtd = 0;
        this.proximoId = 1;
    }

    public void adicionar(String nome, String email, String telefone) {
        if (qtd >= clientes.length) {
            System.out.println("Cadastro cheio.");
            return;
        }
        clientes[qtd] = new Cliente(proximoId++, nome, email, telefone);
        qtd++;
        System.out.println("Cliente adicionado.");
    }

    public Cliente buscarPorId(int id) {
        for (int i = 0; i < qtd; i++) {
            if (clientes[i].getId() == id) return clientes[i];
        }
        return null;
    }

    public void listar() {
        if (qtd == 0) {
            System.out.println("Nenhum cliente cadastrado.");
            return;
        }
        System.out.println("\n--- Clientes cadastrados ---");
        for (int i = 0; i < qtd; i++) {
            System.out.println(clientes[i]);
        }
    }

    public void remover(int id) {
        int pos = -1;
        for (int i = 0; i < qtd; i++) {
            if (clientes[i].getId() == id) {
                pos = i;
                break;
            }
        }
        if (pos == -1) {
            System.out.println("Cliente nao encontrado.");
            return;
        }
        for (int i = pos; i < qtd - 1; i++) {
            clientes[i] = clientes[i + 1];
        }
        clientes[qtd - 1] = null;
        qtd--;
        System.out.println("Cliente removido.");
    }
}

class cadastro_clientes {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Cadastro cadastro = new Cadastro(50);

        // Populando com dados de exemplo
        cadastro.adicionar("Ana Silva", "ana@email.com", "11-99999-1111");
        cadastro.adicionar("Bruno Costa", "bruno@email.com", "11-99999-2222");
        cadastro.adicionar("Carla Souza", "carla@email.com", "11-99999-3333");

        int opcao = 0;
        while (opcao != 5) {
            System.out.println("\n=== CADASTRO DE CLIENTES ===");
            System.out.println("1 - Adicionar");
            System.out.println("2 - Listar");
            System.out.println("3 - Buscar por ID");
            System.out.println("4 - Remover");
            System.out.println("5 - Sair");
            System.out.print("Opcao: ");
            opcao = sc.nextInt();
            sc.nextLine();

            if (opcao == 1) {
                System.out.print("Nome: ");
                String nome = sc.nextLine();
                System.out.print("Email: ");
                String email = sc.nextLine();
                System.out.print("Telefone: ");
                String tel = sc.nextLine();
                cadastro.adicionar(nome, email, tel);
            } else if (opcao == 2) {
                cadastro.listar();
            } else if (opcao == 3) {
                System.out.print("ID: ");
                int id = sc.nextInt();
                Cliente c = cadastro.buscarPorId(id);
                if (c != null) System.out.println(c);
                else System.out.println("Nao encontrado.");
            } else if (opcao == 4) {
                System.out.print("ID: ");
                int id = sc.nextInt();
                cadastro.remover(id);
            } else if (opcao == 5) {
                System.out.println("Saindo...");
            } else {
                System.out.println("Opcao invalida.");
            }
        }

        sc.close();
    }
}
