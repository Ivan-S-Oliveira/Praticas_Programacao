using System;
using System.Text;

public class Palindromo
{
    // Versão 1: invertendo a string manualmente
    static bool EhPalindromo(string texto)
    {
        string invertida = "";
        for (int i = texto.Length - 1; i >= 0; i--)
        {
            invertida += texto[i];
        }
        return texto == invertida;
    }

    // Versão 2: comparando pontas (mais eficiente)
    static bool EhPalindromoPontas(string texto)
    {
        int inicio = 0;
        int fim = texto.Length - 1;
        while (inicio < fim)
        {
            if (texto[inicio] != texto[fim]) return false;
            inicio++;
            fim--;
        }
        return true;
    }

    // Versão 3: ignorando espaços, pontuação e maiúsculas
    static bool EhPalindromoLimpo(string texto)
    {
        var limpo = new StringBuilder();
        foreach (char c in texto)
        {
            if (char.IsLetterOrDigit(c))
            {
                limpo.Append(char.ToLower(c));
            }
        }
        return EhPalindromoPontas(limpo.ToString());
    }

    public static void Main(string[] args)
    {
        Console.Write("Digite uma palavra ou frase: ");
        string texto = Console.ReadLine();

        Console.WriteLine($"\n\"{texto}\" é palíndromo (direto)? {EhPalindromo(texto)}");
        Console.WriteLine($"\"{texto}\" é palíndromo (pontas)? {EhPalindromoPontas(texto)}");
        Console.WriteLine($"\"{texto}\" é palíndromo (limpo)?  {EhPalindromoLimpo(texto)}");

        // Exemplos prontos
        Console.WriteLine("\n--- Exemplos ---");
        string[] exemplos = { "arara", "Python", "A base do teto desaba", "ovo", "radar" };
        foreach (string ex in exemplos)
        {
            string marca = EhPalindromoLimpo(ex) ? "Sim ->" : "Não ->";
            Console.WriteLine($"{marca} {ex}");
        }
    }
}