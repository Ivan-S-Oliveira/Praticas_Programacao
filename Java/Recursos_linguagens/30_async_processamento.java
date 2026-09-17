package Recursos_linguagens;

/**
 * 30 - Processamento Assincrono
 * Conceitos: CompletableFuture, ExecutorService, encadeamento, combinacao
 */

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.function.Supplier;

class async_processamento {

    // Simula um servico lento (ex.: consulta a banco, chamada HTTP)
    static String consultarPreco(String produto) {
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        switch (produto) {
            case "Notebook": return "3500.00";
            case "Mouse":    return "89.90";
            case "Teclado":  return "250.00";
            case "Monitor":  return "1200.00";
            default:         return "0.00";
        }
    }

    static double calcularDesconto(String produto, double preco) {
        // Simula regra de desconto
        if (preco > 1000) return preco * 0.10;
        if (preco > 100)  return preco * 0.05;
        return 0;
    }

    // ---------- 1) ExecutorService com Callable ----------
    static void exemploExecutorService() throws Exception {
        System.out.println("=== ExecutorService com Callable ===");
        ExecutorService pool = Executors.newFixedThreadPool(4);

        List<Future<String>> futures = new ArrayList<>();
        String[] produtos = {"Notebook", "Mouse", "Teclado", "Monitor"};

        long inicio = System.currentTimeMillis();
        for (String p : produtos) {
            futures.add(pool.submit(() -> p + " = R$ " + consultarPreco(p)));
        }
        for (Future<String> f : futures) {
            System.out.println("  " + f.get());
        }
        long fim = System.currentTimeMillis();
        System.out.println("Tempo total: " + (fim - inicio) + "ms");
        System.out.println("(sequencial seria ~2000ms, paralelo ~500ms)\n");

        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
    }

    // ---------- 2) CompletableFuture com encadeamento ----------
    static void exemploCompletableFuture() throws Exception {
        System.out.println("=== CompletableFuture com encadeamento ===");
        ExecutorService pool = Executors.newFixedThreadPool(4);

        Supplier<Double> tarefa = () -> {
            String precoStr = consultarPreco("Notebook");
            return Double.parseDouble(precoStr);
        };

        CompletableFuture<Double> futuro = CompletableFuture
                .supplyAsync(tarefa, pool)
                .thenApply(preco -> preco - calcularDesconto("Notebook", preco));

        System.out.println("  Preco do Notebook com desconto: R$ " + futuro.get());

        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
        System.out.println();
    }

    // ---------- 3) Combinando dois futuros com thenCombine ----------
    static void exemploThenCombine() throws Exception {
        System.out.println("=== thenCombine (dois futuros) ===");
        ExecutorService pool = Executors.newFixedThreadPool(4);

        CompletableFuture<Double> precoNotebook = CompletableFuture.supplyAsync(
                () -> Double.parseDouble(consultarPreco("Notebook")), pool);
        CompletableFuture<Double> precoMouse = CompletableFuture.supplyAsync(
                () -> Double.parseDouble(consultarPreco("Mouse")), pool);

        CompletableFuture<Double> soma = precoNotebook.thenCombine(precoMouse, Double::sum);
        System.out.println("  Notebook + Mouse = R$ " + soma.get());

        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
        System.out.println();
    }

    // ---------- 4) allOf: esperar varios futuros ----------
    static void exemploAllOf() throws Exception {
        System.out.println("=== allOf (varios futuros) ===");
        ExecutorService pool = Executors.newFixedThreadPool(4);

        String[] produtos = {"Notebook", "Mouse", "Teclado", "Monitor"};
        List<CompletableFuture<Double>> futuros = new ArrayList<>();

        long inicio = System.currentTimeMillis();
        for (String p : produtos) {
            futuros.add(CompletableFuture.supplyAsync(
                    () -> Double.parseDouble(consultarPreco(p)), pool));
        }

        CompletableFuture<Void> todos = CompletableFuture.allOf(
                futuros.toArray(new CompletableFuture[0]));

        todos.thenRun(() -> {
            double total = 0;
            for (CompletableFuture<Double> f : futuros) {
                try {
                    total += f.get();
                } catch (Exception ignored) {}
            }
            System.out.printf("  Total dos 4 produtos: R$ %.2f%n", total);
        }).get();

        long fim = System.currentTimeMillis();
        System.out.println("  Tempo: " + (fim - inicio) + "ms");
        System.out.println("  (sequencial seria ~2000ms)\n");

        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
    }

    // ---------- 5) Tratamento de erro com exceptionally ----------
    static void exemploErro() throws Exception {
    System.out.println("=== Tratamento de erro assincrono ===");
    ExecutorService pool = Executors.newFixedThreadPool(2);

    boolean simularFalha = true;

    CompletableFuture<String> futuro = CompletableFuture
        .supplyAsync(() -> {
            if (simularFalha) {
                 throw new RuntimeException("falha simulada");
            }
            return "ok";
        }, pool)
        .exceptionally(ex -> "Erro tratado: " + ex.getMessage());

        System.out.println("  Resultado: " + futuro.get());

        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
    }

    public static void main(String[] args) throws Exception {
        exemploExecutorService();
        exemploCompletableFuture();
        exemploThenCombine();
        exemploAllOf();
        exemploErro();
        System.out.println("Fim dos exemplos assincronos.");
    }
}
