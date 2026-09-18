/*
 * 21 - Generics
 * Conceitos: classes genéricas, métodos genéricos, constraints (where T : ...), covariância.
*/

using System;
using System.Collections.Generic;

// Classe generica simples
public class Pilha<T>
{
    private List<T> itens = new List<T>();

    public void Empilhar(T item)
    {
        itens.Add(item);
    }

    public T Desempilhar()
    {
        if (itens.Count == 0) return default(T);
        T topo = itens[itens.Count - 1];
        itens.RemoveAt(itens.Count - 1);
        return topo;
    }

    public T Topo()
    {
        if (itens.Count == 0) return default(T);
        return itens[itens.Count - 1];
    }

    public bool Vazia() { return itens.Count == 0; }
    public int Tamanho() { return itens.Count; }
}

// Par generico
public class Par<A, B>
{
    public A Primeiro { get; set; }
    public B Segundo { get; set; }

    public Par(A primeiro, B segundo)
    {
        Primeiro = primeiro;
        Segundo = segundo;
    }

    public override string ToString()
    {
        return $"({Primeiro}, {Segundo})";
    }
}

// Bounded: so aceita IComparable
public class Comparador<T> where T : IComparable<T>
{
    public T Maior(List<T> lista)
    {
        if (lista.Count == 0) return default(T);
        T maior = lista[0];
        foreach (T item in lista)
        {
            if (item.CompareTo(maior) > 0) maior = item;
        }
        return maior;
    }

    public T Menor(List<T> lista)
    {
        if (lista.Count == 0) return default(T);
        T menor = lista[0];
        foreach (T item in lista)
        {
            if (item.CompareTo(menor) < 0) menor = item;
        }
        return menor;
    }
}

// Constraint de classe com new()
public class Fabrica<T> where T : new()
{
    public T Criar()
    {
        return new T();
    }
}

public class Produto
{
    public string Nome { get; set; }
    public override string ToString() { return "Produto vazio"; }
}

public class generics
{
    public static void Main(string[] args)
    {
        Console.WriteLine("=== Pilha generica ===");
        Pilha<string> pilhaTexto = new Pilha<string>();
        pilhaTexto.Empilhar("Ana");
        pilhaTexto.Empilhar("Bruno");
        pilhaTexto.Empilhar("Carla");
        Console.WriteLine("Topo: " + pilhaTexto.Topo());
        Console.WriteLine("Desempilhado: " + pilhaTexto.Desempilhar());
        Console.WriteLine("Novo topo: " + pilhaTexto.Topo());

        Pilha<int> pilhaNum = new Pilha<int>();
        pilhaNum.Empilhar(10);
        pilhaNum.Empilhar(20);
        pilhaNum.Empilhar(30);
        Console.WriteLine("\nSoma da pilha numerica: " +
            (pilhaNum.Desempilhar() + pilhaNum.Desempilhar() + pilhaNum.Desempilhar()));

        Console.WriteLine("\n=== Par generico ===");
        Par<string, int> p1 = new Par<string, int>("Ana", 28);
        Par<int, double> p2 = new Par<int, double>(1, 3.14);
        Console.WriteLine(p1);
        Console.WriteLine(p2);

        Console.WriteLine("\n=== Comparador (bounded) ===");
        Comparador<int> ci = new Comparador<int>();
        List<int> numeros = new List<int> { 5, 2, 9, 1, 7, 3 };
        Console.WriteLine("Maior: " + ci.Maior(numeros));
        Console.WriteLine("Menor: " + ci.Menor(numeros));

        Comparador<string> cs = new Comparador<string>();
        List<string> nomes = new List<string> { "Ana", "Eduarda", "Bruno", "Carla" };
        Console.WriteLine("Maior nome: " + cs.Maior(nomes));
        Console.WriteLine("Menor nome: " + cs.Menor(nomes));

        Console.WriteLine("\n=== Fabrica (new()) ===");
        Fabrica<Produto> fabrica = new Fabrica<Produto>();
        Produto pr = fabrica.Criar();
        Console.WriteLine("Criado: " + pr);
    }
}