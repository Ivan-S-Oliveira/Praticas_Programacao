package POO;

/**
 * 14 - Sistema de Notas
 * Conceitos: composicao (Turma tem Alunos), arrays, metodos de agregacao
 */

class Aluno {
    private String nome;
    private double[] notas;
    private int qtdNotas;

    public Aluno(String nome) {
        this.nome = nome;
        this.notas = new double[10];
        this.qtdNotas = 0;
    }

    public String getNome() { return nome; }

    public void adicionarNota(double nota) {
        if (nota < 0 || nota > 10) {
            System.out.println("Nota invalida para " + nome);
            return;
        }
        if (qtdNotas >= notas.length) {
            System.out.println("Limite de notas atingido para " + nome);
            return;
        }
        notas[qtdNotas] = nota;
        qtdNotas++;
    }

    public double calcularMedia() {
        if (qtdNotas == 0) return 0;
        double soma = 0;
        for (int i = 0; i < qtdNotas; i++) {
            soma += notas[i];
        }
        return soma / qtdNotas;
    }

    public String getSituacao() {
        double media = calcularMedia();
        if (media >= 7) return "Aprovado";
        if (media >= 5) return "Recuperacao";
        return "Reprovado";
    }

    public void mostrarBoletim() {
        System.out.print(nome + " - Notas: [");
        for (int i = 0; i < qtdNotas; i++) {
            System.out.print(notas[i]);
            if (i < qtdNotas - 1) System.out.print(", ");
        }
        System.out.println(String.format("] | Media: %.2f | %s",
                calcularMedia(), getSituacao()));
    }
}

class Turma {
    private String nome;
    private Aluno[] alunos;
    private int qtdAlunos;

    public Turma(String nome, int capacidade) {
        this.nome = nome;
        this.alunos = new Aluno[capacidade];
        this.qtdAlunos = 0;
    }

    public void adicionarAluno(Aluno aluno) {
        if (qtdAlunos >= alunos.length) {
            System.out.println("Turma cheia.");
            return;
        }
        alunos[qtdAlunos] = aluno;
        qtdAlunos++;
    }

    public double mediaGeral() {
        if (qtdAlunos == 0) return 0;
        double soma = 0;
        for (int i = 0; i < qtdAlunos; i++) {
            soma += alunos[i].calcularMedia();
        }
        return soma / qtdAlunos;
    }

    public int contarPorSituacao(String situacao) {
        int contador = 0;
        for (int i = 0; i < qtdAlunos; i++) {
            if (alunos[i].getSituacao().equals(situacao)) {
                contador++;
            }
        }
        return contador;
    }

    public void mostrarRelatorio() {
        System.out.println("\n=== Turma: " + nome + " ===");
        for (int i = 0; i < qtdAlunos; i++) {
            alunos[i].mostrarBoletim();
        }
        System.out.println(String.format("\nMedia geral da turma: %.2f", mediaGeral()));
        System.out.println("Aprovados:    " + contarPorSituacao("Aprovado"));
        System.out.println("Recuperacao:  " + contarPorSituacao("Recuperacao"));
        System.out.println("Reprovados:   " + contarPorSituacao("Reprovado"));
    }
}

class sistema_notas {
    public static void main(String[] args) {
        Turma turma = new Turma("3o Ano A", 10);

        Aluno a1 = new Aluno("Ana");
        a1.adicionarNota(9.5);
        a1.adicionarNota(8.0);
        a1.adicionarNota(7.5);

        Aluno a2 = new Aluno("Bruno");
        a2.adicionarNota(6.0);
        a2.adicionarNota(5.5);
        a2.adicionarNota(6.5);

        Aluno a3 = new Aluno("Carla");
        a3.adicionarNota(4.0);
        a3.adicionarNota(3.5);
        a3.adicionarNota(5.0);

        Aluno a4 = new Aluno("Daniel");
        a4.adicionarNota(10.0);
        a4.adicionarNota(9.0);
        a4.adicionarNota(8.5);

        turma.adicionarAluno(a1);
        turma.adicionarAluno(a2);
        turma.adicionarAluno(a3);
        turma.adicionarAluno(a4);

        turma.mostrarRelatorio();
    }
}
