/*
 * 24 - Delegates
 * Conceitos: delegate customizado, multicast delegates, Func/Action/Predicate, eventos simples.
*/

using System;

// Declaracao de delegate customizado
public delegate double OperacaoMatematica(double a, double b);
public delegate void Notificador(string mensagem);
public delegate int Transformador(int x);

// Classe com evento usando delegate
public class Pedido
{
    public event Notificador StatusMudou;

    private string status;
    public string Status
    {
        get { return status; }
        set
        {
            status = value;
            if (StatusMudou != null)
            {
                StatusMudou("Pedido mudou para: " + status);
            }
        }
    }
}

public class delegates
{
    static double Somar(double a, double b) { return a + b; }
    static double Subtrair(double a, double b) { return a - b; }
    static double Multiplicar(double a, double b) { return a * b; }
    static double Dividir(double a, double b)
    {
        if (b == 0) throw new DivideByZeroException();
        return a / b;
    }

    static int AoQuadrado(int x) { return x * x; }

    public static void Main(string[] args)
    {
        // ---------- Delegate customizado ----------
        Console.WriteLine("=== Delegate OperacaoMatematica ===");
        OperacaoMatematica op = Somar;
        Console.WriteLine("Somar(10, 5): " + op(10, 5));

        op = Subtrair;
        Console.WriteLine("Subtrair(10, 5): " + op(10, 5));

        op = Multiplicar;
        Console.WriteLine("Multiplicar(10, 5): " + op(10, 5));

        op = Dividir;
        Console.WriteLine("Dividir(10, 5): " + op(10, 5));

        // ---------- Multicast delegates ----------
        Console.WriteLine("\n=== Multicast ===");
        Notificador notificar = (msg) => Console.WriteLine("  [LOG] " + msg);
        notificar += (msg) => Console.WriteLine("  [EMAIL] " + msg);
        notificar += (msg) => Console.WriteLine("  [SMS] " + msg);

        notificar("Sistema iniciado");
        Console.WriteLine("Total de handlers: 3");

        // Removendo um handler
        notificar -= (msg) => Console.WriteLine("  [SMS] " + msg); // nao remove por ser lambda diferente
        // Para remover de verdade, guarde a referencia:
        Notificador handlerSMS = (msg) => Console.WriteLine("  [SMS_2] " + msg);
        notificar += handlerSMS;
        notificar -= handlerSMS;
        Console.WriteLine("\nAdicionado e removido SMS_2. Chamando novamente:");
        notificar("Status atualizado");

        // ---------- Delegate como parametro ----------
        Console.WriteLine("\n=== Delegate como parametro ===");
        int[] valores = { 1, 2, 3, 4, 5 };
        int[] quadrados = AplicarTransformacao(valores, AoQuadrado);
        Console.WriteLine("Quadrados: " + string.Join(", ", quadrados));

        // Passando lambda
        int[] dobrados = AplicarTransformacao(valores, x => x * 2);
        Console.WriteLine("Dobrados: " + string.Join(", ", dobrados));

        // ---------- Func, Action, Predicate ----------
        Console.WriteLine("\n=== Func / Action / Predicate ===");
        Func<int, int, int> somaFunc = (a, b) => a + b;
        Console.WriteLine("Func soma: " + somaFunc(3, 4));

        Action<string> logAction = msg => Console.WriteLine("  Action: " + msg);
        logAction("teste");

        Predicate<int> maiorQue5 = n => n > 5;
        Console.WriteLine("Predicate 7 > 5? " + maiorQue5(7));
        Console.WriteLine("Predicate 3 > 5? " + maiorQue5(3));

        // ---------- Eventos ----------
        Console.WriteLine("\n=== Eventos ===");
        Pedido pedido = new Pedido();
        pedido.StatusMudou += msg => Console.WriteLine("  [Ouvinte 1] " + msg);
        pedido.StatusMudou += msg => Console.WriteLine("  [Ouvinte 2] " + msg);

        pedido.Status = "Em processamento";
        pedido.Status = "Enviado";
        pedido.Status = "Entregue";
    }

    static int[] AplicarTransformacao(int[] valores, Transformador t)
    {
        int[] resultado = new int[valores.Length];
        for (int i = 0; i < valores.Length; i++)
        {
            resultado[i] = t(valores[i]);
        }
        return resultado;
    }
}