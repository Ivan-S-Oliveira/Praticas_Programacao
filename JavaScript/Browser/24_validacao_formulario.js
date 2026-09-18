/**
 * 24 - Validacao de Formulario
 *
 * Conceitos abordados:
 *   - Validacao client-side no submit
 *   - Validacao por campo com regex
 *   - checkValidity e setCustomValidity (API HTML5)
 *   - Exibicao de mensagens de erro por campo
 *   - Validacao em tempo real (input, blur)
 *   - Array de erros e objeto de regras
 *   - Feedback visual com classList
 */

const form = document.querySelector("#form");
const erros = {};

// ---------- Regras de validacao ----------
const regras = {
    nome: (valor) => {
        if (valor.trim() === "") return "Nome e obrigatorio.";
        if (valor.trim().length < 3) return "Nome muito curto.";
        if (!/^[A-Za-zÀ-ÿ ]+$/.test(valor)) return "Somente letras e espacos.";
        return null;
    },
    email: (valor) => {
        if (valor.trim() === "") return "E-mail e obrigatorio.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return "E-mail invalido.";
        return null;
    },
    senha: (valor) => {
        if (valor === "") return "Senha e obrigatoria.";
        if (valor.length < 8) return "Minimo 8 caracteres.";
        if (!/[A-Za-z]/.test(valor)) return "Precisa de uma letra.";
        if (!/\d/.test(valor)) return "Precisa de um numero.";
        return null;
    },
    confirmacao: (valor) => {
        const senha = form.elements["senha"].value;
        if (valor === "") return "Confirme a senha.";
        if (valor !== senha) return "Senhas nao coincidem.";
        return null;
    },
};

// ---------- Valida um campo ----------
function validarCampo(nome) {
    const campo = form.elements[nome];
    const valor = campo.value;
    const erro = regras[nome] ? regras[nome](valor) : null;

    const spanErro = document.querySelector(`[data-erro="${nome}"]`);

    if (erro) {
        erros[nome] = erro;
        if (spanErro) spanErro.textContent = erro;
        campo.classList.add("invalido");
        campo.setCustomValidity(erro);
    } else {
        delete erros[nome];
        if (spanErro) spanErro.textContent = "";
        campo.classList.remove("invalido");
        campo.setCustomValidity("");
    }
}

// ---------- Validacao em tempo real ----------
Object.keys(regras).forEach((nome) => {
    const campo = form.elements[nome];
    if (!campo) return;
    campo.addEventListener("input", () => validarCampo(nome));
    campo.addEventListener("blur", () => validarCampo(nome));
});

// ---------- Submit ----------
form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // Valida todos
    Object.keys(regras).forEach(validarCampo);

    if (Object.keys(erros).length > 0) {
        document.querySelector("#msg-geral").textContent =
            "Corrija os erros antes de enviar.";
        return;
    }

    document.querySelector("#msg-geral").textContent =
        "Formulario valido. Enviando...";

    // Aqui enviaria os dados (fetch, etc.)
    console.log("Enviando:", {
        nome: form.elements["nome"].value,
        email: form.elements["email"].value,
    });
});