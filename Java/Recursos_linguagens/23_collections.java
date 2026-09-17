package Recursos_linguagens;

/**
 * 23 - Collections Framework
 * Conceitos: List, Set, Map, TreeSet, TreeMap, Collections utilitarios
 */

import java.util.*;

class collections {
    public static void main(String[] args) {
        // -------- LIST: ordem de insercao, permite duplicatas --------
        System.out.println("=== List (ArrayList) ===");
        List<String> frutas = new ArrayList<>();
        frutas.add("banana");
        frutas.add("maca");
        frutas.add("uva");
        frutas.add("banana"); // duplicata
        System.out.println("Lista: " + frutas);
        System.out.println("Tamanho: " + frutas.size());
        System.out.println("Elemento em [1]: " + frutas.get(1));
        System.out.println("Contem 'uva'? " + frutas.contains("uva"));
        Collections.sort(frutas);
        System.out.println("Ordenada: " + frutas);
        Collections.reverse(frutas);
        System.out.println("Reversa: " + frutas);

        // -------- SET: sem duplicatas --------
        System.out.println("\n=== Set (HashSet - sem ordem) ===");
        Set<String> setFrutas = new HashSet<>(frutas);
        System.out.println("Set: " + setFrutas);
        System.out.println("Tamanho: " + setFrutas.size());

        System.out.println("\n=== Set (TreeSet - ordenado) ===");
        Set<String> ordenado = new TreeSet<>(frutas);
        System.out.println("TreeSet: " + ordenado);

        System.out.println("\n=== Set (LinkedHashSet - ordem de insercao) ===");
        Set<String> inserido = new LinkedHashSet<>(frutas);
        System.out.println("LinkedHashSet: " + inserido);

        // -------- MAP: chave -> valor --------
        System.out.println("\n=== Map (HashMap) ===");
        Map<String, Integer> idades = new HashMap<>();
        idades.put("Ana", 28);
        idades.put("Bruno", 15);
        idades.put("Carla", 42);
        idades.put("Ana", 29); // sobrescreve
        System.out.println("Idades: " + idades);
        System.out.println("Idade da Ana: " + idades.get("Ana"));
        System.out.println("Contem 'Bruno'? " + idades.containsKey("Bruno"));

        System.out.println("\n--- Iterando Map ---");
        for (Map.Entry<String, Integer> e : idades.entrySet()) {
            System.out.println("  " + e.getKey() + " -> " + e.getValue());
        }

        System.out.println("\n=== Map (TreeMap - chaves ordenadas) ===");
        Map<String, Integer> ordenadoMap = new TreeMap<>(idades);
        System.out.println("TreeMap: " + ordenadoMap);

        System.out.println("\n=== Collections utilitarios ===");
        List<Integer> numeros = new ArrayList<>(Arrays.asList(5, 2, 9, 1, 7, 3));
        System.out.println("Original: " + numeros);
        System.out.println("Min: " + Collections.min(numeros));
        System.out.println("Max: " + Collections.max(numeros));
        Collections.shuffle(numeros);
        System.out.println("Embaralhada: " + numeros);
        Collections.sort(numeros, Collections.reverseOrder());
        System.out.println("Decrescente: " + numeros);

        System.out.println("\n=== List com Comparator customizado ===");
        List<String> nomes = new ArrayList<>(Arrays.asList("Ana", "Bruno", "Carla", "Daniel", "Eduarda"));
        nomes.sort(Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()));
        System.out.println("Por tamanho e alfabetica: " + nomes);

        System.out.println("\n=== Set operacoes ===");
        Set<Integer> a = new HashSet<>(Arrays.asList(1, 2, 3, 4, 5));
        Set<Integer> b = new HashSet<>(Arrays.asList(4, 5, 6, 7, 8));

        Set<Integer> uniao = new HashSet<>(a);
        uniao.addAll(b);
        System.out.println("A: " + a);
        System.out.println("B: " + b);
        System.out.println("Uniao: " + uniao);

        Set<Integer> intersec = new HashSet<>(a);
        intersec.retainAll(b);
        System.out.println("Interseccao: " + intersec);

        Set<Integer> diferenca = new HashSet<>(a);
        diferenca.removeAll(b);
        System.out.println("A - B: " + diferenca);
    }
}
