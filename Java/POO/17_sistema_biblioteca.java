package POO;

/**
 * 17 - Sistema de Biblioteca
 * Conceitos: composicao, estado do objeto, emprestimo/devolucao
 */

class Livro {
    private int id;
    private String titulo;
    private String autor;
    private int ano;
    private boolean disponivel;

    public Livro(int id, String titulo, String autor, int ano) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
        this.disponivel = true;
    }

    public int getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getAutor() { return autor; }
    public int getAno() { return ano; }
    public boolean isDisponivel() { return disponivel; }

    public void emprestar() { disponivel = false; }
    public void devolver() { disponivel = true; }

    @Override
    public String toString() {
        String status = disponivel ? "disponivel" : "emprestado";
        return String.format("[%d] %-30s %-20s %4d  (%s)",
                id, titulo, autor, ano, status);
    }
}

class Biblioteca {
    private String nome;
    private Livro[] livros;
    private int qtd;
    private int proximoId;

    public Biblioteca(String nome, int capacidade) {
        this.nome = nome;
        this.livros = new Livro[capacidade];
        this.qtd = 0;
        this.proximoId = 1;
    }

    public void adicionar(String titulo, String autor, int ano) {
        if (qtd >= livros.length) {
            System.out.println("Biblioteca cheia.");
            return;
        }
        livros[qtd] = new Livro(proximoId++, titulo, autor, ano);
        qtd++;
    }

    public Livro buscarPorId(int id) {
        for (int i = 0; i < qtd; i++) {
            if (livros[i].getId() == id) return livros[i];
        }
        return null;
    }

    public void emprestar(int id) {
        Livro l = buscarPorId(id);
        if (l == null) {
            System.out.println("Livro nao encontrado.");
            return;
        }
        if (!l.isDisponivel()) {
            System.out.println("Livro ja esta emprestado.");
            return;
        }
        l.emprestar();
        System.out.println("Emprestado: " + l.getTitulo());
    }

    public void devolver(int id) {
        Livro l = buscarPorId(id);
        if (l == null) {
            System.out.println("Livro nao encontrado.");
            return;
        }
        if (l.isDisponivel()) {
            System.out.println("Este livro ja esta na biblioteca.");
            return;
        }
        l.devolver();
        System.out.println("Devolvido: " + l.getTitulo());
    }

    public void listar() {
        System.out.println("\n=== " + nome + " ===");
        for (int i = 0; i < qtd; i++) {
            System.out.println(livros[i]);
        }
    }

    public void buscarPorAutor(String autor) {
        System.out.println("\n--- Livros de " + autor + " ---");
        boolean achou = false;
        for (int i = 0; i < qtd; i++) {
            if (livros[i].getAutor().toLowerCase().contains(autor.toLowerCase())) {
                System.out.println(livros[i]);
                achou = true;
            }
        }
        if (!achou) System.out.println("Nenhum livro encontrado.");
    }

    public void listarDisponiveis() {
        System.out.println("\n--- Livros disponiveis ---");
        for (int i = 0; i < qtd; i++) {
            if (livros[i].isDisponivel()) {
                System.out.println(livros[i]);
            }
        }
    }
}

class sistema_biblioteca {
    public static void main(String[] args) {
        Biblioteca bib = new Biblioteca("Biblioteca Central", 20);

        bib.adicionar("Dom Casmurro", "Machado de Assis", 1899);
        bib.adicionar("O Cortico", "Aluisio Azevedo", 1890);
        bib.adicionar("Grande Sertao: Veredas", "Joao Guimaraes Rosa", 1956);
        bib.adicionar("Memorias Postumas", "Machado de Assis", 1881);
        bib.adicionar("Capitaes da Areia", "Jorge Amado", 1937);

        bib.listar();

        System.out.println("\n--- Emprestimos ---");
        bib.emprestar(1);
        bib.emprestar(3);
        bib.emprestar(1); // ja emprestado

        bib.listar();
        bib.buscarPorAutor("Machado");
        bib.listarDisponiveis();

        System.out.println("\n--- Devolucao ---");
        bib.devolver(1);
        bib.listarDisponiveis();
    }
}
