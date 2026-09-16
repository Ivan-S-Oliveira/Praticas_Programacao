public class OrdenarLista
{
    // Bubble Sort manual
    static void BubbleSort(int[] arr)
    {
        int n = arr.Length;
        for (int i = 0; i < n - 1; i++)
        {
            for (int j = 0; j < n - 1 - i; j++)
            {
                if (arr[j] > arr[j + 1])
                {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void Main(string[] args)
    {
        Console.Write("Quantos números deseja ordenar? ");
        int n = int.Parse(Console.ReadLine());

        int[] numeros = new int[n];
        for (int i = 0; i < n; i++)
        {
            Console.Write($"Número {i + 1}: ");
            numeros[i] = int.Parse(Console.ReadLine());
        }

        // Cópia para comparar
        int[] copiaArray = (int[])numeros.Clone();
        var copiaLista = new List<int>(numeros);

        // Método 1: bubble sort manual
        BubbleSort(numeros);
        Console.Write("\nOrdenado (bubble sort): ");
        foreach (int num in numeros) Console.Write($"{num} ");
        Console.WriteLine();

        // Método 2: Array.Sort (nativo)
        Array.Sort(copiaArray);
        Console.Write("Ordenado (Array.Sort):  ");
        foreach (int num in copiaArray) Console.Write($"{num} ");
        Console.WriteLine();

        // Método 3: List<T>.Sort (nativo)
        copiaLista.Sort();
        Console.Write("Ordenado (List.Sort):   ");
        foreach (int num in copiaLista) Console.Write($"{num} ");
        Console.WriteLine();
    }
}