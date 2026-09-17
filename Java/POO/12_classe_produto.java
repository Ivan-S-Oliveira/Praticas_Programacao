package POO;

/**
 * 12 - Classe Produto
 * Conceitos: atributos static, construtores sobrecarregados, metodos
 */

class Produto {
    private static int contador = 0;

    private int id;
    private String nome;
    private double preco;
    private int quantidade;

    // Construtor completo
    public Produto(String nome, double preco, int quantidade) {
        contador++;
        this.id = contador;
        this.nome = nome;
        this.preco = preco;
        this.quantidade = quantidade;
    }

    // Construtor sobrecarregado: quantidade = 0
    public Produto(String nome, double preco) {
        this(nome, preco, 0);
    }

    public int getId() { return id; }
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public int getQuantidade() { return quantidade; }

    public void setPreco(double preco) {
        if (preco >= 0) this.preco = preco;
        else System.out.println("Preco invalido.");
    }

    public void adicionarEstoque(int qtd) {
        if (qtd > 0) quantidade += qtd;
    }

    public boolean removerEstoque(int qtd) {
        if (qtd > 0 && qtd <= quantidade) {
            quantidade -= qtd;
            return true;
        }
        return false;
    }

    public double valorTotal() {
        return preco * quantidade;
    }

    public static int getTotalProdutos() {
        return contador;
    }

    @Override
    public String toString() {
        return String.format("Produto{id=%d, nome='%s', preco=%.2f, qtd=%d}",
                id, nome, preco, quantidade);
    }
}

class classe_produto {
    public static void main(String[] args) {
        Produto p1 = new Produto("Notebook", 3500.00, 10);
        Produto p2 = new Produto("Mouse", 89.90);
        Produto p3 = new Produto("Teclado", 250.00, 5);

        System.out.println("--- Produtos cadastrados ---");
        System.out.println(p1);
        System.out.println(p2);
        System.out.println(p3);

        System.out.println("\n--- Movimentacoes ---");
        p2.adicionarEstoque(20);
        System.out.println("Apos adicionar 20 ao mouse: " + p2);

        boolean removeu = p3.removerEstoque(2);
        System.out.println("Removeu 2 teclados? " + removeu);
        System.out.println(p3);

        boolean falhou = p3.removerEstoque(100);
        System.out.println("Tentou remover 100 teclados? " + falhou);

        System.out.println("\n--- Valores totais em estoque ---");
        System.out.println("Notebook: R$ " + p1.valorTotal());
        System.out.println("Mouse:    R$ " + p2.valorTotal());
        System.out.println("Teclado:  R$ " + p3.valorTotal());

        System.out.println("\nTotal de produtos criados: " + Produto.getTotalProdutos());
    }
}
