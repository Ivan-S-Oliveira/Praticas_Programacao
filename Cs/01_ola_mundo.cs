using System;

public class OlaMundo
{
    public static void Main(string[] args)
    {
        // 1. O clássico
        Console.WriteLine("Olá, Mundo!");

        // 2. Variáveis
        string nome = "Estudante";
        int idade = 25;
        Console.WriteLine($"Olá, {nome}! Você tem {idade} anos.");

        // 3. Entrada do usuário
        Console.Write("Digite seu nome: ");
        string nomeUsuario = Console.ReadLine();
        Console.WriteLine($"Bem-vindo(a), {nomeUsuario}!");

        // 4. Operação simples
        Console.Write("Em que ano você nasceu? ");
        int anoNascimento = int.Parse(Console.ReadLine());
        int anoAtual = 2026;
        int idadeUsuario = anoAtual - anoNascimento;
        Console.WriteLine($"Você tem aproximadamente {idadeUsuario} anos.");
    }
}