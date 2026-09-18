/*
 * 17 - Sistema de Biblioteca
 * Conceitos: composição, estado do objeto, empréstimo/devolução, busca por autor.
*/
using System;

public class Livro
{
    private int id;
    private string titulo;
    private string autor;
    private int ano;
    private bool disponivel;

    public Livro(int id, string titulo, string autor, int ano)
    {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
        this.disponivel = true;
    }

    public int GetId() { return id; }
    public string GetTitulo() { return titulo; }
    public string GetAutor() { return autor; }
    public int GetAno() { return ano; }
    public bool IsDisponivel() { return disponivel; }

    public void Emprestar() { disponivel = false; }
    public void Devolver() { disponivel = true; }

    public override string ToString()
    {
        string status = disponivel ? "disponivel" : "emprestado";
        return string.Format("[{0}] {1,-30} {2,-20} {3,4}  ({4})",
            id, titulo, autor, ano, status);
    }
}

public class Biblioteca
{
    private string nome;
    private Livro[] livros;
    private int qtd;
    private int proximoId;

    public Biblioteca(string nome, int capacidade)
    {
        this.nome = nome;
        this.livros = new Livro[capacidade];
        this.qtd = 0;
        this.proximoId = 1;
    }

    public void Adicionar(string titulo, string autor, int ano)
    {
        if (qtd >= livros.Length)
        {
            Console.WriteLine("Biblioteca cheia.");
            return;
        }
        livros[qtd] = new Livro(proximoId++, titulo, autor, ano);
        qtd++;
    }

    public Livro BuscarPorId(int id)
    {
        for (int i = 0; i < qtd; i++)
        {
            if (livros[i].GetId() == id) return livros[i];
        }
        return null;
    }

    public void Emprestar(int id)
    {
        Livro l = BuscarPorId(id);
        if (l == null) { Console.WriteLine("Livro nao encontrado."); return; }
        if (!l.IsDisponivel()) { Console.WriteLine("Livro ja esta emprestado."); return; }
        l.Emprestar();
        Console.WriteLine("Emprestado: " + l.GetTitulo());
    }

    public void Devolver(int id)
    {
        Livro l = BuscarPorId(id);
        if (l == null) { Console.WriteLine("Livro nao encontrado."); return; }
        if (l.IsDisponivel()) { Console.WriteLine("Este livro ja esta na biblioteca."); return; }
        l.Devolver();
        Console.WriteLine("Devolvido: " + l.GetTitulo());
    }

    public void Listar()
    {
        Console.WriteLine("\n=== " + nome + " ===");
        for (int i = 0; i < qtd; i++)
        {
            Console.WriteLine(livros[i]);
        }
    }

    public void BuscarPorAutor(string autor)
    {
        Console.WriteLine("\n--- Livros de " + autor + " ---");
        bool achou = false;
        for (int i = 0; i < qtd; i++)
        {
            if (livros[i].GetAutor().ToLower().Contains(autor.ToLower()))
            {
                Console.WriteLine(livros[i]);
                achou = true;
            }
        }
        if (!achou) Console.WriteLine("Nenhum livro encontrado.");
    }

    public void ListarDisponiveis()
    {
        Console.WriteLine("\n--- Livros disponiveis ---");
        for (int i = 0; i < qtd; i++)
        {
            if (livros[i].IsDisponivel()) Console.WriteLine(livros[i]);
        }
    }
}

public class sistema_biblioteca
{
    public static void Main(string[] args)
    {
        Biblioteca bib = new Biblioteca("Biblioteca Central", 20);

        bib.Adicionar("Dom Casmurro", "Machado de Assis", 1899);
        bib.Adicionar("O Cortico", "Aluisio Azevedo", 1890);
        bib.Adicionar("Grande Sertao: Veredas", "Joao Guimaraes Rosa", 1956);
        bib.Adicionar("Memorias Postumas", "Machado de Assis", 1881);
        bib.Adicionar("Capitaes da Areia", "Jorge Amado", 1937);

        bib.Listar();

        Console.WriteLine("\n--- Emprestimos ---");
        bib.Emprestar(1);
        bib.Emprestar(3);
        bib.Emprestar(1);

        bib.Listar();
        bib.BuscarPorAutor("Machado");
        bib.ListarDisponiveis();

        Console.WriteLine("\n--- Devolucao ---");
        bib.Devolver(1);
        bib.ListarDisponiveis();
    }
}