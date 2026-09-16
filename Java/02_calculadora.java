import java.util.Scanner;

class calculadora {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("=== CALCULADORA ===");
        System.out.println("1 - Somar");
        System.out.println("2 - Subtrair");
        System.out.println("3 - Multiplicar");
        System.out.println("4 - Dividir");
        System.out.print("Escolha uma opção (1-4): ");
        int opcao = scanner.nextInt();

        System.out.print("Digite o primeiro número: ");
        double num1 = scanner.nextDouble();
        System.out.print("Digite o segundo número: ");
        double num2 = scanner.nextDouble();

        double resultado = 0;
        boolean valido = true;

        if (opcao == 1) {
            resultado = num1 + num2;
        } else if (opcao == 2) {
            resultado = num1 - num2;
        } else if (opcao == 3) {
            resultado = num1 * num2;
        } else if (opcao == 4) {
            if (num2 == 0) {
                System.out.println("Erro: divisão por zero!");
                valido = false;
            } else {
                resultado = num1 / num2;
            }
        } else {
            System.out.println("Opção inválida!");
            valido = false;
        }

        if (valido) {
            System.out.println("Resultado: " + resultado);
        }

        scanner.close();
    }
}
