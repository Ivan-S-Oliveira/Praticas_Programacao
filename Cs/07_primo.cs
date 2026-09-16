using System;

public class Primo
{
    static bool EhPrimo(int n)
    {
        if (n < 2) return false;
        if (n == 2) return true;
        if (n % 2 == 0) return false;

        int limite = (int)Math.Sqrt(n) + 1;
        for (int i = 3; i < limite; i += 2)
        {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void Main(string[] args)
    {
        Console.Write("Digite um número: ");
        int n = int.Parse(Console.ReadLine());

        if (EhPrimo(n))
        {
            Console.WriteLine($"{n} é PRIMO. ✅");
        }
        else
        {
            Console.WriteLine($"{n} NÃO é primo.");
        }

        // Primos até 50
        Console.Write("\nPrimos até 50: ");
        for (int i = 2; i <= 50; i++)
        {
            if (EhPrimo(i))
            {
                Console.Write($"{i} ");
            }
        }
        Console.WriteLine();
    }
}