/*
 * 19 - Polimorfismo
 * Conceitos: classe abstrata (abstract), métodos abstratos, polimorfismo real.
*/

using System;

public abstract class FormaGeometrica
{
    protected string nome;

    public FormaGeometrica(string nome)
    {
        this.nome = nome;
    }

    public string GetNome() { return nome; }

    public abstract double CalcularArea();
    public abstract double CalcularPerimetro();

    public virtual string Descricao()
    {
        return string.Format("{0}: area={1:F2}, perimetro={2:F2}",
            nome, CalcularArea(), CalcularPerimetro());
    }

    public override string ToString()
    {
        return GetType().Name + "{" + nome + "}";
    }
}

public class Retangulo : FormaGeometrica
{
    private double largura;
    private double altura;

    public Retangulo(double largura, double altura)
        : base("Retangulo")
    {
        this.largura = largura;
        this.altura = altura;
    }

    public override double CalcularArea()
    {
        return largura * altura;
    }

    public override double CalcularPerimetro()
    {
        return 2 * (largura + altura);
    }
}

public class Circulo : FormaGeometrica
{
    private double raio;

    public Circulo(double raio)
        : base("Circulo")
    {
        this.raio = raio;
    }

    public override double CalcularArea()
    {
        return Math.PI * raio * raio;
    }

    public override double CalcularPerimetro()
    {
        return 2 * Math.PI * raio;
    }
}

public class Triangulo : FormaGeometrica
{
    private double a, b, c;

    public Triangulo(double a, double b, double c)
        : base("Triangulo")
    {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    public override double CalcularArea()
    {
        // Formula de Heron
        double s = (a + b + c) / 2;
        return Math.Sqrt(s * (s - a) * (s - b) * (s - c));
    }

    public override double CalcularPerimetro()
    {
        return a + b + c;
    }
}

public class polimorfismo
{
    public static void Main(string[] args)
    {
        FormaGeometrica[] formas = new FormaGeometrica[5];
        formas[0] = new Retangulo(10, 5);
        formas[1] = new Circulo(3);
        formas[2] = new Triangulo(3, 4, 5);
        formas[3] = new Retangulo(7, 7);
        formas[4] = new Circulo(5);

        Console.WriteLine("=== Formas geometricas (polimorfismo) ===\n");

        double areaTotal = 0;
        double perimetroTotal = 0;

        for (int i = 0; i < formas.Length; i++)
        {
            Console.WriteLine(formas[i].Descricao());
            areaTotal += formas[i].CalcularArea();
            perimetroTotal += formas[i].CalcularPerimetro();
        }

        Console.WriteLine(string.Format("\nArea total:      {0:F2}", areaTotal));
        Console.WriteLine(string.Format("Perimetro total: {0:F2}", perimetroTotal));

        Console.WriteLine("\n=== Apenas circulos ===");
        for (int i = 0; i < formas.Length; i++)
        {
            if (formas[i] is Circulo)
            {
                Console.WriteLine(formas[i].Descricao());
            }
        }

        Console.WriteLine("\n=== Agrupando por tipo ===");
        string[] tipos = { "Retangulo", "Circulo", "Triangulo" };
        for (int t = 0; t < tipos.Length; t++)
        {
            int cont = 0;
            double somaArea = 0;
            for (int i = 0; i < formas.Length; i++)
            {
                if (formas[i].GetType().Name == tipos[t])
                {
                    cont++;
                    somaArea += formas[i].CalcularArea();
                }
            }
            Console.WriteLine(string.Format("{0,-12}: {1} forma(s), area total = {2:F2}",
                tipos[t], cont, somaArea));
        }
    }
}