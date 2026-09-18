/*
 * 23 - Lambda Expressions
 * Conceitos: lambdas, expression-bodied members, closures, Func, Action, Predicate.
*/

using System;
using System.Collections.Generic;

public class lambda
{
    // Expression-bodied methods
    public static int Dobro(int x) => x * 2;
    public static int Soma(int a, int b) => a + b;
    public static bool EhPar(int x) => x % 2 == 0;

    public static void Main(string[] args)
    {
        // ---------- Lambda basica ----------
        Func<int, int> quadrado = x => x * x;
        Console.WriteLine("Quadrado de 5: " + quadrado(5));

        // Multiplos parametros
        Func<int, int, int> soma = (a, b) => a + b;
        Console.WriteLine("Soma 3+4: " + soma(3, 4));

        // Sem parametros
        Func<string> saudacao = () => "Ola, lambdas!";
        Console.WriteLine(saudacao());

        // Action: nao retorna valor
        Action<string> imprimir = msg => Console.WriteLine("MSG: " + msg);
        imprimir("Testando Action");

        // Predicate: retorna bool
        Predicate<int> ehPositivo = n => n > 0;
        Console.WriteLine("5 e positivo? " + ehPositivo(5));
        Console.WriteLine("-3 e positivo? " + ehPositivo(-3));

        // ---------- Closure ----------
        Console.WriteLine("\n=== Closures ===");
        int contador = 0;
        Action incrementar = () => contador++;
        incrementar();
        incrementar();
        incrementar();
        Console.WriteLine("Contador apos 3 incrementos: " + contador);

        // Closure com parametro externo mutavel
        Func<int, int> criarAcumulador(int inicial)
        {
            int total = inicial;
            return x =>
            {
                total += x;
                return total;
            };
        }

        var acum = criarAcumulador(100);
        Console.WriteLine("Acumulador (100): +10 = " + acum(10));
        Console.WriteLine("Acumulador: +20 = " + acum(20));
        Console.WriteLine("Acumulador: +5 = " + acum(5));

        // ---------- Lambdas como argumentos ----------
        Console.WriteLine("\n=== Lambdas em listas ===");
        List<int> numeros = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        List<int> pares = numeros.FindAll(n => n % 2 == 0);
        Console.WriteLine("Pares: " + string.Join(", ", pares));

        int somaTotal = numeros.FindAll(n => n > 5).Sum();
        Console.WriteLine("Soma dos > 5: " + somaTotal);

        // ---------- Expression-bodied members ----------
        Console.WriteLine("\n=== Expression-bodied methods ===");
        Console.WriteLine("Dobro de 7: " + Dobro(7));
        Console.WriteLine("Soma 10+20: " + Soma(10, 20));
        Console.WriteLine("EhPar(4)? " + EhPar(4));
        Console.WriteLine("EhPar(7)? " + EhPar(7));

        // ---------- Composicao ----------
        Console.WriteLine("\n=== Composicao de lambdas ===");
        Func<int, int> dobrar = x => x * 2;
        Func<int, int> somar10 = x => x + 10;

        Func<int, int> composta = x => somar10(dobrar(x));
        Console.WriteLine("Composta(5) [dobra depois soma 10]: " + composta(5));

        // ---------- Lambdas com LINQ ----------
        Console.WriteLine("\n=== Lambdas com LINQ ===");
        var quadradosPares = numeros
            .Where(n => n % 2 == 0)
            .Select(n => n * n)
            .ToList();
        Console.WriteLine("Quadrados dos pares: " + string.Join(", ", quadradosPares));
    }
}