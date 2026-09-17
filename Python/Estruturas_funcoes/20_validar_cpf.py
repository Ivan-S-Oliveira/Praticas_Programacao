"""
20 - Validação de CPF
Conceitos: strings, laços, cálculo de dígitos verificadores
"""

import re

def limpar_cpf(cpf):
    """Remove tudo que não for dígito."""
    return re.sub(r"\D", "", cpf)

def formatar_cpf(cpf):
    """Retorna no formato 000.000.000-00."""
    cpf = limpar_cpf(cpf)
    if len(cpf) != 11:
        return cpf
    return f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}"

def validar_cpf(cpf):
    """Valida CPF pelo algoritmo dos dígitos verificadores."""
    cpf = limpar_cpf(cpf)

    # Deve ter 11 dígitos
    if len(cpf) != 11:
        return False

    # Rejeita sequências repetidas (000... , 111..., etc.)
    if cpf == cpf[0] * 11:
        return False

    # Cálculo do 1º dígito verificador
    soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
    resto = soma % 11
    digito1 = 0 if resto < 2 else 11 - resto
    if int(cpf[9]) != digito1:
        return False

    # Cálculo do 2º dígito verificador
    soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
    resto = soma % 11
    digito2 = 0 if resto < 2 else 11 - resto
    if int(cpf[10]) != digito2:
        return False

    return True

def analisar_cpf(cpf_original):
    """Retorna um dicionário com análise detalhada."""
    cpf_limpo = limpar_cpf(cpf_original)
    return {
        "original": cpf_original,
        "limpo": cpf_limpo,
        "formatado": formatar_cpf(cpf_limpo),
        "valido": validar_cpf(cpf_limpo),
        "tamanho": len(cpf_limpo),
    }

def main():
    print("=== VALIDADOR DE CPF ===\n")

    cpf = input("Digite um CPF (com ou sem pontuação): ")
    resultado = analisar_cpf(cpf)

    print(f"\nCPF digitado:  {resultado['original']}")
    print(f"Somente dígitos: {resultado['limpo']} ({resultado['tamanho']} dígitos)")
    print(f"Formatado:     {resultado['formatado']}")
    print(f"Válido?        {'SIM' if resultado['valido'] else 'NÃO'}")

    # Exemplos prontos
    print("\n--- Testes com exemplos ---")
    exemplos = [
        "529.982.247-25",
        "111.444.777-35",
        "111.111.111-11",
        "123.456.789-00",
        "52998224725",
        "123",
    ]
    for ex in exemplos:
        status = "válido" if validar_cpf(ex) else "inválido"
        print(f"  {ex:<20} → {status}")

if __name__ == "__main__":
    main()