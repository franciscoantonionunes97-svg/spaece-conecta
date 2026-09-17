/* ============================================================
   SPAECE CONECTA — Páginas / Telas
   ============================================================ */

const PAGINAS = {};

/* ============================================================
   INÍCIO — Dashboard do Professor (cards grandes)
   ============================================================ */
PAGINAS.inicio = function () {
  const s = sessaoAtual();
  const cobertura = calcularCobertura({ escolaId: s.escolaId, professorId: s.perfil === 'professor' ? s.id : null });
  const meusRegistros = getDB().registros.filter(r => r.professorId === s.id || s.perfil !== 'professor');
  const minhasAtiv = getDB().atividades.filter(a => a.autor === s.nome || s.perfil !== 'professor');

  const cards = [
    { ic: '📚', cor: '', t: 'MATRIZ DO SPAECE', d: 'Consulte as habilidades', p: 'matriz' },
    { ic: '📝', cor: 'verde', t: 'ATIVIDADES', d: 'Encontre atividades prontas', p: 'atividades' },
    { ic: '🎮', cor: 'amarelo', t: 'JOGOS', d: 'Aprenda brincando', p: 'jogos' },
    { ic: '📋', cor: 'roxo', t: 'SIMULADOS', d: 'Prepare sua turma', p: 'simulados' },
    { ic: '🤖', cor: 'roxo', t: 'CRIAR ATIVIDADE COM IA', d: 'Crie uma atividade personalizada', p: 'ia-atividade' },
    { ic: '🤖📅', cor: 'roxo', t: 'CRIAR PLANO COM IA', d: 'Planeje sua aula', p: 'ia-plano' },
    { ic: '🎯', cor: 'verde', t: 'MINHAS HABILIDADES', d: 'Acompanhe o que já trabalhou', p: 'minhas-habilidades' },
    { ic: '📊', cor: '', t: 'RESULTADOS', d: 'Veja o desempenho da turma', p: 'resultados' },
    { ic: '📈', cor: 'verde', t: 'EVOLUÇÃO', d: 'Acompanhe o progresso', p: 'evolucao' },
    { ic: '📅', cor: 'amarelo', t: 'CALENDÁRIO', d: 'Organize seu trabalho', p: 'calendario' }
  ];

  return `
    <div class="pagina-cabecalho">
      <h2>Olá, ${esc(s.nome.split(' ')[0])}! 👋</h2>
      <p>Bem-vindo(a) ao SPAECE Conecta — Língua Portuguesa, 9º ano. O que você deseja fazer hoje?</p>
    </div>

    ${!matrizDisponivel() ? avisoMatrizIndisponivel() : ''}

    <div class="grid-kpi mb">
      <div class="kpi ${cobertura.percentual >= 75 ? 'verde' : cobertura.percentual >= 40 ? 'amarelo' : 'vermelho'}">
        <span class="icone-kpi">📊</span>
        <span class="rotulo">Cobertura da Matriz</span>
        <span class="valor">${cobertura.percentual}%</span>
        <span class="detalhe">${cobertura.cobertas} de ${cobertura.total} habilidades com registro</span>
      </div>
      <div class="kpi">
        <span class="icone-kpi">📌</span>
        <span class="rotulo">Registros de Trabalho</span>
        <span class="valor">${meusRegistros.length}</span>
        <span class="detalhe">evidências pedagógicas</span>
      </div>
      <div class="kpi roxo">
        <span class="icone-kpi">📝</span>
        <span class="rotulo">Minhas Atividades</span>
        <span class="valor">${minhasAtiv.length}</span>
        <span class="detalhe">no repositório</span>
      </div>
      <div class="kpi amarelo">
        <span class="icone-kpi">🎯</span>
        <span class="rotulo">Habilidades Pendentes</span>
        <span class="valor">${cobertura.pendentes}</span>
        <span class="detalhe">ainda sem registro</span>
      </div>
    </div>

    <h3 style="margin:22px 0 14px;color:var(--azul-900)">Acessos rápidos</h3>
    <div class="grid-cards">
      ${cards.map(c => `
        <button class="card-acesso" data-ir="${c.p}">
          <div class="icone ${c.cor}" aria-hidden="true">${c.ic}</div>
          <h3>${c.t}</h3>
          <p>${c.d}</p>
        </button>`).join('')}
    </div>
  `;
};

/* ============================================================
   MATRIZ DO SPAECE
   ============================================================ */
PAGINAS.matriz = function () {
  const m = matriz();
  if (!matrizDisponivel()) {
    return `
      <div class="pagina-cabecalho"><h2>📚 Matriz do SPAECE</h2>
      <p>Língua Portuguesa — 9º Ano</p></div>
      ${avisoMatrizIndisponivel()}
      ${pode('matriz') ? `<button class="btn btn-primario btn-grande" data-ir="admin-matriz">⚙️ Administrar Matriz Oficial</button>` : ''}
    `;
  }
  const habs = listarHabilidades();
  const filtro = window._filtroMatriz || {};
  const busca = (filtro.busca || '').toLowerCase();
  const lista = habs.filter(h => !busca || h.codigo.toLowerCase().includes(busca) || h.texto.toLowerCase().includes(busca));

  return `
    <div class="pagina-cabecalho">
      <h2>📚 Matriz do SPAECE</h2>
      <p>Habilidades oficiais cadastradas — ${esc(m.ano || 'ano não informado')} ${m.edicao ? '• ' + esc(m.edicao) : ''}</p>
    </div>
    <div class="alerta alerta-info">
      <span class="ic">ℹ️</span>
      <div>Fonte oficial: <strong>${esc(m.documentoOrigem || 'documento não informado')}</strong>.
      Importada em ${formatarData(m.dataImportacao)} por ${esc(m.responsavel || '—')}.
      Os textos das habilidades não são alterados pelo sistema.</div>
    </div>
    <div class="filtros">
      <div class="campo"><label for="busca-matriz">Buscar habilidade</label>
        <input id="busca-matriz" placeholder="Código ou texto…" value="${esc(filtro.busca || '')}"></div>
      <button class="btn btn-primario" id="btn-buscar-matriz">Buscar</button>
    </div>
    <div class="legenda mb">
      <span><span class="dot" style="background:var(--verde-500)"></span> Trabalhada</span>
      <span><span class="dot" style="background:var(--amarelo-500)"></span> Precisa de retomada</span>
      <span><span class="dot" style="background:var(--vermelho-500)"></span> Ainda não trabalhada</span>
    </div>
    <div class="grid-matriz">
      ${lista.map(h => {
        const st = statusHabilidade(h.id, { escolaId: sessaoAtual().escolaId });
        const nAtv = getDB().atividades.filter(a => a.habilidadeId === h.id).length;
        const nJog = getDB().jogos.filter(j => j.habilidadeId === h.id).length;
        const nSim = getDB().simulados.filter(s => (s.habilidadesIds || []).includes(h.id)).length;
        const nReg = getDB().registros.filter(r => r.habilidadeId === h.id).length;
        return `<div class="hab-card status-${st.cor}" data-hab="${h.id}">
          <div class="codigo">${esc(h.codigo)}</div>
          <div class="texto">${esc(h.texto)}</div>
          <div class="meta">
            ${badgeStatus(st.cor, st.rotulo)}
            <span class="badge badge-cinza">📝 ${nAtv}</span>
            <span class="badge badge-cinza">🎮 ${nJog}</span>
            <span class="badge badge-cinza">📋 ${nSim}</span>
            <span class="badge badge-cinza">📌 ${nReg}</span>
            ${h.link ? '<span class="badge badge-verde">🔗 material</span>' : ''}
          </div>
        </div>`;
      }).join('')}
    </div>
    ${lista.length === 0 ? vazio('🔍', 'Nenhuma habilidade encontrada', 'Ajuste a busca.') : ''}
  `;
};

function abrirDetalheHabilidade(habId) {
  const h = obterHabilidade(habId);
  if (!h) { toast('Habilidade não encontrada na Matriz Oficial.', 'erro'); return; }
  const st = statusHabilidade(h.id, { escolaId: sessaoAtual().escolaId });
  const atvs = getDB().atividades.filter(a => a.habilidadeId === h.id);
  const jogs = getDB().jogos.filter(j => j.habilidadeId === h.id);
  const sims = getDB().simulados.filter(s => (s.habilidadesIds || []).includes(h.id));
  const plns = getDB().planos.filter(p => p.habilidadeId === h.id);
  const regs = getDB().registros.filter(r => r.habilidadeId === h.id);
  const desp = calcularDesempenhoPorHabilidade({ escolaId: sessaoAtual().escolaId })[h.id];

  abrirModal(`Habilidade ${h.codigo}`, `
    <div class="alerta alerta-info"><span class="ic">📚</span>
      <div><strong>Texto oficial (não editável):</strong><br>${esc(h.texto)}</div></div>
    <div class="flex-centro mb">${badgeStatus(st.cor, st.rotulo)}</div>
    <div class="grid-kpi mb">
      <div class="kpi"><span class="rotulo">Cobertura</span><span class="valor">${st.cobertura ? '100%' : '0%'}</span>
        <span class="detalhe">${st.cobertura ? 'há registro de trabalho' : 'sem registro'}</span></div>
      <div class="kpi ${desp === null || desp === undefined ? '' : desp >= 60 ? 'verde' : 'amarelo'}">
        <span class="rotulo">Desempenho</span>
        <span class="valor">${desp === null || desp === undefined ? '—' : desp + '%'}</span>
        <span class="detalhe">${desp === null || desp === undefined ? 'sem resultados registrados' : 'resultado dos estudantes'}</span></div>
    </div>
    <div class="alerta alerta-aviso"><span class="ic">⚠️</span>
      <div><strong>Cobertura ≠ Domínio.</strong> "Trabalhada" significa que existe evidência de trabalho registrada.
      O desempenho é analisado separadamente.</div></div>
    <h4 style="margin:14px 0 8px">Conteúdos vinculados</h4>
    <p style="font-size:.88rem;color:var(--cinza-700)">
      📝 Atividades: <strong>${atvs.length}</strong> &nbsp;|&nbsp;
      🎮 Jogos: <strong>${jogs.length}</strong> &nbsp;|&nbsp;
      📋 Simulados: <strong>${sims.length}</strong> &nbsp;|&nbsp;
      📅 Planos: <strong>${plns.length}</strong> &nbsp;|&nbsp;
      📌 Registros: <strong>${regs.length}</strong>
    </p>
    ${h.link ? `<div class="alerta alerta-info mt"><span class="ic">🔗</span>
      <div><strong>Material desta habilidade disponível.</strong><br>
      <a class="btn btn-verde btn-pequeno mt" href="${esc(h.link)}" target="_blank" rel="noopener">📂 Abrir material</a></div></div>` : ''}
  `, `<button class="btn btn-contorno" onclick="fecharModal()">Fechar</button>
      ${h.link ? `<a class="btn btn-verde" href="${esc(h.link)}" target="_blank" rel="noopener">📂 Abrir material</a>` : ''}
      <button class="btn btn-primario" data-ir-modal="atividades">Ver atividades</button>`, true);
}

/* ============================================================
   ATIVIDADES — Repositório
   ============================================================ */
