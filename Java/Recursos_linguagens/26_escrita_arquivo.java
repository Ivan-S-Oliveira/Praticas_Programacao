package Recursos_linguagens;

/**
 * 26 - Escrita de Arquivo
 * Conceitos: Files.write, BufferedWriter, append, StandardOpenOption
 */

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;

class escrita_arquivo {
    private static final String ARQUIVO = "exemplo_escrita.txt";
    private static final String ARQUIVO_APPEND = "exemplo_append.txt";

    // 1) Sobrescrever com Files.write
    public static void escreverSobrescrevendo(Path p, List<String> linhas) throws IOException {
        Files.write(p, linhas, StandardCharsets.UTF_8);
        System.out.println("Arquivo escrito (sobrescrevendo): " + p);
    }

    // 2) Adicionar (append)
    public static void adicionarLinha(Path p, String linha) throws IOException {
        Files.write(p,
                (linha + System.lineSeparator()).getBytes(StandardCharsets.UTF_8),
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);
    }

    // 3) BufferedWriter - melhor para escrever muita coisa
    public static void escreverComBuffer(Path p, List<String> linhas) throws IOException {
        try (BufferedWriter bw = Files.newBufferedWriter(p, StandardCharsets.UTF_8,
                StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {
            for (String linha : linhas) {
                bw.write(linha);
                bw.newLine();
            }
        }
        System.out.println("Escrito com BufferedWriter: " + p);
    }

    // 4) Escrever CSV simples
    public static void escreverCsv(Path p, String[][] dados) throws IOException {
        try (BufferedWriter bw = Files.newBufferedWriter(p, StandardCharsets.UTF_8)) {
            for (String[] linha : dados) {
                bw.write(String.join(";", linha));
                bw.newLine();
            }
        }
        System.out.println("CSV escrito: " + p);
    }

    // 5) Anexar bloco grande
    public static void anexarVariasLinhas(Path p, List<String> linhas) throws IOException {
        Files.write(p, linhas, StandardCharsets.UTF_8,
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);
    }

    public static void main(String[] args) {
        try {
            Path p = Paths.get(ARQUIVO);
            Path pAppend = Paths.get(ARQUIVO_APPEND);
            Path pCsv = Paths.get("saida.csv");

            // Escrevendo pela primeira vez
            List<String> conteudo = List.of(
                "Linha 1: primeira escrita",
                "Linha 2: usando Files.write",
                "Linha 3: sobrescrevendo se existir"
            );
            escreverSobrescrevendo(p, conteudo);

            // Anexando em arquivo separado
            Files.deleteIfExists(pAppend);
            adicionarLinha(pAppend, "Primeira linha anexada");
            adicionarLinha(pAppend, "Segunda linha anexada");
            adicionarLinha(pAppend, "Terceira linha anexada");
            System.out.println("Linhas anexadas em: " + pAppend);

            // BufferedWriter
            escreverComBuffer(p, List.of(
                "Reescrito com buffer",
                "Acentuacao: programacao, linguagem",
                "Fim"
            ));

            // CSV
            String[][] csv = {
                {"id", "produto", "preco", "quantidade"},
                {"1", "Notebook", "3500.00", "5"},
                {"2", "Mouse", "89.90", "30"},
                {"3", "Teclado", "250.00", "15"}
            };
            escreverCsv(pCsv, csv);

            // Append bloco
            anexarVariasLinhas(pAppend, List.of(
                "Linha extra 1",
                "Linha extra 2"
            ));

            // Confirmando conteudo final
            System.out.println("\n=== Conteudo de " + ARQUIVO + " ===");
            Files.readAllLines(p).forEach(l -> System.out.println("  " + l));

            System.out.println("\n=== Conteudo de " + ARQUIVO_APPEND + " ===");
            Files.readAllLines(pAppend).forEach(l -> System.out.println("  " + l));

            System.out.println("\n=== Conteudo de saida.csv ===");
            Files.readAllLines(pCsv).forEach(l -> System.out.println("  " + l));

            System.out.println("\nTamanho de cada arquivo (bytes):");
            System.out.println("  " + ARQUIVO + ": " + Files.size(p));
            System.out.println("  " + ARQUIVO_APPEND + ": " + Files.size(pAppend));
            System.out.println("  saida.csv: " + Files.size(pCsv));

        } catch (IOException e) {
            System.out.println("Erro de I/O: " + e.getMessage());
        }
    }
}
