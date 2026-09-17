import java.util.Arrays;
import java.util.Scanner;

class ordenar_array {

    // Bubble Sort manual
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    // troca
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Quantos números deseja ordenar? ");
        int n = scanner.nextInt();

        int[] numeros = new int[n];
        for (int i = 0; i < n; i++) {
            System.out.print("Número " + (i + 1) + ": ");
            numeros[i] = scanner.nextInt();
        }

        // Cópia para comparar os dois métodos
        int[] copia = Arrays.copyOf(numeros, numeros.length);

        // Método 1: bubble sort manual
        bubbleSort(numeros);
        System.out.print("\nOrdenado (bubble sort): ");
        for (int num : numeros) {
            System.out.print(num + " ");
        }
        System.out.println();

        // Método 2: Arrays.sort
        Arrays.sort(copia);
        System.out.print("Ordenado (Arrays.sort): ");
        for (int num : copia) {
            System.out.print(num + " ");
        }
        System.out.println();

        scanner.close();
    }
}