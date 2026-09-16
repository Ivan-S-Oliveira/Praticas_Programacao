import java.util.Scanner;

class ola_mundo {
    public static void main(String[] args) {
        // 1. Olá Mundo
        System.out.println("Olá, Mundo!");

        // 2. Variáveis
        String nome = "Estudante";
        int idade = 25;
        System.out.println("Olá, " + nome + "! Você tem " + idade + " anos.");

        // 3. Entrada do usuário
        Scanner scanner = new Scanner(System.in);
        System.out.print("Digite seu nome: ");
        String nomeUsuario = scanner.nextLine();
        System.out.println("Bem-vindo(a), " + nomeUsuario + "!");

        // 4. Operação simples
        System.out.print("Em que ano você nasceu? ");
        int anoNascimento = scanner.nextInt();
        int anoAtual = 2026;
        int idadeUsuario = anoAtual - anoNascimento;
        System.out.println("Você tem aproximadamente " + idadeUsuario + " anos.");

        scanner.close();
    }
}