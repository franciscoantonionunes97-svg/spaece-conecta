/* ============================================================
   SPAECE CONECTA — Utilitários de Interface
   ============================================================ */

function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function toast(msg, tipo = 'ok') {
  const box = document.getElementById('toast');
  const el = document.createElement('div');
  el.className = 'toast' + (tipo === 'erro' ? ' erro' : tipo === 'aviso' ? ' aviso' : '');
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; }, 3200);
  setTimeout(() => el.remove(), 3600);
}

function abrirModal(titulo, corpoHTML, rodapeHTML, largo) {
  document.getElementById('modal-titulo').textContent = titulo;
  document.getElementById('modal-corpo').innerHTML = corpoHTML;
  document.getElementById('modal-rodape').innerHTML = rodapeHTML || '';
  document.getElementById('modal').classList.toggle('largo', !!largo);
  document.getElementById('modal-fundo').classList.add('aberto');
  document.getElementById('modal').setAttribute('aria-label', titulo);
}
function fecharModal() {
  document.getElementById('modal-fundo').classList.remove('aberto');
  document.getElementById('modal-corpo').innerHTML = '';
  document.getElementById('modal-rodape').innerHTML = '';
}

function formatarData(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('pt-BR');
}
function formatarDataHora(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function iniciais(nome) {
  if (!nome) return '?';
  const p = nome.trim().split(/\s+/);
  return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
}

function badgeStatus(cor, rotulo) {
  const cls = cor === 'verde' ? 'badge-verde' : cor === 'amarelo' ? 'badge-amarelo' : cor === 'vermelho' ? 'badge-vermelho' : 'badge-cinza';
  const ic = cor === 'verde' ? '🟢' : cor === 'amarelo' ? '🟡' : cor === 'vermelho' ? '🔴' : '⚪';
  return `<span class="badge ${cls}">${ic} ${esc(rotulo)}</span>`;
}

function barraProgresso(pct, cor) {
  const c = cor || (pct >= 75 ? 'verde' : pct >= 40 ? 'amarelo' : 'vermelho');
  return `<div class="barra ${c}"><span style="width:${Math.max(0, Math.min(100, pct))}%"></span></div>`;
}

function vazio(icone, titulo, texto) {
  return `<div class="vazio"><div class="ic" aria-hidden="true">${icone}</div><h3>${esc(titulo)}</h3><p>${esc(texto || '')}</p></div>`;
}

function avisoMatrizIndisponivel() {
  return `<div class="alerta alerta-aviso">
    <span class="ic">⚠️</span>
    <div><strong>A Matriz Oficial do SPAECE ainda não foi cadastrada no sistema.</strong><br>
    Cadastre ou importe a versão oficial antes de criar conteúdos vinculados às habilidades.</div>
  </div>`;
}

function avisoHabilidadeNaoEncontrada() {
  return `<div class="alerta alerta-erro">
    <span class="ic">🚫</span>
    <div>Essa habilidade não foi localizada na Matriz Oficial cadastrada no sistema.
    Verifique a solicitação ou selecione uma habilidade disponível na Matriz.</div>
  </div>`;
}

function avisoIA() {
  return `<div class="aviso-ia">🤖 <strong>Gerada com apoio de IA — revise antes de utilizar.</strong>
    A IA é um assistente pedagógico e não substitui a decisão do professor.</div>`;
}

/* Botão para a pasta geral de materiais (Drive) — aparece quando o administrador cadastra o link. */
function botaoPastaMateriais() {
  const url = (typeof obterPastaMateriais === 'function') ? obterPastaMateriais() : '';
  if (!url) return '';
  return `<a class="btn btn-verde btn-grande" href="${esc(url)}" target="_blank" rel="noopener">📁 Pasta de Materiais</a>`;
}

/* Seção de materiais por habilidade — lista as habilidades que possuem link cadastrado.
   Exibida nas telas de Atividades, Jogos e Simulados para acesso rápido do professor. */
function secaoMateriaisHabilidades(titulo) {
  const habs = (typeof listarHabilidades === 'function') ? listarHabilidades() : [];
  const comLink = habs.filter(h => h.link);
  if (!comLink.length) return '';
  return `
    <div class="card mb">
      <h3>${titulo || '📂 Materiais por habilidade'}</h3>
      <p style="font-size:.86rem;color:var(--cinza-500)">Clique em uma habilidade para abrir o material correspondente (atividades, jogos e simulados).</p>
      <div class="grid-materiais">
        ${comLink.map(h => `
          <a class="material-item" href="${esc(h.link)}" target="_blank" rel="noopener">
            <span class="codigo">${esc(h.codigo)}</span>
            <span class="texto">${esc(h.texto)}</span>
            <span class="abrir">📂 Abrir material</span>
          </a>`).join('')}
      </div>
    </div>`;
}

/* Seção de materiais cadastrados por categoria (Atividades, Jogos ou Simulados).
   Mostra os links do Drive que o administrador direcionou para esta tela. */
function secaoMateriaisCategoria(categoria, titulo) {
  const mats = (typeof listarMateriais === 'function') ? listarMateriais(categoria) : [];
  if (!mats.length) return '';
  return `
    <div class="card mb">
      <h3>${titulo || '📂 Materiais disponíveis'}</h3>
      <p style="font-size:.86rem;color:var(--cinza-500)">Materiais cadastrados pela Secretaria para esta seção. Clique para abrir.</p>
      <div class="grid-materiais">
        ${mats.map(m => {
          const h = m.habilidadeId && typeof obterHabilidade === 'function' ? obterHabilidade(m.habilidadeId) : null;
          const ehPdf = m.tipo === 'pdf';
          const conteudo = `
            <span class="codigo">${ehPdf ? '📄 ' : '🔗 '}${esc(m.titulo || 'Material')}</span>
            ${h ? `<span class="texto">${esc(h.codigo)} — ${esc(h.texto)}</span>` : ''}
            ${ehPdf ? `<span class="texto">${esc(m.arquivoNome || 'arquivo.pdf')}${m.arquivoTamanho ? ' • ' + formatarTamanho(m.arquivoTamanho) : ''}</span>` : ''}
            <span class="abrir">${ehPdf ? '📄 Abrir PDF' : '📂 Abrir material'}</span>`;
          return ehPdf
            ? `<a class="material-item" href="#" data-abrir-pdf="${m.id}">${conteudo}</a>`
            : `<a class="material-item" href="${esc(m.link)}" target="_blank" rel="noopener">${conteudo}</a>`;
        }).join('')}
      </div>
    </div>`;
}

/* Opções de habilidades para <select> — SOMENTE da Matriz Oficial */
function opcoesHabilidades(selecionado) {
  const habs = listarHabilidades();
  if (!habs.length) return '<option value="">— Matriz não cadastrada —</option>';
  return '<option value="">Selecione uma habilidade oficial…</option>' +
    habs.map(h => `<option value="${h.id}" ${selecionado === h.id ? 'selected' : ''}>${esc(h.codigo)} — ${esc(h.texto.slice(0, 70))}${h.texto.length > 70 ? '…' : ''}</option>`).join('');
}

function opcoesEscolas(selecionado, apenasEscopo) {
  let esc_ = apenasEscopo ? escopoEscolas() : listarEscolas();
  return esc_.map(e => `<option value="${e.id}" ${selecionado === e.id ? 'selected' : ''}>${esc(e.nome)}</option>`).join('');
}

function opcoesTurmas(selecionado) {
  const turmas = new Set();
  getDB().registros.forEach(r => { if (r.turma) turmas.add(r.turma); });
  getDB().eventos.forEach(e => { if (e.turma) turmas.add(e.turma); });
  const arr = Array.from(turmas).sort();
  return '<option value="">Todas as turmas</option>' + arr.map(t => `<option value="${esc(t)}" ${selecionado === t ? 'selected' : ''}>${esc(t)}</option>`).join('');
}

/* Gráfico de barras simples em HTML/CSS (sem dependências) */
function graficoBarras(dados, cor) {
  if (!dados.length) return vazio('📊', 'Sem dados', 'Ainda não há dados registrados.');
  return dados.map(d => `
    <div class="barra-linha">
      <div class="nome" title="${esc(d.rotulo)}">${esc(d.rotulo)}</div>
      ${barraProgresso(d.valor, cor)}
      <div class="pct">${d.valor}%</div>
    </div>`).join('');
}

/* Gráfico de linha simples (SVG) para evolução */
function graficoLinha(pontos, largura = 640, altura = 200) {
  if (!pontos.length) return vazio('📈', 'Sem dados', 'Ainda não há dados registrados.');
  const max = Math.max(...pontos.map(p => p.valor), 1);
  const pad = 30;
  const w = largura - pad * 2, h = altura - pad * 2;
  const step = pontos.length > 1 ? w / (pontos.length - 1) : 0;
  const coords = pontos.map((p, i) => [pad + i * step, pad + h - (p.valor / max) * h]);
  const path = coords.map((c, i) => (i === 0 ? 'M' : 'L') + c[0].toFixed(1) + ' ' + c[1].toFixed(1)).join(' ');
  const area = path + ` L${coords[coords.length - 1][0].toFixed(1)} ${pad + h} L${coords[0][0].toFixed(1)} ${pad + h} Z`;
  const labels = pontos.map((p, i) => `<text x="${coords[i][0].toFixed(1)}" y="${altura - 8}" font-size="10" fill="#7b8794" text-anchor="middle">${esc(p.rotulo)}</text>`).join('');
  const dots = coords.map((c, i) => `<circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="4" fill="#2563a8"><title>${esc(pontos[i].rotulo)}: ${pontos[i].valor}%</title></circle>`).join('');
  return `<svg viewBox="0 0 ${largura} ${altura}" style="width:100%;height:auto" role="img" aria-label="Gráfico de evolução">
    <path d="${area}" fill="rgba(37,99,168,.12)"/>
    <path d="${path}" fill="none" stroke="#2563a8" stroke-width="2.5"/>
    ${dots}${labels}
  </svg>`;
}

/* Gráfico de rosca (donut) */
function graficoRosca(pct, rotulo) {
  const r = 52, c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  const cor = pct >= 75 ? '#2fbf71' : pct >= 40 ? '#f0b429' : '#e04b3a';
  return `<div style="text-align:center">
    <svg viewBox="0 0 140 140" style="width:150px;height:150px" role="img" aria-label="${esc(rotulo)}: ${pct}%">
      <circle cx="70" cy="70" r="${r}" fill="none" stroke="#e4e7eb" stroke-width="14"/>
      <circle cx="70" cy="70" r="${r}" fill="none" stroke="${cor}" stroke-width="14"
        stroke-dasharray="${c}" stroke-dashoffset="${off}" stroke-linecap="round"
        transform="rotate(-90 70 70)"/>
      <text x="70" y="76" text-anchor="middle" font-size="26" font-weight="800" fill="#0b2545">${pct}%</text>
    </svg>
    <div style="font-size:.82rem;color:var(--cinza-500);font-weight:600">${esc(rotulo)}</div>
  </div>`;
}
