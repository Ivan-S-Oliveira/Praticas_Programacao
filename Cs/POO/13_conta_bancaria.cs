/*
 * 13 - Classe ContaBancaria
 * Conceitos: encapsulamento, histórico, transferência entre objetos.
*/
using System;

public class ContaBancaria
{
    private string titular;
    private string numero;
    private double saldo;
    private string[] historico;
    private int totalMovimentacoes;

    public ContaBancaria(string titular, string numero)
    {
        this.titular = titular;
        this.numero = numero;
        this.saldo = 0.0;
        this.historico = new string[100];
        this.totalMovimentacoes = 0;
    }

    public string GetTitular() { return titular; }
    public string GetNumero() { return numero; }
    public double GetSaldo() { return saldo; }

    private void Registrar(string descricao)
    {
        if (totalMovimentacoes < historico.Length)
        {
            historico[totalMovimentacoes] = descricao;
            totalMovimentacoes++;
        }
    }

    public void Depositar(double valor)
    {
        if (valor <= 0)
        {
            Console.WriteLine("Valor de deposito invalido.");
            return;
        }
        saldo += valor;
        Registrar(string.Format("Deposito de R$ {0:F2}", valor));
        Console.WriteLine(string.Format("Deposito de R$ {0:F2} realizado.", valor));
    }

    public bool Sacar(double valor)
    {
        if (valor <= 0)
        {
            Console.WriteLine("Valor de saque invalido.");
            return false;
        }
        if (valor > saldo)
        {
            Console.WriteLine("Saldo insuficiente.");
            return false;
        }
        saldo -= valor;
        Registrar(string.Format("Saque de R$ {0:F2}", valor));
        Console.WriteLine(string.Format("Saque de R$ {0:F2} realizado.", valor));
        return true;
    }

    public bool Transferir(ContaBancaria destino, double valor)
    {
        if (destino == null)
        {
            Console.WriteLine("Conta destino invalida.");
            return false;
        }
        if (this.Sacar(valor))
        {
            destino.Depositar(valor);
            return true;
        }
        return false;
    }

    public void MostrarExtrato()
    {
        Console.WriteLine("\n--- Extrato: " + titular + " (" + numero + ") ---");
        for (int i = 0; i < totalMovimentacoes; i++)
        {
            Console.WriteLine("  " + (i + 1) + ". " + historico[i]);
        }
        Console.WriteLine(string.Format("Saldo atual: R$ {0:F2}", saldo));
    }

    public override string ToString()
    {
        return string.Format("Conta{{titular='{0}', numero='{1}', saldo={2:F2}}}",
            titular, numero, saldo);
    }
}

public class conta_bancaria
{
    public static void Main(string[] args)
    {
        ContaBancaria c1 = new ContaBancaria("Ana", "0001-1");
        ContaBancaria c2 = new ContaBancaria("Bruno", "0002-2");

        Console.WriteLine("--- Estado inicial ---");
        Console.WriteLine(c1);
        Console.WriteLine(c2);

        Console.WriteLine("\n--- Operacoes ---");
        c1.Depositar(1000.00);
        c1.Depositar(500.00);
        c1.Sacar(200.00);
        c1.Sacar(5000.00);

        c1.Transferir(c2, 300.00);

        Console.WriteLine("\n--- Saldos finais ---");
        Console.WriteLine(c1);
        Console.WriteLine(c2);

        c1.MostrarExtrato();
        c2.MostrarExtrato();
    }
}