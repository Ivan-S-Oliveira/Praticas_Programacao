/*
 * 18 - Herança
 * Conceitos: extends (em C# :), base(...), override, virtual, instanceof (is).
*/
using System;

public class Animal
{
    protected string nome;
    protected int idade;

    public Animal(string nome, int idade)
    {
        this.nome = nome;
        this.idade = idade;
    }

    public string GetNome() { return nome; }
    public int GetIdade() { return idade; }

    public virtual string EmitirSom()
    {
        return "...";
    }

    public virtual string Movimentar()
    {
        return nome + " se move.";
    }

    public void Apresentar()
    {
        Console.WriteLine(string.Format("{0} ({1} anos) diz: {2}",
            nome, idade, EmitirSom()));
    }

    public override string ToString()
    {
        return GetType().Name + "{nome='" + nome + "', idade=" + idade + "}";
    }
}

public class Cachorro : Animal
{
    private string raca;

    public Cachorro(string nome, int idade, string raca)
        : base(nome, idade)
    {
        this.raca = raca;
    }

    public string GetRaca() { return raca; }

    public override string EmitirSom()
    {
        return "Au au!";
    }

    public override string Movimentar()
    {
        return nome + " corre pela casa.";
    }
}

public class Gato : Animal
{
    private bool ehCaseiro;

    public Gato(string nome, int idade, bool ehCaseiro)
        : base(nome, idade)
    {
        this.ehCaseiro = ehCaseiro;
    }

    public bool IsEhCaseiro() { return ehCaseiro; }

    public override string EmitirSom()
    {
        return "Miau!";
    }

    public override string Movimentar()
    {
        return nome + " anda silenciosamente.";
    }
}

public class Passaro : Animal
{
    private double envergaduraAsas;

    public Passaro(string nome, int idade, double envergaduraAsas)
        : base(nome, idade)
    {
        this.envergaduraAsas = envergaduraAsas;
    }

    public double GetEnvergaduraAsas() { return envergaduraAsas; }

    public override string EmitirSom()
    {
        return "Piu piu!";
    }

    public override string Movimentar()
    {
        return nome + " voa com " + envergaduraAsas + " cm de envergadura.";
    }
}

public class heranca
{
    public static void Main(string[] args)
    {
        Animal[] animais = new Animal[4];
        animais[0] = new Cachorro("Rex", 5, "Labrador");
        animais[1] = new Gato("Mimi", 3, true);
        animais[2] = new Passaro("Tweety", 1, 15.5);
        animais[3] = new Cachorro("Bolt", 2, "Husky");

        Console.WriteLine("=== Apresentacao dos animais ===");
        for (int i = 0; i < animais.Length; i++)
        {
            animais[i].Apresentar();
            Console.WriteLine("  " + animais[i].Movimentar());
            Console.WriteLine("  " + animais[i]);
            Console.WriteLine();
        }

        Console.WriteLine("=== Filtrando por tipo ===");
        for (int i = 0; i < animais.Length; i++)
        {
            if (animais[i] is Cachorro)
            {
                Cachorro c = (Cachorro) animais[i];
                Console.WriteLine(c.GetNome() + " e da raca " + c.GetRaca());
            }
        }
    }
}