import java.util.Scanner;

class fatorial {

    // Método estático
    static long fatorialIterativo(int n) {
        if (n < 0) return -1;
        long resultado = 1;
        for (int i = 2; i <= n; i++) {
            resultado *= i;
        }
        return resultado;
    }

    static long fatorialWhile(int n) {
        if (n < 0) return -1;
        long resultado = 1;
        while (n > 1) {
            resultado *= n;
            n--;
        }
        return resultado;
    }

    static long fatorialRecursivo(int n) {
        if (n < 0) return -1;
        if (n == 0 || n == 1) return 1;
        return n * fatorialRecursivo(n - 1);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite um número inteiro não-negativo: ");
        int n = scanner.nextInt();

        System.out.println("\n" + n + "! (for):      " + fatorialIterativo(n));
        System.out.println(n + "! (while):    " + fatorialWhile(n));
        System.out.println(n + "! (recursivo): " + fatorialRecursivo(n));

        scanner.close();
    }
}