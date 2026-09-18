/**
 * 26 - Consumir API
 *
 * Conceitos abordados:
 *   - fetch para requisicoes HTTP
 *   - Promises e async/await
 *   - response.ok e response.status
 *   - response.json() para parsear
 *   - try/catch para erros de rede
 *   - Estados de UI: carregando, erro, sucesso
 *   - Renderizacao com createElement (seguro) em vez de innerHTML
 *   - Promise.all para requisicoes paralelas
 */

const lista = document.querySelector("#usuarios");
const status = document.querySelector("#status");

// ---------- Funcao generica de fetch com JSON ----------
async function buscarJson(url) {
    const resp = await fetch(url);
    if (!resp.ok) {
        throw new Error(`HTTP ${resp.status} - ${resp.statusText}`);
    }
    return resp.json();
}

// ---------- Renderiza um usuario ----------
function renderizarUsuario(usuario) {
    const li = document.createElement("li");
    li.className = "usuario";

    const nome = document.createElement("strong");
    nome.textContent = usuario.name;

    const email = document.createElement("span");
    email.textContent = ` - ${usuario.email}`;

    li.append(nome, email);
    return li;
}

// ---------- Carrega lista de usuarios ----------
async function carregarUsuarios() {
    status.textContent = "Carregando...";
    lista.innerHTML = "";

    try {
        const usuarios = await buscarJson("https://jsonplaceholder.typicode.com/users");
        status.textContent = `${usuarios.length} usuario(s) carregado(s).`;

        usuarios.forEach((u) => lista.append(renderizarUsuario(u)));
    } catch (erro) {
        status.textContent = `Erro: ${erro.message}`;
        status.classList.add("erro");
    }
}

// ---------- Carrega um usuario pelo id ----------
async function carregarUsuario(id) {
    status.textContent = `Buscando usuario ${id}...`;
    lista.innerHTML = "";

    try {
        const usuario = await buscarJson(
            `https://jsonplaceholder.typicode.com/users/${id}`
        );
        lista.append(renderizarUsuario(usuario));
        status.textContent = "OK";
    } catch (erro) {
        status.textContent = `Erro: ${erro.message}`;
    }
}

// ---------- Requisicoes paralelas ----------
async function carregarVarios() {
    status.textContent = "Carregando 3 usuarios em paralelo...";
    lista.innerHTML = "";

    try {
        const ids = [1, 2, 3];
        const resultados = await Promise.all(
            ids.map((id) =>
                buscarJson(`https://jsonplaceholder.typicode.com/users/${id}`)
            )
        );
        resultados.forEach((u) => lista.append(renderizarUsuario(u)));
        status.textContent = "3 usuarios carregados.";
    } catch (erro) {
        status.textContent = `Erro: ${erro.message}`;
    }
}

// ---------- Eventos ----------
document.querySelector("#btn-todos").addEventListener("click", carregarUsuarios);
document.querySelector("#btn-um").addEventListener("click", () => carregarUsuario(5));
document.querySelector("#btn-paralelo").addEventListener("click", carregarVarios);

// Carrega ao abrir
carregarUsuarios();