using System;

public class ParOuImpar
{
    public static void Main(string[] args)
    {
        Console.Write("Digite um número inteiro: ");
        int numero = int.Parse(Console.ReadLine());

        if (numero % 2 == 0)
        {
            Console.WriteLine($"O número {numero} é PAR.");
        }
        else
        {
            Console.WriteLine($"O número {numero} é ÍMPAR.");
        }

        // Bônus: verificar de 1 a 10
        Console.WriteLine("\n--- Verificando de 1 a 10 ---");
        for (int i = 1; i <= 10; i++)
        {
            string tipo = (i % 2 == 0) ? "par" : "ímpar";
            Console.WriteLine($"{i} é {tipo}");
        }
    }
}