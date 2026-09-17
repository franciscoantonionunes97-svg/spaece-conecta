/* ============================================================
   SPAECE CONECTA — Aplicação (roteamento, eventos, login)
   ============================================================ */

const MENU = [
  { grupo: 'Pedagógico' },
  { id: 'inicio', ic: '🏠', t: 'INÍCIO' },
  { id: 'matriz', ic: '📚', t: 'MATRIZ' },
  { id: 'atividades', ic: '📝', t: 'ATIVIDADES' },
  { id: 'jogos', ic: '🎮', t: 'JOGOS' },
  { id: 'simulados', ic: '📋', t: 'SIMULADOS' },
  { id: 'ia-atividade', ic: '🤖', t: 'CRIAR COM IA' },
  { id: 'planos', ic: '📅', t: 'PLANOS' },
  { id: 'minhas-habilidades', ic: '🎯', t: 'MINHAS HABILIDADES' },
  { id: 'resultados', ic: '📊', t: 'RESULTADOS' },
  { id: 'evolucao', ic: '📈', t: 'EVOLUÇÃO' },
  { id: 'calendario', ic: '📆', t: 'CALENDÁRIO' },
  { id: 'repositorio', ic: '📚', t: 'REPOSITÓRIO' },
  { id: 'evidencias', ic: '📌', t: 'EVIDÊNCIAS' },
  { grupo: 'Secretaria', perfis: ['admin', 'tecnico'] },
  { id: 'painel-secretaria', ic: '📊', t: 'PAINEL SPAECE', perfis: ['admin', 'tecnico'] },
  { id: 'mapa-cobertura', ic: '🗺️', t: 'MAPA DE COBERTURA', perfis: ['admin', 'tecnico'] },
  { id: 'comparacao', ic: '🏫', t: 'COMPARAÇÃO', perfis: ['admin', 'tecnico'] },
  { id: 'como-estamos', ic: '📈', t: 'COMO ESTAMOS?', perfis: ['admin', 'tecnico'] },
  { id: 'alertas', ic: '🔔', t: 'ALERTAS', perfis: ['admin', 'tecnico'] },
  { id: 'relatorios', ic: '📄', t: 'RELATÓRIOS', perfis: ['admin', 'tecnico'] },
  { id: 'historico', ic: '🕓', t: 'HISTÓRICO' },
  { grupo: 'Administração', perfis: ['admin'] },
  { id: 'admin-matriz', ic: '📚', t: 'MATRIZ OFICIAL', perfis: ['admin'] },
  { id: 'admin-usuarios', ic: '👥', t: 'USUÁRIOS', perfis: ['admin'] },
  { id: 'admin-escolas', ic: '🏫', t: 'ESCOLAS', perfis: ['admin'] },
  { id: 'admin-logs', ic: '📋', t: 'LOGS', perfis: ['admin'] },
  { grupo: 'Sistema' },
  { id: 'configuracoes', ic: '⚙️', t: 'CONFIGURAÇÕES' }
];

const TITULOS = {
  inicio: 'Início', matriz: 'Matriz do SPAECE', atividades: 'Atividades', jogos: 'Jogos Pedagógicos',
  simulados: 'Simulados', 'ia-atividade': 'Criar Atividade com IA', 'ia-plano': 'Criar Plano com IA',
  'ia-jogo': 'Criar Jogo com IA', planos: 'Planos de Aula', 'minhas-habilidades': 'Minhas Habilidades',
  resultados: 'Resultados', evolucao: 'Evolução', calendario: 'Calendário Pedagógico',
  repositorio: 'Repositório Colaborativo', evidencias: 'Evidências Pedagógicas',
  'painel-secretaria': 'Painel de Monitoramento SPAECE', 'mapa-cobertura': 'Mapa de Cobertura',
  comparacao: 'Comparação entre Escolas', 'como-estamos': 'Como Estamos?', alertas: 'Alertas Pedagógicos',
  relatorios: 'Relatórios', historico: 'Histórico', 'admin-matriz': 'Matriz Oficial',
  'admin-usuarios': 'Usuários', 'admin-escolas': 'Escolas', 'admin-logs': 'Logs',
  configuracoes: 'Configurações', escola: 'Painel da Escola'
};

let _paginaAtual = 'inicio';

function renderMenu() {
  const perfil = perfilAtual();
  const nav = document.getElementById('nav-principal');
  nav.innerHTML = MENU.map(item => {
    if (item.grupo) {
      if (item.perfis && !item.perfis.includes(perfil)) return '';
      return `<div class="grupo">${esc(item.grupo)}</div>`;
    }
    if (item.perfis && !item.perfis.includes(perfil)) return '';
    return `<a href="#" data-ir="${item.id}" class="${_paginaAtual === item.id ? 'ativo' : ''}">
      <span class="ic" aria-hidden="true">${item.ic}</span> ${esc(item.t)}</a>`;
  }).join('');
}

