/**
 * 19 - Destructuring
 *
 * Conceitos abordados:
 *   - Destructuring de arrays (por posicao)
 *   - Destructuring de objetos (por chave)
 *   - Valores padrao
 *   - Renomeacao de variaveis
 *   - Destructuring aninhado
 *   - Destructuring em parametros de funcao
 *   - Rest em destructuring (...resto)
 *   - Troca de variaveis sem auxiliar
 *   - Ignorar valores com virgula
 */

// ---------- 1) Arrays ----------
const cores = ["vermelho", "verde", "azul"];

const [primeira, segunda, terceira] = cores;
console.log("Primeira:", primeira);
console.log("Segunda: ", segunda);
console.log("Terceira:", terceira);

// ---------- 2) Ignorar valores ----------
const [primeiraCor, , terceiraCor] = cores;
console.log("\nPulando o meio:", primeiraCor, terceiraCor);

// ---------- 3) Valores padrao ----------
const [a = 1, b = 2, c = 3, d = 4] = [10, 20];
console.log("\nCom padrao:", { a, b, c, d });

// ---------- 4) Rest em arrays ----------
const [cabeca, ...cauda] = [1, 2, 3, 4, 5];
console.log("\nCabeca:", cabeca, "| Cauda:", cauda);

// ---------- 5) Objetos ----------
const usuario = {
    nome: "Ana",
    idade: 28,
    cidade: "Sao Paulo",
    email: "ana@exemplo.com",
};

const { nome, idade } = usuario;
console.log("\nNome: ", nome);
console.log("Idade:", idade);

// ---------- 6) Renomeacao ----------
const { nome: nomeUsuario, idade: idadeUsuario } = usuario;
console.log("\nRenomeado:", nomeUsuario, idadeUsuario);

// ---------- 7) Valores padrao em objetos ----------
const { pais = "Brasil", profissao = "Nao informada" } = usuario;
console.log("Padroes:", pais, "|", profissao);

// ---------- 8) Rest em objetos ----------
const { nome: _nome, ...restoUsuario } = usuario;
console.log("\nResto do usuario:", restoUsuario);

// ---------- 9) Aninhamento ----------
const pedido = {
    id: 101,
    cliente: {
        nome: "Bruno",
        endereco: {
            rua: "Av. Brasil",
            numero: 250,
            cidade: "Rio de Janeiro",
        },
    },
    itens: [
        { produto: "Caneta", qtd: 3 },
        { produto: "Caderno", qtd: 1 },
    ],
};

const {
    cliente: {
        nome: nomeCliente,
        endereco: { cidade: cidadeCliente },
    },
    itens,
} = pedido;

console.log("\nCliente:", nomeCliente);
console.log("Cidade: ", cidadeCliente);
console.log("Itens:  ", itens.map((i) => `${i.produto} x${i.qtd}`));

// ---------- 10) Em parametros de funcao ----------
function apresentar({ nome, idade, cidade = "Nao informada" }) {
    return `${nome}, ${idade} anos, de ${cidade}.`;
}
console.log("\nApresentar:", apresentar(usuario));

function somarArray([x, y]) {
    return x + y;
}
console.log("Somar array:", somarArray([10, 20]));

// ---------- 11) Troca de variaveis ----------
let m = 1;
let n = 2;
[m, n] = [n, m];
console.log("\nTrocados: m =", m, "| n =", n);

// ---------- 12) Em retorno de funcao ----------
function minMax(numeros) {
    return [Math.min(...numeros), Math.max(...numeros)];
}
const [min, max] = minMax([3, 7, 1, 9, 4]);
console.log("Min:", min, "| Max:", max);

// ---------- 13) Destructuring de string ----------
const [letra1, letra2, ...restoLetras] = "JavaScript";
console.log("\nPrimeiras letras:", letra1, letra2);
console.log("Resto:", restoLetras.join(""));