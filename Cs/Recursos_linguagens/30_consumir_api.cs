/*
 * 30 - Consumir API
 * Conceitos: consumo completo de API com DTOs, filtros, agregações com LINQ, 
 * cache em memória, tratamento de erro robusto.
*/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

// DTO mapeando o retorno do ViaCEP
public class EnderecoCep
{
    public string Cep { get; set; }
    public string Logradouro { get; set; }
    public string Complemento { get; set; }
    public string Bairro { get; set; }
    public string Localidade { get; set; }
    public string Uf { get; set; }
    public string Ibge { get; set; }
    public string Erro { get; set; }
}

public class consumir_api
{
    private static readonly HttpClient client = new HttpClient();
    private const string BASE = "https://viacep.com.br/ws/";

    // Cache simples em memoria
    private static readonly Dictionary<string, EnderecoCep> cache =
        new Dictionary<string, EnderecoCep>();

    public static async Task<EnderecoCep> ConsultarCepAsync(string cep)
    {
        string limpo = new string(cep.Where(char.IsDigit).ToArray());
        if (limpo.Length != 8)
        {
            return new EnderecoCep { Erro = "CEP deve ter 8 digitos" };
        }

        // Cache hit
        if (cache.ContainsKey(limpo))
        {
            Console.WriteLine($"  (cache) {limpo}");
            return cache[limpo];
        }

        try
        {
            EnderecoCep endereco = await client.GetFromJsonAsync<EnderecoCep>(
                $"{BASE}{limpo}/json/");

            if (endereco != null)
            {
                cache[limpo] = endereco;
            }
            return endereco;
        }
        catch (Exception ex)
        {
            return new EnderecoCep { Erro = "Falha na consulta: " + ex.Message };
        }
    }

    public static string Formatar(EnderecoCep e)
    {
        if (e == null) return "(null)";
        if (!string.IsNullOrEmpty(e.Erro)) return "Erro: " + e.Erro;

        List<string> partes = new List<string>();
        if (!string.IsNullOrEmpty(e.Logradouro)) partes.Add(e.Logradouro);
        if (!string.IsNullOrEmpty(e.Bairro)) partes.Add(e.Bairro);
        if (!string.IsNullOrEmpty(e.Localidade)) partes.Add(e.Localidade);
        if (!string.IsNullOrEmpty(e.Uf)) partes.Add(e.Uf);
        return string.Join(", ", partes);
    }

    public static async Task Main(string[] args)
    {
        client.Timeout = TimeSpan.FromSeconds(10);
        Console.WriteLine("=== CONSULTA DE CEP (ViaCEP) ===\n");

        // ---------- 1) Consultas sequenciais ----------
        string[] ceps = {
            "01310-100", "20040-020", "30130-010",
            "70040-010", "90010-150", "99999-999"
        };

        Console.WriteLine("--- Sequencial ---");
        var inicio = DateTime.Now;
        List<EnderecoCep> resultados = new List<EnderecoCep>();

        foreach (string cep in ceps)
        {
            Console.WriteLine("Consultando " + cep + "...");
            EnderecoCep end = await ConsultarCepAsync(cep);
            resultados.Add(end);
            Console.WriteLine("  -> " + Formatar(end));
        }
        var duracaoSeq = DateTime.Now - inicio;
        Console.WriteLine($"Tempo sequencial: {duracaoSeq.TotalMilliseconds:F0}ms\n");

        // ---------- 2) Consultas paralelas ----------
        Console.WriteLine("--- Paralelo ---");
        inicio = DateTime.Now;

        List<Task<EnderecoCep>> tarefas = new List<Task<EnderecoCep>>();
        foreach (string cep in ceps)
        {
            tarefas.Add(ConsultarCepAsync(cep));
        }
        EnderecoCep[] resultadosParalelos = await Task.WhenAll(tarefas);

        foreach (string cep in ceps)
        {
            Console.WriteLine($"  {cep} -> {Formatar(cache.ContainsKey(new string(cep.Where(char.IsDigit).ToArray()))
                ? cache[new string(cep.Where(char.IsDigit).ToArray())]
                : new EnderecoCep { Erro = "nao consultado" })}");
        }
        var duracaoPar = DateTime.Now - inicio;
        Console.WriteLine($"Tempo paralelo: {duracaoPar.TotalMilliseconds:F0}ms");
        Console.WriteLine("(o cache fez varias consultas retornarem instantaneamente)\n");

        // ---------- 3) Analise com LINQ ----------
        Console.WriteLine("--- Analise com LINQ ---");
        List<EnderecoCep> validos = resultados.Where(r => string.IsNullOrEmpty(r.Erro)).ToList();

        Console.WriteLine($"Total consultado: {resultados.Count}");
        Console.WriteLine($"Validos:          {validos.Count}");
        Console.WriteLine($"Com erro:         {resultados.Count - validos.Count}");

        Console.WriteLine("\nAgrupados por UF:");
        var porUf = validos.GroupBy(v => v.Uf).OrderBy(g => g.Key);
        foreach (var g in porUf)
        {
            Console.WriteLine($"  {g.Key}: {g.Count()} CEP(s)");
        }

        Console.WriteLine("\nEnderecos encontrados (ordenados por cidade):");
        foreach (EnderecoCep e in validos.OrderBy(v => v.Localidade))
        {
            Console.WriteLine($"  {e.Cep} - {e.Localidade}/{e.Uf} - {e.Logradouro}");
        }

        // ---------- 4) Busca por texto ----------
        Console.WriteLine("\n--- Busca por 'Paulista' ---");
        var paulista = resultados.Where(r =>
            !string.IsNullOrEmpty(r.Logradouro) &&
            r.Logradouro.IndexOf("Paulista", StringComparison.OrdinalIgnoreCase) >= 0);

        foreach (EnderecoCep e in paulista)
        {
            Console.WriteLine($"  {e.Cep}: {Formatar(e)}");
        }

        Console.WriteLine("\nFim das consultas.");
    }
}