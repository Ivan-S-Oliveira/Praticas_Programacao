package POO;

/**
 * 20 - Polimorfismo: Pagamentos
 * Conceitos: classe abstrata, polimorfismo, sobrescrita, arrays de tipos base
 */

abstract class FormaPagamento {
    protected String titular;
    protected double valor;

    public FormaPagamento(String titular, double valor) {
        this.titular = titular;
        this.valor = valor;
    }

    public String getTitular() { return titular; }
    public double getValor() { return valor; }

    // Metodos a serem implementados pelas subclasses
    public abstract double calcularTaxa();
    public abstract String getDescricao();

    // Metodo concreto que usa os abstratos (Template Method simples)
    public double calcularTotal() {
        return valor + calcularTaxa();
    }

    public void processar() {
        System.out.println(String.format("%-20s | %-20s | Valor: R$ %10.2f | Taxa: R$ %8.2f | Total: R$ %10.2f",
                getClass().getSimpleName(),
                getDescricao(),
                valor,
                calcularTaxa(),
                calcularTotal()));
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{" + titular + ", R$ " + valor + "}";
    }
}

class CartaoCredito extends FormaPagamento {
    private int parcelas;

    public CartaoCredito(String titular, double valor, int parcelas) {
        super(titular, valor);
        this.parcelas = parcelas;
    }

    @Override
    public double calcularTaxa() {
        // 3% do valor + 1% por parcela acima de 1
        return valor * 0.03 + valor * 0.01 * (parcelas - 1);
    }

    @Override
    public String getDescricao() {
        return "Credito em " + parcelas + "x";
    }
}

class CartaoDebito extends FormaPagamento {
    public CartaoDebito(String titular, double valor) {
        super(titular, valor);
    }

    @Override
    public double calcularTaxa() {
        return valor * 0.01; // 1% de taxa fixa
    }

    @Override
    public String getDescricao() {
        return "Debito a vista";
    }
}

class Pix extends FormaPagamento {
    public Pix(String titular, double valor) {
        super(titular, valor);
    }

    @Override
    public double calcularTaxa() {
        return 0.0; // Pix sem taxa
    }

    @Override
    public String getDescricao() {
        return "Pix instantaneo";
    }
}

class Boleto extends FormaPagamento {
    private int diasParaVencimento;

    public Boleto(String titular, double valor, int diasParaVencimento) {
        super(titular, valor);
        this.diasParaVencimento = diasParaVencimento;
    }

    @Override
    public double calcularTaxa() {
        // R$ 2,50 + 0,5% do valor
        return 2.50 + valor * 0.005;
    }

    @Override
    public String getDescricao() {
        return "Boleto em " + diasParaVencimento + " dias";
    }
}

class polimorfismo_pagamentos {
    public static void main(String[] args) {
        FormaPagamento[] pagamentos = new FormaPagamento[6];
        pagamentos[0] = new CartaoCredito("Ana", 1000.00, 1);
        pagamentos[1] = new CartaoCredito("Bruno", 1000.00, 6);
        pagamentos[2] = new CartaoDebito("Carla", 500.00);
        pagamentos[3] = new Pix("Daniel", 2500.00);
        pagamentos[4] = new Boleto("Eduarda", 800.00, 30);
        pagamentos[5] = new Pix("Felipe", 150.00);

        System.out.println("=== Processando pagamentos (polimorfismo) ===\n");

        double totalGeral = 0;
        double totalTaxas = 0;

        for (int i = 0; i < pagamentos.length; i++) {
            FormaPagamento p = pagamentos[i];
            p.processar();
            totalGeral += p.calcularTotal();
            totalTaxas += p.calcularTaxa();
        }

        System.out.println(String.format("\nTotal processado:  R$ %10.2f", totalGeral));
        System.out.println(String.format("Total em taxas:    R$ %10.2f", totalTaxas));
        System.out.println(String.format("Total liquido:     R$ %10.2f", totalGeral - totalTaxas));

        // Filtrando apenas Pix
        System.out.println("\n=== Apenas pagamentos via Pix ===");
        for (int i = 0; i < pagamentos.length; i++) {
            if (pagamentos[i] instanceof Pix) {
                pagamentos[i].processar();
            }
        }

        // Agrupando por tipo
        System.out.println("\n=== Contagem por tipo ===");
        String[] tipos = {"CartaoCredito", "CartaoDebito", "Pix", "Boleto"};
        for (int t = 0; t < tipos.length; t++) {
            int count = 0;
            double soma = 0;
            for (int i = 0; i < pagamentos.length; i++) {
                if (pagamentos[i].getClass().getSimpleName().equals(tipos[t])) {
                    count++;
                    soma += pagamentos[i].getValor();
                }
            }
            if (count > 0) {
                System.out.println(String.format("%-15s: %d pagamento(s), R$ %.2f",
                        tipos[t], count, soma));
            }
        }
    }
}
