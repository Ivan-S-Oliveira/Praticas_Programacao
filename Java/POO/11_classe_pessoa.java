package POO;

/**
 * 11 - Classe Pessoa
 * Conceitos: classe, encapsulamento, construtor, getters/setters, toString
 */

class Pessoa {
    private String nome;
    private int idade;
    private String email;

    // Construtor
    public Pessoa(String nome, int idade, String email) {
        this.nome = nome;
        this.idade = idade;
        this.email = email;
    }

    // Getters
    public String getNome() {
        return nome;
    }

    public int getIdade() {
        return idade;
    }

    public String getEmail() {
        return email;
    }

    // Setters com validacao simples
    public void setNome(String nome) {
        if (nome != null && !nome.trim().isEmpty()) {
            this.nome = nome;
        } else {
            System.out.println("Nome invalido.");
        }
    }

    public void setIdade(int idade) {
        if (idade >= 0 && idade <= 150) {
            this.idade = idade;
        } else {
            System.out.println("Idade invalida.");
        }
    }

    public void setEmail(String email) {
        if (email != null && email.contains("@")) {
            this.email = email;
        } else {
            System.out.println("Email invalido.");
        }
    }

    // Metodos de instancia
    public boolean ehMaiorDeIdade() {
        return idade >= 18;
    }

    public void apresentar() {
        System.out.println("Ola, meu nome e " + nome + ", tenho " + idade + " anos.");
    }

    // toString
    @Override
    public String toString() {
        return "Pessoa{nome='" + nome + "', idade=" + idade + ", email='" + email + "'}";
    }
}

class classe_pessoa {
    public static void main(String[] args) {
        Pessoa p1 = new Pessoa("Ana", 28, "ana@email.com");
        Pessoa p2 = new Pessoa("Bruno", 15, "bruno@email.com");

        System.out.println("--- Pessoa 1 ---");
        p1.apresentar();
        System.out.println(p1);
        System.out.println("Maior de idade? " + p1.ehMaiorDeIdade());

        System.out.println("\n--- Pessoa 2 ---");
        p2.apresentar();
        System.out.println(p2);
        System.out.println("Maior de idade? " + p2.ehMaiorDeIdade());

        System.out.println("\n--- Testando setters invalidos ---");
        p1.setIdade(-5);
        p1.setEmail("sem-arroba");
        p1.setNome("");

        System.out.println("\n--- Apos alteracoes validas ---");
        p1.setIdade(29);
        p1.setEmail("ana.nova@email.com");
        System.out.println(p1);
    }
}
