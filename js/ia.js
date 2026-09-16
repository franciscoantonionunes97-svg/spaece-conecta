/* ============================================================
   SPAECE CONECTA — Assistente Pedagógico (IA)
   REGRA INEGOCIÁVEL: a IA NUNCA inventa habilidades, códigos ou
   descritores. Todo conteúdo é gerado a partir da habilidade
   OFICIAL selecionada na Matriz cadastrada pela Secretaria.
   Todo material é identificado como "Gerada com apoio de IA".
   ============================================================ */

const IA = {

  /* Valida a habilidade contra a Matriz Oficial. Retorna null se não existir. */
  validarHabilidade(habilidadeId) {
    if (!matrizDisponivel()) return { erro: 'matriz' };
    const h = obterHabilidade(habilidadeId);
    if (!h) return { erro: 'habilidade' };
    return { habilidade: h };
  },

  /* ---------- Geração de ATIVIDADE ---------- */
  gerarAtividade(opts) {
    const v = this.validarHabilidade(opts.habilidadeId);
    if (v.erro) return v;
    const h = v.habilidade;
    const n = Math.max(1, Math.min(10, parseInt(opts.qtd || 5, 10)));
    const dificuldade = opts.dificuldade || 'Média';
    const genero = opts.genero || 'Texto informativo';
    const contexto = opts.contexto || 'cotidiano escolar';
    const objetivo = opts.objetivo || `Desenvolver a habilidade ${h.codigo} por meio de leitura e interpretação.`;

    const textoBase = this._textoBase(genero, contexto, h);
    const questoes = [];
    for (let i = 0; i < n; i++) {
      questoes.push(this._questao(i, h, dificuldade, genero, contexto));
    }

    return {
      habilidade: h,
      atividade: {
        titulo: `Atividade — ${h.codigo}: ${this._resumo(h.texto)}`,
        habilidadeId: h.id,
        objetivo,
        orientacao: `Professor(a), esta atividade foi elaborada para trabalhar a habilidade oficial ${h.codigo}. `
          + `Recomenda-se: (1) ativar conhecimentos prévios; (2) leitura compartilhada do texto-base; `
          + `(3) resolução individual; (4) correção comentada; (5) registro da aplicação no sistema. `
          + `Ajuste o vocabulário e o tempo conforme a realidade da turma.`,
        textoBase,
        questoes,
        dificuldade,
        tipo: opts.tipo || 'Atividade',
        genero,
        tema: contexto,
        origemIA: true
      }
    };
  },

  /* ---------- Geração de PLANO ---------- */
  gerarPlano(opts) {
    const v = this.validarHabilidade(opts.habilidadeId);
    if (v.erro) return v;
    const h = v.habilidade;
    const turma = opts.turma || '—';
    const duracao = opts.duracao || '2 aulas';
    const objetivo = opts.objetivo || `Trabalhar a habilidade ${h.codigo} com a turma ${turma}.`;
    const recursos = opts.recursos || 'Quadro, textos impressos, projetor (se disponível)';
    const caracteristicas = opts.caracteristicas || 'Turma heterogênea, com diferentes níveis de leitura.';
    const metodologia = opts.metodologia || 'Sequência didática com leitura, discussão e produção.';

    return {
      habilidade: h,
      plano: {
        titulo: `Plano de Aula — ${h.codigo}`,
        habilidadeId: h.id,
        turma, duracao, objetivo,
        conteudo: {
          identificacao: `Habilidade Oficial ${h.codigo} — ${h.texto}`,
          habilidadeOficial: `${h.codigo} — ${h.texto}`,
          objetivo,
          conhecimentosPrevios: `Levantar o que os estudantes já sabem sobre o tema e sobre o tipo de texto envolvido na habilidade ${h.codigo}. `
            + `Aplicar uma sondagem oral ou escrita breve para diagnosticar o ponto de partida da turma.`,
          desenvolvimento: `1) Apresentação da habilidade e do objetivo da aula.\n`
            + `2) Leitura e exploração de um texto adequado ao 9º ano.\n`
            + `3) Atividades guiadas focadas na habilidade ${h.codigo}.\n`
            + `4) Prática autônoma com correção comentada.\n`
            + `5) Sistematização dos aprendizados.`,
          metodologia,
          atividades: `Atividade diagnóstica, atividade principal vinculada à habilidade ${h.codigo}, `
            + `e atividade de fixação. Utilizar o repositório do sistema para selecionar materiais já vinculados a esta habilidade.`,
          recursos,
          avaliacao: `Avaliação processual: observação da participação, análise das respostas das atividades e, `
            + `quando possível, aplicação de simulado pedagógico com registro de resultados por habilidade.`,
          intervencao: `Para estudantes com maior dificuldade, retomar com exemplos concretos, apoio em duplas e `
            + `mediação individual. Registrar as estratégias utilizadas.`,
          retomada: `Caso os resultados indiquem desempenho abaixo do esperado na habilidade ${h.codigo}, `
            + `planejar nova abordagem com recurso diferenciado (jogo, atividade em grupo ou novo texto).`,
          atividadeComplementar: `Propor uma tarefa que relacione a habilidade ${h.codigo} a situações do cotidiano `
            + `dos estudantes, estimulando a aplicação do que foi aprendido.`,
          caracteristicasTurma: caracteristicas
        },
        origemIA: true
      }
    };
  },

  /* ---------- Geração de JOGO ---------- */
  gerarJogo(opts) {
    const v = this.validarHabilidade(opts.habilidadeId);
    if (v.erro) return v;
    const h = v.habilidade;
    const tipo = opts.tipo || 'Quiz';
    return {
      habilidade: h,
      jogo: {
        titulo: `${tipo} — ${h.codigo}`,
        tipo,
        habilidadeId: h.id,
        objetivo: `Reforçar, de forma lúdica, a habilidade oficial ${h.codigo}: ${this._resumo(h.texto)}.`,
        regras: this._regrasJogo(tipo),
        materiais: tipo === 'Cartas' || tipo === 'Trilha' ? 'Cartas impressas, tabuleiro, marcadores' : 'Quadro, projetor ou cartões',
        origemIA: true
      }
    };
  },

  /* ---------- Sugestão de retomada ---------- */
  sugerirRetomada(habilidadeId) {
    const v = this.validarHabilidade(habilidadeId);
    if (v.erro) return v;
    const h = v.habilidade;
    return {
      habilidade: h,
      sugestoes: [
        `Retomar a habilidade ${h.codigo} com uma nova atividade de menor complexidade.`,
        `Aplicar um jogo pedagógico vinculado à habilidade ${h.codigo} para reforço lúdico.`,
        `Realizar revisão em pequenos grupos com mediação do professor.`,
        `Aplicar novo simulado pedagógico focado nesta habilidade e registrar os resultados.`,
        `Elaborar plano de retomada com metodologia diferenciada.`
      ]
    };
  },

  /* ---------- Helpers internos ---------- */
  _resumo(texto) {
    const t = String(texto).trim();
    return t.length > 60 ? t.slice(0, 60) + '…' : t;
  },

  _textoBase(genero, contexto, h) {
    return `[Texto-base sugerido — gênero: ${genero}]\n\n`
      + `Este texto-base foi gerado como apoio para trabalhar a habilidade oficial ${h.codigo} `
      + `(${this._resumo(h.texto)}) em contexto de ${contexto}.\n\n`
      + `O professor deve revisar, adaptar e, preferencialmente, substituir por um texto autêntico `
      + `adequado à realidade da turma. A habilidade trabalhada é a da Matriz Oficial cadastrada.`;
  },

  _questao(i, h, dificuldade, genero, contexto) {
    const letras = ['A', 'B', 'C', 'D'];
    const correta = i % 4;
    const alternativas = letras.map((l, idx) => ({
      letra: l,
      texto: idx === correta
        ? `Alternativa correta relacionada à habilidade ${h.codigo} (revisar e adaptar).`
        : `Alternativa incorreta ${idx + 1} (revisar e adaptar).`
    }));
    return {
      enunciado: `Questão ${i + 1} (${dificuldade}) — Com base no texto, assinale a alternativa que melhor atende à habilidade ${h.codigo}.`,
      textoBase: '',
      alternativas,
      correta: letras[correta],
      justificativa: `A alternativa correta atende ao que a habilidade oficial ${h.codigo} propõe. `
        + `Professor(a), revise o enunciado e as alternativas antes de aplicar.`,
      dificuldade,
      origemIA: true
    };
  },

  _regrasJogo(tipo) {
    const base = {
      'Quiz': 'Divida a turma em equipes. Leia as perguntas; cada equipe responde em até 30 segundos. Marque pontos por acerto.',
      'Verdadeiro ou Falso': 'Leia afirmações sobre a habilidade. Os estudantes levantam placas VERDADEIRO/FALSO. Discuta cada resposta.',
      'Associação': 'Distribua cartões com conceitos e exemplos. Os estudantes devem associá-los corretamente.',
      'Caça ao erro': 'Apresente frases com erros relacionados à habilidade. As equipes identificam e corrigem.',
      'Completar': 'Entregue textos com lacunas. Os estudantes completam aplicando a habilidade trabalhada.',
      'Cartas': 'Distribua cartas com desafios. Cada estudante resolve e explica sua resposta à turma.',
      'Trilha': 'Monte uma trilha com casas. Ao cair em cada casa, o estudante resolve um desafio da habilidade.',
      'Desafio em equipe': 'Proponha um desafio coletivo. As equipes colaboram para resolver e apresentar a solução.',
      'Perguntas rápidas': 'Faça perguntas rápidas em sequência. Estimule respostas ágeis e corretas.'
    };
    return base[tipo] || base['Quiz'];
  }
};
