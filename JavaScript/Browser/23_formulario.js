/**
 * 23 - Formulario
 *
 * Conceitos abordados:
 *   - Leitura de inputs com .value
 *   - form.elements para acessar campos por nome
 *   - FormData para ler todos os campos de uma vez
 *   - Checkbox, radio e select
 *   - Reset do formulario com .reset()
 *   - Focus automatico
 *   - Construcao de objeto a partir do formulario
 */

const form = document.querySelector("#cadastro");
const resultado = document.querySelector("#resultado");

form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // ---------- 1) Acesso direto por elementos ----------
    const nome = form.elements["nome"].value.trim();
    const email = form.elements["email"].value.trim();

    // ---------- 2) Checkbox ----------
    const interesses = [];
    form.querySelectorAll("input[name='interesses']:checked").forEach((cb) => {
        interesses.push(cb.value);
    });

    // ---------- 3) Radio ----------
    const generoSelecionado = form.querySelector("input[name='genero']:checked");
    const genero = generoSelecionado ? generoSelecionado.value : "";

    // ---------- 4) Select ----------
    const pais = form.elements["pais"].value;

    // ---------- 5) FormData (le tudo de uma vez) ----------
    const dados = new FormData(form);
    console.log("FormData entries:");
    for (const [chave, valor] of dados.entries()) {
        console.log(`  ${chave}: ${valor}`);
    }

    // ---------- 6) Monta objeto e exibe ----------
    const usuario = {
        nome,
        email,
        genero,
        pais,
        interesses,
        criadoEm: new Date().toLocaleString("pt-BR"),
    };

    resultado.innerHTML = `
        <h3>Dados recebidos</h3>
        <pre>${JSON.stringify(usuario, null, 2)}</pre>
    `;

    // ---------- 7) Reset ----------
    form.reset();
    form.elements["nome"].focus();
});