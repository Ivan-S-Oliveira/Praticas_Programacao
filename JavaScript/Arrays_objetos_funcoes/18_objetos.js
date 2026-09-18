/**
 * 18 - Objetos
 *
 * Conceitos abordados:
 *   - Criacao literal de objetos
 *   - Acesso com ponto e com colchetes
 *   - Metodos e propriedades computadas
 *   - Object.keys, Object.values, Object.entries
 *   - Object.assign (merge raso)
 *   - Object.freeze (imutavel) e Object.seal (nao adiciona/remove)
 *   - hasOwnProperty e operador in
 *   - Iteracao com for...in e Object.entries
 *   - Aninhamento de objetos
 */

// ---------- 1) Criacao ----------
const pessoa = {
    nome: "Ana",
    idade: 28,
    cidade: "Sao Paulo",
    saudar() {
        return `Ola, meu nome e ${this.nome}.`;
    },
};

console.log("Nome:  ", pessoa.nome);
console.log("Idade: ", pessoa.idade);
console.log("Metodo:", pessoa.saudar());

// ---------- 2) Acesso com colchetes (chave dinamica) ----------
const chave = "cidade";
console.log("\nAcesso dinamico:", pessoa[chave]);

// ---------- 3) Adicionar e remover propriedades ----------
pessoa.profissao = "Desenvolvedora";
pessoa["pais"] = "Brasil";
console.log("\nCom novas props:", pessoa);

delete pessoa.pais;
console.log("Apos delete:", pessoa);

// ---------- 4) Object.keys, values, entries ----------
console.log("\nKeys:   ", Object.keys(pessoa));
console.log("Values: ", Object.values(pessoa));
console.log("Entries:", Object.entries(pessoa));

// ---------- 5) Iteracao ----------
console.log("\n--- for...of com entries ---");
for (const [chave, valor] of Object.entries(pessoa)) {
    if (typeof valor !== "function") {
        console.log(`  ${chave}: ${valor}`);
    }
}

console.log("\n--- for...in (inclui herdadas) ---");
for (const chave in pessoa) {
    if (Object.hasOwn(pessoa, chave)) {
        console.log(`  ${chave}`);
    }
}

// ---------- 6) Object.assign (merge raso) ----------
const base = { a: 1, b: 2 };
const extras = { b: 99, c: 3 };
const mesclado = Object.assign({}, base, extras);
console.log("\nObject.assign:", mesclado); // { a: 1, b: 99, c: 3 }

// ---------- 7) Spread como alternativa moderna ----------
const mescladoSpread = { ...base, ...extras };
console.log("Spread merge: ", mescladoSpread);

// ---------- 8) Object.freeze ----------
const config = Object.freeze({ host: "localhost", porta: 3000 });
config.porta = 8080; // silenciosamente ignorado (ou erro em strict mode)
console.log("\nFreeze - porta nao muda:", config.porta);

// ---------- 9) Object.seal ----------
const selado = Object.seal({ x: 1 });
selado.x = 99;        // ok (modificar)
selado.y = 100;       // nao adiciona
delete selado.x;      // nao remove
console.log("Seal:", selado); // { x: 99 }

// ---------- 10) hasOwnProperty e in ----------
const obj = { nome: "Ana" };
console.log("\nhasOwn 'nome'?", Object.hasOwn(obj, "nome"));
console.log("hasOwn 'toString'?", Object.hasOwn(obj, "toString")); // false (herdado)
console.log("'toString' in obj?", "toString" in obj);              // true (herdado)

// ---------- 11) Objetos aninhados ----------
const empresa = {
    nome: "Tech",
    endereco: {
        rua: "Av. Paulista",
        numero: 1000,
        cidade: {
            nome: "Sao Paulo",
            uf: "SP",
        },
    },
    funcionarios: [
        { nome: "Ana", cargo: "Dev" },
        { nome: "Bruno", cargo: "Designer" },
    ],
};

console.log("\nCidade:", empresa.endereco.cidade.nome);
console.log("Funcionarios:", empresa.funcionarios.map((f) => f.nome));

// ---------- 12) Copia rasa vs profunda ----------
const raso = { ...empresa };
raso.endereco.rua = "ALTERADO"; // muda tambem no original!
console.log("\nCopia rasa alterou o original:", empresa.endereco.rua);

const profundo = structuredClone(empresa);
profundo.endereco.rua = "Outra rua";
console.log("Copia profunda nao afeta:", empresa.endereco.rua);
console.log("Copia profunda:", profundo.endereco.rua);