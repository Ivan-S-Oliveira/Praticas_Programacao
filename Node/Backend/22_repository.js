/**
 * 22 - Repository Pattern
 *
 * Conceitos abordados:
 *   - Repository: camada que encapsula o acesso a dados
 *   - Separacao de responsabilidades (dominio nao conhece o banco)
 *   - Interface implicita: mesmos metodos, implementacoes diferentes
 *   - Inversao de dependencia (o servico depende do repositorio, nao do banco)
 *   - Facilita trocar a fonte de dados (memoria -> SQLite -> API)
 *   - Testabilidade: pode-se injetar um repositorio fake
 *   - DTO nao obrigatorio: retorna objetos simples
 *
 * Como testar:
 *   node 22_repository.js
 */

// ============================================================
// CONTRATO (interface implicita)
// Todo repositorio deve ter: listar, buscarPorId, criar, atualizar, remover
// ============================================================

// ============================================================
// IMPLEMENTACAO 1: em memoria
// ============================================================
class UsuarioRepositoryMemoria {
    constructor() {
        this.itens = [];
        this.proximoId = 1;
    }

    listar() {
        return [...this.itens];
    }

    buscarPorId(id) {
        return this.itens.find((u) => u.id === Number(id)) || null;
    }

    buscarPorEmail(email) {
        return this.itens.find((u) => u.email === email) || null;
    }

    criar(dados) {
        const novo = { id: this.proximoId++, ...dados };
        this.itens.push(novo);
        return novo;
    }

    atualizar(id, dados) {
        const idx = this.itens.findIndex((u) => u.id === Number(id));
        if (idx === -1) return null;
        this.itens[idx] = { ...this.itens[idx], ...dados, id: this.itens[idx].id };
        return this.itens[idx];
    }

    remover(id) {
        const idx = this.itens.findIndex((u) => u.id === Number(id));
        if (idx === -1) return false;
        this.itens.splice(idx, 1);
        return true;
    }
}

// ============================================================
// IMPLEMENTACAO 2: "fake" para testes (mesma interface)
// ============================================================
class UsuarioRepositoryFake {
    constructor(dadosIniciais = []) {
        this.itens = [...dadosIniciais];
        this.proximoId = this.itens.length + 1;
        this.chamadas = { listar: 0, criar: 0 };
    }

    listar() {
        this.chamadas.listar++;
        return [...this.itens];
    }

    buscarPorId(id) {
        return this.itens.find((u) => u.id === Number(id)) || null;
    }

    criar(dados) {
        this.chamadas.criar++;
        const novo = { id: this.proximoId++, ...dados };
        this.itens.push(novo);
        return novo;
    }

    atualizar(id, dados) {
        const idx = this.itens.findIndex((u) => u.id === Number(id));
        if (idx === -1) return null;
        this.itens[idx] = { ...this.itens[idx], ...dados };
        return this.itens[idx];
    }

    remover(id) {
        const idx = this.itens.findIndex((u) => u.id === Number(id));
        if (idx === -1) return false;
        this.itens.splice(idx, 1);
        return true;
    }
}

// ============================================================
// SERVICO: usa o repositorio (nao conhece a implementacao)
// ============================================================
class UsuarioService {
    constructor(repositorio) {
        this.repo = repositorio;
    }

    listar() {
        return this.repo.listar();
    }

    buscarPorId(id) {
        const u = this.repo.buscarPorId(id);
        if (!u) throw new Error("Usuario nao encontrado");
        return u;
    }

    criar({ nome, email }) {
        if (!nome || !email) throw new Error("nome e email obrigatorios");
        if (this.repo.buscarPorEmail && this.repo.buscarPorEmail(email)) {
            throw new Error("Email ja cadastrado");
        }
        return this.repo.criar({ nome, email });
    }

    atualizar(id, dados) {
        const u = this.repo.atualizar(id, dados);
        if (!u) throw new Error("Usuario nao encontrado");
        return u;
    }

    remover(id) {
        const ok = this.repo.remover(id);
        if (!ok) throw new Error("Usuario nao encontrado");
        return true;
    }
}

// ============================================================
// DEMO: trocando a implementacao sem mexer no service
// ============================================================
console.log("--- Com repositorio em memoria ---");
const serviceMemoria = new UsuarioService(new UsuarioRepositoryMemoria());
serviceMemoria.criar({ nome: "Ana", email: "ana@ex.com" });
serviceMemoria.criar({ nome: "Bruno", email: "bruno@ex.com" });
console.log(serviceMemoria.listar());

console.log("\n--- Com repositorio fake (para testes) ---");
const repoFake = new UsuarioRepositoryFake([{ id: 1, nome: "Pre-carregado", email: "pre@ex.com" }]);
const serviceFake = new UsuarioService(repoFake);
serviceFake.criar({ nome: "Carla", email: "carla@ex.com" });
console.log(serviceFake.listar());
console.log("Chamadas de criar no fake:", repoFake.chamadas.criar);

console.log("\n--- Erro de negocio ---");
try {
    serviceFake.criar({ nome: "", email: "" });
} catch (e) {
    console.log("Erro capturado:", e.message);
}