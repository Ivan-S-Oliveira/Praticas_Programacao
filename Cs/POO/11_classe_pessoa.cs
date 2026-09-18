/*
 * 11 - Classe Pessoa
 * Conceitos: classe, atributos privados, construtor, getters/setters manuais, ToString
*/
using System;

public class Pessoa
{
    private string nome;
    private int idade;
    private string email;

    public Pessoa(string nome, int idade, string email)
    {
        this.nome = nome;
        this.idade = idade;
        this.email = email;
    }

    // Getters manuais (sem properties automaticas)
    public string GetNome() { return nome; }
    public int GetIdade() { return idade; }
    public string GetEmail() { return email; }

    // Setters com validacao
    public void SetNome(string valor)
    {
        if (valor != null && valor.Trim().Length > 0)
            nome = valor;
        else
            Console.WriteLine("Nome invalido.");
    }

    public void SetIdade(int valor)
    {
        if (valor >= 0 && valor <= 150)
            idade = valor;
        else
            Console.WriteLine("Idade invalida.");
    }

    public void SetEmail(string valor)
    {
        if (valor != null && valor.Contains("@"))
            email = valor;
        else
            Console.WriteLine("Email invalido.");
    }

    public bool EhMaiorDeIdade()
    {
        return idade >= 18;
    }

    public void Apresentar()
    {
        Console.WriteLine("Ola, meu nome e " + nome + ", tenho " + idade + " anos.");
    }

    public override string ToString()
    {
        return "Pessoa{nome='" + nome + "', idade=" + idade + ", email='" + email + "'}";
    }
}

public class classe_pessoa
{
    public static void Main(string[] args)
    {
        Pessoa p1 = new Pessoa("Ana", 28, "ana@email.com");
        Pessoa p2 = new Pessoa("Bruno", 15, "bruno@email.com");

        Console.WriteLine("--- Pessoa 1 ---");
        p1.Apresentar();
        Console.WriteLine(p1);
        Console.WriteLine("Maior de idade? " + p1.EhMaiorDeIdade());

        Console.WriteLine("\n--- Pessoa 2 ---");
        p2.Apresentar();
        Console.WriteLine(p2);
        Console.WriteLine("Maior de idade? " + p2.EhMaiorDeIdade());

        Console.WriteLine("\n--- Testando setters invalidos ---");
        p1.SetIdade(-5);
        p1.SetEmail("sem-arroba");
        p1.SetNome("");

        Console.WriteLine("\n--- Apos alteracoes validas ---");
        p1.SetIdade(29);
        p1.SetEmail("ana.nova@email.com");
        Console.WriteLine(p1);
    }
}