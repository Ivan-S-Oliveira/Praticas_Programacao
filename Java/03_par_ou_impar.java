import java.util.Scanner;

class par_ou_impar {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite um número inteiro: ");
        int numero = scanner.nextInt();

        if (numero % 2 == 0) {
            System.out.println("O número " + numero + " é Par!");
        } else {
            System.out.println("O número " + numero + " é Ímpar!");
        }

        // Bônus: verificar de 1 a 10
        System.out.println("\n--- Verificando de 1 a 10 ---");
        for (int i = 1; i <= 10; i++) {
            String tipo = (i % 2 == 0) ? "par" : "ímpar";
            System.out.println(i + " é " + tipo);
        }

        scanner.close();
    }
}