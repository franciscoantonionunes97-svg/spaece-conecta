/* ============================================================
   SPAECE CONECTA — Camada de Dados (Store)
   Persistência local (localStorage). Nenhum dado fictício de
   desempenho é criado. A Matriz Oficial inicia VAZIA.
   ============================================================ */

const DB_KEY = 'spaece_ararenda_db_v1';

const ESCOLAS_INICIAIS = [
  { id: 'esc-21dez', nome: 'EEF 21 DE DEZEMBRO', tipo: 'EEF' },
  { id: 'esc-joaquim', nome: 'EEF JOAQUIM FERREIRA DA SILVA', tipo: 'EEF' },
  { id: 'esc-josealves', nome: 'EEF JOSE ALVES DE SENA', tipo: 'EEF' },
  { id: 'esc-antonio', nome: 'EEF ANTONIO DE SOUZA BARROS', tipo: 'EEF' },
  { id: 'esc-03dez', nome: 'EEIF 03 DE DEZEMBRO', tipo: 'EEIF' },
  { id: 'esc-firmino', nome: 'EEF FIRMINO JOSE', tipo: 'EEF' }
];

const USUARIOS_INICIAIS = [
  {
    id: 'usr-francisco', nome: 'FRANCISCO ANTONIO NUNES GOMES',
    email: 'francisco.gomes@ararenda.ce.gov.br', perfil: 'admin',
    escolaId: null, ativo: true, senhaHash: null, precisaDefinirSenha: true
  },
  {
    id: 'usr-djanaine', nome: 'DJANAINE',
    email: 'djanaine@ararenda.ce.gov.br', perfil: 'tecnico',
    escolaId: null, ativo: true, senhaHash: null, precisaDefinirSenha: true
  },
  {
    id: 'usr-camila', nome: 'FRANCISCA CAMILA BRITO',
    email: 'francisca.brito@ararenda.ce.gov.br', perfil: 'professor',
    escolaId: 'esc-21dez', ativo: true, senhaHash: null, precisaDefinirSenha: true
  }
];

function dbInicial() {
  return {
    versao: 1,
    instituicao: 'SECRETARIA MUNICIPAL DE EDUCAÇÃO DE ARARENDÁ',
    escolas: ESCOLAS_INICIAIS.map(e => ({ ...e })),
    usuarios: USUARIOS_INICIAIS.map(u => ({ ...u })),
    // MATRIZ OFICIAL — inicia VAZIA. Só é preenchida por importação/cadastro do administrador.
    matriz: {
      cadastrada: false,
      confirmada: false,
      ano: '',
      edicao: '',
      documentoOrigem: '',
      responsavel: '',
      dataImportacao: null,
      habilidades: [] // { id, codigo, texto, eixo, status, link }
    },
    // Pasta geral de materiais (ex.: Google Drive) compartilhada com os professores
    pastaMateriais: '',
    atividades: [],   // repositório
    questoes: [],     // banco de questões
    jogos: [],
    simulados: [],
    planos: [],
    registros: [],    // evidências de trabalho (registro de atividade)
    resultados: [],   // resultados de simulados/avaliações
    eventos: [],      // calendário
    logs: [],
    anoLetivo: new Date().getFullYear(),
    sessao: null
  };
}

let DB = null;

function carregar() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      DB = JSON.parse(raw);
      // Garantir integridade de campos novos
      const base = dbInicial();
      for (const k of Object.keys(base)) {
        if (DB[k] === undefined) DB[k] = base[k];
      }
      // Migração: garantir que usuários iniciais (ex.: novos professores) existam
      if (Array.isArray(DB.usuarios)) {
        let mudou = false;
        for (const u of USUARIOS_INICIAIS) {
          if (!DB.usuarios.some(x => x.email === u.email)) {
            DB.usuarios.push({ ...u });
            mudou = true;
          }
        }
        if (mudou) salvar();
      }
      // Migração: garantir campo 'link' nas habilidades já cadastradas
      if (DB.matriz && Array.isArray(DB.matriz.habilidades)) {
        let mudouLink = false;
        for (const h of DB.matriz.habilidades) {
          if (h.link === undefined) { h.link = ''; mudouLink = true; }
        }
        if (mudouLink) salvar();
      }
    } else {
      DB = dbInicial();
      salvar();
    }
  } catch (e) {
    console.error('Erro ao carregar DB:', e);
    DB = dbInicial();
  }
  return DB;
}

function salvar() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(DB));
  } catch (e) {
    console.error('Erro ao salvar DB:', e);
  }
}