PAGINAS.atividades = function () {
  if (!matrizDisponivel()) return `
    <div class="pagina-cabecalho flex-entre">
      <div><h2>📝 Repositório de Atividades</h2><p>Atividades de Língua Portuguesa vinculadas às habilidades oficiais.</p></div>
      <div class="flex-centro">${botaoPastaMateriais()}${botaoAdicionarMaterial('atividades')}</div>
    </div>
    ${avisoMatrizIndisponivel()}
    ${secaoMateriaisCategoria('atividades', '📂 Materiais de Atividades (Drive)')}
    ${secaoMateriaisHabilidades('📂 Materiais de Atividades por habilidade')}`;
  const f = window._filtroAtv || {};
  let lista = listarAtividades();
  if (f.habilidadeId) lista = lista.filter(a => a.habilidadeId === f.habilidadeId);
  if (f.tipo) lista = lista.filter(a => a.tipo === f.tipo);
  if (f.dificuldade) lista = lista.filter(a => a.dificuldade === f.dificuldade);
  if (f.genero) lista = lista.filter(a => a.genero === f.genero);
  if (f.busca) { const b = f.busca.toLowerCase(); lista = lista.filter(a => a.titulo.toLowerCase().includes(b)); }

  return `
    <div class="pagina-cabecalho flex-entre">
      <div><h2>📝 Repositório de Atividades</h2><p>Atividades de Língua Portuguesa vinculadas às habilidades oficiais.</p></div>
      <div class="flex-centro">
        ${botaoPastaMateriais()}
        ${botaoAdicionarMaterial('atividades')}
        <button class="btn btn-roxo btn-grande" data-ir="ia-atividade">🤖 Criar com IA</button>
      </div>
    </div>
    <div class="filtros">
      <div class="campo"><label>Habilidade</label><select id="f-atv-hab">${opcoesHabilidades(f.habilidadeId)}</select></div>
      <div class="campo"><label>Tipo</label><select id="f-atv-tipo">
        <option value="">Todos</option>${['Atividade','Avaliação','Interpretação','Leitura','Análise linguística'].map(t=>`<option ${f.tipo===t?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="campo"><label>Dificuldade</label><select id="f-atv-dif">
        <option value="">Todas</option>${['Fácil','Média','Difícil'].map(t=>`<option ${f.dificuldade===t?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="campo"><label>Gênero textual</label><input id="f-atv-gen" value="${esc(f.genero||'')}" placeholder="Ex.: Crônica"></div>
      <div class="campo"><label>Buscar</label><input id="f-atv-busca" value="${esc(f.busca||'')}" placeholder="Título…"></div>
      <button class="btn btn-primario" id="btn-filtrar-atv">Filtrar</button>
      <button class="btn btn-contorno" id="btn-limpar-atv">Limpar</button>
    </div>
    ${secaoMateriaisCategoria('atividades', '📂 Materiais de Atividades (Drive)')}
    ${secaoMateriaisHabilidades('📂 Materiais de Atividades por habilidade')}
    ${lista.length === 0 ? vazio('📝', 'Nenhuma atividade encontrada', 'Crie uma atividade com IA ou ajuste os filtros.') : `
    <div class="grid-cards">
      ${lista.map(a => {
        const h = obterHabilidade(a.habilidadeId);
        return `<div class="card">
          <div class="flex-entre mb">
            <span class="badge badge-azul">${h ? esc(h.codigo) : '—'}</span>
            <span class="badge badge-cinza">${esc(a.dificuldade)}</span>
          </div>
          <h3>${esc(a.titulo)}</h3>
          <p style="font-size:.84rem;color:var(--cinza-500);margin-bottom:10px">${esc(a.tipo)} • ${esc(a.genero||'—')} • ${a.questoes.length} questões</p>
          ${a.origemIA ? '<span class="badge badge-roxo">🤖 IA</span>' : ''}
          <div class="flex-centro mt">
            <button class="btn btn-claro btn-pequeno" data-ver-atv="${a.id}">Ver</button>
            <button class="btn btn-contorno btn-pequeno" data-imprimir-atv="${a.id}">🖨️</button>
            <button class="btn btn-contorno btn-pequeno" data-reg-atv="${a.id}">📌 Registrar</button>
          </div>
        </div>`;
      }).join('')}
    </div>`}
  `;
};

function verAtividade(id) {
  const a = obterAtividade(id); if (!a) return;
  const h = obterHabilidade(a.habilidadeId);
  abrirModal(a.titulo, `
    ${a.origemIA ? avisoIA() : ''}
    <div class="alerta alerta-info"><span class="ic">🎯</span>
      <div><strong>Habilidade da Matriz:</strong><br>${h ? esc(h.codigo) + ' — ' + esc(h.texto) : '—'}</div></div>
    <p><strong>Objetivo:</strong> ${esc(a.objetivo)}</p>
    <p class="mt"><strong>Orientação ao professor:</strong> ${esc(a.orientacao)}</p>
    ${a.textoBase ? `<div class="texto-base mt">${esc(a.textoBase)}</div>` : ''}
    <h4 class="mt">Questões</h4>
    ${a.questoes.map((q, i) => renderQuestao(q, i)).join('')}
  `, `<button class="btn btn-contorno" onclick="fecharModal()">Fechar</button>
      <button class="btn btn-primario" onclick="window.print()">🖨️ Imprimir</button>`, true);
}

function renderQuestao(q, i) {
  return `<div class="questao">
    <div class="enunciado">${i + 1}. ${esc(q.enunciado)}</div>
    ${q.textoBase ? `<div class="texto-base">${esc(q.textoBase)}</div>` : ''}
    <ul class="alternativas">
      ${(q.alternativas || []).map(alt => {
        const letra = alt.letra || '';
        const correta = letra === q.correta;
        return `<li class="${correta ? 'correta' : ''}"><strong>${esc(letra)})</strong> ${esc(alt.texto)}</li>`;
      }).join('')}
    </ul>
    <div class="gabarito">✔ Gabarito: ${esc(q.correta)}</div>
    ${q.justificativa ? `<div class="justificativa">💡 ${esc(q.justificativa)}</div>` : ''}
  </div>`;
}

/* ============================================================
   JOGOS
   ============================================================ */
PAGINAS.jogos = function () {
  if (!matrizDisponivel()) return `
    <div class="pagina-cabecalho flex-entre">
      <div><h2>🎮 Jogos Pedagógicos</h2><p>Aprender brincando — todo jogo tem objetivo pedagógico e habilidade oficial.</p></div>
      <div class="flex-centro">${botaoPastaMateriais()}${botaoAdicionarMaterial('jogos')}</div>
    </div>
    ${avisoMatrizIndisponivel()}
    ${secaoMateriaisCategoria('jogos', '📂 Materiais de Jogos (Drive)')}
    ${secaoMateriaisHabilidades('📂 Materiais de Jogos por habilidade')}`;
  const lista = listarJogos();
  return `
    <div class="pagina-cabecalho flex-entre">
      <div><h2>🎮 Jogos Pedagógicos</h2><p>Aprender brincando — todo jogo tem objetivo pedagógico e habilidade oficial.</p></div>
      <div class="flex-centro">
        ${botaoPastaMateriais()}
        ${botaoAdicionarMaterial('jogos')}
        <button class="btn btn-roxo btn-grande" data-ir="ia-jogo">🤖 Criar jogo com IA</button>
      </div>
    </div>
    ${secaoMateriaisCategoria('jogos', '📂 Materiais de Jogos (Drive)')}
    ${secaoMateriaisHabilidades('📂 Materiais de Jogos por habilidade')}
    ${lista.length === 0 ? vazio('🎮', 'Nenhum jogo cadastrado', 'Crie um jogo pedagógico vinculado a uma habilidade oficial.') : `
    <div class="grid-cards">
      ${lista.map(j => {
        const h = obterHabilidade(j.habilidadeId);
        return `<div class="card">
          <div class="flex-entre mb"><span class="badge badge-amarelo">${esc(j.tipo)}</span>
            <span class="badge badge-azul">${h ? esc(h.codigo) : '—'}</span></div>
          <h3>${esc(j.titulo)}</h3>
          <p style="font-size:.84rem;color:var(--cinza-500)">${esc(j.objetivo)}</p>
          <div class="flex-centro mt">
            <button class="btn btn-claro btn-pequeno" data-ver-jogo="${j.id}">Ver</button>
            <button class="btn btn-contorno btn-pequeno" data-reg-jogo="${j.id}">📌 Registrar</button>
          </div>
        </div>`;
      }).join('')}
    </div>`}
  `;
};

function verJogo(id) {
  const j = getDB().jogos.find(x => x.id === id); if (!j) return;
  const h = obterHabilidade(j.habilidadeId);
  abrirModal(j.titulo, `
    ${j.origemIA ? avisoIA() : ''}
    <div class="alerta alerta-info"><span class="ic">🎯</span>
      <div><strong>Habilidade da Matriz:</strong><br>${h ? esc(h.codigo) + ' — ' + esc(h.texto) : '—'}</div></div>
    <p><strong>Tipo:</strong> ${esc(j.tipo)}</p>
    <p class="mt"><strong>Objetivo pedagógico:</strong> ${esc(j.objetivo)}</p>
    <p class="mt"><strong>Regras:</strong> ${esc(j.regras)}</p>
    <p class="mt"><strong>Materiais:</strong> ${esc(j.materiais)}</p>
  `, `<button class="btn btn-contorno" onclick="fecharModal()">Fechar</button>`, true);
}

/* ============================================================
   SIMULADOS
   ============================================================ */
PAGINAS.simulados = function () {
  if (!matrizDisponivel()) return `
    <div class="pagina-cabecalho flex-entre">
      <div><h2>📋 Simulados Pedagógicos</h2><p>Prepare sua turma. Simulados são ferramentas pedagógicas — não são provas oficiais do SPAECE.</p></div>
      <div class="flex-centro">${botaoPastaMateriais()}${botaoAdicionarMaterial('simulados')}</div>
    </div>
    ${avisoMatrizIndisponivel()}
    ${secaoMateriaisCategoria('simulados', '📂 Materiais de Simulados (Drive)')}
    ${secaoMateriaisHabilidades('📂 Materiais de Simulados por habilidade')}`;
  const lista = listarSimulados();
  return `
    <div class="pagina-cabecalho flex-entre">
      <div><h2>📋 Simulados Pedagógicos</h2><p>Prepare sua turma. Simulados são ferramentas pedagógicas — não são provas oficiais do SPAECE.</p></div>
      <div class="flex-centro">
        ${botaoPastaMateriais()}
        ${botaoAdicionarMaterial('simulados')}
        <button class="btn btn-primario btn-grande" id="btn-novo-simulado">➕ Gerar Simulado</button>
      </div>
    </div>
    <div class="alerta alerta-aviso"><span class="ic">⚠️</span>
      <div>Todo simulado criado aqui é identificado como <strong>SIMULADO PEDAGÓGICO</strong>.
      Não reproduzimos questões oficiais protegidas por direitos autorais.</div></div>
    ${secaoMateriaisCategoria('simulados', '📂 Materiais de Simulados (Drive)')}
    ${secaoMateriaisHabilidades('📂 Materiais de Simulados por habilidade')}
    ${lista.length === 0 ? vazio('📋', 'Nenhum simulado gerado', 'Gere um simulado selecionando habilidades oficiais.') : `
    <div class="grid-cards">
      ${lista.map(s => `<div class="card">
        <div class="flex-entre mb"><span class="badge badge-roxo">SIMULADO PEDAGÓGICO</span>
          <span class="badge badge-cinza">${s.questoes.length} questões</span></div>
        <h3>${esc(s.titulo)}</h3>
        <p style="font-size:.84rem;color:var(--cinza-500)">${s.habilidadesIds.length} habilidade(s) • ${esc(s.dificuldade)} • ${formatarData(s.data)}</p>
        <div class="flex-centro mt">
          <button class="btn btn-claro btn-pequeno" data-ver-sim="${s.id}">Ver</button>
          <button class="btn btn-verde btn-pequeno" data-res-sim="${s.id}">📊 Registrar resultado</button>
        </div>
      </div>`).join('')}
    </div>`}
  `;
};

function modalNovoSimulado() {
  abrirModal('Gerar Simulado Pedagógico', `
    <div class="campo"><label>Título</label><input id="sim-titulo" placeholder="Ex.: Simulado Diagnóstico — 1º Bimestre"></div>
    <div class="campo"><label>Habilidades (selecione uma ou mais)</label>
      <select id="sim-habs" multiple size="6" style="height:auto">${listarHabilidades().map(h=>`<option value="${h.id}">${esc(h.codigo)} — ${esc(h.texto.slice(0,60))}</option>`).join('')}</select>
      <div class="ajuda">Use Ctrl/Cmd para selecionar várias.</div></div>
    <div class="campo-linha">
      <div class="campo"><label>Quantidade de questões</label><input type="number" id="sim-qtd" value="10" min="1" max="30"></div>
      <div class="campo"><label>Dificuldade</label><select id="sim-dif"><option>Mista</option><option>Fácil</option><option>Média</option><option>Difícil</option></select></div>
    </div>
    <div class="campo"><label>Turma</label><input id="sim-turma" placeholder="Ex.: 9º A"></div>
  `, `<button class="btn btn-contorno" onclick="fecharModal()">Cancelar</button>
      <button class="btn btn-primario" id="btn-gerar-sim">Gerar</button>`);
}

function gerarSimulado() {
  const titulo = document.getElementById('sim-titulo').value.trim() || 'Simulado Pedagógico';
  const habs = Array.from(document.getElementById('sim-habs').selectedOptions).map(o => o.value);
  const qtd = parseInt(document.getElementById('sim-qtd').value, 10) || 10;
  const dif = document.getElementById('sim-dif').value;
  const turma = document.getElementById('sim-turma').value.trim();
  if (!habs.length) { toast('Selecione ao menos uma habilidade oficial.', 'erro'); return; }

  // Monta questões a partir do banco (somente questões vinculadas às habilidades escolhidas)
  let pool = getDB().questoes.filter(q => habs.includes(q.habilidadeId));
  const questoes = [];
  for (let i = 0; i < qtd; i++) {
    const habId = habs[i % habs.length];
    const h = obterHabilidade(habId);
    const doBanco = pool.filter(q => q.habilidadeId === habId);
    if (doBanco.length) {
      const q = doBanco[i % doBanco.length];
      questoes.push({ ...q, habilidadeId: habId });
    } else {
      // Gera questão de apoio vinculada à habilidade oficial (identificada como IA)
      const g = IA.gerarAtividade({ habilidadeId: habId, qtd: 1, dificuldade: dif === 'Mista' ? 'Média' : dif });
      if (g.erro) continue;
      questoes.push({ ...g.atividade.questoes[0], habilidadeId: habId, origemIA: true });
    }
  }
  const s = salvarSimulado({ titulo, habilidadesIds: habs, questoes, dificuldade: dif, turma });
  fecharModal();
  toast('Simulado gerado com sucesso!');
  renderPagina('simulados');
}

function verSimulado(id) {
  const s = obterSimulado(id); if (!s) return;
  abrirModal(s.titulo, `
    <div class="alerta alerta-aviso"><span class="ic">📋</span><div><strong>SIMULADO PEDAGÓGICO</strong> — não é prova oficial do SPAECE.</div></div>
    <p><strong>Habilidades:</strong> ${s.habilidadesIds.map(id => { const h = obterHabilidade(id); return h ? esc(h.codigo) : ''; }).join(', ')}</p>
    <h4 class="mt">Questões</h4>
    ${s.questoes.map((q, i) => renderQuestao(q, i)).join('')}
  `, `<button class="btn btn-contorno" onclick="fecharModal()">Fechar</button>
      <button class="btn btn-primario" onclick="window.print()">🖨️ Imprimir</button>`, true);
}

function modalResultadoSimulado(simId) {
  const s = obterSimulado(simId); if (!s) return;
  abrirModal('Registrar Resultado — ' + s.titulo, `
    <div class="campo-linha">
      <div class="campo"><label>Turma</label><input id="res-turma" value="${esc(s.turma||'')}"></div>
      <div class="campo"><label>Data</label><input type="date" id="res-data" value="${new Date().toISOString().slice(0,10)}"></div>
    </div>
    <p style="font-size:.86rem;color:var(--cinza-500)">Informe os acertos por habilidade (total de acertos / total de questões da habilidade).</p>
    ${s.habilidadesIds.map(id => {
      const h = obterHabilidade(id);
      const nQ = s.questoes.filter(q => q.habilidadeId === id).length;
      return `<div class="campo-linha">
        <div class="campo"><label>${h ? esc(h.codigo) : id} — acertos</label><input type="number" class="res-acerto" data-hab="${id}" min="0" value="0"></div>
        <div class="campo"><label>Total de questões</label><input type="number" class="res-total" data-hab="${id}" min="0" value="${nQ}"></div>
      </div>`;
    }).join('')}
  `, `<button class="btn btn-contorno" onclick="fecharModal()">Cancelar</button>
      <button class="btn btn-verde" id="btn-salvar-res" data-sim="${simId}">Salvar resultado</button>`);
}

function salvarResultadoSimulado(simId) {
  const s = obterSimulado(simId);
  const turma = document.getElementById('res-turma').value.trim();
  const data = document.getElementById('res-data').value;
  const porHabilidade = {}; let acertos = 0, total = 0;
  document.querySelectorAll('.res-acerto').forEach(inp => {
    const hab = inp.dataset.hab;
    const a = parseInt(inp.value, 10) || 0;
    const t = parseInt(document.querySelector(`.res-total[data-hab="${hab}"]`).value, 10) || 0;
    porHabilidade[hab] = { acertos: a, total: t };
    acertos += a; total += t;
  });
  salvarResultado({ simuladoId: simId, escolaId: sessaoAtual().escolaId, turma, data, porHabilidade, acertos, total });
  fecharModal(); toast('Resultado registrado!'); renderPagina('resultados');
}

/* ============================================================
   IA — CRIAR ATIVIDADE
   ============================================================ */
PAGINAS['ia-atividade'] = function () {
  if (!matrizDisponivel()) return `<div class="pagina-cabecalho"><h2>🤖 Criar Atividade com IA</h2></div>${avisoMatrizIndisponivel()}`;
  return `
    <div class="pagina-cabecalho"><h2>🤖 Criar Atividade com IA</h2>
      <p>Crie uma atividade personalizada vinculada a uma habilidade oficial.</p></div>
    <div class="ia-caixa">
      <div class="cab">🤖 Assistente Pedagógico</div>
      <p style="font-size:.88rem">A IA auxilia o planejamento e a criação de sugestões. Ela <strong>não substitui o professor</strong> e
      <strong>nunca inventa habilidades</strong>. Todo conteúdo é gerado a partir da habilidade oficial selecionada e deve ser revisado.</p>
    </div>
    <div class="card">
      <div class="campo"><label>Habilidade oficial *</label><select id="ia-atv-hab">${opcoesHabilidades()}</select></div>
      <div class="campo-linha">
        <div class="campo"><label>Tipo de atividade</label><select id="ia-atv-tipo">
          <option>Atividade</option><option>Avaliação</option><option>Interpretação</option><option>Leitura</option><option>Análise linguística</option></select></div>
        <div class="campo"><label>Quantidade de questões</label><input type="number" id="ia-atv-qtd" value="5" min="1" max="10"></div>
      </div>
      <div class="campo-linha">
        <div class="campo"><label>Dificuldade</label><select id="ia-atv-dif"><option>Fácil</option><option selected>Média</option><option>Difícil</option></select></div>
        <div class="campo"><label>Gênero textual</label><input id="ia-atv-gen" placeholder="Ex.: Crônica, Notícia…"></div>
      </div>
      <div class="campo"><label>Contexto / tema</label><input id="ia-atv-ctx" placeholder="Ex.: meio ambiente, cotidiano escolar…"></div>
      <div class="campo"><label>Objetivo (opcional)</label><textarea id="ia-atv-obj" placeholder="Deixe em branco para a IA sugerir."></textarea></div>
      <div class="campo"><label>Turma</label><input id="ia-atv-turma" placeholder="Ex.: 9º A"></div>
      <button class="btn btn-roxo btn-grande btn-bloco" id="btn-ia-gerar-atv">🤖 Gerar Atividade</button>
    </div>
    <div id="ia-atv-resultado" class="mt"></div>
  `;
};

function gerarAtividadeIA() {
  const opts = {
    habilidadeId: document.getElementById('ia-atv-hab').value,
    tipo: document.getElementById('ia-atv-tipo').value,
    qtd: document.getElementById('ia-atv-qtd').value,
    dificuldade: document.getElementById('ia-atv-dif').value,
    genero: document.getElementById('ia-atv-gen').value,
    contexto: document.getElementById('ia-atv-ctx').value,
    objetivo: document.getElementById('ia-atv-obj').value,
    turma: document.getElementById('ia-atv-turma').value
  };
  if (!opts.habilidadeId) { toast('Selecione uma habilidade oficial.', 'erro'); return; }
  const r = IA.gerarAtividade(opts);
  if (r.erro === 'matriz') { document.getElementById('ia-atv-resultado').innerHTML = avisoMatrizIndisponivel(); return; }
  if (r.erro === 'habilidade') { document.getElementById('ia-atv-resultado').innerHTML = avisoHabilidadeNaoEncontrada(); return; }
  const a = r.atividade; const h = r.habilidade;
  window._iaAtvGerada = a;
  document.getElementById('ia-atv-resultado').innerHTML = `
    <div class="card">
      ${avisoIA()}
      <div class="alerta alerta-info"><span class="ic">🎯</span>
        <div><strong>Habilidade da Matriz:</strong><br>${esc(h.codigo)} — ${esc(h.texto)}</div></div>
      <h3>${esc(a.titulo)}</h3>
      <p><strong>Objetivo:</strong> ${esc(a.objetivo)}</p>
      <p class="mt"><strong>Orientação ao professor:</strong> ${esc(a.orientacao)}</p>
      ${a.textoBase ? `<div class="texto-base mt">${esc(a.textoBase)}</div>` : ''}
      <h4 class="mt">Questões</h4>
      ${a.questoes.map((q, i) => renderQuestao(q, i)).join('')}
      <div class="flex-centro mt">
        <button class="btn btn-verde" id="btn-ia-salvar-atv">💾 Salvar no repositório</button>
        <button class="btn btn-contorno" onclick="window.print()">🖨️ Imprimir</button>
      </div>
    </div>`;
}

/* ============================================================
   IA — CRIAR PLANO
   ============================================================ */
PAGINAS['ia-plano'] = function () {
  if (!matrizDisponivel()) return `<div class="pagina-cabecalho"><h2>🤖📅 Criar Plano com IA</h2></div>${avisoMatrizIndisponivel()}`;
  return `
    <div class="pagina-cabecalho"><h2>🤖📅 Criar Plano com IA</h2>
      <p>Planeje sua aula a partir de uma habilidade oficial.</p></div>
    <div class="ia-caixa">
      <div class="cab">🤖 Assistente Pedagógico</div>
      <p style="font-size:.88rem">O plano é uma sugestão. Revise, adapte à sua turma e registre a aplicação. A IA não altera a Matriz.</p>
    </div>
    <div class="card">
      <div class="campo"><label>Habilidade oficial *</label><select id="ia-pln-hab">${opcoesHabilidades()}</select></div>
      <div class="campo-linha">
        <div class="campo"><label>Turma</label><input id="ia-pln-turma" placeholder="Ex.: 9º A"></div>
        <div class="campo"><label>Duração</label><input id="ia-pln-dur" placeholder="Ex.: 2 aulas"></div>
      </div>
      <div class="campo"><label>Objetivo (opcional)</label><textarea id="ia-pln-obj"></textarea></div>
      <div class="campo"><label>Contexto</label><input id="ia-pln-ctx" placeholder="Ex.: turma com dificuldade em inferência"></div>
      <div class="campo"><label>Recursos disponíveis</label><input id="ia-pln-rec" placeholder="Ex.: projetor, textos impressos"></div>
      <div class="campo"><label>Características da turma</label><input id="ia-pln-car" placeholder="Ex.: heterogênea, 32 estudantes"></div>
      <div class="campo"><label>Metodologia desejada</label><input id="ia-pln-met" placeholder="Ex.: sequência didática, sala de aula invertida"></div>
      <button class="btn btn-roxo btn-grande btn-bloco" id="btn-ia-gerar-pln">🤖 Gerar Plano</button>
    </div>
    <div id="ia-pln-resultado" class="mt"></div>
  `;
};

function gerarPlanoIA() {
  const opts = {
    habilidadeId: document.getElementById('ia-pln-hab').value,
    turma: document.getElementById('ia-pln-turma').value,
    duracao: document.getElementById('ia-pln-dur').value,
    objetivo: document.getElementById('ia-pln-obj').value,
    contexto: document.getElementById('ia-pln-ctx').value,
    recursos: document.getElementById('ia-pln-rec').value,
    caracteristicas: document.getElementById('ia-pln-car').value,
    metodologia: document.getElementById('ia-pln-met').value
  };
  if (!opts.habilidadeId) { toast('Selecione uma habilidade oficial.', 'erro'); return; }
  const r = IA.gerarPlano(opts);
  if (r.erro === 'matriz') { document.getElementById('ia-pln-resultado').innerHTML = avisoMatrizIndisponivel(); return; }
  if (r.erro === 'habilidade') { document.getElementById('ia-pln-resultado').innerHTML = avisoHabilidadeNaoEncontrada(); return; }
  const p = r.plano; const h = r.habilidade; const c = p.conteudo;
  window._iaPlanoGerado = p;
  const bloco = (t, v) => v ? `<p class="mt"><strong>${t}:</strong><br>${esc(v).replace(/\n/g, '<br>')}</p>` : '';
  document.getElementById('ia-pln-resultado').innerHTML = `
    <div class="card">
      ${avisoIA()}
      <div class="alerta alerta-info"><span class="ic">🎯</span>
        <div><strong>Habilidade da Matriz:</strong><br>${esc(h.codigo)} — ${esc(h.texto)}</div></div>
      <h3>${esc(p.titulo)}</h3>
      ${bloco('Identificação', c.identificacao)}
      ${bloco('Objetivo', c.objetivo)}
      ${bloco('Conhecimentos prévios', c.conhecimentosPrevios)}
      ${bloco('Desenvolvimento', c.desenvolvimento)}
      ${bloco('Metodologia', c.metodologia)}
      ${bloco('Atividades', c.atividades)}
      ${bloco('Recursos', c.recursos)}
      ${bloco('Avaliação', c.avaliacao)}
      ${bloco('Intervenção', c.intervencao)}
      ${bloco('Retomada', c.retomada)}
      ${bloco('Atividade complementar', c.atividadeComplementar)}
      <div class="flex-centro mt">
        <button class="btn btn-verde" id="btn-ia-salvar-pln">💾 Salvar plano</button>
        <button class="btn btn-contorno" onclick="window.print()">🖨️ Imprimir</button>
      </div>
    </div>`;
}

/* ============================================================
   IA — CRIAR JOGO
   ============================================================ */
PAGINAS['ia-jogo'] = function () {
  if (!matrizDisponivel()) return `<div class="pagina-cabecalho"><h2>🤖 Criar Jogo com IA</h2></div>${avisoMatrizIndisponivel()}`;
  return `
    <div class="pagina-cabecalho"><h2>🤖 Criar Jogo com IA</h2><p>Jogos pedagógicos vinculados a habilidades oficiais.</p></div>
    <div class="card">
      <div class="campo"><label>Habilidade oficial *</label><select id="ia-jgo-hab">${opcoesHabilidades()}</select></div>
      <div class="campo"><label>Tipo de jogo</label><select id="ia-jgo-tipo">
        ${['Quiz','Verdadeiro ou Falso','Associação','Caça ao erro','Completar','Cartas','Trilha','Desafio em equipe','Perguntas rápidas'].map(t=>`<option>${t}</option>`).join('')}</select></div>
      <button class="btn btn-roxo btn-grande btn-bloco" id="btn-ia-gerar-jgo">🤖 Gerar Jogo</button>
    </div>
    <div id="ia-jgo-resultado" class="mt"></div>`;
};

function gerarJogoIA() {
  const opts = { habilidadeId: document.getElementById('ia-jgo-hab').value, tipo: document.getElementById('ia-jgo-tipo').value };
  if (!opts.habilidadeId) { toast('Selecione uma habilidade oficial.', 'erro'); return; }
  const r = IA.gerarJogo(opts);
  if (r.erro) { document.getElementById('ia-jgo-resultado').innerHTML = r.erro === 'matriz' ? avisoMatrizIndisponivel() : avisoHabilidadeNaoEncontrada(); return; }
  const j = r.jogo; const h = r.habilidade; window._iaJogoGerado = j;
  document.getElementById('ia-jgo-resultado').innerHTML = `
    <div class="card">${avisoIA()}
      <div class="alerta alerta-info"><span class="ic">🎯</span><div><strong>Habilidade da Matriz:</strong><br>${esc(h.codigo)} — ${esc(h.texto)}</div></div>
      <h3>${esc(j.titulo)}</h3>
      <p class="mt"><strong>Objetivo pedagógico:</strong> ${esc(j.objetivo)}</p>
      <p class="mt"><strong>Regras:</strong> ${esc(j.regras)}</p>
      <p class="mt"><strong>Materiais:</strong> ${esc(j.materiais)}</p>
      <button class="btn btn-verde mt" id="btn-ia-salvar-jgo">💾 Salvar jogo</button>
    </div>`;
}

/* ============================================================
   MINHAS HABILIDADES
   ============================================================ */
PAGINAS['minhas-habilidades'] = function () {
  if (!matrizDisponivel()) return `<div class="pagina-cabecalho"><h2>🎯 Minhas Habilidades</h2></div>${avisoMatrizIndisponivel()}`;
  const s = sessaoAtual();
  const f = window._filtroMinhas || {};
  const filtro = { escolaId: s.escolaId, professorId: s.perfil === 'professor' ? s.id : null, turma: f.turma, anoLetivo: f.anoLetivo };
  const habs = listarHabilidades();
  const desp = calcularDesempenhoPorHabilidade(filtro);
  let lista = habs.map(h => ({ h, st: statusHabilidade(h.id, filtro), desp: desp[h.id] }));
  if (f.status) lista = lista.filter(x => x.st.cor === f.status);

  const cobertura = calcularCobertura(filtro);
  return `
    <div class="pagina-cabecalho"><h2>🎯 Minhas Habilidades</h2>
      <p>Acompanhe o que já foi trabalhado. Cobertura e desempenho são indicadores diferentes.</p></div>
    <div class="grid-kpi mb">
      <div class="kpi verde"><span class="rotulo">Trabalhadas</span><span class="valor">${lista.filter(x=>x.st.cobertura).length}</span></div>
      <div class="kpi vermelho"><span class="rotulo">Não trabalhadas</span><span class="valor">${lista.filter(x=>!x.st.cobertura).length}</span></div>
      <div class="kpi amarelo"><span class="rotulo">Precisam de retomada</span><span class="valor">${lista.filter(x=>x.st.cor==='amarelo').length}</span></div>
      <div class="kpi"><span class="rotulo">Cobertura</span><span class="valor">${cobertura.percentual}%</span></div>
    </div>
    <div class="filtros">
      <div class="campo"><label>Turma</label><select id="mh-turma">${opcoesTurmas(f.turma)}</select></div>
      <div class="campo"><label>Status</label><select id="mh-status">
        <option value="">Todos</option>
        <option value="verde" ${f.status==='verde'?'selected':''}>Trabalhada</option>
        <option value="amarelo" ${f.status==='amarelo'?'selected':''}>Precisa de retomada</option>
        <option value="vermelho" ${f.status==='vermelho'?'selected':''}>Não trabalhada</option></select></div>
      <button class="btn btn-primario" id="btn-filtrar-mh">Filtrar</button>
    </div>
    <div class="tabela-wrap">
      <table class="tabela">
        <thead><tr><th>Código</th><th>Habilidade</th><th>Status</th><th>Cobertura</th><th>Desempenho</th><th>Ações</th></tr></thead>
        <tbody>
          ${lista.map(x => `<tr>
            <td><strong>${esc(x.h.codigo)}</strong></td>
            <td style="max-width:420px">${esc(x.h.texto)}</td>
            <td>${badgeStatus(x.st.cor, x.st.rotulo)}</td>
            <td>${x.st.cobertura ? '✅ Sim' : '— Não'}</td>
            <td>${x.desp === null || x.desp === undefined ? '—' : x.desp + '%'}</td>
            <td><button class="btn btn-claro btn-pequeno" data-hab="${x.h.id}">Detalhes</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
};

/* ============================================================
   RESULTADOS
   ============================================================ */
PAGINAS.resultados = function () {
  if (!matrizDisponivel()) return `<div class="pagina-cabecalho"><h2>📊 Resultados</h2></div>${avisoMatrizIndisponivel()}`;
  const s = sessaoAtual();
  const filtro = { escolaId: s.escolaId };
  const desp = calcularDesempenhoPorHabilidade(filtro);
  const habs = listarHabilidades();
  const comDesp = habs.filter(h => desp[h.id] !== undefined && desp[h.id] !== null)
    .map(h => ({ rotulo: h.codigo, valor: desp[h.id] })).sort((a, b) => b.valor - a.valor);
  const resultados = getDB().resultados.filter(r => !s.escolaId || r.escolaId === s.escolaId);

  return `
    <div class="pagina-cabecalho"><h2>📊 Resultados</h2><p>Desempenho dos estudantes nas atividades avaliativas e simulados.</p></div>
    ${resultados.length === 0 ? vazio('📊', 'AINDA NÃO HÁ DADOS REGISTRADOS', 'Registre resultados de simulados para visualizar o desempenho.') : `
    <div class="card mb"><h3>Desempenho por Habilidade</h3>${graficoBarras(comDesp)}</div>
    <div class="tabela-wrap">
      <table class="tabela">
        <thead><tr><th>Data</th><th>Turma</th><th>Simulado</th><th>Acertos</th><th>Total</th><th>%</th></tr></thead>
        <tbody>${resultados.map(r => {
          const sim = r.simuladoId ? obterSimulado(r.simuladoId) : null;
          const pct = r.total ? Math.round((r.acertos / r.total) * 100) : 0;
          return `<tr><td>${formatarData(r.data)}</td><td>${esc(r.turma)}</td>
            <td>${sim ? esc(sim.titulo) : '—'}</td><td>${r.acertos}</td><td>${r.total}</td>
            <td><span class="badge ${pct>=60?'badge-verde':'badge-amarelo'}">${pct}%</span></td></tr>`;
        }).join('')}</tbody>
      </table>
    </div>`}
  `;
};

/* ============================================================
   EVOLUÇÃO
   ============================================================ */
PAGINAS.evolucao = function () {
  const s = sessaoAtual();
  const regs = getDB().registros.filter(r => !s.escolaId || r.escolaId === s.escolaId);
  if (!regs.length) return `<div class="pagina-cabecalho"><h2>📈 Evolução</h2></div>${vazio('📈','AINDA NÃO HÁ DADOS REGISTRADOS','Registre atividades para acompanhar a evolução ao longo do tempo.')}`;
  // Agrupa registros por mês
  const porMes = {};
  regs.forEach(r => { const m = (r.data || '').slice(0, 7); if (m) porMes[m] = (porMes[m] || 0) + 1; });
  const meses = Object.keys(porMes).sort();
  const pontos = meses.map(m => ({ rotulo: m.slice(5) + '/' + m.slice(2, 4), valor: porMes[m] }));
  const maxV = Math.max(...pontos.map(p => p.valor), 1);
  const pontosPct = pontos.map(p => ({ rotulo: p.rotulo, valor: Math.round((p.valor / maxV) * 100) }));

  return `
    <div class="pagina-cabecalho"><h2>📈 Evolução</h2><p>Acompanhe o progresso do trabalho ao longo do tempo.</p></div>
    <div class="card mb"><h3>Registros de trabalho por mês</h3>${graficoLinha(pontosPct)}</div>
    <div class="grid-kpi">
      <div class="kpi"><span class="rotulo">Total de registros</span><span class="valor">${regs.length}</span></div>
      <div class="kpi verde"><span class="rotulo">Meses com atividade</span><span class="valor">${meses.length}</span></div>
      <div class="kpi amarelo"><span class="rotulo">Média por mês</span><span class="valor">${Math.round(regs.length / Math.max(meses.length,1))}</span></div>
    </div>`;
};

/* ============================================================
   CALENDÁRIO
   ============================================================ */
PAGINAS.calendario = function () {
  const hoje = new Date();
  const ano = window._calAno || hoje.getFullYear();
  const mes = window._calMes !== undefined ? window._calMes : hoje.getMonth();
  const nomesMes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const primeiro = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const eventos = listarEventos();
  const evPorDia = {};
  eventos.forEach(e => { if (e.data) { const d = e.data.slice(0, 10); (evPorDia[d] = evPorDia[d] || []).push(e); } });

  let celulas = '';
  for (let i = 0; i < primeiro; i++) celulas += '<div class="cal-dia vazio"></div>';
  for (let d = 1; d <= diasNoMes; d++) {
    const iso = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const evs = evPorDia[iso] || [];
    const ehHoje = iso === hoje.toISOString().slice(0, 10);
    celulas += `<div class="cal-dia ${ehHoje ? 'hoje' : ''} ${evs.length ? 'tem-evento' : ''}" data-dia="${iso}">
      <div class="num">${d}</div>
      ${evs.slice(0, 2).map(e => `<span class="ev" title="${esc(e.titulo)}">${esc(e.tipo)}: ${esc(e.titulo)}</span>`).join('')}
      ${evs.length > 2 ? `<span class="ev">+${evs.length - 2}</span>` : ''}
    </div>`;
  }

  return `
    <div class="pagina-cabecalho flex-entre">
      <div><h2>📅 Calendário Pedagógico</h2><p>Organize seu trabalho. Clique em uma data para registrar.</p></div>
      <button class="btn btn-primario" id="btn-novo-evento">➕ Novo registro</button>
    </div>
    <div class="card">
      <div class="flex-entre mb">
        <button class="btn btn-contorno btn-pequeno" id="cal-prev">‹ Anterior</button>
        <h3 style="margin:0">${nomesMes[mes]} ${ano}</h3>
        <button class="btn btn-contorno btn-pequeno" id="cal-next">Próximo ›</button>
      </div>
      <div class="cal-grid">
        ${['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => `<div class="cal-cab">${d}</div>`).join('')}
        ${celulas}
      </div>
    </div>`;
};

function modalNovoEvento(dataPre) {
  abrirModal('Novo Registro no Calendário', `
    <div class="campo-linha">
      <div class="campo"><label>Data</label><input type="date" id="ev-data" value="${dataPre || new Date().toISOString().slice(0,10)}"></div>
      <div class="campo"><label>Tipo</label><select id="ev-tipo">
        ${['Aula','Atividade','Jogo','Avaliação','Simulado','Retomada'].map(t=>`<option>${t}</option>`).join('')}</select></div>
    </div>
    <div class="campo"><label>Título</label><input id="ev-titulo" placeholder="Ex.: Trabalho com habilidade X"></div>
    <div class="campo"><label>Habilidade (opcional)</label><select id="ev-hab">${opcoesHabilidades()}</select></div>
    <div class="campo"><label>Turma</label><input id="ev-turma" placeholder="Ex.: 9º A"></div>
    <div class="campo"><label>Observações</label><textarea id="ev-obs"></textarea></div>
  `, `<button class="btn btn-contorno" onclick="fecharModal()">Cancelar</button>
      <button class="btn btn-primario" id="btn-salvar-evento">Salvar</button>`);
}

/* ============================================================
   REGISTRO DE ATIVIDADE (Evidência)
   ============================================================ */
function modalRegistro(pre) {
  pre = pre || {};
  if (!matrizDisponivel()) { toast('Cadastre a Matriz Oficial antes de registrar.', 'erro'); return; }
  const s = sessaoAtual();
  abrirModal('📌 Registrar Trabalho Pedagógico', `
    <div class="alerta alerta-info"><span class="ic">📌</span>
      <div>Registrar cria uma <strong>evidência pedagógica</strong> e atualiza a cobertura da Matriz. Cobertura não significa domínio.</div></div>
    <div class="campo-linha">
      <div class="campo"><label>Escola</label><select id="reg-escola">${opcoesEscolas(pre.escolaId || s.escolaId, s.perfil !== 'admin' && s.perfil !== 'tecnico')}</select></div>
      <div class="campo"><label>Turma</label><input id="reg-turma" value="${esc(pre.turma||'')}" placeholder="Ex.: 9º A"></div>
    </div>
    <div class="campo-linha">
      <div class="campo"><label>Data</label><input type="date" id="reg-data" value="${new Date().toISOString().slice(0,10)}"></div>
      <div class="campo"><label>Tipo de recurso</label><select id="reg-recurso">
        ${['Atividade','Jogo','Simulado','Avaliação','Plano','Retomada'].map(t=>`<option ${pre.recurso===t?'selected':''}>${t}</option>`).join('')}</select></div>
    </div>
    <div class="campo"><label>Habilidade oficial *</label><select id="reg-hab">${opcoesHabilidades(pre.habilidadeId)}</select></div>
    <div class="campo-linha">
      <div class="campo"><label>Quantidade de estudantes</label><input type="number" id="reg-qtd" min="0" value="0"></div>
      <div class="campo"><label>Resultado (opcional, %)</label><input type="number" id="reg-res" min="0" max="100" placeholder="Ex.: 62"></div>
    </div>
    <div class="campo"><label>Observações</label><textarea id="reg-obs" placeholder="Como foi a aplicação? O que observar?"></textarea></div>
  `, `<button class="btn btn-contorno" onclick="fecharModal()">Cancelar</button>
      <button class="btn btn-verde" id="btn-salvar-registro">Salvar registro</button>`);
}

function salvarRegistroForm() {
  const habId = document.getElementById('reg-hab').value;
  if (!habId) { toast('Selecione uma habilidade oficial.', 'erro'); return; }
  if (!obterHabilidade(habId)) { toast('Habilidade não localizada na Matriz Oficial.', 'erro'); return; }
  const res = document.getElementById('reg-res').value;
  salvarRegistro({
    escolaId: document.getElementById('reg-escola').value,
    turma: document.getElementById('reg-turma').value.trim(),
    data: document.getElementById('reg-data').value,
    recurso: document.getElementById('reg-recurso').value,
    habilidadeId: habId,
    qtdEstudantes: parseInt(document.getElementById('reg-qtd').value, 10) || 0,
    resultado: res ? { percentual: parseInt(res, 10) } : null,
    observacoes: document.getElementById('reg-obs').value.trim()
  });
  fecharModal(); toast('Registro salvo! Indicadores atualizados.');
  renderPagina(window._paginaAtual);
}

/* ============================================================
   EVIDÊNCIAS
   ============================================================ */
PAGINAS.evidencias = function () {
  const s = sessaoAtual();
  let regs = getDB().registros;
  if (s.escolaId) regs = regs.filter(r => r.escolaId === s.escolaId);
  if (s.perfil === 'professor') regs = regs.filter(r => r.professorId === s.id);
  return `
    <div class="pagina-cabecalho flex-entre">
      <div><h2>📌 Evidências Pedagógicas</h2><p>Registros reais do trabalho pedagógico realizado.</p></div>
      <button class="btn btn-verde btn-grande" id="btn-nova-evidencia">➕ Registrar trabalho</button>
    </div>
    ${regs.length === 0 ? vazio('📌','AINDA NÃO HÁ DADOS REGISTRADOS','Registre o trabalho realizado com as habilidades da Matriz.') : `
    <div class="tabela-wrap">
      <table class="tabela">
        <thead><tr><th>Data</th><th>Escola</th><th>Turma</th><th>Habilidade</th><th>Recurso</th><th>Estudantes</th><th>Resultado</th><th>Professor</th></tr></thead>
        <tbody>${regs.map(r => {
          const h = obterHabilidade(r.habilidadeId); const e = obterEscola(r.escolaId);
          return `<tr><td>${formatarData(r.data)}</td><td>${e?esc(e.nome):'—'}</td><td>${esc(r.turma)}</td>
            <td>${h?esc(h.codigo):'—'}</td><td>${esc(r.recurso)}</td><td>${r.qtdEstudantes}</td>
            <td>${r.resultado && r.resultado.percentual !== undefined ? r.resultado.percentual+'%' : '—'}</td>
            <td>${esc(r.professor)}</td></tr>`;
        }).join('')}</tbody>
      </table>
    </div>`}`;
};

/* ============================================================
   PLANOS
   ============================================================ */
PAGINAS.planos = function () {
  if (!matrizDisponivel()) return `<div class="pagina-cabecalho"><h2>📅 Planos</h2></div>${avisoMatrizIndisponivel()}`;
  const s = sessaoAtual();
  let planos = listarPlanos();
  if (s.perfil === 'professor') planos = planos.filter(p => p.autor === s.nome);
  return `
    <div class="pagina-cabecalho flex-entre">
      <div><h2>📅 Planos de Aula</h2><p>Planos vinculados às habilidades oficiais.</p></div>
      <button class="btn btn-roxo btn-grande" data-ir="ia-plano">🤖📅 Criar com IA</button>
    </div>
    ${planos.length === 0 ? vazio('📅','Nenhum plano salvo','Crie um plano com IA vinculado a uma habilidade oficial.') : `
    <div class="grid-cards">${planos.map(p => {
      const h = obterHabilidade(p.habilidadeId);
      return `<div class="card">
        <div class="flex-entre mb"><span class="badge badge-azul">${h?esc(h.codigo):'—'}</span>
          ${p.origemIA?'<span class="badge badge-roxo">🤖 IA</span>':''}</div>
        <h3>${esc(p.titulo)}</h3>
        <p style="font-size:.84rem;color:var(--cinza-500)">${esc(p.turma||'—')} • ${esc(p.duracao||'—')} • ${formatarData(p.data)}</p>
        <button class="btn btn-claro btn-pequeno mt" data-ver-plano="${p.id}">Ver plano</button>
      </div>`;
    }).join('')}</div>`}`;
};

function verPlano(id) {
  const p = getDB().planos.find(x => x.id === id); if (!p) return;
  const h = obterHabilidade(p.habilidadeId); const c = p.conteudo || {};
  const bloco = (t, v) => v ? `<p class="mt"><strong>${t}:</strong><br>${esc(v).replace(/\n/g,'<br>')}</p>` : '';
  abrirModal(p.titulo, `
    ${p.origemIA ? avisoIA() : ''}
    <div class="alerta alerta-info"><span class="ic">🎯</span><div><strong>Habilidade da Matriz:</strong><br>${h?esc(h.codigo)+' — '+esc(h.texto):'—'}</div></div>
    ${bloco('Objetivo', c.objetivo)}${bloco('Conhecimentos prévios', c.conhecimentosPrevios)}
    ${bloco('Desenvolvimento', c.desenvolvimento)}${bloco('Metodologia', c.metodologia)}
    ${bloco('Atividades', c.atividades)}${bloco('Recursos', c.recursos)}
    ${bloco('Avaliação', c.avaliacao)}${bloco('Intervenção', c.intervencao)}
    ${bloco('Retomada', c.retomada)}${bloco('Atividade complementar', c.atividadeComplementar)}
  `, `<button class="btn btn-contorno" onclick="fecharModal()">Fechar</button>
      <button class="btn btn-primario" onclick="window.print()">🖨️ Imprimir</button>`, true);
}

/* ============================================================
   REPOSITÓRIO COLABORATIVO
   ============================================================ */
PAGINAS.repositorio = function () {
  const atvs = listarAtividades();
  return `
    <div class="pagina-cabecalho"><h2>📚 Repositório Colaborativo</h2>
      <p>Atividades criadas pelos professores da rede. Salve, favorite, compartilhe e imprima.</p></div>
    ${atvs.length === 0 ? vazio('📚','Nenhuma atividade no repositório','As atividades criadas aparecerão aqui.') : `
    <div class="tabela-wrap">
      <table class="tabela">
        <thead><tr><th>Título</th><th>Habilidade</th><th>Autor</th><th>Escola</th><th>Tipo</th><th>Data</th><th>Ações</th></tr></thead>
        <tbody>${atvs.map(a => {
          const h = obterHabilidade(a.habilidadeId); const e = obterEscola(a.escolaId);
          return `<tr><td>${esc(a.titulo)} ${a.origemIA?'<span class="badge badge-roxo">🤖</span>':''}</td>
            <td>${h?esc(h.codigo):'—'}</td><td>${esc(a.autor)}</td><td>${e?esc(e.nome):'—'}</td>
            <td>${esc(a.tipo)}</td><td>${formatarData(a.data)}</td>
            <td><button class="btn btn-claro btn-pequeno" data-ver-atv="${a.id}">Ver</button></td></tr>`;
        }).join('')}</tbody>
      </table>
    </div>`}`;
};

/* ============================================================
   CONFIGURAÇÕES
   ============================================================ */
PAGINAS.configuracoes = function () {
  const s = sessaoAtual();
  const db = getDB();
  return `
    <div class="pagina-cabecalho"><h2>⚙️ Configurações</h2><p>Preferências e administração do sistema.</p></div>
    <div class="grid-cards">
      <div class="card"><h3>👤 Minha Conta</h3>
        <p style="font-size:.88rem"><strong>Nome:</strong> ${esc(s.nome)}<br><strong>E-mail:</strong> ${esc(s.email)}<br>
        <strong>Perfil:</strong> ${esc(ROTULO_PERFIL[s.perfil])}</p>
        <button class="btn btn-claro btn-pequeno mt" id="btn-alterar-senha">🔑 Alterar senha</button>
      </div>
      <div class="card"><h3>📅 Ano Letivo</h3>
        <div class="campo"><label>Ano letivo ativo</label><input type="number" id="cfg-ano" value="${db.anoLetivo}"></div>
        <button class="btn btn-primario btn-pequeno" id="btn-salvar-ano">Salvar</button>
      </div>
      ${pode('matriz') ? `<div class="card"><h3>📚 Matriz Oficial</h3>
        <p style="font-size:.88rem">${matrizDisponivel() ? 'Matriz cadastrada e confirmada.' : 'Matriz ainda não cadastrada.'}</p>
        <button class="btn btn-primario btn-pequeno mt" data-ir="admin-matriz">Administrar Matriz</button></div>` : ''}
      ${pode('matriz') ? `<div class="card"><h3>📁 Pasta de Materiais</h3>
        <p style="font-size:.88rem">${obterPastaMateriais() ? 'Pasta cadastrada e visível aos professores.' : 'Nenhuma pasta cadastrada.'}</p>
        <button class="btn btn-primario btn-pequeno mt" data-ir="admin-matriz" data-aba="links">Configurar pasta e links</button></div>` : ''}
      ${pode('config') ? `<div class="card"><h3>👥 Usuários</h3>
        <p style="font-size:.88rem">${listarUsuarios().length} usuários cadastrados.</p>
        <button class="btn btn-primario btn-pequeno mt" data-ir="admin-usuarios">Gerenciar usuários</button></div>
      <div class="card"><h3>🏫 Escolas</h3>
        <p style="font-size:.88rem">${listarEscolas().length} escolas na rede.</p>
        <button class="btn btn-primario btn-pequeno mt" data-ir="admin-escolas">Gerenciar escolas</button></div>
      <div class="card"><h3>💾 Backup</h3>
        <p style="font-size:.88rem">Exporte ou importe os dados do sistema.</p>
        <div class="flex-centro mt"><button class="btn btn-claro btn-pequeno" id="btn-exportar">⬇️ Exportar</button>
        <button class="btn btn-contorno btn-pequeno" id="btn-importar">⬆️ Importar</button></div></div>
      <div class="card"><h3>📋 Logs</h3>
        <p style="font-size:.88rem">${db.logs.length} eventos registrados.</p>
        <button class="btn btn-claro btn-pequeno mt" data-ir="admin-logs">Ver logs</button></div>` : ''}
    </div>`;
};

/* ============================================================
   ADMIN — MATRIZ OFICIAL
   ============================================================ */
PAGINAS['admin-matriz'] = function () {
  if (!pode('matriz')) return `<div class="pagina-cabecalho"><h2>Acesso restrito</h2></div>${vazio('🔒','Sem permissão','Apenas o administrador da Secretaria pode administrar a Matriz.')}`;
  const m = matriz();
  return `
    <div class="pagina-cabecalho"><h2>📚 Administração da Matriz Oficial</h2>
      <p>Fonte de verdade do sistema. Nenhuma habilidade é criada automaticamente.</p></div>
    <div class="alerta alerta-erro"><span class="ic">🚫</span>
      <div><strong>REGRA INEGOCIÁVEL:</strong> Não invente habilidades, descritores, códigos ou competências.
      O sistema trabalha SOMENTE com a Matriz Oficial cadastrada/importada pela Secretaria.</div></div>

    <div class="card mb">
      <h3>Status da Matriz</h3>
      <p style="font-size:.9rem">
        Cadastrada: <strong>${m.cadastrada ? 'Sim' : 'Não'}</strong> &nbsp;|&nbsp;
        Confirmada: <strong>${m.confirmada ? 'Sim' : 'Não'}</strong> &nbsp;|&nbsp;
        Habilidades: <strong>${m.habilidades.length}</strong><br>
        Ano/Edição: <strong>${esc(m.ano||'—')} ${esc(m.edicao||'')}</strong> &nbsp;|&nbsp;
        Documento: <strong>${esc(m.documentoOrigem||'—')}</strong><br>
        Importada em: <strong>${formatarData(m.dataImportacao)}</strong> por <strong>${esc(m.responsavel||'—')}</strong>
      </p>
      ${m.cadastrada && !m.confirmada ? `<div class="alerta alerta-aviso mt"><span class="ic">⚠️</span>
        <div>Matriz importada mas <strong>não confirmada</strong>. Confira os dados e confirme para liberar aos demais módulos.</div></div>
        <button class="btn btn-verde btn-grande mt" id="btn-confirmar-matriz">✅ Confirmar Matriz</button>` : ''}
      ${m.habilidades.length > 0 ? `<div class="mt" style="border-top:1px solid var(--cinza-200);padding-top:14px">
        <button class="btn btn-perigo" id="btn-excluir-matriz">🗑️ Excluir Matriz inteira</button>
        <div class="ajuda" style="margin-top:6px">Remove todas as ${m.habilidades.length} habilidades e reinicia a Matriz. Use quando os dados importados/colados estiverem incorretos.</div>
      </div>` : ''}
    </div>

    <div class="abas">
      <button class="ativo" data-aba-matriz="importar">📥 Importar</button>
      <button data-aba-matriz="manual">✍️ Cadastro manual</button>
      <button data-aba-matriz="conferir">🔍 Conferência</button>
      <button data-aba-matriz="links">🔗 Links de materiais</button>
    </div>
    <div id="aba-matriz-conteudo"></div>
  `;
};

function renderAbaMatriz(aba) {
  const el = document.getElementById('aba-matriz-conteudo'); if (!el) return;
  if (aba === 'importar') {
    el.innerHTML = `
      <div class="card">
        <h3>Importar Matriz Oficial</h3>
        <p style="font-size:.88rem;color:var(--cinza-500)">Importe por arquivo estruturado (CSV/JSON) ou cole os dados. Cada linha: código;texto;eixo.</p>
        <div class="campo-linha">
          <div class="campo"><label>Ano</label><input id="imp-ano" placeholder="Ex.: 2024"></div>
          <div class="campo"><label>Edição</label><input id="imp-edicao" placeholder="Ex.: 1ª edição"></div>
        </div>
        <div class="campo"><label>Documento de origem</label><input id="imp-doc" placeholder="Ex.: Matriz SPAECE Língua Portuguesa 9º ano"></div>
        <div class="campo"><label>Responsável</label><input id="imp-resp" value="${esc(sessaoAtual().nome)}"></div>
        <div class="campo"><label>Arquivo (CSV ou JSON)</label><input type="file" id="imp-arquivo" accept=".csv,.json,.txt"></div>
        <div class="campo"><label>Ou cole os dados (código;texto;eixo por linha)</label>
          <textarea id="imp-texto" style="min-height:140px" placeholder="D01;Localizar informações explícitas em um texto.;Leitura"></textarea></div>
        <button class="btn btn-primario btn-grande" id="btn-importar-matriz">📥 Importar</button>
      </div>`;
  } else if (aba === 'manual') {
    el.innerHTML = `
      <div class="card">
        <h3>Cadastro Manual de Habilidade</h3>
        <div class="campo"><label>Código oficial *</label><input id="man-codigo" placeholder="Ex.: D01"></div>
        <div class="campo"><label>Texto oficial da habilidade *</label><textarea id="man-texto" placeholder="Texto exatamente conforme o documento oficial."></textarea></div>
        <div class="campo"><label>Eixo (opcional)</label><input id="man-eixo" placeholder="Ex.: Leitura"></div>
        <button class="btn btn-primario" id="btn-add-habilidade">➕ Adicionar habilidade</button>
      </div>`;
  } else if (aba === 'links') {
    const habs = listarHabilidades();
    const pasta = obterPastaMateriais();
    const mats = listarMateriais();
    el.innerHTML = `
      <div class="card mb">
        <h3>📁 Pasta geral de materiais (Drive)</h3>
        <p style="font-size:.88rem;color:var(--cinza-500)">Cole o link de uma pasta do Google Drive (ou outro repositório) onde ficam TODOS os jogos, simulados e atividades. Os professores verão um botão "Pasta de Materiais" nas telas de Atividades, Jogos e Simulados.</p>
        <div class="campo"><label>Link da pasta de materiais</label>
          <input id="cfg-pasta-materiais" value="${esc(pasta)}" placeholder="https://drive.google.com/drive/folders/..."></div>
        <div class="flex-centro">
          <button class="btn btn-primario" id="btn-salvar-pasta-materiais">💾 Salvar pasta</button>
          ${pasta ? `<a class="btn btn-claro" href="${esc(pasta)}" target="_blank" rel="noopener">🔗 Abrir pasta</a>` : ''}
        </div>
      </div>

      <div class="card mb">
        <h3>➕ Cadastrar material (link do Drive ou arquivo PDF)</h3>
        <p style="font-size:.88rem;color:var(--cinza-500)">Escolha para onde o material vai: <strong>Atividades</strong>, <strong>Jogos</strong> ou <strong>Simulados</strong>. Você pode colar um <strong>link</strong> (Drive) ou enviar um <strong>arquivo PDF</strong> do seu computador.</p>
        <div class="campo"><label>Título do material *</label>
          <input id="mat-titulo" placeholder="Ex.: Jogo de interpretação — Crônica"></div>
        <div class="campo"><label>Tipo de material *</label>
          <select id="mat-tipo">
            <option value="link">🔗 Link (Drive / site)</option>
            <option value="pdf">📄 Arquivo PDF (enviar do computador)</option>
          </select></div>
        <div class="campo" id="mat-campo-link"><label>Link do material (Drive) *</label>
          <input id="mat-link" placeholder="https://drive.google.com/..."></div>
        <div class="campo" id="mat-campo-pdf" style="display:none"><label>Arquivo PDF *</label>
          <input type="file" id="mat-arquivo" accept="application/pdf,.pdf">
          <small style="color:var(--cinza-500);font-size:.8rem">Tamanho recomendado: até 20 MB. O arquivo fica salvo no navegador.</small></div>
        <div class="campo-linha">
          <div class="campo"><label>Onde exibir *</label>
            <select id="mat-categoria">
              ${CATEGORIAS_MATERIAL.map(c => `<option value="${c.id}">${c.icone} ${c.rotulo}</option>`).join('')}
            </select></div>
          <div class="campo"><label>Habilidade (opcional)</label>
            <select id="mat-habilidade"><option value="">— Nenhuma —</option>${habs.map(h => `<option value="${h.id}">${esc(h.codigo)} — ${esc(h.texto.slice(0,50))}</option>`).join('')}</select></div>
        </div>
        <button class="btn btn-primario btn-grande" id="btn-add-material">➕ Cadastrar material</button>
      </div>

      <div class="card mb">
        <h3>📂 Materiais cadastrados (${mats.length})</h3>
        ${mats.length === 0 ? '<p style="font-size:.88rem;color:var(--cinza-500)">Nenhum material cadastrado ainda.</p>' : `
        <div class="tabela-wrap"><table class="tabela">
          <thead><tr><th>Título</th><th>Onde exibe</th><th>Habilidade</th><th>Tipo</th><th>Abrir</th><th>Ações</th></tr></thead>
          <tbody>${mats.map(m => {
            const h = m.habilidadeId ? obterHabilidade(m.habilidadeId) : null;
            const cat = CATEGORIAS_MATERIAL.find(c => c.id === m.categoria) || CATEGORIAS_MATERIAL[0];
            const ehPdf = m.tipo === 'pdf';
            return `<tr>
              <td><strong>${esc(m.titulo || '—')}</strong></td>
              <td><span class="badge badge-azul">${cat.icone} ${esc(cat.rotulo)}</span></td>
              <td>${h ? esc(h.codigo) : '—'}</td>
              <td>${ehPdf ? `<span class="badge badge-verde">📄 PDF</span><br><small style="color:var(--cinza-500)">${esc(m.arquivoNome || '')} ${m.arquivoTamanho ? '(' + formatarTamanho(m.arquivoTamanho) + ')' : ''}</small>` : '<span class="badge badge-cinza">🔗 Link</span>'}</td>
              <td>${ehPdf
                ? `<button class="btn btn-claro btn-pequeno" data-abrir-pdf="${m.id}">📄 Abrir PDF</button>`
                : `<a href="${esc(m.link)}" target="_blank" rel="noopener">🔗 Abrir</a>`}</td>
              <td><button class="btn btn-perigo btn-pequeno" data-del-material="${m.id}">🗑️ Remover</button></td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>`}
      </div>

      <div class="alerta alerta-info"><span class="ic">🔗</span>
        <div>Você também pode vincular um link direto a cada habilidade da Matriz. Ao clicar na habilidade, o professor será direcionado ao material correspondente.</div></div>
      ${habs.length === 0 ? vazio('🔍','Nenhuma habilidade cadastrada','Importe ou cadastre a Matriz Oficial antes de vincular links.') : `
      <div class="tabela-wrap"><table class="tabela">
        <thead><tr><th>Código</th><th>Texto oficial</th><th>Link do material</th><th>Ações</th></tr></thead>
        <tbody>${habs.map(h => `<tr>
          <td><strong>${esc(h.codigo)}</strong></td>
          <td style="max-width:320px">${esc(h.texto)}</td>
          <td><input class="input-link-hab" data-hab-link="${h.id}" value="${esc(h.link||'')}" placeholder="https://drive.google.com/..." style="min-width:240px"></td>
          <td>
            <button class="btn btn-primario btn-pequeno" data-salvar-link="${h.id}">💾 Salvar</button>
            ${h.link ? `<a class="btn btn-claro btn-pequeno" href="${esc(h.link)}" target="_blank" rel="noopener">🔗 Abrir</a>` : ''}
          </td>
        </tr>`).join('')}</tbody>
      </table></div>`}
    `;
  } else {
    const habs = listarHabilidades();
    el.innerHTML = habs.length === 0 ? vazio('🔍','Nenhuma habilidade cadastrada','Importe ou cadastre a Matriz Oficial.') : `
      <div class="alerta alerta-info"><span class="ic">🔍</span><div>Confira os códigos e textos. Após confirmar, a Matriz fica disponível para todos os módulos.</div></div>
      <div class="tabela-wrap"><table class="tabela">
        <thead><tr><th>Código</th><th>Texto oficial</th><th>Eixo</th><th>Ações</th></tr></thead>
        <tbody>${habs.map(h => `<tr><td><strong>${esc(h.codigo)}</strong></td><td>${esc(h.texto)}</td><td>${esc(h.eixo||'—')}</td>
          <td><button class="btn btn-perigo btn-pequeno" data-del-hab="${h.id}">Remover</button></td></tr>`).join('')}</tbody>
      </table></div>`;
  }
}

/* ============================================================
   ADMIN — USUÁRIOS
   ============================================================ */
PAGINAS['admin-usuarios'] = function () {
  if (!pode('config')) return `<div class="pagina-cabecalho"><h2>Acesso restrito</h2></div>${vazio('🔒','Sem permissão','')}`;
  const us = listarUsuarios();
  return `
    <div class="pagina-cabecalho flex-entre">
      <div><h2>👥 Usuários</h2><p>Gestão de usuários e perfis de acesso.</p></div>
      <button class="btn btn-primario" id="btn-novo-usuario">➕ Novo usuário</button>
    </div>
    <div class="tabela-wrap"><table class="tabela">
      <thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Escola</th><th>Status</th><th>Ações</th></tr></thead>
      <tbody>${us.map(u => {
        const e = u.escolaId ? obterEscola(u.escolaId) : null;
        return `<tr><td>${esc(u.nome)}</td><td>${esc(u.email)}</td><td>${esc(ROTULO_PERFIL[u.perfil]||u.perfil)}</td>
          <td>${e?esc(e.nome):'—'}</td>
          <td>${u.precisaDefinirSenha?'<span class="badge badge-amarelo">Aguardando senha</span>':'<span class="badge badge-verde">Ativo</span>'}</td>
          <td><button class="btn btn-contorno btn-pequeno" data-reset-senha="${u.id}">🔑 Resetar senha</button></td></tr>`;
      }).join('')}</tbody>
    </table></div>`;
};

/* ============================================================
   ADMIN — ESCOLAS
   ============================================================ */
PAGINAS['admin-escolas'] = function () {
  if (!pode('config')) return `<div class="pagina-cabecalho"><h2>Acesso restrito</h2></div>${vazio('🔒','Sem permissão','')}`;
  const esc_ = listarEscolas();
  return `
    <div class="pagina-cabecalho flex-entre">
      <div><h2>🏫 Escolas da Rede</h2><p>${esc(getDB().instituicao)}</p></div>
      <button class="btn btn-primario" id="btn-nova-escola">➕ Nova escola</button>
    </div>
    <div class="grid-cards">${esc_.map(e => `<div class="card">
      <h3>${esc(e.nome)}</h3><p style="font-size:.84rem;color:var(--cinza-500)">Tipo: ${esc(e.tipo)}</p>
      <button class="btn btn-claro btn-pequeno mt" data-ir="escola" data-escola="${e.id}">Ver painel</button>
    </div>`).join('')}</div>`;
};

/* ============================================================
   ADMIN — LOGS
   ============================================================ */
PAGINAS['admin-logs'] = function () {
  if (!pode('config')) return `<div class="pagina-cabecalho"><h2>Acesso restrito</h2></div>${vazio('🔒','Sem permissão','')}`;
  const logs = getDB().logs;
  return `
    <div class="pagina-cabecalho"><h2>📋 Logs do Sistema</h2><p>Registro de ações para auditoria e segurança.</p></div>
    ${logs.length === 0 ? vazio('📋','Sem registros','') : `
    <div class="tabela-wrap"><table class="tabela">
      <thead><tr><th>Data/Hora</th><th>Usuário</th><th>Ação</th><th>Detalhe</th></tr></thead>
      <tbody>${logs.map(l => `<tr><td>${formatarDataHora(l.data)}</td><td>${esc(l.usuario)}</td><td>${esc(l.acao)}</td><td>${esc(l.detalhe)}</td></tr>`).join('')}</tbody>
    </table></div>`}`;
};

/* ============================================================
   SECRETARIA — PAINEL DE MONITORAMENTO
   ============================================================ */
PAGINAS['painel-secretaria'] = function () {
  if (!pode('rede')) return `<div class="pagina-cabecalho"><h2>Acesso restrito</h2></div>${vazio('🔒','Sem permissão','')}`;
  const cobertura = calcularCobertura({});
  const escolas = listarEscolas();
  const professores = listarUsuarios().filter(u => u.perfil === 'professor');
  const turmas = new Set(getDB().registros.map(r => r.turma).filter(Boolean));
  const atvs = listarAtividades().length;
  const jogs = listarJogos().length;
  const sims = listarSimulados().length;

  return `
    <div class="pagina-cabecalho"><h2>📊 Painel de Monitoramento SPAECE</h2>
      <p>LÍNGUA PORTUGUESA — 9º ANO • ${esc(getDB().instituicao)}</p></div>
    ${!matrizDisponivel() ? avisoMatrizIndisponivel() : ''}
    <div class="grid-kpi mb">
      <div class="kpi ${cobertura.percentual>=75?'verde':cobertura.percentual>=40?'amarelo':'vermelho'}">
        <span class="icone-kpi">📊</span><span class="rotulo">Cobertura da Matriz</span>
        <span class="valor">${cobertura.percentual}%</span><span class="detalhe">${cobertura.cobertas}/${cobertura.total} habilidades</span></div>
      <div class="kpi"><span class="icone-kpi">🏫</span><span class="rotulo">Escolas</span><span class="valor">${escolas.length}</span></div>
      <div class="kpi"><span class="icone-kpi">👨‍🏫</span><span class="rotulo">Professores</span><span class="valor">${professores.length}</span></div>
      <div class="kpi"><span class="icone-kpi">👥</span><span class="rotulo">Turmas</span><span class="valor">${turmas.size}</span></div>
      <div class="kpi roxo"><span class="icone-kpi">📝</span><span class="rotulo">Atividades</span><span class="valor">${atvs}</span></div>
      <div class="kpi amarelo"><span class="icone-kpi">🎮</span><span class="rotulo">Jogos</span><span class="valor">${jogs}</span></div>
      <div class="kpi"><span class="icone-kpi">📋</span><span class="rotulo">Simulados</span><span class="valor">${sims}</span></div>
      <div class="kpi vermelho"><span class="icone-kpi">🎯</span><span class="rotulo">Habilidades Pendentes</span><span class="valor">${cobertura.pendentes}</span></div>
    </div>
    <div class="grid-cards">
      <button class="card-acesso" data-ir="mapa-cobertura"><div class="icone" aria-hidden="true">🗺️</div><h3>MAPA DE COBERTURA</h3><p>Visualize a Matriz como mapa de calor</p></button>
      <button class="card-acesso" data-ir="comparacao"><div class="icone verde" aria-hidden="true">🏫</div><h3>COMPARAÇÃO ENTRE ESCOLAS</h3><p>Monitoramento e apoio pedagógico</p></button>
      <button class="card-acesso" data-ir="como-estamos"><div class="icone amarelo" aria-hidden="true">📈</div><h3>COMO ESTAMOS?</h3><p>Situação geral do trabalho com a Matriz</p></button>
      <button class="card-acesso" data-ir="relatorios"><div class="icone roxo" aria-hidden="true">📄</div><h3>RELATÓRIOS</h3><p>Gere relatórios e PDFs</p></button>
      <button class="card-acesso" data-ir="alertas"><div class="icone vermelho" aria-hidden="true">🔔</div><h3>ALERTAS PEDAGÓGICOS</h3><p>Apoio a professores e gestores</p></button>
    </div>`;
};

/* ============================================================
   MAPA DE COBERTURA
   ============================================================ */
PAGINAS['mapa-cobertura'] = function () {
  if (!pode('rede')) return `<div class="pagina-cabecalho"><h2>Acesso restrito</h2></div>${vazio('🔒','Sem permissão','')}`;
  if (!matrizDisponivel()) return `<div class="pagina-cabecalho"><h2>🗺️ Mapa de Cobertura</h2></div>${avisoMatrizIndisponivel()}`;
  const f = window._filtroMapa || {};
  const filtro = { escolaId: f.escolaId, turma: f.turma, anoLetivo: f.anoLetivo };
  const habs = listarHabilidades();
  return `
    <div class="pagina-cabecalho"><h2>🗺️ Mapa de Cobertura da Matriz</h2>
      <p>Visualização tipo mapa de calor. Cobertura = existe registro de trabalho.</p></div>
    <div class="filtros">
      <div class="campo"><label>Escola</label><select id="mapa-escola"><option value="">Toda a rede</option>${opcoesEscolas(f.escolaId)}</select></div>
      <div class="campo"><label>Turma</label><select id="mapa-turma">${opcoesTurmas(f.turma)}</select></div>
      <button class="btn btn-primario" id="btn-filtrar-mapa">Filtrar</button>
    </div>
    <div class="card">
      <div class="heatmap">
        ${habs.map(h => {
          const st = statusHabilidade(h.id, filtro);
          const cls = st.cor === 'verde' ? 'heat-verde' : st.cor === 'amarelo' ? 'heat-amarelo' : 'heat-vermelho';
          return `<div class="heat-cell ${cls}" data-hab="${h.id}" title="${esc(h.codigo)}: ${esc(st.rotulo)}">${esc(h.codigo)}</div>`;
        }).join('')}
      </div>
      <div class="legenda">
        <span><span class="dot" style="background:var(--verde-500)"></span> Cobertura registrada</span>
        <span><span class="dot" style="background:var(--amarelo-500)"></span> Cobertura parcial / atenção</span>
        <span><span class="dot" style="background:var(--vermelho-500)"></span> Sem registro / baixa cobertura</span>
      </div>
    </div>`;
};

/* ============================================================
   COMPARAÇÃO ENTRE ESCOLAS
   ============================================================ */
PAGINAS.comparacao = function () {
  if (!pode('rede')) return `<div class="pagina-cabecalho"><h2>Acesso restrito</h2></div>${vazio('🔒','Sem permissão','')}`;
  const escolas = listarEscolas();
  const linhas = escolas.map(e => {
    const cob = calcularCobertura({ escolaId: e.id });
    const atvs = getDB().registros.filter(r => r.escolaId === e.id && r.recurso === 'Atividade').length;
    const sims = getDB().registros.filter(r => r.escolaId === e.id && r.recurso === 'Simulado').length;
    return { e, cob, atvs, sims };
  });
  return `
    <div class="pagina-cabecalho"><h2>🏫 Comparação entre Escolas</h2>
      <p>Monitoramento e apoio pedagógico. Não há ranking nem classificação.</p></div>
    <div class="alerta alerta-info"><span class="ic">🤝</span>
      <div>Esta visão tem caráter de <strong>apoio pedagógico</strong>. Não classifica escolas como melhores ou piores.</div></div>
    <div class="tabela-wrap"><table class="tabela">
      <thead><tr><th>Escola</th><th>Cobertura</th><th>Atividades</th><th>Simulados</th><th>Habilidades Pendentes</th></tr></thead>
      <tbody>${linhas.map(l => `<tr>
        <td><strong>${esc(l.e.nome)}</strong></td>
        <td>${barraProgresso(l.cob.percentual)}<small>${l.cob.percentual}%</small></td>
        <td>${l.atvs}</td><td>${l.sims}</td><td>${l.cob.pendentes}</td></tr>`).join('')}</tbody>
    </table></div>`;
};

/* ============================================================
   PAINEL POR ESCOLA
   ============================================================ */
PAGINAS.escola = function () {
  const id = window._escolaAtual;
  const e = obterEscola(id);
  if (!e) return `<div class="pagina-cabecalho"><h2>Escola não encontrada</h2></div>`;
  const cob = calcularCobertura({ escolaId: id });
  const regs = getDB().registros.filter(r => r.escolaId === id);
  const turmas = new Set(regs.map(r => r.turma).filter(Boolean));
  const profs = new Set(regs.map(r => r.professor).filter(Boolean));
  const habs = listarHabilidades();
  return `
    <div class="pagina-cabecalho"><h2>🏫 ${esc(e.nome)}</h2><p>Painel individual da escola</p></div>
    <div class="grid-kpi mb">
      <div class="kpi ${cob.percentual>=75?'verde':cob.percentual>=40?'amarelo':'vermelho'}">
        <span class="rotulo">Cobertura da Matriz</span><span class="valor">${cob.percentual}%</span>
        <span class="detalhe">${cob.cobertas}/${cob.total}</span></div>
      <div class="kpi"><span class="rotulo">Professores</span><span class="valor">${profs.size}</span></div>
      <div class="kpi"><span class="rotulo">Turmas</span><span class="valor">${turmas.size}</span></div>
      <div class="kpi amarelo"><span class="rotulo">Registros</span><span class="valor">${regs.length}</span></div>
    </div>
    ${!matrizDisponivel() ? avisoMatrizIndisponivel() : `
    <div class="card mb"><h3>Habilidades trabalhadas</h3>
      <div class="grid-matriz">${habs.map(h => {
        const st = statusHabilidade(h.id, { escolaId: id });
        return `<div class="hab-card status-${st.cor}" data-hab="${h.id}">
          <div class="codigo">${esc(h.codigo)}</div><div class="texto">${esc(h.texto)}</div>
          <div class="meta">${badgeStatus(st.cor, st.rotulo)}</div></div>`;
      }).join('')}</div></div>`}
    <div class="card"><h3>Registros recentes</h3>
      ${regs.length === 0 ? vazio('📌','AINDA NÃO HÁ DADOS REGISTRADOS','') : `
      <div class="tabela-wrap"><table class="tabela">
        <thead><tr><th>Data</th><th>Turma</th><th>Habilidade</th><th>Recurso</th><th>Professor</th></tr></thead>
        <tbody>${regs.slice(0,20).map(r => { const h = obterHabilidade(r.habilidadeId);
          return `<tr><td>${formatarData(r.data)}</td><td>${esc(r.turma)}</td><td>${h?esc(h.codigo):'—'}</td>
          <td>${esc(r.recurso)}</td><td>${esc(r.professor)}</td></tr>`; }).join('')}</tbody>
      </table></div>`}</div>`;
};

/* ============================================================
   COMO ESTAMOS?
   ============================================================ */
PAGINAS['como-estamos'] = function () {
  if (!pode('rede')) return `<div class="pagina-cabecalho"><h2>Acesso restrito</h2></div>${vazio('🔒','Sem permissão','')}`;
  const cob = calcularCobertura({});
  const habs = listarHabilidades();
  const contagem = {};
  getDB().registros.forEach(r => { contagem[r.habilidadeId] = (contagem[r.habilidadeId] || 0) + 1; });
  const maisTrab = habs.map(h => ({ rotulo: h.codigo, valor: contagem[h.id] || 0 })).sort((a,b)=>b.valor-a.valor).slice(0,8);
  const semRegistro = habs.filter(h => !contagem[h.id]);
  const desp = calcularDesempenhoPorHabilidade({});
  const retomada = habs.filter(h => desp[h.id] !== undefined && desp[h.id] !== null && desp[h.id] < 60);

  return `
    <div class="pagina-cabecalho"><h2>📈 COMO ESTAMOS NO TRABALHO COM A MATRIZ?</h2>
      <p>Visão geral da rede — ${esc(getDB().instituicao)}</p></div>
    ${!matrizDisponivel() ? avisoMatrizIndisponivel() : `
    <div class="grid-kpi mb">
      <div class="kpi ${cob.percentual>=75?'verde':cob.percentual>=40?'amarelo':'vermelho'}">
        <span class="rotulo">Cobertura da Matriz</span><span class="valor">${cob.percentual}%</span></div>
      <div class="kpi verde"><span class="rotulo">Habilidades trabalhadas</span><span class="valor">${cob.cobertas}</span></div>
      <div class="kpi vermelho"><span class="rotulo">Sem registro</span><span class="valor">${semRegistro.length}</span></div>
      <div class="kpi amarelo"><span class="rotulo">Retomadas necessárias</span><span class="valor">${retomada.length}</span></div>
    </div>
    <div class="grid-cards">
      <div class="card"><h3>Habilidades com mais registros</h3>${graficoBarras(maisTrab.map(m=>({rotulo:m.rotulo,valor:m.valor})), 'verde')}</div>
      <div class="card"><h3>Habilidades sem registro</h3>
        ${semRegistro.length === 0 ? '<p style="color:var(--verde-700)">✅ Todas as habilidades possuem registro.</p>' :
        `<ul style="list-style:none;font-size:.86rem">${semRegistro.map(h=>`<li style="padding:6px 0;border-bottom:1px solid var(--cinza-200)"><strong>${esc(h.codigo)}</strong> — ${esc(h.texto.slice(0,70))}…</li>`).join('')}</ul>`}</div>
    </div>`}`;
};

/* ============================================================
   ALERTAS PEDAGÓGICOS
   ============================================================ */
PAGINAS.alertas = function () {
  if (!matrizDisponivel()) return `<div class="pagina-cabecalho"><h2>🔔 Alertas</h2></div>${avisoMatrizIndisponivel()}`;
  const s = sessaoAtual();
  const filtro = { escolaId: s.escolaId };
  const habs = listarHabilidades();
  const alertas = [];
  const semReg = habs.filter(h => !getDB().registros.some(r => r.habilidadeId === h.id && (!s.escolaId || r.escolaId === s.escolaId)));
  if (semReg.length) alertas.push({ t: 'aviso', ic: '⚠️', txt: `Há ${semReg.length} habilidade(s) da Matriz ainda sem registro de trabalho.` });
  const desp = calcularDesempenhoPorHabilidade(filtro);
  habs.forEach(h => { if (desp[h.id] !== undefined && desp[h.id] !== null && desp[h.id] < 60)
    alertas.push({ t: 'erro', ic: '📉', txt: `Os resultados indicam necessidade de retomada da habilidade ${h.codigo} (desempenho ${desp[h.id]}%).` }); });
  habs.forEach(h => { const n = getDB().atividades.filter(a => a.habilidadeId === h.id).length;
    if (n > 0 && !getDB().registros.some(r => r.habilidadeId === h.id)) alertas.push({ t: 'info', ic: '📝', txt: `Há ${n} atividade(s) disponíveis para a habilidade ${h.codigo}, ainda sem registro de aplicação.` }); });
  const recentes = getDB().registros.filter(r => (!s.escolaId || r.escolaId === s.escolaId) && r.data >= new Date(Date.now()-30*864e5).toISOString().slice(0,10));
  if (recentes.length) alertas.push({ t: 'ok', ic: '✅', txt: `Há ${recentes.length} registro(s) recente(s) de trabalho com a Matriz nos últimos 30 dias.` });

  return `
    <div class="pagina-cabecalho"><h2>🔔 Alertas Pedagógicos</h2><p>Apoio a professores e gestores — nunca punitivos.</p></div>
    ${alertas.length === 0 ? vazio('🔔','Nenhum alerta no momento','Continue registrando o trabalho pedagógico.') :
      alertas.map(a => `<div class="alerta alerta-${a.t}"><span class="ic">${a.ic}</span><div>${esc(a.txt)}</div></div>`).join('')}`;
};

/* ============================================================
   RELATÓRIOS
   ============================================================ */
PAGINAS.relatorios = function () {
  const s = sessaoAtual();
  const escopo = pode('rede') ? listarEscolas() : escopoEscolas();
  return `
    <div class="pagina-cabecalho"><h2>📄 Relatórios</h2><p>Gere relatórios de cobertura, atividades, desempenho e evolução.</p></div>
    <div class="card mb no-print">
      <div class="campo-linha">
        <div class="campo"><label>Tipo de relatório</label><select id="rel-tipo">
          <option value="cobertura">Cobertura da Matriz</option>
          <option value="atividades">Atividades e Registros</option>
          <option value="desempenho">Desempenho</option>
          <option value="pendentes">Habilidades Pendentes</option>
          <option value="retomada">Habilidades que precisam de retomada</option>
        </select></div>
        <div class="campo"><label>Escola</label><select id="rel-escola"><option value="">Toda a rede</option>${escopo.map(e=>`<option value="${e.id}">${esc(e.nome)}</option>`).join('')}</select></div>
      </div>
      <button class="btn btn-primario" id="btn-gerar-relatorio">📄 Gerar relatório</button>
      <button class="btn btn-contorno" onclick="window.print()">🖨️ Imprimir / PDF</button>
    </div>
    <div id="rel-resultado"></div>`;
};

function gerarRelatorio() {
  const tipo = document.getElementById('rel-tipo').value;
  const escolaId = document.getElementById('rel-escola').value || null;
  const el = document.getElementById('rel-resultado');
  const e = escolaId ? obterEscola(escolaId) : null;
  const cab = `<div class="card mb"><h2 style="color:var(--azul-900)">${esc(getDB().instituicao)}</h2>
    <p><strong>Relatório:</strong> ${esc(tipo)} &nbsp;|&nbsp; <strong>Escopo:</strong> ${e?esc(e.nome):'Toda a rede'} &nbsp;|&nbsp;
    <strong>Emitido em:</strong> ${formatarDataHora(agoraISO())}</p></div>`;
  const habs = listarHabilidades();
  const filtro = { escolaId };
  let corpo = '';
  if (tipo === 'cobertura') {
    const cob = calcularCobertura(filtro);
    corpo = `<div class="card"><h3>Cobertura da Matriz — ${cob.percentual}%</h3>
      <p>${cob.cobertas} de ${cob.total} habilidades com registro de trabalho.</p>
      <div class="tabela-wrap"><table class="tabela"><thead><tr><th>Código</th><th>Habilidade</th><th>Status</th></tr></thead>
      <tbody>${habs.map(h => { const st = statusHabilidade(h.id, filtro);
        return `<tr><td>${esc(h.codigo)}</td><td>${esc(h.texto)}</td><td>${esc(st.rotulo)}</td></tr>`; }).join('')}</tbody></table></div></div>`;
  } else if (tipo === 'atividades') {
    let regs = getDB().registros; if (escolaId) regs = regs.filter(r => r.escolaId === escolaId);
    corpo = `<div class="card"><h3>Registros de Trabalho (${regs.length})</h3>
      <div class="tabela-wrap"><table class="tabela"><thead><tr><th>Data</th><th>Turma</th><th>Habilidade</th><th>Recurso</th><th>Professor</th></tr></thead>
      <tbody>${regs.map(r => { const h = obterHabilidade(r.habilidadeId);
        return `<tr><td>${formatarData(r.data)}</td><td>${esc(r.turma)}</td><td>${h?esc(h.codigo):'—'}</td><td>${esc(r.recurso)}</td><td>${esc(r.professor)}</td></tr>`; }).join('')}</tbody></table></div></div>`;
  } else if (tipo === 'desempenho') {
    const desp = calcularDesempenhoPorHabilidade(filtro);
    const dados = habs.filter(h => desp[h.id] !== undefined && desp[h.id] !== null).map(h => ({ rotulo: h.codigo, valor: desp[h.id] }));
    corpo = `<div class="card"><h3>Desempenho por Habilidade</h3>${graficoBarras(dados)}</div>`;
  } else if (tipo === 'pendentes') {
    const pend = habs.filter(h => !getDB().registros.some(r => r.habilidadeId === h.id && (!escolaId || r.escolaId === escolaId)));
    corpo = `<div class="card"><h3>Habilidades Pendentes (${pend.length})</h3>
      ${pend.length===0?'<p>✅ Nenhuma pendência.</p>':`<ul style="list-style:none">${pend.map(h=>`<li style="padding:6px 0;border-bottom:1px solid var(--cinza-200)"><strong>${esc(h.codigo)}</strong> — ${esc(h.texto)}</li>`).join('')}</ul>`}</div>`;
  } else {
    const desp = calcularDesempenhoPorHabilidade(filtro);
    const ret = habs.filter(h => desp[h.id] !== undefined && desp[h.id] !== null && desp[h.id] < 60);
    corpo = `<div class="card"><h3>Habilidades que precisam de retomada (${ret.length})</h3>
      ${ret.length===0?'<p>✅ Nenhuma retomada indicada.</p>':`<ul style="list-style:none">${ret.map(h=>`<li style="padding:6px 0;border-bottom:1px solid var(--cinza-200)"><strong>${esc(h.codigo)}</strong> — desempenho ${desp[h.id]}%</li>`).join('')}</ul>`}</div>`;
  }
  el.innerHTML = cab + corpo;
}

/* ============================================================
   HISTÓRICO
   ============================================================ */
PAGINAS.historico = function () {
  const anos = new Set(getDB().registros.map(r => r.anoLetivo));
  anos.add(getDB().anoLetivo);
  const ano = window._histAno || getDB().anoLetivo;
  const regs = getDB().registros.filter(r => r.anoLetivo === ano);
  return `
    <div class="pagina-cabecalho"><h2>🕓 Histórico</h2><p>Registros por ano letivo. Nada é apagado automaticamente.</p></div>
    <div class="filtros"><div class="campo"><label>Ano letivo</label><select id="hist-ano">
      ${Array.from(anos).sort((a,b)=>b-a).map(a=>`<option ${a===ano?'selected':''}>${a}</option>`).join('')}</select></div>
      <button class="btn btn-primario" id="btn-filtrar-hist">Filtrar</button></div>
    ${regs.length === 0 ? vazio('🕓','AINDA NÃO HÁ DADOS REGISTRADOS','Nenhum registro neste ano letivo.') : `
    <div class="tabela-wrap"><table class="tabela">
      <thead><tr><th>Data</th><th>Escola</th><th>Turma</th><th>Habilidade</th><th>Recurso</th><th>Professor</th></tr></thead>
      <tbody>${regs.map(r => { const h = obterHabilidade(r.habilidadeId); const e = obterEscola(r.escolaId);
        return `<tr><td>${formatarData(r.data)}</td><td>${e?esc(e.nome):'—'}</td><td>${esc(r.turma)}</td>
        <td>${h?esc(h.codigo):'—'}</td><td>${esc(r.recurso)}</td><td>${esc(r.professor)}</td></tr>`; }).join('')}</tbody>
    </table></div>`}`;
};
