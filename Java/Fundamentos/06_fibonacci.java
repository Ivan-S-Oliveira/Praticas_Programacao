import java.util.Scanner;

class fibonacci {

    static long fibIterativo(int n) {
        long a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            long temp = a + b;
            a = b;
            b = temp;
        }
        return a;
    }

    static long fibRecursivo(int n) {
        if (n <= 1) return n;
        return fibRecursivo(n - 1) + fibRecursivo(n - 2);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Quantos números de Fibonacci deseja ver? ");
        int n = scanner.nextInt();

        if (n <= 0) {
            System.out.println("Digite um número positivo.");
            scanner.close();
            return;
        }

        // Sequência em array
        long[] sequencia = new long[n];
        long a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            sequencia[i] = a;
            long temp = a + b;
            a = b;
            b = temp;
        }

        System.out.print("\nSequência com " + n + " termos: ");
        for (int i = 0; i < n; i++) {
            System.out.print(sequencia[i]);
            if (i < n - 1) System.out.print(", ");
        }
        System.out.println();

        System.out.println("\nO " + n + "º número de Fibonacci é: " + fibIterativo(n));

        if (n <= 20) {
            System.out.println("(recursivo) " + fibRecursivo(n));
        }

        scanner.close();
    }
}