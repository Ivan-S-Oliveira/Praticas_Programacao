/**
 * 21 - Database (simulado em memoria)
 *
 * Conceitos abordados:
 *   - Simulacao de banco de dados com Map/array (substitui SQLite/Postgres)
 *   - Tabelas como Map (chave -> registro)
 *   - Auto-increment com contador
 *   - CRUD basico: insert, select, update, delete
 *   - Indices secundarios (ex: email -> id)
 *   - Transacoes simuladas (snapshot e rollback)
 *   - Separacao de responsabilidades: esta camada nao conhece HTTP
 *
 * Como testar:
 *   node 21_database.js
 */

// ============================================================
// CLASSE BASE: simula uma tabela de banco de dados
// ============================================================
class Tabela {
    constructor(nome, camposObrigatorios = []) {
        this.nome = nome;
        this.camposObrigatorios = camposObrigatorios;
        this.registros = new Map(); // id -> objeto
        this.proximoId = 1;
        this.indices = {}; // nome do campo -> Map(valor -> id)
    }

    criarIndice(campo) {
        this.indices[campo] = new Map();
        for (const [id, reg] of this.registros) {
            this.indices[campo].set(reg[campo], id);
        }
    }

    _validar(dados) {
        const erros = [];
        for (const campo of this.camposObrigatorios) {
            if (dados[campo] === undefined || dados[campo] === null) {
                erros.push(`Campo obrigatorio ausente: ${campo}`);
            }
        }
        return erros;
    }

    insert(dados) {
        const erros = this._validar(dados);
        if (erros.length) throw new Error(erros.join("; "));

        const id = this.proximoId++;
        const registro = { id, ...dados, criadoEm: new Date().toISOString() };
        this.registros.set(id, registro);

        // Atualiza indices
        for (const campo of Object.keys(this.indices)) {
            this.indices[campo].set(registro[campo], id);
        }
        return registro;
    }

    selectTodos() {
        return Array.from(this.registros.values());
    }

    selectPorId(id) {
        return this.registros.get(Number(id)) || null;
    }

    selectPorCampo(campo, valor) {
        const idx = this.indices[campo];
        if (idx) {
            const id = idx.get(valor);
            return id ? this.registros.get(id) : null;
        }
        // Fallback: varredura
        for (const reg of this.registros.values()) {
            if (reg[campo] === valor) return reg;
        }
        return null;
    }

    update(id, dados) {
        const atual = this.selectPorId(id);
        if (!atual) return null;

        // Remove indices antigos
        for (const campo of Object.keys(this.indices)) {
            if (atual[campo] !== undefined) {
                this.indices[campo].delete(atual[campo]);
            }
        }

        const atualizado = { ...atual, ...dados, id: atual.id, atualizadoEm: new Date().toISOString() };
        this.registros.set(atual.id, atualizado);

        // Reindexar
        for (const campo of Object.keys(this.indices)) {
            if (atualizado[campo] !== undefined) {
                this.indices[campo].set(atualizado[campo], atualizado.id);
            }
        }
        return atualizado;
    }

    delete(id) {
        const atual = this.selectPorId(id);
        if (!atual) return false;

        for (const campo of Object.keys(this.indices)) {
            if (atual[campo] !== undefined) {
                this.indices[campo].delete(atual[campo]);
            }
        }
        return this.registros.delete(Number(id));
    }

    count() {
        return this.registros.size;
    }

    // Snapshot + rollback simples
    snapshot() {
        return new Map(this.registros);
    }

    restaurar(snap) {
        this.registros = new Map(snap);
    }
}

// ============================================================
// CLASSE: simula o "banco" com varias tabelas
// ============================================================
class Database {
    constructor() {
        this.tabelas = {};
    }

    criarTabela(nome, camposObrigatorios = []) {
        this.tabelas[nome] = new Tabela(nome, camposObrigatorios);
        return this.tabelas[nome];
    }

    tabela(nome) {
        return this.tabelas[nome] || null;
    }

    // Executa uma funcao dentro de uma "transacao"
    // Se a funcao lancar erro, restaura todas as tabelas
    transacao(fn) {
        const snaps = {};
        for (const [nome, tab] of Object.entries(this.tabelas)) {
            snaps[nome] = tab.snapshot();
        }
        try {
            return fn();
        } catch (e) {
            for (const [nome, snap] of Object.entries(snaps)) {
                this.tabelas[nome].restaurar(snap);
            }
            throw e;
        }
    }
}

// ============================================================
// DEMO
// ============================================================
const db = new Database();
const usuarios = db.criarTabela("usuarios", ["nome", "email"]);
usuarios.criarIndice("email");

// INSERT
const ana = usuarios.insert({ nome: "Ana", email: "ana@ex.com" });
const bruno = usuarios.insert({ nome: "Bruno", email: "bruno@ex.com" });
console.log("Inseridos:", ana, bruno);

// SELECT por id
console.log("\nPor id 1:", usuarios.selectPorId(1));

// SELECT por campo indexado
console.log("Por email:", usuarios.selectPorCampo("email", "bruno@ex.com"));

// UPDATE
usuarios.update(1, { nome: "Ana Souza" });
console.log("\nApos update:", usuarios.selectPorId(1));

// DELETE
usuarios.delete(2);
console.log("\nTotal apos delete:", usuarios.count());

// TRANSACAO com rollback
console.log("\n--- Teste de transacao com rollback ---");
try {
    db.transacao(() => {
        usuarios.insert({ nome: "Carla", email: "carla@ex.com" });
        throw new Error("Falha simulada: rollback!");
    });
} catch (e) {
    console.log("Erro capturado:", e.message);
}
console.log("Total apos rollback (deve ser 1):", usuarios.count());