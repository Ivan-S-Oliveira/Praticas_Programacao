package POO;

/**
 * 13 - Conta Bancaria
 * Conceitos: encapsulamento, saldo privado, operacoes com validacao
 */

class ContaBancaria {
    private String titular;
    private String numero;
    private double saldo;
    private String[] historico;
    private int totalMovimentacoes;

    public ContaBancaria(String titular, String numero) {
        this.titular = titular;
        this.numero = numero;
        this.saldo = 0.0;
        this.historico = new String[100];
        this.totalMovimentacoes = 0;
    }

    public String getTitular() { return titular; }
    public String getNumero() { return numero; }
    public double getSaldo() { return saldo; }

    private void registrar(String descricao) {
        if (totalMovimentacoes < historico.length) {
            historico[totalMovimentacoes] = descricao;
            totalMovimentacoes++;
        }
    }

    public void depositar(double valor) {
        if (valor <= 0) {
            System.out.println("Valor de deposito invalido.");
            return;
        }
        saldo += valor;
        registrar(String.format("Deposito de R$ %.2f", valor));
        System.out.println(String.format("Deposito de R$ %.2f realizado.", valor));
    }

    public boolean sacar(double valor) {
        if (valor <= 0) {
            System.out.println("Valor de saque invalido.");
            return false;
        }
        if (valor > saldo) {
            System.out.println("Saldo insuficiente.");
            return false;
        }
        saldo -= valor;
        registrar(String.format("Saque de R$ %.2f", valor));
        System.out.println(String.format("Saque de R$ %.2f realizado.", valor));
        return true;
    }

    public boolean transferir(ContaBancaria destino, double valor) {
        if (destino == null) {
            System.out.println("Conta destino invalida.");
            return false;
        }
        if (this.sacar(valor)) {
            destino.depositar(valor);
            return true;
        }
        return false;
    }

    public void mostrarExtrato() {
        System.out.println("\n--- Extrato: " + titular + " (" + numero + ") ---");
        for (int i = 0; i < totalMovimentacoes; i++) {
            System.out.println("  " + (i + 1) + ". " + historico[i]);
        }
        System.out.println(String.format("Saldo atual: R$ %.2f", saldo));
    }

    @Override
    public String toString() {
        return String.format("Conta{titular='%s', numero='%s', saldo=%.2f}",
                titular, numero, saldo);
    }
}

class conta_bancaria {
    public static void main(String[] args) {
        ContaBancaria c1 = new ContaBancaria("Ana", "0001-1");
        ContaBancaria c2 = new ContaBancaria("Bruno", "0002-2");

        System.out.println("--- Estado inicial ---");
        System.out.println(c1);
        System.out.println(c2);

        System.out.println("\n--- Operacoes ---");
        c1.depositar(1000.00);
        c1.depositar(500.00);
        c1.sacar(200.00);
        c1.sacar(5000.00); // saldo insuficiente

        c1.transferir(c2, 300.00);

        System.out.println("\n--- Saldos finais ---");
        System.out.println(c1);
        System.out.println(c2);

        c1.mostrarExtrato();
        c2.mostrarExtrato();
    }
}
