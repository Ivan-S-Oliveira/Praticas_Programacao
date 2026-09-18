/*
 * 27 - File System
 * Conceitos: File, Directory, Path, FileInfo, DirectoryInfo, percorrer recursivamente.
 */

 using System;
using System.Collections.Generic;
using System.IO;

public class file_system
{
    const string RAIZ = "pasta_teste";

    public static void CriarEstrutura()
    {
        if (Directory.Exists(RAIZ))
        {
            Directory.Delete(RAIZ, true);
        }
        Directory.CreateDirectory(RAIZ);
        Directory.CreateDirectory(Path.Combine(RAIZ, "documentos"));
        Directory.CreateDirectory(Path.Combine(RAIZ, "imagens"));
        Directory.CreateDirectory(Path.Combine(RAIZ, "codigos"));

        File.WriteAllText(Path.Combine(RAIZ, "readme.txt"), "Arquivo de exemplo.\nSegunda linha.\n");
        File.WriteAllText(Path.Combine(RAIZ, "documentos", "contrato.txt"), "Contrato X");
        File.WriteAllText(Path.Combine(RAIZ, "documentos", "notas.txt"), "Notas da reuniao");
        File.WriteAllText(Path.Combine(RAIZ, "imagens", "foto.jpg"), "conteudo fake de imagem");
        File.WriteAllText(Path.Combine(RAIZ, "codigos", "script.py"), "print('hello')");
        File.WriteAllText(Path.Combine(RAIZ, "codigos", "app.js"), "console.log('hi')");
        Console.WriteLine("Estrutura criada em: " + Path.GetFullPath(RAIZ));
    }

    public static void ListarDiretorio(string caminho)
    {
        Console.WriteLine($"\n--- Conteudo de {caminho} ---");
        foreach (string dir in Directory.GetDirectories(caminho))
        {
            Console.WriteLine("  [DIR]  " + Path.GetFileName(dir));
        }
        foreach (string arq in Directory.GetFiles(caminho))
        {
            FileInfo info = new FileInfo(arq);
            Console.WriteLine($"  [FILE] {Path.GetFileName(arq)} ({info.Length} bytes)");
        }
    }

    public static void PercorrerRecursivo(string caminho, int nivel)
    {
        string indent = new string(' ', nivel * 2);
        Console.WriteLine($"{indent}[DIR] {Path.GetFileName(caminho)}");
        foreach (string arq in Directory.GetFiles(caminho))
        {
            FileInfo info = new FileInfo(arq);
            Console.WriteLine($"{indent}  {Path.GetFileName(arq)} ({info.Length} bytes)");
        }
        foreach (string sub in Directory.GetDirectories(caminho))
        {
            PercorrerRecursivo(sub, nivel + 1);
        }
    }

    public static long TamanhoTotal(string caminho)
    {
        long total = 0;
        foreach (string arq in Directory.GetFiles(caminho, "*", SearchOption.AllDirectories))
        {
            total += new FileInfo(arq).Length;
        }
        return total;
    }

    public static void Main(string[] args)
    {
        Console.WriteLine("=== FILE SYSTEM ===");
        CriarEstrutura();

        ListarDiretorio(RAIZ);
        ListarDiretorio(Path.Combine(RAIZ, "documentos"));

        Console.WriteLine("\n=== Arvore completa ===");
        PercorrerRecursivo(RAIZ, 0);

        Console.WriteLine($"\nTamanho total: {TamanhoTotal(RAIZ)} bytes");

        // ---------- Manipulacao de arquivo ----------
        Console.WriteLine("\n=== Manipulacao ===");
        string arquivo = Path.Combine(RAIZ, "readme.txt");
        Console.WriteLine("Existe? " + File.Exists(arquivo));
        Console.WriteLine("Conteudo:");
        Console.WriteLine(File.ReadAllText(arquivo));

        File.AppendAllText(arquivo, "Linha adicionada.\n");
        Console.WriteLine("Apos append:");
        Console.WriteLine(File.ReadAllText(arquivo));

        // ---------- Path ----------
        Console.WriteLine("=== Path ===");
        string caminho = Path.Combine(RAIZ, "documentos", "contrato.txt");
        Console.WriteLine("Completo:  " + Path.GetFullPath(caminho));
        Console.WriteLine("Diretorio: " + Path.GetDirectoryName(caminho));
        Console.WriteLine("Arquivo:   " + Path.GetFileName(caminho));
        Console.WriteLine("Sem ext:   " + Path.GetFileNameWithoutExtension(caminho));
        Console.WriteLine("Extensao:  " + Path.GetExtension(caminho));

        // ---------- FileInfo / DirectoryInfo ----------
        Console.WriteLine("\n=== Info ===");
        FileInfo fi = new FileInfo(arquivo);
        Console.WriteLine($"Nome: {fi.Name}");
        Console.WriteLine($"Tamanho: {fi.Length} bytes");
        Console.WriteLine($"Criado em: {fi.CreationTime}");
        Console.WriteLine($"Modificado: {fi.LastWriteTime}");

        // ---------- Busca ----------
        Console.WriteLine("\n=== Busca por extensao ===");
        string[] todos = Directory.GetFiles(RAIZ, "*.*", SearchOption.AllDirectories);
        foreach (string f in todos)
        {
            if (Path.GetExtension(f) == ".txt")
                Console.WriteLine("  TXT: " + f);
        }
    }
}