function renderPagina(id, opts) {
  opts = opts || {};
  if (!PAGINAS[id]) id = 'inicio';
  _paginaAtual = id;
  window._paginaAtual = id;
  if (opts.escolaId) window._escolaAtual = opts.escolaId;

  const main = document.getElementById('conteudo-principal');
  main.innerHTML = PAGINAS[id]();
  document.getElementById('titulo-pagina').innerHTML = `${esc(TITULOS[id] || 'Início')}<small>SPAECE Conecta — Língua Portuguesa 9º Ano</small>`;
  renderMenu();
  window.scrollTo(0, 0);
  fecharSidebar();
  main.focus();

  // Hooks pós-renderização
  if (id === 'admin-matriz') {
    const aba = opts.aba || 'importar';
    renderAbaMatriz(aba);
    document.querySelectorAll('[data-aba-matriz]').forEach(b => b.classList.toggle('ativo', b.dataset.abaMatriz === aba));
  }
}

function abrirSidebar() {
  document.getElementById('sidebar').classList.add('aberta');
  document.getElementById('overlay-sidebar').classList.add('aberto');
}
function fecharSidebar() {
  document.getElementById('sidebar').classList.remove('aberta');
  document.getElementById('overlay-sidebar').classList.remove('aberto');
}

/* ============================================================
   LOGIN
   ============================================================ */
function mostrarApp() {
  document.getElementById('tela-login').style.display = 'none';
  document.getElementById('app').classList.add('ativo');
  const s = sessaoAtual();
  document.getElementById('usuario-nome').textContent = s.nome;
  document.getElementById('usuario-perfil').textContent = ROTULO_PERFIL[s.perfil] || s.perfil;
  const av = document.getElementById('usuario-avatar');
  av.textContent = iniciais(s.nome);
  av.className = 'avatar ' + (s.perfil === 'admin' ? 'admin' : s.perfil === 'tecnico' ? 'tecnico' : s.perfil === 'gestor' ? 'gestor' : '');
  renderPagina('inicio');
}

function mostrarLogin() {
  document.getElementById('tela-login').style.display = 'grid';
  document.getElementById('app').classList.remove('ativo');
  // Limpa o bloco de primeiro acesso para não exibir dados de sessão anterior
  const bloco = document.getElementById('bloco-primeiro-acesso');
  if (bloco) bloco.classList.add('oculto');
  const erroEl = document.getElementById('login-erro');
  if (erroEl) erroEl.classList.add('oculto');
  window._usuarioPrimeiroAcesso = null;
}

async function tentarLogin(ev) {
  ev.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;
  const erroEl = document.getElementById('login-erro');
  erroEl.classList.add('oculto');

  const r = await autenticar(email, senha);
  if (r.ok) {
    iniciarSessao(r.usuario);
    mostrarApp();
    toast('Bem-vindo(a), ' + r.usuario.nome.split(' ')[0] + '!');
  } else if (r.precisaDefinir) {
    window._usuarioPrimeiroAcesso = r.usuarioId;
    const u = obterUsuario(r.usuarioId);
    // Identifica o usuário no bloco de primeiro acesso
    if (u) {
      document.getElementById('pa-nome').textContent = u.nome;
      document.getElementById('pa-perfil').textContent = ROTULO_PERFIL[u.perfil] || u.perfil;
      const av = document.getElementById('pa-avatar');
      av.textContent = iniciais(u.nome);
      av.className = 'avatar ' + (u.perfil === 'admin' ? 'admin' : u.perfil === 'tecnico' ? 'tecnico' : u.perfil === 'gestor' ? 'gestor' : '');
    }
    document.getElementById('bloco-primeiro-acesso').classList.remove('oculto');
    erroEl.textContent = r.erro;
    erroEl.classList.remove('oculto');
  } else {
    erroEl.textContent = r.erro;
    erroEl.classList.remove('oculto');
  }
}

async function definirSenhaPrimeiroAcesso() {
  const id = window._usuarioPrimeiroAcesso;
  const s1 = document.getElementById('nova-senha').value;
  const s2 = document.getElementById('conf-senha').value;
  if (s1 !== s2) { toast('As senhas não coincidem.', 'erro'); return; }
  if (s1.length < 6) { toast('A senha deve ter ao menos 6 caracteres.', 'erro'); return; }
  try {
    await definirSenha(id, s1);
    const u = obterUsuario(id);
    iniciarSessao(u);
    mostrarApp();
    toast('Senha definida! Bem-vindo(a).');
  } catch (e) { toast(e.message, 'erro'); }
}

