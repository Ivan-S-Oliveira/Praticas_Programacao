import java.util.Scanner;

class maior_numero {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite o 1º número: ");
        double n1 = scanner.nextDouble();
        System.out.print("Digite o 2º número: ");
        double n2 = scanner.nextDouble();
        System.out.print("Digite o 3º número: ");
        double n3 = scanner.nextDouble();

        // Forma 1: lógica manual
        double maiorManual;
        if (n1 >= n2 && n1 >= n3) {
            maiorManual = n1;
        } else if (n2 >= n1 && n2 >= n3) {
            maiorManual = n2;
        } else {
            maiorManual = n3;
        }

        // Forma 2: usando Math.max
        double maiorMath = Math.max(n1, Math.max(n2, n3));

        System.out.println("\nMaior (lógica manual): " + maiorManual);
        System.out.println("Maior (usando Math.max): " + maiorMath);

        scanner.close();
    }
}
