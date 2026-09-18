/*
 * 14 - Sistema de Notas
 * Conceitos: composição (Turma tem Aluno), arrays de objetos, agregações.
*/
using System;

public class Aluno
{
    private string nome;
    private double[] notas;
    private int qtdNotas;

    public Aluno(string nome)
    {
        this.nome = nome;
        this.notas = new double[10];
        this.qtdNotas = 0;
    }

    public string GetNome() { return nome; }

    public void AdicionarNota(double nota)
    {
        if (nota < 0 || nota > 10)
        {
            Console.WriteLine("Nota invalida para " + nome);
            return;
        }
        if (qtdNotas >= notas.Length)
        {
            Console.WriteLine("Limite de notas atingido para " + nome);
            return;
        }
        notas[qtdNotas] = nota;
        qtdNotas++;
    }

    public double CalcularMedia()
    {
        if (qtdNotas == 0) return 0;
        double soma = 0;
        for (int i = 0; i < qtdNotas; i++)
        {
            soma += notas[i];
        }
        return soma / qtdNotas;
    }

    public string GetSituacao()
    {
        double media = CalcularMedia();
        if (media >= 7) return "Aprovado";
        if (media >= 5) return "Recuperacao";
        return "Reprovado";
    }

    public void MostrarBoletim()
    {
        Console.Write(nome + " - Notas: [");
        for (int i = 0; i < qtdNotas; i++)
        {
            Console.Write(notas[i]);
            if (i < qtdNotas - 1) Console.Write(", ");
        }
        Console.WriteLine(string.Format("] | Media: {0:F2} | {1}", CalcularMedia(), GetSituacao()));
    }
}

public class Turma
{
    private string nome;
    private Aluno[] alunos;
    private int qtdAlunos;

    public Turma(string nome, int capacidade)
    {
        this.nome = nome;
        this.alunos = new Aluno[capacidade];
        this.qtdAlunos = 0;
    }

    public void AdicionarAluno(Aluno aluno)
    {
        if (qtdAlunos >= alunos.Length)
        {
            Console.WriteLine("Turma cheia.");
            return;
        }
        alunos[qtdAlunos] = aluno;
        qtdAlunos++;
    }

    public double MediaGeral()
    {
        if (qtdAlunos == 0) return 0;
        double soma = 0;
        for (int i = 0; i < qtdAlunos; i++)
        {
            soma += alunos[i].CalcularMedia();
        }
        return soma / qtdAlunos;
    }

    public int ContarPorSituacao(string situacao)
    {
        int contador = 0;
        for (int i = 0; i < qtdAlunos; i++)
        {
            if (alunos[i].GetSituacao() == situacao) contador++;
        }
        return contador;
    }

    public void MostrarRelatorio()
    {
        Console.WriteLine("\n=== Turma: " + nome + " ===");
        for (int i = 0; i < qtdAlunos; i++)
        {
            alunos[i].MostrarBoletim();
        }
        Console.WriteLine(string.Format("\nMedia geral: {0:F2}", MediaGeral()));
        Console.WriteLine("Aprovados:   " + ContarPorSituacao("Aprovado"));
        Console.WriteLine("Recuperacao: " + ContarPorSituacao("Recuperacao"));
        Console.WriteLine("Reprovados:  " + ContarPorSituacao("Reprovado"));
    }
}

public class sistema_notas
{
    public static void Main(string[] args)
    {
        Turma turma = new Turma("3o Ano A", 10);

        Aluno a1 = new Aluno("Ana");
        a1.AdicionarNota(9.5); a1.AdicionarNota(8.0); a1.AdicionarNota(7.5);

        Aluno a2 = new Aluno("Bruno");
        a2.AdicionarNota(6.0); a2.AdicionarNota(5.5); a2.AdicionarNota(6.5);

        Aluno a3 = new Aluno("Carla");
        a3.AdicionarNota(4.0); a3.AdicionarNota(3.5); a3.AdicionarNota(5.0);

        Aluno a4 = new Aluno("Daniel");
        a4.AdicionarNota(10.0); a4.AdicionarNota(9.0); a4.AdicionarNota(8.5);

        turma.AdicionarAluno(a1);
        turma.AdicionarAluno(a2);
        turma.AdicionarAluno(a3);
        turma.AdicionarAluno(a4);

        turma.MostrarRelatorio();
    }
}