/* ============================================================
   LOGIN COM GOOGLE
   Autenticação federada por e-mail institucional. O sistema
   valida o e-mail contra os usuários cadastrados pela Secretaria.
   Nenhuma senha é criada ou armazenada neste fluxo.
   ============================================================ */
function loginComGoogle(emailPreenchido) {
  abrirModal('Entrar com Google', `
    <div class="alerta alerta-info mb">
      <span class="ic">🔐</span>
      <div>Use seu <strong>e-mail institucional do Google</strong> cadastrado pela Secretaria.
      A autenticação é feita pela sua conta Google — nenhuma senha é armazenada no sistema.</div>
    </div>
    <div class="campo">
      <label for="google-email">E-mail institucional (Google)</label>
      <input type="email" id="google-email" placeholder="nome@ararenda.ce.gov.br" autocomplete="email" value="${esc(emailPreenchido || '')}">
      <div class="ajuda">Ex.: francisco.gomes@ararenda.ce.gov.br</div>
    </div>
    <div id="google-erro" class="alerta alerta-erro oculto" role="alert"></div>
  `, `
    <button class="btn btn-contorno" id="btn-google-cancelar">Cancelar</button>
    <button class="btn btn-google" id="btn-google-confirmar">
      <svg class="google-ic" viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      Continuar com Google
    </button>
  `);
  setTimeout(() => { const el = document.getElementById('google-email'); if (el) el.focus(); }, 60);
}

function confirmarLoginGoogle() {
  const email = (document.getElementById('google-email').value || '').trim();
  const erroEl = document.getElementById('google-erro');
  erroEl.classList.add('oculto');

  if (!email) {
    erroEl.textContent = 'Informe seu e-mail institucional.';
    erroEl.classList.remove('oculto');
    return;
  }

  const u = obterUsuarioPorEmail(email);
  if (!u) {
    erroEl.innerHTML = 'Este e-mail não está cadastrado no sistema. Procure a Secretaria Municipal de Educação.';
    erroEl.classList.remove('oculto');
    return;
  }
  if (!u.ativo) {
    erroEl.textContent = 'Usuário inativo. Procure a Secretaria.';
    erroEl.classList.remove('oculto');
    return;
  }

  // Autenticação federada: e-mail institucional validado via Google.
  u.precisaDefinirSenha = false;
  u.autenticacao = 'google';
  atualizarUsuario(u.id, u);
  registrarLog('Login com Google', u.nome);

  fecharModal();
  iniciarSessao(u);
  mostrarApp();
  toast('Bem-vindo(a), ' + u.nome.split(' ')[0] + '! (Google)');
}

/* ============================================================
   EVENTOS GLOBAIS (delegação)
   ============================================================ */
