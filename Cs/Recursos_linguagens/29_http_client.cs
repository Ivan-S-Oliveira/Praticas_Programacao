/*
 * 29 - HttpClient
 * Conceitos: HttpClient, GET/POST, headers, JSON no corpo, HttpRequestMessage, 
 * HttpResponseMessage, HttpClientFactory conceitual.
 */

 using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class http_client
{
    private static readonly HttpClient client = new HttpClient();

    // ---------- GET simples ----------
    public static async Task GetSimples(string url)
    {
        Console.WriteLine($"=== GET {url} ===");
        try
        {
            HttpResponseMessage resp = await client.GetAsync(url);
            Console.WriteLine("Status: " + (int)resp.StatusCode + " " + resp.StatusCode);
            Console.WriteLine("Content-Type: " + resp.Content.Headers.ContentType);

            string corpo = await resp.Content.ReadAsStringAsync();
            if (corpo.Length > 300)
                corpo = corpo.Substring(0, 300) + "...";
            Console.WriteLine("Corpo (resumido):\n" + corpo + "\n");
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine("Erro HTTP: " + ex.Message + "\n");
        }
    }

    // ---------- GET retornando JSON desserializado ----------
    public class Todo
    {
        public int UserId { get; set; }
        public int Id { get; set; }
        public string Title { get; set; }
        public bool Completed { get; set; }
    }

    public static async Task GetJson(string url)
    {
        Console.WriteLine($"=== GET JSON {url} ===");
        try
        {
            Todo todo = await client.GetFromJsonAsync<Todo>(url);
            Console.WriteLine($"  userId: {todo.UserId}");
            Console.WriteLine($"  id: {todo.Id}");
            Console.WriteLine($"  title: {todo.Title}");
            Console.WriteLine($"  completed: {todo.Completed}\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Erro: " + ex.Message + "\n");
        }
    }

    // ---------- POST com JSON ----------
    public static async Task PostJson(string url)
    {
        Console.WriteLine($"=== POST JSON {url} ===");
        try
        {
            var novo = new
            {
                title = "teste",
                body = "conteudo",
                userId = 1
            };

            HttpResponseMessage resp = await client.PostAsJsonAsync(url, novo);
            Console.WriteLine("Status: " + (int)resp.StatusCode);

            string corpo = await resp.Content.ReadAsStringAsync();
            Console.WriteLine("Resposta: " + corpo + "\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Erro: " + ex.Message + "\n");
        }
    }

    // ---------- Com headers customizados ----------
    public static async Task ComHeaders(string url)
    {
        Console.WriteLine($"=== Com headers {url} ===");
        try
        {
            HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Get, url);
            req.Headers.Add("User-Agent", "CSharpApp/1.0");
            req.Headers.Add("Accept", "application/json");

            HttpResponseMessage resp = await client.SendAsync(req);
            Console.WriteLine("Status: " + (int)resp.StatusCode);
            Console.WriteLine("Headers da resposta:");
            foreach (var h in resp.Headers)
            {
                Console.WriteLine($"  {h.Key}: {string.Join(", ", h.Value)}");
            }
            Console.WriteLine();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Erro: " + ex.Message + "\n");
        }
    }

    public static async Task Main(string[] args)
    {
        client.Timeout = TimeSpan.FromSeconds(10);

        // Exemplos usando APIs publicas de teste
        await GetJson("https://jsonplaceholder.typicode.com/todos/1");
        await GetJson("https://jsonplaceholder.typicode.com/todos/5");
        await PostJson("https://jsonplaceholder.typicode.com/posts");
        await ComHeaders("https://jsonplaceholder.typicode.com/todos/1");

        Console.WriteLine("Fim dos exemplos de HttpClient.");
    }
}
