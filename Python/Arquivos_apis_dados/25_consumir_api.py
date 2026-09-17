"""
25 - Consumir API
Conceitos: urllib.request, json.loads, tratamento de erro, query strings

Usa apenas a biblioteca padrao (urllib) para fazer requisicoes HTTP.
Demonstra GET, parametros e conversao de resposta JSON em dicionario.
"""

import json
import urllib.request
import urllib.parse
import urllib.error


BASE_URL = "https://viacep.com.br/ws"


def buscar_cep(cep):
    """Consulta um CEP no ViaCEP e retorna um dicionario."""
    cep_limpo = "".join(c for c in cep if c.isdigit())
    if len(cep_limpo) != 8:
        return {"erro": "CEP deve ter 8 digitos."}

    url = f"{BASE_URL}/{cep_limpo}/json/"
    try:
        with urllib.request.urlopen(url, timeout=10) as resposta:
            if resposta.status != 200:
                return {"erro": f"HTTP {resposta.status}"}
            texto = resposta.read().decode("utf-8")
            dados = json.loads(texto)
            if "erro" in dados:
                return {"erro": "CEP nao encontrado."}
            return dados
    except urllib.error.HTTPError as e:
        return {"erro": f"HTTP {e.code}: {e.reason}"}
    except urllib.error.URLError as e:
        return {"erro": f"Falha de conexao: {e.reason}"}
    except json.JSONDecodeError:
        return {"erro": "Resposta nao era JSON valido."}
    except Exception as e:
        return {"erro": f"Erro inesperado: {e}"}


def formatar_endereco(dados):
    if "erro" in dados:
        return f"Erro: {dados['erro']}"
    partes = [
        dados.get("logradouro", ""),
        dados.get("bairro", ""),
        dados.get("localidade", ""),
        dados.get("uf", ""),
    ]
    return ", ".join(p for p in partes if p)


def consultar_lista(ceps):
    """Consulta varios CEPs e retorna lista de resultados."""
    resultados = []
    for cep in ceps:
        print(f"Consultando {cep}...")
        dados = buscar_cep(cep)
        resultados.append((cep, dados))
    return resultados


def main():
    print("=== CONSULTA DE CEP (ViaCEP) ===\n")

    ceps = ["01310-100", "20040-020", "30130-010", "99999-999"]
    resultados = consultar_lista(ceps)

    print("\n--- Resultados ---")
    for cep, dados in resultados:
        if "erro" in dados:
            print(f"{cep}: {dados['erro']}")
        else:
            print(f"{cep}: {formatar_endereco(dados)}")

    # Demonstracao de parametros de URL (query string)
    print("\n--- Exemplo de query string ---")
    params = {"cidade": "Sao Paulo", "uf": "SP"}
    query = urllib.parse.urlencode(params)
    print(f"URL montada: https://exemplo.com/api?{query}")


if __name__ == "__main__":
    main()