function getDB() { if (!DB) carregar(); return DB; }

function uid(prefixo = 'id') {
  return prefixo + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

function agoraISO() { return new Date().toISOString(); }

function registrarLog(acao, detalhe) {
  const db = getDB();
  const u = db.sessao ? db.sessao.nome : 'sistema';
  db.logs.unshift({ id: uid('log'), data: agoraISO(), usuario: u, acao, detalhe: detalhe || '' });
  if (db.logs.length > 500) db.logs.length = 500;
  salvar();
}

/* ---------- Escolas ---------- */
function listarEscolas() { return getDB().escolas.slice(); }
function obterEscola(id) { return getDB().escolas.find(e => e.id === id) || null; }
function adicionarEscola(nome, tipo) {
  const db = getDB();
  const esc = { id: uid('esc'), nome: nome.trim().toUpperCase(), tipo: tipo || 'EEF' };
  db.escolas.push(esc); salvar(); registrarLog('Escola cadastrada', esc.nome);
  return esc;
}

/* ---------- Usuários ---------- */
function listarUsuarios() { return getDB().usuarios.slice(); }
function obterUsuario(id) { return getDB().usuarios.find(u => u.id === id) || null; }
function obterUsuarioPorEmail(email) {
  return getDB().usuarios.find(u => u.email.toLowerCase() === String(email).toLowerCase()) || null;
}
function adicionarUsuario(dados) {
  const db = getDB();
  const u = {
    id: uid('usr'), nome: dados.nome.trim().toUpperCase(), email: dados.email.trim().toLowerCase(),
    perfil: dados.perfil, escolaId: dados.escolaId || null, ativo: true,
    senhaHash: null, precisaDefinirSenha: true
  };
  db.usuarios.push(u); salvar(); registrarLog('Usuário cadastrado', u.nome + ' (' + u.perfil + ')');
  return u;
}
function atualizarUsuario(id, dados) {
  const db = getDB();
  const u = obterUsuario(id); if (!u) return null;
  Object.assign(u, dados); salvar(); return u;
}

/* ---------- Matriz Oficial ---------- */
function matriz() { return getDB().matriz; }
function matrizDisponivel() {
  const m = getDB().matriz;
  return m.cadastrada && m.confirmada && m.habilidades.length > 0;
}
function listarHabilidades() { return getDB().matriz.habilidades.slice(); }
function obterHabilidade(id) { return getDB().matriz.habilidades.find(h => h.id === id) || null; }
function obterHabilidadePorCodigo(codigo) {
  return getDB().matriz.habilidades.find(h => h.codigo.toLowerCase() === String(codigo).toLowerCase()) || null;
}

function importarMatriz(meta, habilidades) {
  const db = getDB();
  db.matriz = {
    cadastrada: true,
    confirmada: false,
    ano: meta.ano || '',
    edicao: meta.edicao || '',
    documentoOrigem: meta.documentoOrigem || '',
    responsavel: meta.responsavel || '',
    dataImportacao: agoraISO(),
    habilidades: habilidades.map(h => ({
      id: h.id || uid('hab'),
      codigo: String(h.codigo).trim(),
      texto: String(h.texto).trim(),
      eixo: h.eixo || '',
      status: 'ativa',
      link: h.link || ''
    }))
  };
  salvar();
  registrarLog('Matriz importada', habilidades.length + ' habilidades — aguardando conferência');
  return db.matriz;
}

function confirmarMatriz() {
  const db = getDB();
  db.matriz.confirmada = true;
  salvar();
  registrarLog('Matriz confirmada', db.matriz.habilidades.length + ' habilidades disponíveis');
}

function adicionarHabilidade(h) {
  const db = getDB();
  const nova = { id: uid('hab'), codigo: h.codigo.trim(), texto: h.texto.trim(), eixo: h.eixo || '', status: 'ativa', link: h.link || '' };
  db.matriz.habilidades.push(nova);
  db.matriz.cadastrada = true;
  salvar(); registrarLog('Habilidade cadastrada manualmente', nova.codigo);
  return nova;
}
function removerHabilidade(id) {
  const db = getDB();
  db.matriz.habilidades = db.matriz.habilidades.filter(h => h.id !== id);
  salvar();
}

/* Vincula (ou remove) um link de material a uma habilidade da Matriz Oficial.
   O link é cadastrado MANUALMENTE pelo administrador (ex.: pasta/arquivo do Google Drive). */
function atualizarLinkHabilidade(id, link) {
  const db = getDB();
  const h = db.matriz.habilidades.find(x => x.id === id);
  if (!h) return null;
  h.link = (link || '').trim();
  salvar();
  registrarLog('Link de material atualizado', h.codigo + (h.link ? ' \u2192 ' + h.link : ' (removido)'));
  return h;
}

/* Pasta geral de materiais (ex.: Google Drive) compartilhada com os professores. */
function obterPastaMateriais() { return getDB().pastaMateriais || ''; }
function definirPastaMateriais(url) {
  const db = getDB();
  db.pastaMateriais = (url || '').trim();
  salvar();
  registrarLog('Pasta de materiais atualizada', db.pastaMateriais || '(removida)');
  return db.pastaMateriais;
}

/* Exclui a Matriz Oficial inteira, voltando ao estado inicial (vazia).
   Usado quando o administrador importou/colou dados incorretos e quer recomeçar. */
function limparMatriz() {
  const db = getDB();
  const qtd = db.matriz.habilidades.length;
  db.matriz = {
    cadastrada: false,
    confirmada: false,
    ano: '',
    edicao: '',
    documentoOrigem: '',
    responsavel: '',
    dataImportacao: null,
    habilidades: []
  };
  salvar();
  registrarLog('Matriz excluída', qtd + ' habilidades removidas — matriz reiniciada');
  return qtd;
}

/* ---------- Atividades ---------- */
function listarAtividades() { return getDB().atividades.slice(); }
function obterAtividade(id) { return getDB().atividades.find(a => a.id === id) || null; }
function salvarAtividade(dados) {
  const db = getDB();
  const a = {
    id: dados.id || uid('atv'),
    titulo: dados.titulo,
    habilidadeId: dados.habilidadeId,
    objetivo: dados.objetivo || '',
    orientacao: dados.orientacao || '',
    textoBase: dados.textoBase || '',
    questoes: dados.questoes || [],
    dificuldade: dados.dificuldade || 'Média',
    tipo: dados.tipo || 'Atividade',
    genero: dados.genero || '',
    tema: dados.tema || '',
    autor: dados.autor || (db.sessao ? db.sessao.nome : ''),
    escolaId: dados.escolaId || (db.sessao ? db.sessao.escolaId : null),
    origemIA: !!dados.origemIA,
    favorita: !!dados.favorita,
    compartilhada: !!dados.compartilhada,
    data: dados.data || agoraISO()
  };
  const idx = db.atividades.findIndex(x => x.id === a.id);
  if (idx >= 0) db.atividades[idx] = a; else db.atividades.unshift(a);
  salvar();
  registrarLog(idx >= 0 ? 'Atividade editada' : 'Atividade criada', a.titulo);
  return a;
}
function removerAtividade(id) {
  const db = getDB();
  db.atividades = db.atividades.filter(a => a.id !== id); salvar();
}

/* ---------- Questões ---------- */
function listarQuestoes() { return getDB().questoes.slice(); }
function salvarQuestao(dados) {
  const db = getDB();
  const q = {
    id: dados.id || uid('qst'),
    enunciado: dados.enunciado,
    textoBase: dados.textoBase || '',
    alternativas: dados.alternativas || [],
    correta: dados.correta,
    justificativa: dados.justificativa || '',
    habilidadeId: dados.habilidadeId,
    dificuldade: dados.dificuldade || 'Média',
    fonte: dados.fonte || '',
    autor: dados.autor || (db.sessao ? db.sessao.nome : ''),
    origemIA: !!dados.origemIA,
    data: dados.data || agoraISO()
  };
  const idx = db.questoes.findIndex(x => x.id === q.id);
  if (idx >= 0) db.questoes[idx] = q; else db.questoes.unshift(q);
  salvar(); return q;
}
function removerQuestao(id) {
  const db = getDB();
  db.questoes = db.questoes.filter(q => q.id !== id); salvar();
}

/* ---------- Jogos ---------- */
function listarJogos() { return getDB().jogos.slice(); }
function salvarJogo(dados) {
  const db = getDB();
  const j = {
    id: dados.id || uid('jgo'),
    titulo: dados.titulo,
    tipo: dados.tipo || 'Quiz',
    habilidadeId: dados.habilidadeId,
    objetivo: dados.objetivo || '',
    regras: dados.regras || '',
    materiais: dados.materiais || '',
    origemIA: !!dados.origemIA,
    autor: dados.autor || (db.sessao ? db.sessao.nome : ''),
    data: dados.data || agoraISO()
  };
  const idx = db.jogos.findIndex(x => x.id === j.id);
  if (idx >= 0) db.jogos[idx] = j; else db.jogos.unshift(j);
  salvar(); return j;
}
function removerJogo(id) {
  const db = getDB();
  db.jogos = db.jogos.filter(j => j.id !== id); salvar();
}

/* ---------- Simulados ---------- */
function listarSimulados() { return getDB().simulados.slice(); }
function obterSimulado(id) { return getDB().simulados.find(s => s.id === id) || null; }
function salvarSimulado(dados) {
  const db = getDB();
  const s = {
    id: dados.id || uid('sim'),
    titulo: dados.titulo,
    habilidadesIds: dados.habilidadesIds || [],
    questoes: dados.questoes || [],
    dificuldade: dados.dificuldade || 'Mista',
    autor: dados.autor || (db.sessao ? db.sessao.nome : ''),
    escolaId: dados.escolaId || (db.sessao ? db.sessao.escolaId : null),
    turma: dados.turma || '',
    data: dados.data || agoraISO()
  };
  const idx = db.simulados.findIndex(x => x.id === s.id);
  if (idx >= 0) db.simulados[idx] = s; else db.simulados.unshift(s);
  salvar(); registrarLog('Simulado gerado', s.titulo);
  return s;
}

/* ---------- Planos ---------- */
function listarPlanos() { return getDB().planos.slice(); }
function salvarPlano(dados) {
  const db = getDB();
  const p = {
    id: dados.id || uid('pln'),
    titulo: dados.titulo,
    habilidadeId: dados.habilidadeId,
    turma: dados.turma || '',
    duracao: dados.duracao || '',
    objetivo: dados.objetivo || '',
    conteudo: dados.conteudo || {},
    origemIA: !!dados.origemIA,
    autor: dados.autor || (db.sessao ? db.sessao.nome : ''),
    escolaId: dados.escolaId || (db.sessao ? db.sessao.escolaId : null),
    data: dados.data || agoraISO()
  };
  const idx = db.planos.findIndex(x => x.id === p.id);
  if (idx >= 0) db.planos[idx] = p; else db.planos.unshift(p);
  salvar(); registrarLog('Plano salvo', p.titulo);
  return p;
}
function removerPlano(id) {
  const db = getDB();
  db.planos = db.planos.filter(p => p.id !== id); salvar();
}

/* ---------- Registros (Evidências) ---------- */
function listarRegistros() { return getDB().registros.slice(); }
function salvarRegistro(dados) {
  const db = getDB();
  const r = {
    id: dados.id || uid('reg'),
    escolaId: dados.escolaId,
    professor: dados.professor || (db.sessao ? db.sessao.nome : ''),
    professorId: dados.professorId || (db.sessao ? db.sessao.id : null),
    turma: dados.turma || '',
    data: dados.data || agoraISO().slice(0, 10),
    habilidadeId: dados.habilidadeId,
    atividadeId: dados.atividadeId || null,
    recurso: dados.recurso || 'Atividade',
    qtdEstudantes: dados.qtdEstudantes || 0,
    observacoes: dados.observacoes || '',
    resultado: dados.resultado || null, // { acertos, total } ou percentual
    anoLetivo: dados.anoLetivo || db.anoLetivo
  };
  db.registros.unshift(r);
  salvar();
  registrarLog('Registro de trabalho', r.turma + ' — ' + r.recurso);
  return r;
}
function removerRegistro(id) {
  const db = getDB();
  db.registros = db.registros.filter(r => r.id !== id); salvar();
}

/* ---------- Resultados ---------- */
function listarResultados() { return getDB().resultados.slice(); }
function salvarResultado(dados) {
  const db = getDB();
  const r = {
    id: dados.id || uid('res'),
    simuladoId: dados.simuladoId || null,
    escolaId: dados.escolaId,
    turma: dados.turma || '',
    professor: dados.professor || (db.sessao ? db.sessao.nome : ''),
    data: dados.data || agoraISO().slice(0, 10),
    porHabilidade: dados.porHabilidade || {}, // { habId: {acertos, total} }
    acertos: dados.acertos || 0,
    total: dados.total || 0,
    anoLetivo: dados.anoLetivo || db.anoLetivo
  };
  db.resultados.unshift(r); salvar();
  registrarLog('Resultado registrado', r.turma);
  return r;
}

/* ---------- Eventos (Calendário) ---------- */
function listarEventos() { return getDB().eventos.slice(); }
function salvarEvento(dados) {
  const db = getDB();
  const e = {
    id: dados.id || uid('evt'),
    data: dados.data, // YYYY-MM-DD
    tipo: dados.tipo || 'Aula',
    titulo: dados.titulo,
    habilidadeId: dados.habilidadeId || null,
    turma: dados.turma || '',
    observacoes: dados.observacoes || '',
    autor: db.sessao ? db.sessao.nome : ''
  };
  db.eventos.push(e); salvar(); return e;
}
function removerEvento(id) {
  const db = getDB();
  db.eventos = db.eventos.filter(e => e.id !== id); salvar();
}

/* ---------- Config ---------- */
function definirAnoLetivo(ano) {
  const db = getDB();
  db.anoLetivo = parseInt(ano, 10); salvar();
}

/* ---------- Export / Import / Backup ---------- */
function exportarBackup() {
  return JSON.stringify(getDB(), null, 2);
}
function importarBackup(json) {
  const dados = JSON.parse(json);
  if (!dados || typeof dados !== 'object') throw new Error('Arquivo inválido');
  DB = dados; salvar();
}
function resetarSistema() {
  DB = dbInicial(); salvar();
}

/* ---------- Cálculos de indicadores ---------- */
// COBERTURA: existe registro de trabalho com a habilidade?
function calcularCobertura(filtro = {}) {
  const db = getDB();
  const habs = db.matriz.habilidades;
  const regs = db.registros.filter(r => {
    if (filtro.escolaId && r.escolaId !== filtro.escolaId) return false;
    if (filtro.professorId && r.professorId !== filtro.professorId) return false;
    if (filtro.turma && r.turma !== filtro.turma) return false;
    if (filtro.anoLetivo && r.anoLetivo !== filtro.anoLetivo) return false;
    if (filtro.periodoDe && r.data < filtro.periodoDe) return false;
    if (filtro.periodoAte && r.data > filtro.periodoAte) return false;
    return true;
  });
  const trabalhadas = new Set(regs.map(r => r.habilidadeId));
  const total = habs.length;
  const cobertas = habs.filter(h => trabalhadas.has(h.id)).length;
  return {
    total,
    cobertas,
    pendentes: total - cobertas,
    percentual: total ? Math.round((cobertas / total) * 100) : 0,
    trabalhadasIds: Array.from(trabalhadas)
  };
}

// DESEMPENHO: resultado dos estudantes (separado da cobertura)
function calcularDesempenhoPorHabilidade(filtro = {}) {
  const db = getDB();
  const mapa = {};
  db.resultados.forEach(r => {
    if (filtro.escolaId && r.escolaId !== filtro.escolaId) return;
    if (filtro.turma && r.turma !== filtro.turma) return;
    if (filtro.anoLetivo && r.anoLetivo !== filtro.anoLetivo) return;
    Object.entries(r.porHabilidade || {}).forEach(([habId, v]) => {
      if (!mapa[habId]) mapa[habId] = { acertos: 0, total: 0 };
      mapa[habId].acertos += v.acertos || 0;
      mapa[habId].total += v.total || 0;
    });
  });
  const out = {};
  Object.entries(mapa).forEach(([habId, v]) => {
    out[habId] = v.total ? Math.round((v.acertos / v.total) * 100) : null;
  });
  return out;
}

// Status visual de uma habilidade (cobertura + desempenho)
function statusHabilidade(habId, filtro = {}) {
  const db = getDB();
  const temRegistro = db.registros.some(r => {
    if (r.habilidadeId !== habId) return false;
    if (filtro.escolaId && r.escolaId !== filtro.escolaId) return false;
    if (filtro.professorId && r.professorId !== filtro.professorId) return false;
    if (filtro.turma && r.turma !== filtro.turma) return false;
    if (filtro.anoLetivo && r.anoLetivo !== filtro.anoLetivo) return false;
    return true;
  });
  if (!temRegistro) return { cor: 'vermelho', rotulo: 'AINDA NÃO TRABALHADA', cobertura: false };
  const desp = calcularDesempenhoPorHabilidade(filtro)[habId];
  if (desp !== undefined && desp !== null && desp < 60) {
    return { cor: 'amarelo', rotulo: 'TRABALHADA — PRECISA DE RETOMADA', cobertura: true, desempenho: desp };
  }
  return { cor: 'verde', rotulo: 'TRABALHADA', cobertura: true, desempenho: desp ?? null };
}

/* ---------- Seed opcional de conteúdo de exemplo (NÃO cria habilidades) ---------- */
// Nenhum conteúdo de exemplo é criado automaticamente, pois exigiria
// vínculo com habilidades oficiais que ainda não foram cadastradas.

carregar();
