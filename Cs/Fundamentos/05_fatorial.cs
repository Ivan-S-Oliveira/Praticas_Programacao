using System;

public class Fatorial
{
    static long FatorialIterativo(int n)
    {
        if (n < 0) return -1;
        long resultado = 1;
        for (int i = 2; i <= n; i++)
        {
            resultado *= i;
        }
        return resultado;
    }

    static long FatorialWhile(int n)
    {
        if (n < 0) return -1;
        long resultado = 1;
        while (n > 1)
        {
            resultado *= n;
            n--;
        }
        return resultado;
    }

    static long FatorialRecursivo(int n)
    {
        if (n < 0) return -1;
        if (n == 0 || n == 1) return 1;
        return n * FatorialRecursivo(n - 1);
    }

    public static void Main(string[] args)
    {
        Console.Write("Digite um número inteiro não-negativo: ");
        int n = int.Parse(Console.ReadLine());

        Console.WriteLine($"\n{n}! (for):      {FatorialIterativo(n)}");
        Console.WriteLine($"{n}! (while):    {FatorialWhile(n)}");
        Console.WriteLine($"{n}! (recursivo): {FatorialRecursivo(n)}");
    }
}