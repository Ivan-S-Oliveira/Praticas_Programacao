using System.Text;

public class InverterString
{
    // Forma 1: laço manual
    static string InverterManual(string texto)
    {
        string resultado = "";
        for (int i = texto.Length - 1; i >= 0; i--)
        {
            resultado += texto[i];
        }
        return resultado;
    }

    // Forma 2: array de chars + Array.Reverse
    static string InverterArray(string texto)
    {
        char[] chars = texto.ToCharArray();
        Array.Reverse(chars);
        return new string(chars);
    }

    // Forma 3: StringBuilder
    static string InverterBuilder(string texto)
    {
        var sb = new StringBuilder();
        for (int i = texto.Length - 1; i >= 0; i--)
        {
            sb.Append(texto[i]);
        }
        return sb.ToString();
    }

    public static void Main(string[] args)
    {
        Console.Write("Digite um texto: ");
        string texto = Console.ReadLine();

        Console.WriteLine($"\nOriginal:            {texto}");
        Console.WriteLine($"Invertido (for):     {InverterManual(texto)}");
        Console.WriteLine($"Invertido (array):   {InverterArray(texto)}");
        Console.WriteLine($"Invertido (builder): {InverterBuilder(texto)}");
    }
}