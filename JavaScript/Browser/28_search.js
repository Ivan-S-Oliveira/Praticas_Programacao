/**
 * 28 - Search
 *
 * Conceitos abordados:
 *   - Filtro em tempo real com input event
 *   - Debounce para nao filtrar a cada tecla
 *   - Normalizacao (lowercase + remover acentos)
 *   - Busca com includes, startsWith e multiplos termos
 *   - Destaque do termo encontrado com <mark>
 *   - Ordenacao dos resultados
 *   - Estado vazio (nenhum resultado)
 */

// ---------- Base de dados ficticia ----------
const dados = [
    { id: 1, nome: "Ana Souza", cidade: "Sao Paulo", cargo: "Desenvolvedora" },
    { id: 2, nome: "Bruno Lima", cidade: "Rio de Janeiro", cargo: "Designer" },
    { id: 3, nome: "Carla Mendes", cidade: "Sao Paulo", cargo: "Gerente" },
    { id: 4, nome: "Daniel Alves", cidade: "Belo Horizonte", cargo: "Desenvolvedor" },
    { id: 5, nome: "Eva Rocha", cidade: "Curitiba", cargo: "Analista" },
    { id: 6, nome: "Fabio Castro", cidade: "Porto Alegre", cargo: "Desenvolvedor" },
    { id: 7, nome: "Gabriela Nunes", cidade: "Sao Paulo", cargo: "Designer" },
    { id: 8, nome: "Henrique Dias", cidade: "Recife", cargo: "Analista" },
    { id: 9, nome: "Isabela Freitas", cidade: "Salvador", cargo: "Gerente" },
    { id: 10, nome: "Joao Pereira", cidade: "Fortaleza", cargo: "Desenvolvedor" },
];

// ---------- Elementos ----------
const campo = document.querySelector("#busca");
const resultadosEl = document.querySelector("#resultados");
const infoEl = document.querySelector("#info");

// ---------- Normalizacao ----------
function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// ---------- Debounce ----------
function debounce(fn, ms) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

// ---------- Busca ----------
function buscar(termo) {
    const t = normalizar(termo.trim());
    if (t === "") return dados;

    // Suporta multiplos termos (separados por espaco)
    const termos = t.split(/\s+/);

    return dados.filter((item) => {
        const alvo = normalizar(`${item.nome} ${item.cidade} ${item.cargo}`);
        return termos.every((palavra) => alvo.includes(palavra));
    });
}

// ---------- Destaque ----------
function destacar(texto, termo) {
    if (!termo) return document.createTextNode(texto);

    const fragmento = document.createDocumentFragment();
    const t = normalizar(termo);
    const textoNorm = normalizar(texto);

    let pos = 0;
    while (pos < texto.length) {
        const idx = textoNorm.indexOf(t, pos);
        if (idx === -1) {
            fragmento.append(document.createTextNode(texto.slice(pos)));
            break;
        }
        if (idx > pos) {
            fragmento.append(document.createTextNode(texto.slice(pos, idx)));
        }
        const mark = document.createElement("mark");
        mark.textContent = texto.slice(idx, idx + t.length);
        fragmento.append(mark);
        pos = idx + t.length;
    }

    return fragmento;
}

// ---------- Render ----------
function renderizar(lista, termo) {
    resultadosEl.innerHTML = "";

    if (lista.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Nenhum resultado encontrado.";
        li.className = "vazio";
        resultadosEl.append(li);
        infoEl.textContent = "0 resultados";
        return;
    }

    lista.forEach((item) => {
        const li = document.createElement("li");

        const nome = document.createElement("strong");
        nome.append(destacar(item.nome, termo));

        const resto = document.createElement("span");
        resto.textContent = ` - ${item.cargo} em ${item.cidade}`;

        li.append(nome, resto);
        resultadosEl.append(li);
    });

    infoEl.textContent = `${lista.length} resultado(s)`;
}

// ---------- Evento ----------
campo.addEventListener(
    "input",
    debounce((evento) => {
        const termo = evento.target.value;
        const filtrados = buscar(termo);
        renderizar(filtrados, termo.trim());
    }, 200)
);

// ---------- Inicial ----------
renderizar(dados, "");