package POO;

/**
 * 16 - Sistema de Estoque
 * Conceitos: composicao, array de objetos, movimentacoes
 */

class ItemEstoque {
    private int codigo;
    private String nome;
    private double preco;
    private int quantidade;

    public ItemEstoque(int codigo, String nome, double preco, int quantidade) {
        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
        this.quantidade = quantidade;
    }

    public int getCodigo() { return codigo; }
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public int getQuantidade() { return quantidade; }

    public void entrada(int qtd) {
        if (qtd > 0) quantidade += qtd;
    }

    public boolean saida(int qtd) {
        if (qtd > 0 && qtd <= quantidade) {
            quantidade -= qtd;
            return true;
        }
        return false;
    }

    public double valorTotal() {
        return preco * quantidade;
    }

    @Override
    public String toString() {
        return String.format("[%d] %-15s R$ %8.2f  qtd: %3d  total: R$ %10.2f",
                codigo, nome, preco, quantidade, valorTotal());
    }
}

class Estoque {
    private ItemEstoque[] itens;
    private int qtd;
    private int proximoCodigo;

    public Estoque(int capacidade) {
        this.itens = new ItemEstoque[capacidade];
        this.qtd = 0;
        this.proximoCodigo = 1;
    }

    public void cadastrar(String nome, double preco, int quantidade) {
        if (qtd >= itens.length) {
            System.out.println("Estoque cheio.");
            return;
        }
        itens[qtd] = new ItemEstoque(proximoCodigo++, nome, preco, quantidade);
        qtd++;
        System.out.println("Item cadastrado.");
    }

    public ItemEstoque buscar(int codigo) {
        for (int i = 0; i < qtd; i++) {
            if (itens[i].getCodigo() == codigo) return itens[i];
        }
        return null;
    }

    public void entrada(int codigo, int qtd) {
        ItemEstoque item = buscar(codigo);
        if (item == null) {
            System.out.println("Item nao encontrado.");
            return;
        }
        item.entrada(qtd);
        System.out.println("Entrada registrada em " + item.getNome());
    }

    public void saida(int codigo, int qtd) {
        ItemEstoque item = buscar(codigo);
        if (item == null) {
            System.out.println("Item nao encontrado.");
            return;
        }
        if (item.saida(qtd)) {
            System.out.println("Saida registrada em " + item.getNome());
        } else {
            System.out.println("Quantidade insuficiente em estoque.");
        }
    }

    public double valorTotalEstoque() {
        double soma = 0;
        for (int i = 0; i < qtd; i++) {
            soma += itens[i].valorTotal();
        }
        return soma;
    }

    public void listar() {
        System.out.println("\n--- Estoque atual ---");
        for (int i = 0; i < qtd; i++) {
            System.out.println(itens[i]);
        }
        System.out.println(String.format("Valor total em estoque: R$ %.2f", valorTotalEstoque()));
    }
}

class sistema_estoque {
    public static void main(String[] args) {
        Estoque estoque = new Estoque(20);

        estoque.cadastrar("Notebook", 3500.00, 5);
        estoque.cadastrar("Mouse", 89.90, 30);
        estoque.cadastrar("Teclado", 250.00, 15);
        estoque.cadastrar("Monitor", 1200.00, 8);

        estoque.listar();

        System.out.println("\n--- Movimentacoes ---");
        estoque.entrada(2, 20);   // +20 mouses
        estoque.saida(1, 2);      // -2 notebooks
        estoque.saida(3, 100);    // quantidade insuficiente

        estoque.listar();
    }
}
