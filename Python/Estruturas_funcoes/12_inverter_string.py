"""
12 - Inverter String
Conceitos: slicing, reversed, join, laços
"""

def inverter_slicing(texto):
    """Usa slicing — a forma mais Pythônica."""
    return texto[::-1]

def inverter_loop(texto):
    """Usa laço for manual."""
    resultado = ""
    for i in range(len(texto) - 1, -1, -1):
        resultado += texto[i]
    return resultado

def inverter_reversed(texto):
    """Usa reversed() + join."""
    return "".join(reversed(texto))

def inverter_palavras(frase):
    """Inverte a ordem das palavras, mantendo cada palavra intacta."""
    palavras = frase.split()
    return " ".join(reversed(palavras))

def main():
    texto = input("Digite um texto: ")

    print(f"\nOriginal:             {texto}")
    print(f"Invertido (slicing):  {inverter_slicing(texto)}")
    print(f"Invertido (loop):     {inverter_loop(texto)}")
    print(f"Invertido (reversed): {inverter_reversed(texto)}")
    print(f"Palavras invertidas:  {inverter_palavras(texto)}")

if __name__ == "__main__":
    main()