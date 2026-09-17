def celsius_para_fahrenheit(c):
    return (c * 9/5) + 32

def fahrenheit_para_celsius(f):
    return (f - 32) * 5/9

def celsius_para_kelvin(c):
    return c + 273.15

def kelvin_para_celsius(k):
    return k - 273.15

print("=== Conversor de Temperatura ===")
print("1 - Celsius → Fahrenheit")
print("2 - Fahrenheit → Celsius")
print("3 - Celsius → Kelvin")
print("4 - Kelvin → Celsius")

opcao = input("Escolha uma opção (1-4): ")
valor = float(input("Digite a temperatura: "))

if opcao == "1":
    print(f"{valor}°C = {celsius_para_fahrenheit(valor):.2f}°F")
elif opcao == "2":
    print(f"{valor}°F = {fahrenheit_para_celsius(valor):.2f}°C")
elif opcao == "3":
    print(f"{valor}°C = {celsius_para_kelvin(valor):.2f}K")
elif opcao == "4":
    print(f"{valor}K = {kelvin_para_celsius(valor):.2f}°C")
else:
    print("Opção inválida!")