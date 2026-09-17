package Recursos_linguagens;

/**
 * 28 - Consumir API
 * Conceitos: java.net.http.HttpClient, HttpRequest, HttpResponse
 *
 * Usa o HttpClient nativo (Java 11+) para consultar o ViaCEP.
 * Sem bibliotecas externas.
 */

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

class consumir_api {

    private static final String BASE = "https://viacep.com.br/ws/";
    private static final HttpClient CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    // Aproveitando o parser do exercicio 27 de forma simplificada
    // (aqui fazemos um mini-parser especifico para o retorno do ViaCEP)
    public static Map<String, String> consultarCep(String cep) throws Exception {
        String limpo = cep.replaceAll("\\D", "");
        if (limpo.length() != 8) {
            return Map.of("erro", "CEP deve ter 8 digitos");
        }

        String url = BASE + limpo + "/json/";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(10))
                .header("Accept", "application/json")
                .GET()
                .build();

        HttpResponse<String> response = CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            return Map.of("erro", "HTTP " + response.statusCode());
        }

        return parseJsonSimples(response.body());
    }

    // Parser simples para objetos planos de string/numero/boolean
    private static Map<String, String> parseJsonSimples(String json) {
        Map<String, String> map = new LinkedHashMap<>();
        json = json.trim();
        if (json.startsWith("{")) json = json.substring(1);
        if (json.endsWith("}")) json = json.substring(0, json.length() - 1);

        // Divide por virgula (funciona para JSON simples sem aninhamento)
        boolean dentroString = false;
        StringBuilder atual = new StringBuilder();
        List<String> partes = new ArrayList<>();
        for (int i = 0; i < json.length(); i++) {
            char c = json.charAt(i);
            if (c == '"') dentroString = !dentroString;
            if (c == ',' && !dentroString) {
                partes.add(atual.toString());
                atual = new StringBuilder();
            } else {
                atual.append(c);
            }
        }
        if (atual.length() > 0) partes.add(atual.toString());

        for (String parte : partes) {
            int idx = parte.indexOf(':');
            if (idx < 0) continue;
            String chave = parte.substring(0, idx).trim().replaceAll("\"", "");
            String valor = parte.substring(idx + 1).trim().replaceAll("\"", "");
            map.put(chave, valor);
        }
        return map;
    }

    public static String formatarEndereco(Map<String, String> dados) {
        if (dados.containsKey("erro")) return "Erro: " + dados.get("erro");
        List<String> partes = new ArrayList<>();
        if (dados.containsKey("logradouro")) partes.add(dados.get("logradouro"));
        if (dados.containsKey("bairro")) partes.add(dados.get("bairro"));
        if (dados.containsKey("localidade")) partes.add(dados.get("localidade"));
        if (dados.containsKey("uf")) partes.add(dados.get("uf"));
        return String.join(", ", partes);
    }

    public static void main(String[] args) {
        System.out.println("=== CONSULTA DE CEP (ViaCEP) ===\n");

        String[] ceps = {"01310-100", "20040-020", "30130-010", "99999-999"};

        for (String cep : ceps) {
            try {
                System.out.println("Consultando " + cep + "...");
                Map<String, String> dados = consultarCep(cep);
                System.out.println("  -> " + formatarEndereco(dados));
                if (!dados.containsKey("erro")) {
                    System.out.println("  CEP: " + dados.get("cep"));
                    System.out.println("  IBGE: " + dados.get("ibge"));
                }
                System.out.println();
            } catch (Exception e) {
                System.out.println("  Falha ao consultar " + cep + ": " + e.getMessage());
            }
        }

        System.out.println("Fim das consultas.");
    }
}
