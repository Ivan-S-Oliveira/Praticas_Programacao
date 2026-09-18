/*
 * 25 - Exceptions
 * Conceitos: exceções customizadas, try/catch/finally, throw, when, using com IDisposable.
*/

using System;

// Excecao customizada
public class SaldoInsuficienteException : Exception
{
    public double Saldo { get; private set; }
    public double Solicitado { get; private set; }

    public SaldoInsuficienteException(double saldo, double solicitado)
        : base($"Saldo insuficiente: R$ {saldo:F2} disponivel, R$ {solicitado:F2} solicitado")
    {
        Saldo = saldo;
        Solicitado = solicitado;
    }

    public double Falta { get { return Solicitado - Saldo; } }
}

public class IdadeInvalidaException : Exception
{
    public int Idade { get; private set; }

    public IdadeInvalidaException(int idade)
        : base($"Idade invalida: {idade}")
    {
        Idade = idade;
    }
}

public class Conta
{
    public string Titular { get; private set; }
    public double Saldo { get; private set; }

    public Conta(string titular, double saldoInicial)
    {
        Titular = titular;
        Saldo = saldoInicial;
    }

    public void Sacar(double valor)
    {
        if (valor <= 0)
            throw new ArgumentException("Valor deve ser positivo.");
        if (valor > Saldo)
            throw new SaldoInsuficienteException(Saldo, valor);
        Saldo -= valor;
    }
}

// Classe que implementa IDisposable
public class Conexao : IDisposable
{
    public string Nome { get; private set; }
    private bool aberta;

    public Conexao(string nome)
    {
        Nome = nome;
        aberta = true;
        Console.WriteLine("Conexao " + nome + " aberta.");
    }

    public void Usar()
    {
        if (!aberta) throw new ObjectDisposedException(Nome);
        Console.WriteLine("Usando conexao " + Nome);
    }

    public void Dispose()
    {
        if (aberta)
        {
            aberta = false;
            Console.WriteLine("Conexao " + Nome + " fechada.");
        }
    }
}

public class exceptions
{
    public static void ValidarIdade(int idade)
    {
        if (idade < 0 || idade > 150)
            throw new IdadeInvalidaException(idade);
    }

    public static void Main(string[] args)
    {
        // ---------- 1) Excecao customizada ----------
        Console.WriteLine("=== Saldo insuficiente ===");
        Conta c = new Conta("Ana", 100.00);
        try
        {
            c.Sacar(50);
            Console.WriteLine($"Saque OK. Saldo: R$ {c.Saldo:F2}");
            c.Sacar(200);
        }
        catch (SaldoInsuficienteException ex)
        {
            Console.WriteLine("Erro: " + ex.Message);
            Console.WriteLine($"Faltam R$ {ex.Falta:F2}");
        }
        finally
        {
            Console.WriteLine($"Saldo final: R$ {c.Saldo:F2}");
        }

        // ---------- 2) Multiplos catches ----------
        Console.WriteLine("\n=== Multiplos catches ===");
        string[] entradas = { "10", "abc", "0", "5" };
        foreach (string entrada in entradas)
        {
            try
            {
                int n = int.Parse(entrada);
                int resultado = 100 / n;
                Console.WriteLine($"{entrada} -> {resultado}");
            }
            catch (FormatException)
            {
                Console.WriteLine($"{entrada} -> formato invalido");
            }
            catch (DivideByZeroException)
            {
                Console.WriteLine($"{entrada} -> divisao por zero");
            }
        }

        // ---------- 3) Exception filters (when) ----------
        Console.WriteLine("\n=== Exception filters ===");
        int[] idades = { 25, -5, 200, 40 };
        foreach (int idade in idades)
        {
            try
            {
                ValidarIdade(idade);
                Console.WriteLine($"Idade {idade}: OK");
            }
            catch (IdadeInvalidaException ex) when (ex.Idade < 0)
            {
                Console.WriteLine($"Idade negativa: {ex.Idade}");
            }
            catch (IdadeInvalidaException ex) when (ex.Idade > 150)
            {
                Console.WriteLine($"Idade muito alta: {ex.Idade}");
            }
        }

        // ---------- 4) Inner exception ----------
        Console.WriteLine("\n=== Inner exception ===");
        try
        {
            try
            {
                throw new InvalidOperationException("erro na camada baixa");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("erro na camada alta", ex);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Excecao externa: " + ex.Message);
            if (ex.InnerException != null)
                Console.WriteLine("Excecao interna: " + ex.InnerException.Message);
        }

        // ---------- 5) using / IDisposable ----------
        Console.WriteLine("\n=== using com IDisposable ===");
        using (Conexao conn = new Conexao("DB-01"))
        {
            conn.Usar();
            conn.Usar();
        }
        Console.WriteLine("(fora do bloco using)");

        // using declarativo (C# 8+)
        Console.WriteLine("\n=== using declarativo ===");
        using (Conexao conn2 = new Conexao("DB-02"))
        {
            conn2.Usar();
        }

        // ---------- 6) Relancando excecao ----------
        Console.WriteLine("\n=== Relancando ===");
        try
        {
            Processar();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Capturado no main: " + ex.Message);
        }
    }

    static void Processar()
    {
        try
        {
            throw new Exception("erro interno");
        }
        catch (Exception)
        {
            Console.WriteLine("  Logando erro...");
            throw; // relanca preservando stack trace
        }
    }
}