/*
 * 26 - JSON
 * Conceitos: System.Text.Json, serialização/desserialização, JsonSerializerOptions, DTOs com propriedades.
 */

 using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;

public class Livro
{
    public int Id { get; set; }
    public string Titulo { get; set; }
    public string Autor { get; set; }
    public int Ano { get; set; }
    public bool Disponivel { get; set; }
}

public class Biblioteca
{
    public string Nome { get; set; }
    public string Cidade { get; set; }
    public List<Livro> Livros { get; set; }

    public Biblioteca()
    {
        Livros = new List<Livro>();
    }
}

public class json
{
    public static void Main(string[] args)
    {
        // ---------- 1) Objeto -> JSON ----------
        Biblioteca bib = new Biblioteca
        {
            Nome = "Biblioteca Central",
            Cidade = "Sao Paulo",
            Livros = new List<Livro>
            {
                new Livro { Id = 1, Titulo = "Dom Casmurro", Autor = "Machado de Assis", Ano = 1899, Disponivel = true },
                new Livro { Id = 2, Titulo = "O Cortico", Autor = "Aluisio Azevedo", Ano = 1890, Disponivel = false },
                new Livro { Id = 3, Titulo = "Grande Sertao: Veredas", Autor = "Joao Guimaraes Rosa", Ano = 1956, Disponivel = true }
            }
        };

        JsonSerializerOptions opcoes = new JsonSerializerOptions
        {
            WriteIndented = true,
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };

        string json = JsonSerializer.Serialize(bib, opcoes);
        Console.WriteLine("=== JSON gerado ===");
        Console.WriteLine(json);

        // ---------- 2) JSON -> Objeto ----------
        Console.WriteLine("\n=== Desserializando ===");
        string jsonEntrada = @"
        {
            ""nome"": ""Biblioteca Nova"",
            ""cidade"": ""Rio de Janeiro"",
            ""livros"": [
                { ""id"": 10, ""titulo"": ""Capitaes da Areia"", ""autor"": ""Jorge Amado"", ""ano"": 1937, ""disponivel"": true },
                { ""id"": 11, ""titulo"": ""Memorias Postumas"", ""autor"": ""Machado de Assis"", ""ano"": 1881, ""disponivel"": false }
            ]
        }";

        Biblioteca lida = JsonSerializer.Deserialize<Biblioteca>(jsonEntrada);
        Console.WriteLine("Nome: " + lida.Nome);
        Console.WriteLine("Cidade: " + lida.Cidade);
        foreach (Livro l in lida.Livros)
        {
            Console.WriteLine($"  [{l.Id}] {l.Titulo} ({l.Ano}) - {l.Autor} - {(l.Disponivel ? "disponivel" : "emprestado")}");
        }

        // ---------- 3) Salvar em arquivo ----------
        string arquivo = "biblioteca.json";
        File.WriteAllText(arquivo, json);
        Console.WriteLine($"\nJSON salvo em '{arquivo}' ({new FileInfo(arquivo).Length} bytes)");

        // ---------- 4) Ler de arquivo ----------
        Console.WriteLine("\n=== Lendo do arquivo ===");
        string lido = File.ReadAllText(arquivo);
        Biblioteca bibLida = JsonSerializer.Deserialize<Biblioteca>(lido);
        Console.WriteLine("Livros lidos: " + bibLida.Livros.Count);

        // ---------- 5) Opcoes: nomes em camelCase ----------
        JsonSerializerOptions camelCase = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        string jsonCamel = JsonSerializer.Serialize(bib.Livros[0], camelCase);
        Console.WriteLine("\n=== camelCase ===");
        Console.WriteLine(jsonCamel);

        // ---------- 6) Ignorar propriedades nulas ----------
        Livro incompleto = new Livro { Id = 99, Titulo = "Sem autor", Ano = 2024 };
        JsonSerializerOptions ignorarNulos = new JsonSerializerOptions
        {
            WriteIndented = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };
        Console.WriteLine("\n=== Ignorando nulos ===");
        Console.WriteLine(JsonSerializer.Serialize(incompleto, ignorarNulos));
    }
}