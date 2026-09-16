/* ============================================================
   SPAECE CONECTA — Autenticação e Sessão
   Senhas NUNCA são armazenadas em texto puro.
   Usa SHA-256 (Web Crypto API) + salt por usuário.
   ============================================================ */

async function hashSenha(senha, salt) {
  const dados = new TextEncoder().encode(salt + '::' + senha + '::spaece-ararenda');
  const buf = await crypto.subtle.digest('SHA-256', dados);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function gerarSalt() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function definirSenha(usuarioId, senha) {
  const u = obterUsuario(usuarioId);
  if (!u) throw new Error('Usuário não encontrado');
  if (!senha || senha.length < 6) throw new Error('A senha deve ter ao menos 6 caracteres');
  const salt = gerarSalt();
  u.salt = salt;
  u.senhaHash = await hashSenha(senha, salt);
  u.precisaDefinirSenha = false;
  atualizarUsuario(usuarioId, u);
  registrarLog('Senha definida', u.nome);
}

async function autenticar(email, senha) {
  const u = obterUsuarioPorEmail(email);
  if (!u) return { ok: false, erro: 'Usuário não encontrado.' };
  if (!u.ativo) return { ok: false, erro: 'Usuário inativo. Procure a Secretaria.' };
  if (u.precisaDefinirSenha || !u.senhaHash) {
    return { ok: false, erro: 'Primeiro acesso: defina sua senha.', precisaDefinir: true, usuarioId: u.id };
  }
  const h = await hashSenha(senha, u.salt);
  if (h !== u.senhaHash) return { ok: false, erro: 'Senha incorreta.' };
  return { ok: true, usuario: u };
}

function iniciarSessao(usuario) {
  const db = getDB();
  db.sessao = {
    id: usuario.id, nome: usuario.nome, email: usuario.email,
    perfil: usuario.perfil, escolaId: usuario.escolaId || null,
    inicio: agoraISO()
  };
  salvar();
  registrarLog('Login', usuario.nome);
}

function encerrarSessao() {
  const db = getDB();
  if (db.sessao) registrarLog('Logout', db.sessao.nome);
  db.sessao = null; salvar();
}

function sessaoAtual() { return getDB().sessao; }

function perfilAtual() { const s = sessaoAtual(); return s ? s.perfil : null; }

/* Permissões por perfil */
const PERMISSOES = {
  admin:   { rede: true, todasEscolas: true, config: true, matriz: true, criar: true },
  tecnico: { rede: true, todasEscolas: true, config: false, matriz: false, criar: true },
  gestor:  { rede: false, todasEscolas: false, config: false, matriz: false, criar: true },
  professor: { rede: false, todasEscolas: false, config: false, matriz: false, criar: true }
};

function pode(acao) {
  const p = perfilAtual();
  if (!p) return false;
  return !!(PERMISSOES[p] && PERMISSOES[p][acao]);
}

function escopoEscolas() {
  const s = sessaoAtual();
  if (!s) return [];
  if (s.perfil === 'admin' || s.perfil === 'tecnico') return listarEscolas();
  if (s.perfil === 'gestor' && s.escolaId) return listarEscolas().filter(e => e.id === s.escolaId);
  return [];
}

const ROTULO_PERFIL = {
  admin: 'Administrador da Secretaria',
  tecnico: 'Técnico da Secretaria',
  gestor: 'Gestor Escolar',
  professor: 'Professor'
};
