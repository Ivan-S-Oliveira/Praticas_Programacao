/*
 * 12 - Classe Produto
 * Conceitos: atributo static, construtores sobrecarregados, métodos de instância.
*/
using System;

public class Produto
{
    private static int contador = 0;

    private int id;
    private string nome;
    private double preco;
    private int quantidade;

    public Produto(string nome, double preco, int quantidade)
    {
        contador++;
        this.id = contador;
        this.nome = nome;
        this.preco = preco;
        this.quantidade = quantidade;
    }

    // Construtor sobrecarregado
    public Produto(string nome, double preco)
        : this(nome, preco, 0)
    {
    }

    public int GetId() { return id; }
    public string GetNome() { return nome; }
    public double GetPreco() { return preco; }
    public int GetQuantidade() { return quantidade; }

    public void SetPreco(double valor)
    {
        if (valor >= 0)
            preco = valor;
        else
            Console.WriteLine("Preco invalido.");
    }

    public void AdicionarEstoque(int qtd)
    {
        if (qtd > 0) quantidade += qtd;
    }

    public bool RemoverEstoque(int qtd)
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

    public static int GetTotalProdutos()
    {
        return contador;
    }

    public override string ToString()
    {
        return string.Format("Produto{{id={0}, nome='{1}', preco={2:F2}, qtd={3}}}",
            id, nome, preco, quantidade);
    }
}

public class classe_produto
{
    public static void Main(string[] args)
    {
        Produto p1 = new Produto("Notebook", 3500.00, 10);
        Produto p2 = new Produto("Mouse", 89.90);
        Produto p3 = new Produto("Teclado", 250.00, 5);

        Console.WriteLine("--- Produtos cadastrados ---");
        Console.WriteLine(p1);
        Console.WriteLine(p2);
        Console.WriteLine(p3);

        Console.WriteLine("\n--- Movimentacoes ---");
        p2.AdicionarEstoque(20);
        Console.WriteLine("Apos adicionar 20 ao mouse: " + p2);

        bool removeu = p3.RemoverEstoque(2);
        Console.WriteLine("Removeu 2 teclados? " + removeu);
        Console.WriteLine(p3);

        bool falhou = p3.RemoverEstoque(100);
        Console.WriteLine("Tentou remover 100 teclados? " + falhou);

        Console.WriteLine("\n--- Valores totais ---");
        Console.WriteLine("Notebook: R$ " + p1.ValorTotal());
        Console.WriteLine("Mouse:    R$ " + p2.ValorTotal());
        Console.WriteLine("Teclado:  R$ " + p3.ValorTotal());

        Console.WriteLine("\nTotal de produtos criados: " + Produto.GetTotalProdutos());
    }
}