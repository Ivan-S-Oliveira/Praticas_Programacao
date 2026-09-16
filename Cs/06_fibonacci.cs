public class Fibonacci
{
    static long FibIterativo(int n)
    {
        long a = 0, b = 1;
        for (int i = 0; i < n; i++)
        {
            long temp = a + b;
            a = b;
            b = temp;
        }
        return a;
    }

    static long FibRecursivo(int n)
    {
        if (n <= 1) return n;
        return FibRecursivo(n - 1) + FibRecursivo(n - 2);
    }

    static List<long> FibSequencia(int quantidade)
    {
        var sequencia = new List<long>();
        long a = 0, b = 1;
        for (int i = 0; i < quantidade; i++)
        {
            sequencia.Add(a);
            long temp = a + b;
            a = b;
            b = temp;
        }
        return sequencia;
    }

    public static void Main(string[] args)
    {
        Console.Write("Quantos números de Fibonacci deseja ver? ");
        int n = int.Parse(Console.ReadLine());

        if (n <= 0)
        {
            Console.WriteLine("Digite um número positivo.");
            return;
        }

        Console.WriteLine($"\nSequência com {n} termos:");
        Console.WriteLine(string.Join(", ", FibSequencia(n)));

        Console.WriteLine($"\nO {n}º número de Fibonacci é: {FibIterativo(n)}");

        if (n <= 20)
        {
            Console.WriteLine($"(recursivo) {FibRecursivo(n)}");
        }
    }
}