package Recursos_linguagens;

/**
 * 21 - Interface de Pagamento
 * Conceitos: interface, implements, default methods, polimorfismo
 */

import java.util.Arrays;

interface Pagavel {
    double getValor();

    // Metodo default: implementacao padrao, mas pode ser sobrescrito
    default double calcularTaxa() {
        return 0.0;
    }

    default double calcularTotal() {
        return getValor() + calcularTaxa();
    }

    // Metodo abstrato obrigatorio
    String getDescricao();
}

interface Parcelavel extends Pagavel {
    int getParcelas();
    double getValorParcela();

    default String resumoParcelas() {
        return String.format("%dx de R$ %.2f", getParcelas(), getValorParcela());
    }
}

class Pix implements Pagavel {
    private double valor;
    private String chave;

    public Pix(double valor, String chave) {
        this.valor = valor;
        this.chave = chave;
    }

    @Override public double getValor() { return valor; }

    @Override public String getDescricao() {
        return "Pix para chave " + chave;
    }
}

class CartaoCredito implements Parcelavel {
    private double valor;
    private int parcelas;
    private double taxaMensal;

    public CartaoCredito(double valor, int parcelas, double taxaMensal) {
        this.valor = valor;
        this.parcelas = parcelas;
        this.taxaMensal = taxaMensal;
    }

    @Override public double getValor() { return valor; }
    @Override public int getParcelas() { return parcelas; }

    @Override public double getValorParcela() {
        double total = calcularTotal();
        return total / parcelas;
    }

    @Override public double calcularTaxa() {
        return valor * taxaMensal * parcelas;
    }

    @Override public String getDescricao() {
        return "Credito " + resumoParcelas();
    }
}

class Boleto implements Pagavel {
    private double valor;
    private int diasVencimento;

    public Boleto(double valor, int diasVencimento) {
        this.valor = valor;
        this.diasVencimento = diasVencimento;
    }

    @Override public double getValor() { return valor; }

    @Override public double calcularTaxa() {
        return 2.50 + valor * 0.005;
    }

    @Override public String getDescricao() {
        return "Boleto vence em " + diasVencimento + " dias";
    }
}

class interface_pagamento {
    public static void main(String[] args) {
        Pagavel[] pagamentos = {
            new Pix(500.00, "ana@email.com"),
            new CartaoCredito(1000.00, 3, 0.02),
            new Boleto(800.00, 30),
            new CartaoCredito(200.00, 1, 0.02),
        };

        System.out.println("=== Processando pagamentos via interface ===\n");
        double total = 0, taxas = 0;
        for (Pagavel p : pagamentos) {
            System.out.printf("%-40s | Valor: R$ %8.2f | Taxa: R$ %7.2f | Total: R$ %8.2f%n",
                    p.getDescricao(), p.getValor(), p.calcularTaxa(), p.calcularTotal());
            total += p.calcularTotal();
            taxas += p.calcularTaxa();
        }
        System.out.printf("%nTotal geral: R$ %.2f | Taxas: R$ %.2f%n", total, taxas);

        // Ordenando com Comparator (lambda) - recurso moderno
        System.out.println("\n=== Ordenados por valor ===");
        Arrays.sort(pagamentos, (a, b) -> Double.compare(b.getValor(), a.getValor()));
        for (Pagavel p : pagamentos) {
            System.out.printf("  R$ %8.2f - %s%n", p.getValor(), p.getDescricao());
        }
    }
}
