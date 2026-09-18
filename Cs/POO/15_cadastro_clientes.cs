/*
 * 15 - Cadastro de Clientes
 * Conceitos: CRUD em array, busca linear, remoção com shift, menu com Console.ReadLine.
*/
using System;

public class Cliente
{
    private int id;
    private string nome;
    private string email;
    private string telefone;

    public Cliente(int id, string nome, string email, string telefone)
    {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }

    public int GetId() { return id; }
    public string GetNome() { return nome; }
    public string GetEmail() { return email; }
    public string GetTelefone() { return telefone; }

    public void SetNome(string v) { nome = v; }
    public void SetEmail(string v) { email = v; }
    public void SetTelefone(string v) { telefone = v; }

    public override string ToString()
    {
        return string.Format("[{0}] {1,-15} {2,-25} {3}", id, nome, email, telefone);
    }
}

public class Cadastro
{
    private Cliente[] clientes;
    private int qtd;
    private int proximoId;

    public Cadastro(int capacidade)
    {
        this.clientes = new Cliente[capacidade];
        this.qtd = 0;
        this.proximoId = 1;
    }

    public void Adicionar(string nome, string email, string telefone)
    {
        if (qtd >= clientes.Length)
        {
            Console.WriteLine("Cadastro cheio.");
            return;
        }
        clientes[qtd] = new Cliente(proximoId++, nome, email, telefone);
        qtd++;
        Console.WriteLine("Cliente adicionado.");
    }

    public Cliente BuscarPorId(int id)
    {
        for (int i = 0; i < qtd; i++)
        {
            if (clientes[i].GetId() == id) return clientes[i];
        }
        return null;
    }

    public void Listar()
    {
        if (qtd == 0)
        {
            Console.WriteLine("Nenhum cliente cadastrado.");
            return;
        }
        Console.WriteLine("\n--- Clientes cadastrados ---");
        for (int i = 0; i < qtd; i++)
        {
            Console.WriteLine(clientes[i]);
        }
    }

    public void Remover(int id)
    {
        int pos = -1;
        for (int i = 0; i < qtd; i++)
        {
            if (clientes[i].GetId() == id)
            {
                pos = i;
                break;
            }
        }
        if (pos == -1)
        {
            Console.WriteLine("Cliente nao encontrado.");
            return;
        }
        for (int i = pos; i < qtd - 1; i++)
        {
            clientes[i] = clientes[i + 1];
        }
        clientes[qtd - 1] = null;
        qtd--;
        Console.WriteLine("Cliente removido.");
    }
}

public class cadastro_clientes
{
    public static void Main(string[] args)
    {
        Cadastro cadastro = new Cadastro(50);

        cadastro.Adicionar("Ana Silva", "ana@email.com", "11-99999-1111");
        cadastro.Adicionar("Bruno Costa", "bruno@email.com", "11-99999-2222");
        cadastro.Adicionar("Carla Souza", "carla@email.com", "11-99999-3333");

        int opcao = 0;
        while (opcao != 5)
        {
            Console.WriteLine("\n=== CADASTRO DE CLIENTES ===");
            Console.WriteLine("1 - Adicionar");
            Console.WriteLine("2 - Listar");
            Console.WriteLine("3 - Buscar por ID");
            Console.WriteLine("4 - Remover");
            Console.WriteLine("5 - Sair");
            Console.Write("Opcao: ");

            string entrada = Console.ReadLine();
            int.TryParse(entrada, out opcao);

            if (opcao == 1)
            {
                Console.Write("Nome: ");
                string nome = Console.ReadLine();
                Console.Write("Email: ");
                string email = Console.ReadLine();
                Console.Write("Telefone: ");
                string tel = Console.ReadLine();
                cadastro.Adicionar(nome, email, tel);
            }
            else if (opcao == 2)
            {
                cadastro.Listar();
            }
            else if (opcao == 3)
            {
                Console.Write("ID: ");
                int id;
                int.TryParse(Console.ReadLine(), out id);
                Cliente c = cadastro.BuscarPorId(id);
                if (c != null) Console.WriteLine(c);
                else Console.WriteLine("Nao encontrado.");
            }
            else if (opcao == 4)
            {
                Console.Write("ID: ");
                int id;
                int.TryParse(Console.ReadLine(), out id);
                cadastro.Remover(id);
            }
            else if (opcao == 5)
            {
                Console.WriteLine("Saindo...");
            }
            else
            {
                Console.WriteLine("Opcao invalida.");
            }
        }
    }
}