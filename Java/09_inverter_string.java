import java.util.Scanner;

class inverter_string {

    // Forma 1: laço manual
    static String inverterManual(String texto) {
        String resultado = "";
        for (int i = texto.length() - 1; i >= 0; i--) {
            resultado += texto.charAt(i);
        }
        return resultado;
    }

    // Forma 2: array de chars
    static String inverterArray(String texto) {
        char[] chars = texto.toCharArray();
        int inicio = 0;
        int fim = chars.length - 1;
        while (inicio < fim) {
            char temp = chars[inicio];
            chars[inicio] = chars[fim];
            chars[fim] = temp;
            inicio++;
            fim--;
        }
        return new String(chars);
    }

    // Forma 3: StringBuilder
    static String inverterBuilder(String texto) {
        return new StringBuilder(texto).reverse().toString();
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite um texto: ");
        String texto = scanner.nextLine();

        System.out.println("\nOriginal:         " + texto);
        System.out.println("Invertido (for):  " + inverterManual(texto));
        System.out.println("Invertido (array):" + inverterArray(texto));
        System.out.println("Invertido (build):" + inverterBuilder(texto));

        scanner.close();
    }
}