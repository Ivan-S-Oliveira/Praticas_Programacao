package Recursos_linguagens;

/**
 * 27 - JSON (sem biblioteca externa)
 * Conceitos: parser manual, serializacao manual, Map e List
 *
 * Em producao use Jackson ou Gson. Aqui fazemos na mao para entender.
 */

import java.util.*;

class json {

    // ---------- Serializacao: Map/List -> String JSON ----------
    public static String serializar(Object obj) {
        StringBuilder sb = new StringBuilder();
        escrever(obj, sb, 0);
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private static void escrever(Object obj, StringBuilder sb, int nivel) {
        if (obj == null) {
            sb.append("null");
        } else if (obj instanceof String) {
            sb.append('"').append(escapar((String) obj)).append('"');
        } else if (obj instanceof Number || obj instanceof Boolean) {
            sb.append(obj.toString());
        } else if (obj instanceof Map) {
            Map<String, Object> map = (Map<String, Object>) obj;
            if (map.isEmpty()) { sb.append("{}"); return; }
            sb.append("{\n");
            int i = 0;
            for (Map.Entry<String, Object> e : map.entrySet()) {
                indentar(sb, nivel + 1);
                sb.append('"').append(escapar(e.getKey())).append("\": ");
                escrever(e.getValue(), sb, nivel + 1);
                if (++i < map.size()) sb.append(',');
                sb.append('\n');
            }
            indentar(sb, nivel);
            sb.append('}');
        } else if (obj instanceof List) {
            List<Object> list = (List<Object>) obj;
            if (list.isEmpty()) { sb.append("[]"); return; }
            sb.append("[\n");
            for (int i = 0; i < list.size(); i++) {
                indentar(sb, nivel + 1);
                escrever(list.get(i), sb, nivel + 1);
                if (i < list.size() - 1) sb.append(',');
                sb.append('\n');
            }
            indentar(sb, nivel);
            sb.append(']');
        }
    }

    private static void indentar(StringBuilder sb, int nivel) {
        for (int i = 0; i < nivel; i++) sb.append("  ");
    }

    private static String escapar(String s) {
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\t", "\\t");
    }

    // ---------- Parser simples (apenas objetos planos e arrays) ----------
    public static Object parse(String json) {
        Parser p = new Parser(json);
        return p.parseValor();
    }

    static class Parser {
        private String s;
        private int pos;

        Parser(String s) { this.s = s; this.pos = 0; }

        Object parseValor() {
            pularEspacos();
            if (pos >= s.length()) return null;
            char c = s.charAt(pos);
            if (c == '{') return parseObjeto();
            if (c == '[') return parseArray();
            if (c == '"') return parseString();
            if (c == 't' || c == 'f') return parseBoolean();
            if (c == 'n') { pos += 4; return null; }
            return parseNumero();
        }

        Map<String, Object> parseObjeto() {
            Map<String, Object> map = new LinkedHashMap<>();
            pos++; // {
            pularEspacos();
            if (s.charAt(pos) == '}') { pos++; return map; }
            while (true) {
                pularEspacos();
                String chave = parseString();
                pularEspacos();
                pos++; // :
                Object valor = parseValor();
                map.put(chave, valor);
                pularEspacos();
                char c = s.charAt(pos);
                pos++;
                if (c == '}') break;
            }
            return map;
        }

        List<Object> parseArray() {
            List<Object> list = new ArrayList<>();
            pos++; // [
            pularEspacos();
            if (s.charAt(pos) == ']') { pos++; return list; }
            while (true) {
                Object valor = parseValor();
                list.add(valor);
                pularEspacos();
                char c = s.charAt(pos);
                pos++;
                if (c == ']') break;
            }
            return list;
        }

        String parseString() {
            StringBuilder sb = new StringBuilder();
            pos++; // "
            while (s.charAt(pos) != '"') {
                char c = s.charAt(pos);
                if (c == '\\') {
                    pos++;
                    char esc = s.charAt(pos);
                    if (esc == 'n') sb.append('\n');
                    else if (esc == 't') sb.append('\t');
                    else sb.append(esc);
                } else {
                    sb.append(c);
                }
                pos++;
            }
            pos++; // "
            return sb.toString();
        }

        Number parseNumero() {
            int ini = pos;
            while (pos < s.length() && "-0123456789.eE+".indexOf(s.charAt(pos)) >= 0) pos++;
            String num = s.substring(ini, pos);
            if (num.contains(".") || num.contains("e") || num.contains("E")) {
                return Double.parseDouble(num);
            }
            return Long.parseLong(num);
        }

        Boolean parseBoolean() {
            if (s.startsWith("true", pos)) { pos += 4; return Boolean.TRUE; }
            pos += 5;
            return Boolean.FALSE;
        }

        void pularEspacos() {
            while (pos < s.length() && Character.isWhitespace(s.charAt(pos))) pos++;
        }
    }

    // ---------- Demo ----------
    public static void main(String[] args) {
        // Construindo estrutura manualmente
        Map<String, Object> biblioteca = new LinkedHashMap<>();
        biblioteca.put("nome", "Biblioteca Central");
        biblioteca.put("total", 3);

        List<Object> livros = new ArrayList<>();

        Map<String, Object> l1 = new LinkedHashMap<>();
        l1.put("id", 1);
        l1.put("titulo", "Dom Casmurro");
        l1.put("autor", "Machado de Assis");
        l1.put("ano", 1899);
        l1.put("disponivel", true);
        livros.add(l1);

        Map<String, Object> l2 = new LinkedHashMap<>();
        l2.put("id", 2);
        l2.put("titulo", "O Cortico");
        l2.put("autor", "Aluisio Azevedo");
        l2.put("ano", 1890);
        l2.put("disponivel", false);
        livros.add(l2);

        Map<String, Object> l3 = new LinkedHashMap<>();
        l3.put("id", 3);
        l3.put("titulo", "Grande Sertao: Veredas");
        l3.put("autor", "Joao Guimaraes Rosa");
        l3.put("ano", 1956);
        l3.put("disponivel", true);
        livros.add(l3);

        biblioteca.put("livros", livros);

        // Serializando
        String json = serializar(biblioteca);
        System.out.println("=== JSON gerado ===");
        System.out.println(json);

        // Parseando de volta
        System.out.println("\n=== Parseando de volta ===");
        @SuppressWarnings("unchecked")
        Map<String, Object> parseado = (Map<String, Object>) parse(json);
        System.out.println("Nome: " + parseado.get("nome"));
        System.out.println("Total: " + parseado.get("total"));

        @SuppressWarnings("unchecked")
        List<Object> livrosParse = (List<Object>) parseado.get("livros");
        for (Object o : livrosParse) {
            @SuppressWarnings("unchecked")
            Map<String, Object> livro = (Map<String, Object>) o;
            System.out.printf("  [%d] %s (%d) - %s%n",
                    livro.get("id"), livro.get("titulo"),
                    livro.get("ano"), livro.get("autor"));
        }
    }
}

