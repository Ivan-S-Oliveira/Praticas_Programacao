public class Calculadora
{
    static double Somar(double a, double b) => a + b;
    static double Subtrair(double a, double b) => a - b;
    static double Multiplicar(double a, double b) => a * b;

    static string Dividir(double a, double b)
    {
        if (b == 0) return "Erro: divisão por zero!";
        return (a / b).ToString();
    }

    public static void Main(string[] args)
    {
        Console.WriteLine("=== CALCULADORA ===");
        Console.WriteLine("1 - Somar");
        Console.WriteLine("2 - Subtrair");
        Console.WriteLine("3 - Multiplicar");
        Console.WriteLine("4 - Dividir");
        Console.Write("Escolha uma opção (1-4): ");
        string opcao = Console.ReadLine();

        Console.Write("Digite o primeiro número: ");
        if (!double.TryParse(Console.ReadLine(), out double num1))
        {
            Console.WriteLine("Número inválido!");
            return;
        }

        Console.Write("Digite o segundo número: ");
        if (!double.TryParse(Console.ReadLine(), out double num2))
        {
            Console.WriteLine("Número inválido!");
            return;
        }

        switch (opcao)
        {
            case "1":
                Console.WriteLine($"Resultado: {Somar(num1, num2)}");
                break;
            case "2":
                Console.WriteLine($"Resultado: {Subtrair(num1, num2)}");
                break;
            case "3":
                Console.WriteLine($"Resultado: {Multiplicar(num1, num2)}");
                break;
            case "4":
                Console.WriteLine($"Resultado: {Dividir(num1, num2)}");
                break;
            default:
                Console.WriteLine("Opção inválida!");
                break;
        }
    }
}