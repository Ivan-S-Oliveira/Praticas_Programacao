package POO;

/**
 * 18 - Sistema de Funcionarios
 * Conceitos: composicao, atributos calculados, relatorios
 */

class Funcionario {
    private int id;
    private String nome;
    private String cargo;
    private double salarioBase;

    public Funcionario(int id, String nome, String cargo, double salarioBase) {
        this.id = id;
        this.nome = nome;
        this.cargo = cargo;
        this.salarioBase = salarioBase;
    }

    public int getId() { return id; }
    public String getNome() { return nome; }
    public String getCargo() { return cargo; }
    public double getSalarioBase() { return salarioBase; }

    public void setSalarioBase(double valor) {
        if (valor > 0) this.salarioBase = valor;
    }

    public double calcularSalario() {
        return salarioBase;
    }

    @Override
    public String toString() {
        return String.format("[%d] %-15s %-15s salario base: R$ %10.2f",
                id, nome, cargo, salarioBase);
    }
}

class Empresa {
    private String nome;
    private Funcionario[] funcionarios;
    private int qtd;
    private int proximoId;

    public Empresa(String nome, int capacidade) {
        this.nome = nome;
        this.funcionarios = new Funcionario[capacidade];
        this.qtd = 0;
        this.proximoId = 1;
    }

    public void contratar(String nome, String cargo, double salario) {
        if (qtd >= funcionarios.length) {
            System.out.println("Limite de funcionarios atingido.");
            return;
        }
        funcionarios[qtd] = new Funcionario(proximoId++, nome, cargo, salario);
        qtd++;
        System.out.println("Contratado: " + nome);
    }

    public Funcionario buscar(int id) {
        for (int i = 0; i < qtd; i++) {
            if (funcionarios[i].getId() == id) return funcionarios[i];
        }
        return null;
    }

    public void aumentarSalario(int id, double percentual) {
        Funcionario f = buscar(id);
        if (f == null) {
            System.out.println("Funcionario nao encontrado.");
            return;
        }
        double novo = f.getSalarioBase() * (1 + percentual / 100);
        f.setSalarioBase(novo);
        System.out.println(String.format("Novo salario de %s: R$ %.2f",
                f.getNome(), novo));
    }

    public double folhaPagamento() {
        double total = 0;
        for (int i = 0; i < qtd; i++) {
            total += funcionarios[i].calcularSalario();
        }
        return total;
    }

    public void relatorio() {
        System.out.println("\n=== " + nome + " ===");
        for (int i = 0; i < qtd; i++) {
            Funcionario f = funcionarios[i];
            System.out.println(f + String.format(" | salario final: R$ %.2f",
                    f.calcularSalario()));
        }
        System.out.println(String.format("\nFolha de pagamento: R$ %.2f", folhaPagamento()));
    }

    public void relatorioPorCargo(String cargo) {
        System.out.println("\n--- Funcionarios com cargo: " + cargo + " ---");
        for (int i = 0; i < qtd; i++) {
            if (funcionarios[i].getCargo().equalsIgnoreCase(cargo)) {
                System.out.println(funcionarios[i]);
            }
        }
    }
}
class sistema_funcionarios {
    public static void main(String[] args) {
        Empresa empresa = new Empresa("TechCorp", 20);

        empresa.contratar("Ana", "Desenvolvedora", 6500.00);
        empresa.contratar("Bruno", "Analista", 5000.00);
        empresa.contratar("Carla", "Gerente", 12000.00);
        empresa.contratar("Daniel", "Desenvolvedor", 7000.00);
        empresa.contratar("Eduarda", "Estagiaria", 1800.00);

        empresa.relatorio();

        System.out.println("\n--- Aumentos ---");
        empresa.aumentarSalario(1, 10);   // Ana +10%
        empresa.aumentarSalario(5, 20);   // Eduarda +20%
        empresa.aumentarSalario(99, 5);   // nao existe

        empresa.relatorio();
        empresa.relatorioPorCargo("Desenvolvedora");
        empresa.relatorioPorCargo("Desenvolvedor");
    }
}