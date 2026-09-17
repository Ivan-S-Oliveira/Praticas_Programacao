package Recursos_linguagens;

/**
 * 29 - Threads
 * Conceitos: Thread, Runnable, synchronized, AtomicInteger, join
 */

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

class threads {

    // ---------- 1) Runnable simples ----------
    static class Tarefa implements Runnable {
        private String nome;
        private int repeticoes;

        public Tarefa(String nome, int repeticoes) {
            this.nome = nome;
            this.repeticoes = repeticoes;
        }

        @Override
        public void run() {
            for (int i = 1; i <= repeticoes; i++) {
                System.out.printf("[%s] passo %d%n", nome, i);
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    System.out.println(nome + " interrompida");
                    return;
                }
            }
            System.out.println("[" + nome + "] concluida");
        }
    }

    // ---------- 2) Contador SEM sincronizacao (bug classico) ----------
    static class ContadorIngenuo {
        private int valor = 0;
        public void incrementar() { valor++; }
        public int getValor() { return valor; }
    }

    // ---------- 3) Contador COM sincronizacao ----------
    static class ContadorSincronizado {
        private int valor = 0;
        public synchronized void incrementar() { valor++; }
        public synchronized int getValor() { return valor; }
    }

    // ---------- 4) Contador com AtomicInteger ----------
    static class ContadorAtomico {
        private AtomicInteger valor = new AtomicInteger(0);
        public void incrementar() { valor.incrementAndGet(); }
        public int getValor() { return valor.get(); }
    }

    public static void main(String[] args) throws InterruptedException {
        // ---------- Threads simples ----------
        System.out.println("=== 3 tarefas em paralelo ===");
        Thread t1 = new Thread(new Tarefa("T1", 3));
        Thread t2 = new Thread(new Tarefa("T2", 3));
        Thread t3 = new Thread(new Tarefa("T3", 3));

        long inicio = System.currentTimeMillis();
        t1.start();
        t2.start();
        t3.start();
        t1.join();
        t2.join();
        t3.join();
        long fim = System.currentTimeMillis();
        System.out.println("Tempo total: " + (fim - inicio) + "ms");
        System.out.println("(sequencial seria ~1800ms, paralelo ~600ms)\n");

        // ---------- Race condition ----------
        System.out.println("=== Race condition (sem sincronizacao) ===");
        ContadorIngenuo ingenuo = new ContadorIngenuo();
        List<Thread> threadsIngenuas = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            Thread t = new Thread(() -> {
                for (int j = 0; j < 10_000; j++) ingenuo.incrementar();
            });
            threadsIngenuas.add(t);
            t.start();
        }
        for (Thread t : threadsIngenuas) t.join();
        System.out.println("Esperado: 100000, obtido: " + ingenuo.getValor());
        System.out.println("(valor menor indica race condition)\n");

        // ---------- Sincronizado ----------
        System.out.println("=== Com synchronized ===");
        ContadorSincronizado sinc = new ContadorSincronizado();
        List<Thread> threadsSinc = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            Thread t = new Thread(() -> {
                for (int j = 0; j < 10_000; j++) sinc.incrementar();
            });
            threadsSinc.add(t);
            t.start();
        }
        for (Thread t : threadsSinc) t.join();
        System.out.println("Esperado: 100000, obtido: " + sinc.getValor() + "\n");

        // ---------- AtomicInteger ----------
        System.out.println("=== Com AtomicInteger ===");
        ContadorAtomico atomico = new ContadorAtomico();
        List<Thread> threadsAtom = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            Thread t = new Thread(() -> {
                for (int j = 0; j < 10_000; j++) atomico.incrementar();
            });
            threadsAtom.add(t);
            t.start();
        }
        for (Thread t : threadsAtom) t.join();
        System.out.println("Esperado: 100000, obtido: " + atomico.getValor());
    }
}