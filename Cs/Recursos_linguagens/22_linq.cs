/*
 * 22 - LINQ
 * Conceitos: query syntax, method syntax, operadores de consulta.
*/
using System;
using System.Collections.Generic;
using System.Linq;

public class Aluno
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Curso { get; set; }
    public double Nota { get; set; }

    public override string ToString()
    {
        return $"[{Id}] {Nome} - {Curso} - {Nota:F2}";
    }
}

public class linq
{
    public static void Main(string[] args)
    {
        List<Aluno> alunos = new List<Aluno>
        {
            new Aluno { Id = 1, Nome = "Ana",     Curso = "TI",      Nota = 9.5 },
            new Aluno { Id = 2, Nome = "Bruno",   Curso = "TI",      Nota = 6.5 },
            new Aluno { Id = 3, Nome = "Carla",   Curso = "Direito", Nota = 8.0 },
            new Aluno { Id = 4, Nome = "Daniel",  Curso = "TI",      Nota = 4.5 },
            new Aluno { Id = 5, Nome = "Eduarda", Curso = "Medicina",Nota = 9.0 },
            new Aluno { Id = 6, Nome = "Felipe",  Curso = "TI",      Nota = 7.5 },
            new Aluno { Id = 7, Nome = "Gabriela",Curso = "Direito", Nota = 8.5 },
            new Aluno { Id = 8, Nome = "Henrique",Curso = "TI",      Nota = 5.0 },
        };

        Console.WriteLine("=== Todos os alunos ===");
        foreach (Aluno a in alunos) Console.WriteLine("  " + a);

        // ---------- WHERE ----------
        Console.WriteLine("\n=== Aprovados (nota >= 7) - method syntax ===");
        var aprovados = alunos.Where(a => a.Nota >= 7);
        foreach (Aluno a in aprovados) Console.WriteLine("  " + a);

        Console.WriteLine("\n=== Aprovados - query syntax ===");
        var aprovados2 = from a in alunos where a.Nota >= 7 select a;
        foreach (Aluno a in aprovados2) Console.WriteLine("  " + a);

        // ---------- ORDER BY ----------
        Console.WriteLine("\n=== Ordenados por nota (desc) ===");
        var porNota = alunos.OrderByDescending(a => a.Nota);
        foreach (Aluno a in porNota) Console.WriteLine("  " + a);

        // ---------- SELECT (projecao) ----------
        Console.WriteLine("\n=== Apenas nomes ===");
        var nomes = alunos.Select(a => a.Nome);
        Console.WriteLine("  " + string.Join(", ", nomes));

        // ---------- GROUP BY ----------
        Console.WriteLine("\n=== Agrupados por curso ===");
        var porCurso = alunos.GroupBy(a => a.Curso);
        foreach (var grupo in porCurso)
        {
            Console.WriteLine($"  {grupo.Key} ({grupo.Count()} alunos):");
            foreach (Aluno a in grupo)
            {
                Console.WriteLine($"    - {a.Nome}: {a.Nota:F2}");
            }
        }

        // ---------- AGREGACOES ----------
        Console.WriteLine("\n=== Estatisticas gerais ===");
        Console.WriteLine("Total:     " + alunos.Count());
        Console.WriteLine("Media:     " + alunos.Average(a => a.Nota).ToString("F2"));
        Console.WriteLine("Maior:     " + alunos.Max(a => a.Nota));
        Console.WriteLine("Menor:     " + alunos.Min(a => a.Nota));
        Console.WriteLine("Soma:      " + alunos.Sum(a => a.Nota).ToString("F2"));

        // ---------- ANY / ALL ----------
        Console.WriteLine("\n=== Any / All ===");
        Console.WriteLine("Algum com nota < 5? " + alunos.Any(a => a.Nota < 5));
        Console.WriteLine("Todos com nota > 3? " + alunos.All(a => a.Nota > 3));

        // ---------- FIRST / SINGLE ----------
        Console.WriteLine("\n=== First / Single ===");
        Aluno primeiro = alunos.First(a => a.Curso == "Medicina");
        Console.WriteLine("Primeiro de Medicina: " + primeiro.Nome);

        Aluno unico = alunos.Single(a => a.Id == 3);
        Console.WriteLine("ID=3: " + unico.Nome);

        // ---------- JOIN ----------
        Console.WriteLine("\n=== Join com cursos ===");
        List<Curso> cursos = new List<Curso>
        {
            new Curso { Nome = "TI", Preco = 1500 },
            new Curso { Nome = "Direito", Preco = 2000 },
            new Curso { Nome = "Medicina", Preco = 5000 },
        };

        var joinResult = from a in alunos
                         join c in cursos on a.Curso equals c.Nome
                         select new { a.Nome, Curso = c.Nome, c.Preco };

        foreach (var item in joinResult)
        {
            Console.WriteLine($"  {item.Nome}: {item.Curso} (R$ {item.Preco})");
        }

        // ---------- TAKE / SKIP ----------
        Console.WriteLine("\n=== Top 3 alunos ===");
        var top3 = alunos.OrderByDescending(a => a.Nota).Take(3);
        foreach (Aluno a in top3) Console.WriteLine("  " + a);

        Console.WriteLine("\n=== Pulando os 3 primeiros ===");
        var restantes = alunos.OrderByDescending(a => a.Nota).Skip(3);
        foreach (Aluno a in restantes) Console.WriteLine("  " + a);
    }

    public class Curso
    {
        public string Nome { get; set; }
        public double Preco { get; set; }
    }
}