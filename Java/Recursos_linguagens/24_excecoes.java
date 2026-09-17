package Recursos_linguagens;

/**
 * 24 - Excecoes
 * Conceitos: try/catch/finally, checked vs unchecked, excecoes customizadas
 */

// Excecao customizada UNCHECKED (extends RuntimeException)
class SaldoInsuficienteException extends RuntimeException {
    private double saldo;
    private double solicitado;

    public SaldoInsuficienteException(double saldo, double solicitado) {
        super(String.format("Saldo insuficiente: R$ %.2f disponivel, R$ %.2f solicitado",
                saldo, solicitado));
        this.saldo = saldo;
        this.solicitado = solicitado;
    }

    public double getSaldo() { return saldo; }
    public double getSolicitado() { return solicitado; }
    public double getFalta() { return solicitado - saldo; }
}

// Excecao customizada CHECKED (extends Exception)
class IdadeInvalidaException extends Exception {
    public IdadeInvalidaException(String mensagem) {
        super(mensagem);
    }
}

class Conta {
    private String titular;
    private double saldo;

    public Conta(String titular, double saldoInicial) {
        this.titular = titular;
        this.saldo = saldoInicial;
    }

    public void sacar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor do saque deve ser positivo.");
        }
        if (valor > saldo) {
            throw new SaldoInsuficienteException(saldo, valor);
        }
        saldo -= valor;
    }

    public double getSaldo() { return saldo; }
    public String getTitular() { return titular; }
}

class Cadastro {
    // Metodo que declara 'throws' - checked exception
    public static void validarIdade(int idade) throws IdadeInvalidaException {
        if (idade < 0 || idade > 150) {
            throw new IdadeInvalidaException("Idade fora do intervalo permitido: " + idade);
        }
    }
}

class excecoes {
    public static void main(String[] args) {
        // -------- 1) Excecao unchecked customizada --------
        System.out.println("=== Saldo insuficiente ===");
        Conta c = new Conta("Ana", 100.00);
        try {
            c.sacar(50.00);
            System.out.printf("Saque OK. Novo saldo: R$ %.2f%n", c.getSaldo());
            c.sacar(200.00);
        } catch (SaldoInsuficienteException e) {
            System.out.println("Erro capturado: " + e.getMessage());
            System.out.printf("Faltam R$ %.2f%n", e.getFalta());
        } finally {
            System.out.printf("Saldo final: R$ %.2f%n", c.getSaldo());
        }

        // -------- 2) Excecao checked --------
        System.out.println("\n=== Validacao de idade (checked) ===");
        int[] idades = {25, -5, 200, 40};
        for (int idade : idades) {
            try {
                Cadastro.validarIdade(idade);
                System.out.println("Idade " + idade + ": valida");
            } catch (IdadeInvalidaException e) {
                System.out.println("Idade " + idade + ": " + e.getMessage());
            }
        }

        // -------- 3) Multiplos catches --------
        System.out.println("\n=== Multiplos catches ===");
        String[] entradas = {"10", "abc", "0"};
        for (String entrada : entradas) {
            try {
                int n = Integer.parseInt(entrada);
                int resultado = 100 / n;
                System.out.println(entrada + " -> " + resultado);
            } catch (NumberFormatException e) {
                System.out.println(entrada + " -> nao e um numero valido");
            } catch (ArithmeticException e) {
                System.out.println(entrada + " -> divisao por zero");
            }
        }

        // -------- 4) Finally sempre executa --------
        System.out.println("\n=== Finally ===");
        try {
            System.out.println("Dentro do try");
            throw new RuntimeException("erro simulado");
        } catch (RuntimeException e) {
            System.out.println("Catch: " + e.getMessage());
        } finally {
            System.out.println("Finally sempre executa");
        }

        // -------- 5) try-with-resources --------
        System.out.println("\n=== try-with-resources ===");
        try (Recurso r = new Recurso("A")) {
            r.usar();
        } catch (Exception e) {
            System.out.println("Erro: " + e.getMessage());
        }
        System.out.println("(recurso fechado automaticamente)");
    }

    // Classe que implementa AutoCloseable para try-with-resources
    static class Recurso implements AutoCloseable {
        private String nome;
        public Recurso(String nome) { this.nome = nome; }
        public void usar() { System.out.println("Usando recurso " + nome); }
        @Override
        public void close() { System.out.println("Fechando recurso " + nome); }
    }
}
