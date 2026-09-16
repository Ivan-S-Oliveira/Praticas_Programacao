import java.util.Scanner;

class palindromo {

    // Versão 1: invertendo a string manualmente
    static boolean ehPalindromo(String texto) {
        String invertida = "";
        for (int i = texto.length() - 1; i >= 0; i--) {
            invertida += texto.charAt(i);
        }
        return texto.equals(invertida);
    }

    // Versão 2: comparando pontas
    static boolean ehPalindromoPontas(String texto) {
        int inicio = 0;
        int fim = texto.length() - 1;
        while (inicio < fim) {
            if (texto.charAt(inicio) != texto.charAt(fim)) {
                return false;
            }
            inicio++;
            fim--;
        }
        return true;
    }

    // Versão 3: ignorando espaços e maiúsculas
    static boolean ehPalindromoLimpo(String texto) {
        String limpo = "";
        for (int i = 0; i < texto.length(); i++) {
            char c = texto.charAt(i);
            if (Character.isLetterOrDigit(c)) {
                limpo += Character.toLowerCase(c);
            }
        }
        return ehPalindromoPontas(limpo);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite uma palavra ou frase: ");
        String texto = scanner.nextLine();

        System.out.println("\"" + texto + "\" é palíndromo (direto)? " + ehPalindromo(texto));
        System.out.println("\"" + texto + "\" é palíndromo (pontas)? " + ehPalindromoPontas(texto));
        System.out.println("\"" + texto + "\" é palíndromo (limpo)?  " + ehPalindromoLimpo(texto));

        // Exemplos prontos
        System.out.println("\n--- Exemplos ---");
        String[] exemplos = {"arara", "Python", "A base do teto desaba", "ovo", "radar"};
        for (String ex : exemplos) {
            String marca = ehPalindromoLimpo(ex) ? "Sim ->" : "Não ->";
            System.out.println(marca + " " + ex);
        }

        scanner.close();
    }
}