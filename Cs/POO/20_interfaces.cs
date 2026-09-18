/*
 * 20 - Interfaces
 * Conceitos: interface, implements (em C# :), múltiplas interfaces, polimorfismo via interface.
*/

using System;

// Interfaces
public interface IPagavel
{
    double GetValor();
    string GetDescricao();
}

public interface IParcelavel
{
    int GetParcelas();
    double GetValorParcela();
}

public interface IAuditavel
{
    string GetIdTransacao();
    DateTime GetDataHora();
}

// Implementacao: Pix implementa apenas IPagavel
public class Pix : IPagavel
{
    private double valor;
    private string chave;

    public Pix(double valor, string chave)
    {
        this.valor = valor;
        this.chave = chave;
    }

    public double GetValor() { return valor; }

    public string GetDescricao()
    {
        return "Pix para chave " + chave;
    }
}

// CartaoCredito implementa IPagavel, IParcelavel e IAuditavel
public class CartaoCredito : IPagavel, IParcelavel, IAuditavel
{
    private double valor;
    private int parcelas;
    private double taxaMensal;
    private string idTransacao;
    private DateTime dataHora;

    public CartaoCredito(double valor, int parcelas, double taxaMensal)
    {
        this.valor = valor;
        this.parcelas = parcelas;
        this.taxaMensal = taxaMensal;
        this.idTransacao = "TX-" + DateTime.Now.Ticks;
        this.dataHora = DateTime.Now;
    }

    public double GetValor() { return valor; }
    public int GetParcelas() { return parcelas; }

    public double GetValorParcela()
    {
        double total = valor * (1 + taxaMensal * parcelas);
        return total / parcelas;
    }

    public string GetDescricao()
    {
        return string.Format("Credito em {0}x de R$ {1:F2}", parcelas, GetValorParcela());
    }

    public string GetIdTransacao() { return idTransacao; }
    public DateTime GetDataHora() { return dataHora; }
}

// Boleto implementa IPagavel e IAuditavel
public class Boleto : IPagavel, IAuditavel
{
    private double valor;
    private int diasVencimento;
    private string idTransacao;
    private DateTime dataHora;

    public Boleto(double valor, int diasVencimento)
    {
        this.valor = valor;
        this.diasVencimento = diasVencimento;
        this.idTransacao = "BL-" + DateTime.Now.Ticks;
        this.dataHora = DateTime.Now;
    }

    public double GetValor() { return valor; }

    public string GetDescricao()
    {
        return "Boleto vence em " + diasVencimento + " dias";
    }

    public string GetIdTransacao() { return idTransacao; }
    public DateTime GetDataHora() { return dataHora; }
}

public class interfaces
{
    public static void Main(string[] args)
    {
        IPagavel[] pagamentos = new IPagavel[4];
        pagamentos[0] = new Pix(500.00, "ana@email.com");
        pagamentos[1] = new CartaoCredito(1000.00, 3, 0.02);
        pagamentos[2] = new Boleto(800.00, 30);
        pagamentos[3] = new CartaoCredito(200.00, 1, 0.02);

        Console.WriteLine("=== Processando pagamentos via interface ===\n");

        double total = 0;
        for (int i = 0; i < pagamentos.Length; i++)
        {
            Console.WriteLine(string.Format("{0,-45} | Valor: R$ {1,8:F2}",
                pagamentos[i].GetDescricao(), pagamentos[i].GetValor()));
            total += pagamentos[i].GetValor();
        }
        Console.WriteLine(string.Format("\nTotal geral: R$ {0:F2}", total));

        // Filtrando por interface (is)
        Console.WriteLine("\n=== Apenas pagamentos parcelaveis ===");
        for (int i = 0; i < pagamentos.Length; i++)
        {
            if (pagamentos[i] is IParcelavel)
            {
                IParcelavel p = (IParcelavel) pagamentos[i];
                Console.WriteLine(string.Format("  {0} -> {1} parcelas de R$ {2:F2}",
                    pagamentos[i].GetDescricao(),
                    p.GetParcelas(),
                    p.GetValorParcela()));
            }
        }

        // Auditavel
        Console.WriteLine("\n=== Transacoes auditaveis ===");
        for (int i = 0; i < pagamentos.Length; i++)
        {
            if (pagamentos[i] is IAuditavel)
            {
                IAuditavel a = (IAuditavel) pagamentos[i];
                Console.WriteLine(string.Format("  {0} | ID: {1} | {2:yyyy-MM-dd HH:mm:ss}",
                    pagamentos[i].GetDescricao(),
                    a.GetIdTransacao(),
                    a.GetDataHora()));
            }
        }

        // Chamando metodo que aceita qualquer IPagavel
        Console.WriteLine("\n=== Funcao que aceita qualquer IPagavel ===");
        ImprimirRecibo(pagamentos[0]);
        ImprimirRecibo(pagamentos[2]);
    }

    // Metodo que so depende da interface
    public static void ImprimirRecibo(IPagavel p)
    {
        Console.WriteLine("---- RECIBO ----");
        Console.WriteLine("Descricao: " + p.GetDescricao());
        Console.WriteLine(string.Format("Valor: R$ {0:F2}", p.GetValor()));
        Console.WriteLine("----------------");
    }
}