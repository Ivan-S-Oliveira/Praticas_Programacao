/*
 * 16 - Sistema de Estoque
 * Conceitos: composição, entrada/saída, busca, valor total calculado.
*/
using System;

public class ItemEstoque
{
    private int codigo;
    private string nome;
    private double preco;
    private int quantidade;

    public ItemEstoque(int codigo, string nome, double preco, int quantidade)
    {
        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
        this.quantidade = quantidade;
    }

    public int GetCodigo() { return codigo; }
    public string GetNome() { return nome; }
    public double GetPreco() { return preco; }
    public int GetQuantidade() { return quantidade; }

    public void Entrada(int qtd)
    {
        if (qtd > 0) quantidade += qtd;
    }

    public bool Saida(int qtd)
    {
        if (qtd > 0 && qtd <= quantidade)
        {
            quantidade -= qtd;
            return true;
        }
        return false;
    }

    public double ValorTotal()
    {
        return preco * quantidade;
    }

    public override string ToString()
    {
        return string.Format("[{0}] {1,-15} R$ {2,8:F2}  qtd: {3,3}  total: R$ {4,10:F2}",
            codigo, nome, preco, quantidade, ValorTotal());
    }
}

public class Estoque
{
    private ItemEstoque[] itens;
    private int qtd;
    private int proximoCodigo;

    public Estoque(int capacidade)
    {
        this.itens = new ItemEstoque[capacidade];
        this.qtd = 0;
        this.proximoCodigo = 1;
    }

    public void Cadastrar(string nome, double preco, int quantidade)
    {
        if (qtd >= itens.Length)
        {
            Console.WriteLine("Estoque cheio.");
            return;
        }
        itens[qtd] = new ItemEstoque(proximoCodigo++, nome, preco, quantidade);
        qtd++;
        Console.WriteLine("Item cadastrado.");
    }

    public ItemEstoque Buscar(int codigo)
    {
        for (int i = 0; i < qtd; i++)
        {
            if (itens[i].GetCodigo() == codigo) return itens[i];
        }
        return null;
    }

    public void Entrada(int codigo, int qtd)
    {
        ItemEstoque item = Buscar(codigo);
        if (item == null)
        {
            Console.WriteLine("Item nao encontrado.");
            return;
        }
        item.Entrada(qtd);
        Console.WriteLine("Entrada registrada em " + item.GetNome());
    }

    public void Saida(int codigo, int qtd)
    {
        ItemEstoque item = Buscar(codigo);
        if (item == null)
        {
            Console.WriteLine("Item nao encontrado.");
            return;
        }
        if (item.Saida(qtd))
            Console.WriteLine("Saida registrada em " + item.GetNome());
        else
            Console.WriteLine("Quantidade insuficiente em estoque.");
    }

    public double ValorTotalEstoque()
    {
        double soma = 0;
        for (int i = 0; i < qtd; i++)
        {
            soma += itens[i].ValorTotal();
        }
        return soma;
    }

    public void Listar()
    {
        Console.WriteLine("\n--- Estoque atual ---");
        for (int i = 0; i < qtd; i++)
        {
            Console.WriteLine(itens[i]);
        }
        Console.WriteLine(string.Format("Valor total em estoque: R$ {0:F2}", ValorTotalEstoque()));
    }
}

public class sistema_estoque
{
    public static void Main(string[] args)
    {
        Estoque estoque = new Estoque(20);

        estoque.Cadastrar("Notebook", 3500.00, 5);
        estoque.Cadastrar("Mouse", 89.90, 30);
        estoque.Cadastrar("Teclado", 250.00, 15);
        estoque.Cadastrar("Monitor", 1200.00, 8);

        estoque.Listar();

        Console.WriteLine("\n--- Movimentacoes ---");
        estoque.Entrada(2, 20);
        estoque.Saida(1, 2);
        estoque.Saida(3, 100);

        estoque.Listar();
    }
}