/*
 * 28 - Async/Await
 * Conceitos: async/await, Task, Task<T>, paralelismo com Task.WhenAll, CancellationToken, SemaphoreSlim
 */

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

public class async_await
{
    // Simula uma operacao assincrona (ex.: consulta a banco)
    public static async Task<string> ConsultarPrecoAsync(string produto)
    {
        await Task.Delay(500);
        switch (produto)
        {
            case "Notebook": return "3500.00";
            case "Mouse":    return "89.90";
            case "Teclado":  return "250.00";
            case "Monitor":  return "1200.00";
            default:         return "0.00";
        }
    }

    public static async Task<double> ObterPrecoAsync(string produto)
    {
        string precoStr = await ConsultarPrecoAsync(produto);
        return double.Parse(precoStr, System.Globalization.CultureInfo.InvariantCulture);
    }

    // ---------- Execucao sequencial ----------
    public static async Task Sequencial()
    {
        Console.WriteLine("=== Execucao sequencial ===");
        string[] produtos = { "Notebook", "Mouse", "Teclado", "Monitor" };
        Stopwatch sw = Stopwatch.StartNew();

        foreach (string p in produtos)
        {
            double preco = await ObterPrecoAsync(p);
            Console.WriteLine($"  {p}: R$ {preco:F2}");
        }

        sw.Stop();
        Console.WriteLine($"Tempo: {sw.ElapsedMilliseconds}ms (esperado ~2000ms)\n");
    }

    // ---------- Execucao paralela com WhenAll ----------
    public static async Task Paralelo()
    {
        Console.WriteLine("=== Execucao paralela (WhenAll) ===");
        string[] produtos = { "Notebook", "Mouse", "Teclado", "Monitor" };
        Stopwatch sw = Stopwatch.StartNew();

        List<Task<double>> tarefas = new List<Task<double>>();
        foreach (string p in produtos)
        {
            tarefas.Add(ObterPrecoAsync(p));
        }

        double[] precos = await Task.WhenAll(tarefas);

        for (int i = 0; i < produtos.Length; i++)
        {
            Console.WriteLine($"  {produtos[i]}: R$ {precos[i]:F2}");
        }

        sw.Stop();
        Console.WriteLine($"Tempo: {sw.ElapsedMilliseconds}ms (esperado ~500ms)\n");
    }

    // ---------- Cancelamento ----------
    public static async Task ComCancelamento()
    {
        Console.WriteLine("=== Cancelamento ===");
        CancellationTokenSource cts = new CancellationTokenSource();
        cts.CancelAfter(700);

        try
        {
            await TarefaLonga(cts.Token);
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("  Tarefa cancelada com sucesso.");
        }
        Console.WriteLine();
    }

    public static async Task TarefaLonga(CancellationToken token)
    {
        for (int i = 1; i <= 10; i++)
        {
            token.ThrowIfCancellationRequested();
            Console.WriteLine($"  passo {i}/10");
            await Task.Delay(200, token);
        }
    }

    // ---------- SemaphoreSlim: limitar concorrencia ----------
    public static async Task ComLimiteConcorrencia()
    {
        Console.WriteLine("=== Limitando concorrencia a 2 ===");
        SemaphoreSlim semaforo = new SemaphoreSlim(2);
        List<Task> tarefas = new List<Task>();

        for (int i = 1; i <= 6; i++)
        {
            int id = i;
            tarefas.Add(Task.Run(async () =>
            {
                await semaforo.WaitAsync();
                try
                {
                    Console.WriteLine($"  Tarefa {id} iniciou");
                    await Task.Delay(300);
                    Console.WriteLine($"  Tarefa {id} terminou");
                }
                finally
                {
                    semaforo.Release();
                }
            }));
        }

        await Task.WhenAll(tarefas);
        Console.WriteLine();
    }

    // ---------- Tratamento de erro assincrono ----------
    public static async Task ComErro()
    {
        Console.WriteLine("=== Tratamento de erro ===");
        try
        {
            await TarefaQueFalha();
        }
        catch (InvalidOperationException ex)
        {
            Console.WriteLine("  Erro capturado: " + ex.Message);
        }
        Console.WriteLine();
    }

    public static async Task TarefaQueFalha()
    {
        await Task.Delay(100);
        throw new InvalidOperationException("falha simulada");
    }

    // ---------- Main async ----------
    public static async Task Main(string[] args)
    {
        await Sequencial();
        await Paralelo();
        await ComCancelamento();
        await ComLimiteConcorrencia();
        await ComErro();
        Console.WriteLine("Fim dos exemplos assincronos.");
    }
}