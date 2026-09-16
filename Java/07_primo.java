import java.util.Scanner;

class primo {

    static boolean ehPrimo(int n) {
        if (n < 2) return false;
        if (n == 2) return true;
        if (n % 2 == 0) return false;

        int limite = (int) Math.sqrt(n) + 1;
        for (int i = 3; i < limite; i += 2) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite um número: ");
        int n = scanner.nextInt();

        if (ehPrimo(n)) {
            System.out.println(n + " é Primo!");
        } else {
            System.out.println(n + " Não é primo!");
        }

        // Primos até 50
        System.out.print("\nPrimos até 50: ");
        for (int i = 2; i <= 50; i++) {
            if (ehPrimo(i)) {
                System.out.print(i + " ");
            }
        }
        System.out.println();

        scanner.close();
    }
}