document.addEventListener('click', function (ev) {
  const alvo = ev.target.closest('[data-ir],[data-hab],[data-ver-atv],[data-ver-jogo],[data-ver-sim],[data-ver-plano],[data-res-sim],[data-reg-atv],[data-reg-jogo],[data-imprimir-atv],[data-del-hab],[data-reset-senha],[data-aba-matriz],[data-ir-modal],[data-salvar-link],[data-del-material],[data-abrir-pdf],[data-add-material-cat]');

  // Navegação
  const nav = ev.target.closest('[data-ir]');
  if (nav) {
    ev.preventDefault();
    const id = nav.dataset.ir;
    const opts = {};
    if (nav.dataset.escola) opts.escolaId = nav.dataset.escola;
    if (nav.dataset.aba) opts.aba = nav.dataset.aba;
    renderPagina(id, opts);
    return;
  }

  if (!alvo) return;

  if (alvo.dataset.hab) { abrirDetalheHabilidade(alvo.dataset.hab); return; }
  if (alvo.dataset.verAtv) { verAtividade(alvo.dataset.verAtv); return; }
  if (alvo.dataset.verJogo) { verJogo(alvo.dataset.verJogo); return; }
  if (alvo.dataset.verSim) { verSimulado(alvo.dataset.verSim); return; }
  if (alvo.dataset.verPlano) { verPlano(alvo.dataset.verPlano); return; }
  if (alvo.dataset.resSim) { modalResultadoSimulado(alvo.dataset.resSim); return; }
  if (alvo.dataset.regAtv) { modalRegistro({ atividadeId: alvo.dataset.regAtv, recurso: 'Atividade' }); return; }
  if (alvo.dataset.regJogo) { modalRegistro({ recurso: 'Jogo' }); return; }
  if (alvo.dataset.imprimirAtv) { verAtividade(alvo.dataset.imprimirAtv); return; }
  if (alvo.dataset.delHab) {
    if (confirm('Remover esta habilidade da Matriz? Esta ação não pode ser desfeita.')) {
      removerHabilidade(alvo.dataset.delHab); toast('Habilidade removida.'); renderPagina('admin-matriz');
    }
    return;
  }
  if (alvo.dataset.resetSenha) {
    const u = obterUsuario(alvo.dataset.resetSenha);
    if (confirm(`Resetar a senha de ${u.nome}? O usuário deverá definir uma nova senha no próximo acesso.`)) {
      u.senhaHash = null; u.salt = null; u.precisaDefinirSenha = true; atualizarUsuario(u.id, u);
      toast('Senha resetada.'); renderPagina('admin-usuarios');
    }
    return;
  }
  if (alvo.dataset.abaMatriz) {
    document.querySelectorAll('[data-aba-matriz]').forEach(b => b.classList.remove('ativo'));
    alvo.classList.add('ativo');
    renderAbaMatriz(alvo.dataset.abaMatriz);
    return;
  }
  if (alvo.dataset.salvarLink) {
    const id = alvo.dataset.salvarLink;
    const inp = document.querySelector(`[data-hab-link="${id}"]`);
    const link = inp ? inp.value.trim() : '';
    if (link && !/^https?:\/\//i.test(link)) { toast('O link deve começar com http:// ou https://', 'erro'); return; }
    atualizarLinkHabilidade(id, link);
    toast(link ? 'Link do material salvo.' : 'Link removido.');
    renderAbaMatriz('links');
    return;
  }
  if (alvo.dataset.delMaterial) {
    if (confirm('Remover este material? Esta ação não pode ser desfeita.')) {
      removerMaterial(alvo.dataset.delMaterial);
      toast('Material removido.');
      renderAbaMatriz('links');
    }
    return;
  }
  if (alvo.dataset.abrirPdf) {
    ev.preventDefault();
    abrirPdfMaterial(alvo.dataset.abrirPdf);
    return;
  }
  if (alvo.dataset.addMaterialCat) {
    modalAdicionarMaterial(alvo.dataset.addMaterialCat);
    return;
  }
  if (alvo.dataset.irModal) { fecharModal(); renderPagina(alvo.dataset.irModal); return; }
});

/* Delegação para botões com IDs específicos */
document.addEventListener('click', function (ev) {
  const t = ev.target.closest('button, .cal-dia');
  if (!t) return;
  const id = t.id;

  switch (id) {
    case 'btn-sair': encerrarSessao(); mostrarLogin(); toast('Sessão encerrada.'); break;
    case 'menu-toggle': abrirSidebar(); break;
    case 'btn-definir-senha': definirSenhaPrimeiroAcesso(); break;
    case 'btn-google': loginComGoogle(); break;
    case 'btn-google-primeiro': loginComGoogle(document.getElementById('login-email').value.trim()); break;
    case 'btn-google-cancelar': fecharModal(); break;
    case 'btn-google-confirmar': confirmarLoginGoogle(); break;
    case 'btn-buscar-matriz': window._filtroMatriz = { busca: document.getElementById('busca-matriz').value }; renderPagina('matriz'); break;
    case 'btn-filtrar-atv':
      window._filtroAtv = {
        habilidadeId: document.getElementById('f-atv-hab').value,
        tipo: document.getElementById('f-atv-tipo').value,
        dificuldade: document.getElementById('f-atv-dif').value,
        genero: document.getElementById('f-atv-gen').value,
        busca: document.getElementById('f-atv-busca').value
      }; renderPagina('atividades'); break;
    case 'btn-limpar-atv': window._filtroAtv = {}; renderPagina('atividades'); break;
    case 'btn-novo-simulado': modalNovoSimulado(); break;
    case 'btn-gerar-sim': gerarSimulado(); break;
    case 'btn-salvar-res': salvarResultadoSimulado(t.dataset.sim); break;
    case 'btn-ia-gerar-atv': gerarAtividadeIA(); break;
    case 'btn-ia-salvar-atv': salvarAtividadeIA(); break;
    case 'btn-ia-gerar-pln': gerarPlanoIA(); break;
    case 'btn-ia-salvar-pln': salvarPlanoIA(); break;
    case 'btn-ia-gerar-jgo': gerarJogoIA(); break;
    case 'btn-ia-salvar-jgo': salvarJogoIA(); break;
    case 'btn-filtrar-mh':
      window._filtroMinhas = { turma: document.getElementById('mh-turma').value, status: document.getElementById('mh-status').value };
      renderPagina('minhas-habilidades'); break;
    case 'btn-filtrar-mapa':
      window._filtroMapa = { escolaId: document.getElementById('mapa-escola').value, turma: document.getElementById('mapa-turma').value };
      renderPagina('mapa-cobertura'); break;
    case 'btn-novo-evento': modalNovoEvento(); break;
    case 'btn-salvar-evento': salvarEventoForm(); break;
    case 'btn-nova-evidencia': modalRegistro(); break;
    case 'btn-salvar-registro': salvarRegistroForm(); break;
    case 'btn-confirmar-matriz': confirmarMatriz(); toast('Matriz confirmada e disponível!'); renderPagina('admin-matriz'); break;
    case 'btn-excluir-matriz': excluirMatrizForm(); break;
    case 'btn-cancelar-excluir-matriz': fecharModal(); break;
    case 'btn-confirmar-excluir-matriz': confirmarExcluirMatriz(); break;
    case 'btn-importar-matriz': importarMatrizForm(); break;
    case 'btn-add-habilidade': adicionarHabilidadeForm(); break;
    case 'btn-salvar-pasta-materiais': {
      const url = (document.getElementById('cfg-pasta-materiais').value || '').trim();
      if (url && !/^https?:\/\//i.test(url)) { toast('O link deve começar com http:// ou https://', 'erro'); break; }
      definirPastaMateriais(url);
      toast(url ? 'Pasta de materiais salva.' : 'Pasta removida.');
      renderAbaMatriz('links');
      break;
    }
    case 'btn-add-material': {
      const titulo = (document.getElementById('mat-titulo').value || '').trim();
      const tipo = document.getElementById('mat-tipo').value;
      const categoria = document.getElementById('mat-categoria').value;
      const habilidadeId = document.getElementById('mat-habilidade').value || null;
      if (!titulo) { toast('Informe o título do material.', 'erro'); break; }
      if (tipo === 'pdf') {
        const inp = document.getElementById('mat-arquivo');
        const file = inp && inp.files && inp.files[0];
        if (!file) { toast('Selecione um arquivo PDF.', 'erro'); break; }
        const ehPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
        if (!ehPdf) { toast('O arquivo deve ser um PDF.', 'erro'); break; }
        if (file.size > 25 * 1024 * 1024) { toast('O arquivo é muito grande (máx. 25 MB).', 'erro'); break; }
        const btn = document.getElementById('btn-add-material');
        if (btn) { btn.disabled = true; btn.textContent = '⏳ Salvando PDF…'; }
        salvarArquivo(file).then(arquivoId => {
          adicionarMaterial({
            titulo, tipo: 'pdf', categoria, habilidadeId,
            arquivoId, arquivoNome: file.name, arquivoTipo: file.type || 'application/pdf', arquivoTamanho: file.size
          });
          toast('PDF cadastrado em ' + rotuloCategoria(categoria) + '!');
          renderAbaMatriz('links');
        }).catch(err => {
          console.error(err);
          toast('Não foi possível salvar o PDF.', 'erro');
          if (btn) { btn.disabled = false; btn.textContent = '➕ Cadastrar material'; }
        });
        break;
      }
      const link = (document.getElementById('mat-link').value || '').trim();
      if (!link || !/^https?:\/\//i.test(link)) { toast('Informe um link válido (http:// ou https://).', 'erro'); break; }
      adicionarMaterial({ titulo, tipo: 'link', link, categoria, habilidadeId });
      toast('Material cadastrado em ' + rotuloCategoria(categoria) + '!');
      renderAbaMatriz('links');
      break;
    }
    case 'btn-mam-salvar': {
      const categoria = window._mamCategoria || 'atividades';
      const titulo = (document.getElementById('mam-titulo').value || '').trim();
      const tipo = document.getElementById('mam-tipo').value;
      const habilidadeId = document.getElementById('mam-habilidade').value || null;
      if (!titulo) { toast('Informe o título do material.', 'erro'); break; }
      if (tipo === 'pdf') {
        const inp = document.getElementById('mam-arquivo');
        const file = inp && inp.files && inp.files[0];
        if (!file) { toast('Selecione um arquivo PDF.', 'erro'); break; }
        const ehPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
        if (!ehPdf) { toast('O arquivo deve ser um PDF.', 'erro'); break; }
        if (file.size > 25 * 1024 * 1024) { toast('O arquivo é muito grande (máx. 25 MB).', 'erro'); break; }
        const btn = document.getElementById('btn-mam-salvar');
        if (btn) { btn.disabled = true; btn.textContent = '⏳ Salvando PDF…'; }
        salvarArquivo(file).then(arquivoId => {
          adicionarMaterial({
            titulo, tipo: 'pdf', categoria, habilidadeId,
            arquivoId, arquivoNome: file.name, arquivoTipo: file.type || 'application/pdf', arquivoTamanho: file.size
          });
          fecharModal();
          toast('PDF adicionado em ' + rotuloCategoria(categoria) + '!');
          renderPagina(categoria);
        }).catch(err => {
          console.error(err);
          toast('Não foi possível salvar o PDF.', 'erro');
          if (btn) { btn.disabled = false; btn.textContent = '➕ Adicionar material'; }
        });
        break;
      }
      const link = (document.getElementById('mam-link').value || '').trim();
      if (!link || !/^https?:\/\//i.test(link)) { toast('Informe um link válido (http:// ou https://).', 'erro'); break; }
      adicionarMaterial({ titulo, tipo: 'link', link, categoria, habilidadeId });
      fecharModal();
      toast('Material adicionado em ' + rotuloCategoria(categoria) + '!');
      renderPagina(categoria);
      break;
    }
    case 'btn-novo-usuario': modalNovoUsuario(); break;
    case 'btn-nova-escola': modalNovaEscola(); break;
    case 'btn-gerar-relatorio': gerarRelatorio(); break;
    case 'btn-filtrar-hist': window._histAno = parseInt(document.getElementById('hist-ano').value, 10); renderPagina('historico'); break;
    case 'btn-salvar-ano': definirAnoLetivo(document.getElementById('cfg-ano').value); toast('Ano letivo atualizado.'); break;
    case 'btn-alterar-senha': modalAlterarSenha(); break;
    case 'btn-exportar': exportarArquivo(); break;
    case 'btn-importar': importarArquivo(); break;
    case 'cal-prev': window._calMes--; if (window._calMes < 0) { window._calMes = 11; window._calAno--; } renderPagina('calendario'); break;
    case 'cal-next': window._calMes++; if (window._calMes > 11) { window._calMes = 0; window._calAno++; } renderPagina('calendario'); break;
  }

  // Clique em dia do calendário
  if (t.classList && t.classList.contains('cal-dia') && t.dataset.dia) {
    modalNovoEvento(t.dataset.dia);
  }
});

/* ============================================================
   AÇÕES DE FORMULÁRIOS
   ============================================================ */
/* Abre (ou baixa) um material do tipo PDF salvo no IndexedDB. */
function abrirPdfMaterial(materialId) {
  const m = obterMaterial(materialId);
  if (!m || m.tipo !== 'pdf' || !m.arquivoId) { toast('Arquivo PDF não encontrado.', 'erro'); return; }
  obterArquivo(m.arquivoId).then(reg => {
    if (!reg || !reg.blob) { toast('Arquivo PDF não encontrado no navegador.', 'erro'); return; }
    const url = URL.createObjectURL(reg.blob);
    const win = window.open(url, '_blank');
    if (!win) {
      // Popup bloqueado: força download
      const a = document.createElement('a');
      a.href = url; a.download = reg.nome || 'material.pdf';
      document.body.appendChild(a); a.click(); a.remove();
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }).catch(err => { console.error(err); toast('Não foi possível abrir o PDF.', 'erro'); });
}

function salvarAtividadeIA() {
  const a = window._iaAtvGerada; if (!a) return;
  salvarAtividade(a);
  toast('Atividade salva no repositório!');
  renderPagina('atividades');
}
function salvarPlanoIA() {
  const p = window._iaPlanoGerado; if (!p) return;
  salvarPlano(p);
  toast('Plano salvo!');
  renderPagina('planos');
}
function salvarJogoIA() {
  const j = window._iaJogoGerado; if (!j) return;
  salvarJogo(j);
  toast('Jogo salvo!');
  renderPagina('jogos');
}

function importarMatrizForm() {
  const ano = document.getElementById('imp-ano').value.trim();
  const edicao = document.getElementById('imp-edicao').value.trim();
  const doc = document.getElementById('imp-doc').value.trim();
  const resp = document.getElementById('imp-resp').value.trim();
  const texto = document.getElementById('imp-texto').value.trim();
  const arquivo = document.getElementById('imp-arquivo').files[0];

  const processar = (conteudo) => {
    let habilidades = [];
    try {
      if (conteudo.trim().startsWith('[') || conteudo.trim().startsWith('{')) {
        const j = JSON.parse(conteudo);
        const arr = Array.isArray(j) ? j : (j.habilidades || []);
        habilidades = arr.map(h => ({ codigo: h.codigo || h.cod, texto: h.texto || h.habilidade || h.descricao, eixo: h.eixo || '' }));
      } else {
        habilidades = conteudo.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
          const p = l.split(/[;\t]/);
          return { codigo: (p[0] || '').trim(), texto: (p[1] || '').trim(), eixo: (p[2] || '').trim() };
        });
      }
    } catch (e) { toast('Erro ao ler arquivo: ' + e.message, 'erro'); return; }
    habilidades = habilidades.filter(h => h.codigo && h.texto);
    if (!habilidades.length) { toast('Nenhuma habilidade válida encontrada.', 'erro'); return; }
    importarMatriz({ ano, edicao, documentoOrigem: doc, responsavel: resp }, habilidades);
    toast(`${habilidades.length} habilidades importadas. Confira e confirme.`);
    renderPagina('admin-matriz');
    setTimeout(() => { const b = document.querySelector('[data-aba-matriz="conferir"]'); if (b) b.click(); }, 100);
  };

  if (arquivo) {
    const reader = new FileReader();
    reader.onload = e => processar(e.target.result);
    reader.readAsText(arquivo);
  } else if (texto) {
    processar(texto);
  } else {
    toast('Forneça um arquivo ou cole os dados.', 'erro');
  }
}

function excluirMatrizForm() {
  const m = matriz();
  const qtd = m.habilidades.length;
  if (qtd === 0) { toast('A Matriz já está vazia.', 'aviso'); return; }

  abrirModal('Excluir Matriz Oficial', `
    <div class="alerta alerta-erro mb">
      <span class="ic">⚠️</span>
      <div><strong>Atenção:</strong> esta ação remove <strong>todas as ${qtd} habilidades</strong> da Matriz Oficial
      e reinicia a matriz. Não é possível desfazer.</div>
    </div>
    <p style="font-size:.9rem">Use esta opção quando os dados importados/colados estiverem incorretos e você quiser recomeçar.</p>
    <div class="campo">
      <label>Para confirmar, digite <strong>EXCLUIR</strong> abaixo:</label>
      <input id="conf-excluir-matriz" placeholder="Digite EXCLUIR" autocomplete="off">
    </div>
    <div id="erro-excluir-matriz" class="alerta alerta-erro oculto" role="alert"></div>
  `, `
    <button class="btn btn-contorno" id="btn-cancelar-excluir-matriz">Cancelar</button>
    <button class="btn btn-perigo" id="btn-confirmar-excluir-matriz">🗑️ Excluir Matriz</button>
  `);
  setTimeout(() => { const el = document.getElementById('conf-excluir-matriz'); if (el) el.focus(); }, 60);
}

function confirmarExcluirMatriz() {
  const txt = (document.getElementById('conf-excluir-matriz').value || '').trim().toUpperCase();
  const erroEl = document.getElementById('erro-excluir-matriz');
  erroEl.classList.add('oculto');
  if (txt !== 'EXCLUIR') {
    erroEl.textContent = 'Digite exatamente a palavra EXCLUIR para confirmar.';
    erroEl.classList.remove('oculto');
    return;
  }
  const qtd = limparMatriz();
  fecharModal();
  toast(`Matriz excluída (${qtd} habilidades removidas). Você pode importar novamente.`);
  renderPagina('admin-matriz');
}

function adicionarHabilidadeForm() {
  const codigo = document.getElementById('man-codigo').value.trim();
  const texto = document.getElementById('man-texto').value.trim();
  const eixo = document.getElementById('man-eixo').value.trim();
  if (!codigo || !texto) { toast('Informe código e texto oficial.', 'erro'); return; }
  adicionarHabilidade({ codigo, texto, eixo });
  toast('Habilidade adicionada.');
  renderPagina('admin-matriz');
  setTimeout(() => { const b = document.querySelector('[data-aba-matriz="conferir"]'); if (b) b.click(); }, 100);
}

function modalNovoUsuario() {
  abrirModal('Novo Usuário', `
    <div class="campo"><label>Nome completo</label><input id="nu-nome"></div>
    <div class="campo"><label>E-mail institucional</label><input type="email" id="nu-email"></div>
    <div class="campo"><label>Perfil</label><select id="nu-perfil">
      <option value="professor">Professor</option><option value="gestor">Gestor Escolar</option>
      <option value="tecnico">Técnico da Secretaria</option><option value="admin">Administrador da Secretaria</option></select></div>
    <div class="campo"><label>Escola (para professor/gestor)</label><select id="nu-escola"><option value="">— Nenhuma —</option>${opcoesEscolas()}</select></div>
    <div class="alerta alerta-info"><span class="ic">🔐</span><div>O usuário definirá a própria senha no primeiro acesso. Nenhuma senha é criada pelo administrador.</div></div>
  `, `<button class="btn btn-contorno" onclick="fecharModal()">Cancelar</button>
      <button class="btn btn-primario" id="btn-salvar-usuario">Criar usuário</button>`);
  document.getElementById('btn-salvar-usuario').onclick = () => {
    const nome = document.getElementById('nu-nome').value.trim();
    const email = document.getElementById('nu-email').value.trim();
    if (!nome || !email) { toast('Preencha nome e e-mail.', 'erro'); return; }
    if (obterUsuarioPorEmail(email)) { toast('E-mail já cadastrado.', 'erro'); return; }
    adicionarUsuario({ nome, email, perfil: document.getElementById('nu-perfil').value, escolaId: document.getElementById('nu-escola').value || null });
    fecharModal(); toast('Usuário criado.'); renderPagina('admin-usuarios');
  };
}

function modalNovaEscola() {
  abrirModal('Nova Escola', `
    <div class="campo"><label>Nome da escola</label><input id="ne-nome" placeholder="Ex.: EEF NOME DA ESCOLA"></div>
    <div class="campo"><label>Tipo</label><select id="ne-tipo"><option>EEF</option><option>EEIF</option><option>EMEF</option><option>Outro</option></select></div>
  `, `<button class="btn btn-contorno" onclick="fecharModal()">Cancelar</button>
      <button class="btn btn-primario" id="btn-salvar-escola">Criar escola</button>`);
  document.getElementById('btn-salvar-escola').onclick = () => {
    const nome = document.getElementById('ne-nome').value.trim();
    if (!nome) { toast('Informe o nome.', 'erro'); return; }
    adicionarEscola(nome, document.getElementById('ne-tipo').value);
    fecharModal(); toast('Escola cadastrada.'); renderPagina('admin-escolas');
  };
}

function modalAlterarSenha() {
  abrirModal('Alterar Senha', `
    <div class="campo"><label>Senha atual</label><input type="password" id="as-atual"></div>
    <div class="campo"><label>Nova senha</label><input type="password" id="as-nova"></div>
    <div class="campo"><label>Confirmar nova senha</label><input type="password" id="as-conf"></div>
  `, `<button class="btn btn-contorno" onclick="fecharModal()">Cancelar</button>
      <button class="btn btn-primario" id="btn-confirmar-senha">Alterar</button>`);
  document.getElementById('btn-confirmar-senha').onclick = async () => {
    const s = sessaoAtual();
    const u = obterUsuario(s.id);
    const atual = document.getElementById('as-atual').value;
    const nova = document.getElementById('as-nova').value;
    const conf = document.getElementById('as-conf').value;
    const h = await hashSenha(atual, u.salt);
    if (h !== u.senhaHash) { toast('Senha atual incorreta.', 'erro'); return; }
    if (nova !== conf) { toast('As senhas não coincidem.', 'erro'); return; }
    if (nova.length < 6) { toast('Mínimo 6 caracteres.', 'erro'); return; }
    await definirSenha(u.id, nova);
    fecharModal(); toast('Senha alterada com sucesso.');
  };
}

function salvarEventoForm() {
  const titulo = document.getElementById('ev-titulo').value.trim();
  if (!titulo) { toast('Informe um título.', 'erro'); return; }
  salvarEvento({
    data: document.getElementById('ev-data').value,
    tipo: document.getElementById('ev-tipo').value,
    titulo,
    habilidadeId: document.getElementById('ev-hab').value || null,
    turma: document.getElementById('ev-turma').value.trim(),
    observacoes: document.getElementById('ev-obs').value.trim()
  });
  fecharModal(); toast('Registro adicionado ao calendário.'); renderPagina('calendario');
}

function exportarArquivo() {
  const blob = new Blob([exportarBackup()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'spaece-ararenda-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  toast('Backup exportado.');
}

function importarArquivo() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json';
  inp.onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try { importarBackup(ev.target.result); toast('Backup importado. Recarregando…'); setTimeout(() => location.reload(), 800); }
      catch (err) { toast('Erro ao importar: ' + err.message, 'erro'); }
    };
    r.readAsText(f);
  };
  inp.click();
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('form-login').addEventListener('submit', tentarLogin);
  document.getElementById('modal-fechar').addEventListener('click', fecharModal);
  document.getElementById('modal-fundo').addEventListener('click', e => { if (e.target.id === 'modal-fundo') fecharModal(); });
  document.getElementById('overlay-sidebar').addEventListener('click', fecharSidebar);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModal(); });

  // Alterna entre campo de LINK e campo de ARQUIVO PDF no cadastro de materiais
  document.addEventListener('change', function (ev) {
    if (!ev.target) return;
    if (ev.target.id === 'mat-tipo' || ev.target.id === 'mam-tipo') {
      const prefixo = ev.target.id === 'mat-tipo' ? 'mat' : 'mam';
      const ehPdf = ev.target.value === 'pdf';
      const campoLink = document.getElementById(prefixo + '-campo-link');
      const campoPdf = document.getElementById(prefixo + '-campo-pdf');
      if (campoLink) campoLink.style.display = ehPdf ? 'none' : '';
      if (campoPdf) campoPdf.style.display = ehPdf ? '' : 'none';
    }
  });

  const s = sessaoAtual();
  if (s) mostrarApp(); else mostrarLogin();
});
