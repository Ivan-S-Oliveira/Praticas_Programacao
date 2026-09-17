package Recursos_linguagens;

/**
 * 25 - Leitura de Arquivo
 * Conceitos: Files, Paths, BufferedReader, try-with-resources, Stream
 */

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

class leitura_arquivo {
    private static final String ARQUIVO = "exemplo_leitura.txt";

    public static void criarArquivoExemplo() throws IOException {
        Path p = Paths.get(ARQUIVO);
        if (Files.exists(p)) {
            System.out.println("Arquivo ja existe: " + p.toAbsolutePath());
            return;
        }
        List<String> linhas = List.of(
            "Python e uma linguagem de programacao.",
            "Java tambem e uma linguagem de programacao.",
            "Ambas sao muito usadas no mercado.",
            "Esta e a quarta linha do arquivo.",
            "Fim do arquivo."
        );
        Files.write(p, linhas, StandardCharsets.UTF_8);
        System.out.println("Arquivo criado: " + p.toAbsolutePath());
    }

    // 1) Files.readAllLines - le tudo de uma vez
    public static List<String> lerTudo(Path p) throws IOException {
        return Files.readAllLines(p, StandardCharsets.UTF_8);
    }

    // 2) Files.readString - le como uma unica String (Java 11+)
    public static String lerComoString(Path p) throws IOException {
        return Files.readString(p, StandardCharsets.UTF_8);
    }

    // 3) BufferedReader - ideal para arquivos grandes
    public static void lerComBufferedReader(Path p) throws IOException {
        try (BufferedReader br = Files.newBufferedReader(p, StandardCharsets.UTF_8)) {
            String linha;
            int i = 1;
            while ((linha = br.readLine()) != null) {
                System.out.printf("%2d: %s%n", i, linha);
                i++;
            }
        }
    }

    // 4) Files.lines - Stream (mais funcional)
    public static void lerComStream(Path p) throws IOException {
        try (var stream = Files.lines(p, StandardCharsets.UTF_8)) {
            stream.filter(l -> l.toLowerCase().contains("java"))
                  .forEach(l -> System.out.println("  [filtro] " + l));
        }
    }

    public static void main(String[] args) {
        try {
            criarArquivoExemplo();
            Path p = Paths.get(ARQUIVO);

            System.out.println("\n=== readAllLines ===");
            List<String> linhas = lerTudo(p);
            for (String l : linhas) {
                System.out.println("  " + l);
            }
            System.out.println("Total de linhas: " + linhas.size());

            System.out.println("\n=== readString (arquivo inteiro) ===");
            String texto = lerComoString(p);
            System.out.println("Caracteres: " + texto.length());
            System.out.println("Palavras: " + texto.split("\\s+").length);

            System.out.println("\n=== BufferedReader ===");
            lerComBufferedReader(p);

            System.out.println("\n=== Stream (filtrando linhas com 'java') ===");
            lerComStream(p);

            System.out.println("\n=== Informacoes do arquivo ===");
            System.out.println("Tamanho: " + Files.size(p) + " bytes");
            System.out.println("Ultima modificacao: " + Files.getLastModifiedTime(p));

        } catch (IOException e) {
            System.out.println("Erro de I/O: " + e.getMessage());
        }
    }
}
