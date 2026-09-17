package Recursos_linguagens;

/**
 * 22 - Generics
 * Conceitos: <T>, <? extends>, <? super>, metodos genericos, bounded types
 */

import java.util.ArrayList;
import java.util.List;

// Classe generica: pilha (LIFO)
class Pilha<T> {
    private List<T> itens = new ArrayList<>();

    public void empilhar(T item) {
        itens.add(item);
    }

    public T desempilhar() {
        if (itens.isEmpty()) return null;
        return itens.remove(itens.size() - 1);
    }

    public T topo() {
        if (itens.isEmpty()) return null;
        return itens.get(itens.size() - 1);
    }

    public boolean vazia() { return itens.isEmpty(); }
    public int tamanho() { return itens.size(); }
}

// Par generico de dois tipos
class Par<A, B> {
    private A primeiro;
    private B segundo;

    public Par(A primeiro, B segundo) {
        this.primeiro = primeiro;
        this.segundo = segundo;
    }

    public A getPrimeiro() { return primeiro; }
    public B getSegundo() { return segundo; }

    @Override
    public String toString() {
        return "(" + primeiro + ", " + segundo + ")";
    }
}

// Bounded type: so aceita Number ou subclasses
class CaixaNumerica<T extends Number> {
    private T valor;

    public CaixaNumerica(T valor) { this.valor = valor; }

    public double metade() {
        return valor.doubleValue() / 2;
    }

    public T getValor() { return valor; }
}

// Metodos genericos utilitarios
class Util {
    // Aceita lista de qualquer tipo
    public static <T> void imprimirLista(List<T> lista) {
        for (T item : lista) {
            System.out.println("  - " + item);
        }
    }

    // Aceita lista de Number ou subclasses (covariancia)
    public static double somar(List<? extends Number> lista) {
        double soma = 0;
        for (Number n : lista) {
            soma += n.doubleValue();
        }
        return soma;
    }

    // Aceita lista que possa receber Number (contravariancia)
    public static void adicionarNumeros(List<? super Integer> lista) {
        lista.add(1);
        lista.add(2);
        lista.add(3);
    }

    // Encontra o maior de uma lista de Comparable
    public static <T extends Comparable<T>> T maior(List<T> lista) {
        if (lista.isEmpty()) return null;
        T maior = lista.get(0);
        for (T item : lista) {
            if (item.compareTo(maior) > 0) maior = item;
        }
        return maior;
    }
}

class generics {
    public static void main(String[] args) {
        System.out.println("=== Pilha generica ===");
        Pilha<String> pilhaTexto = new Pilha<>();
        pilhaTexto.empilhar("Ana");
        pilhaTexto.empilhar("Bruno");
        pilhaTexto.empilhar("Carla");
        System.out.println("Topo: " + pilhaTexto.topo());
        System.out.println("Desempilhado: " + pilhaTexto.desempilhar());
        System.out.println("Novo topo: " + pilhaTexto.topo());

        Pilha<Integer> pilhaNum = new Pilha<>();
        pilhaNum.empilhar(10);
        pilhaNum.empilhar(20);
        pilhaNum.empilhar(30);
        System.out.println("\nSoma da pilha numerica: " +
                (pilhaNum.desempilhar() + pilhaNum.desempilhar() + pilhaNum.desempilhar()));

        System.out.println("\n=== Par generico ===");
        Par<String, Integer> p1 = new Par<>("Ana", 28);
        Par<Integer, Double> p2 = new Par<>(1, 3.14);
        System.out.println(p1);
        System.out.println(p2);

        System.out.println("\n=== Caixa numerica (bounded) ===");
        CaixaNumerica<Integer> c1 = new CaixaNumerica<>(10);
        CaixaNumerica<Double> c2 = new CaixaNumerica<>(3.14);
        System.out.println("Metade de " + c1.getValor() + " = " + c1.metade());
        System.out.println("Metade de " + c2.getValor() + " = " + c2.metade());

        System.out.println("\n=== Metodos genericos ===");
        List<String> nomes = new ArrayList<>();
        nomes.add("Ana");
        nomes.add("Bruno");
        System.out.println("Lista de strings:");
        Util.imprimirLista(nomes);

        List<Integer> nums = new ArrayList<>();
        nums.add(10);
        nums.add(20);
        nums.add(30);
        System.out.println("\nSoma de Integer: " + Util.somar(nums));

        List<Double> decimais = new ArrayList<>();
        decimais.add(1.5);
        decimais.add(2.5);
        System.out.println("Soma de Double: " + Util.somar(decimais));

        System.out.println("\n=== Maior elemento ===");
        System.out.println("Maior string: " + Util.maior(nomes));
        System.out.println("Maior numero: " + Util.maior(nums));

        System.out.println("\n=== Wildcard super ===");
        List<Number> numeros = new ArrayList<>();
        Util.adicionarNumeros(numeros);
        System.out.println("Lista mista: " + numeros);
    }
}
