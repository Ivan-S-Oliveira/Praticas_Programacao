package POO;

/**
 * 19 - Heranca: Animais
 * Conceitos: extends, super, sobrescrita de metodos, classe base
 */

class Animal {
    protected String nome;
    protected int idade;

    public Animal(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    public String getNome() { return nome; }
    public int getIdade() { return idade; }

    public String emitirSom() {
        return "...";
    }

    public String movimentar() {
        return nome + " se move.";
    }

    public void apresentar() {
        System.out.println(String.format("%s (%d anos) diz: %s",
                nome, idade, emitirSom()));
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{nome='" + nome + "', idade=" + idade + "}";
    }
}

class Cachorro extends Animal {
    private String raca;

    public Cachorro(String nome, int idade, String raca) {
        super(nome, idade);
        this.raca = raca;
    }

    public String getRaca() { return raca; }

    @Override
    public String emitirSom() {
        return "Au au!";
    }

    @Override
    public String movimentar() {
        return nome + " corre pela casa.";
    }
}

class Gato extends Animal {
    private boolean ehCaseiro;

    public Gato(String nome, int idade, boolean ehCaseiro) {
        super(nome, idade);
        this.ehCaseiro = ehCaseiro;
    }

    public boolean isEhCaseiro() { return ehCaseiro; }

    @Override
    public String emitirSom() {
        return "Miau!";
    }

    @Override
    public String movimentar() {
        return nome + " anda silenciosamente.";
    }
}

class Passaro extends Animal {
    private double envergaduraAsas;

    public Passaro(String nome, int idade, double envergaduraAsas) {
        super(nome, idade);
        this.envergaduraAsas = envergaduraAsas;
    }

    public double getEnvergaduraAsas() { return envergaduraAsas; }

    @Override
    public String emitirSom() {
        return "Piu piu!";
    }

    @Override
    public String movimentar() {
        return nome + " voa com " + envergaduraAsas + " cm de envergadura.";
    }
}

class heranca_animais {
    public static void main(String[] args) {
        Animal[] animais = new Animal[4];
        animais[0] = new Cachorro("Rex", 5, "Labrador");
        animais[1] = new Gato("Mimi", 3, true);
        animais[2] = new Passaro("Tweety", 1, 15.5);
        animais[3] = new Cachorro("Bolt", 2, "Husky");

        System.out.println("=== Apresentacao dos animais ===");
        for (int i = 0; i < animais.length; i++) {
            animais[i].apresentar();
            System.out.println("  " + animais[i].movimentar());
            System.out.println("  " + animais[i]);
            System.out.println();
        }

        System.out.println("=== Filtrando por tipo ===");
        for (int i = 0; i < animais.length; i++) {
            if (animais[i] instanceof Cachorro) {
                Cachorro c = (Cachorro) animais[i];
                System.out.println(c.getNome() + " e da raca " + c.getRaca());
            }
        }
    }
}
