using System;

public class MaiorNumero
{
    public static void Main(string[] args)
    {
        Console.Write("Digite o 1º número: ");
        double n1 = double.Parse(Console.ReadLine());
        Console.Write("Digite o 2º número: ");
        double n2 = double.Parse(Console.ReadLine());
        Console.Write("Digite o 3º número: ");
        double n3 = double.Parse(Console.ReadLine());

        // Forma 1: lógica manual
        double maiorManual;
        if (n1 >= n2 && n1 >= n3)
        {
            maiorManual = n1;
        }
        else if (n2 >= n1 && n2 >= n3)
        {
            maiorManual = n2;
        }
        else
        {
            maiorManual = n3;
        }

        // Forma 2: usando Math.Max
        double maiorMath = Math.Max(n1, Math.Max(n2, n3));

        Console.WriteLine($"\nMaior (lógica manual): {maiorManual}");
        Console.WriteLine($"Maior (Math.Max):      {maiorMath}");
    }
}