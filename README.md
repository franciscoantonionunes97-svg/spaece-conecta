# SPAECE CONECTA — Sistema Web Educacional

**LÍNGUA PORTUGUESA — 9º ANO**
**PLANEJAR • TRABALHAR • AVALIAR • ACOMPANHAR**

Plataforma institucional de apoio e monitoramento do trabalho pedagógico com as habilidades da **Matriz Oficial do SPAECE**, desenvolvida para a **Secretaria Municipal de Educação de Ararendá**.

---

## 1. O que é este sistema

O SPAECE Conecta é um sistema web educacional que apoia e monitora o trabalho pedagógico das escolas municipais de Ararendá em Língua Portuguesa do 9º ano. Ele permite que professores planejem, registrem e acompanhem o trabalho com as habilidades da Matriz Oficial do SPAECE, e que a Secretaria monitore a **cobertura** e o **desempenho** da rede de forma pedagógica, sem ranking e sem linguagem punitiva.

### Regra fundamental (anti-alucinação)

> **O sistema NUNCA inventa habilidades, descritores, códigos, competências ou indicadores.**

Todo conteúdo é vinculado **exclusivamente** à Matriz Oficial do SPAECE cadastrada/importada pela Secretaria. Enquanto a matriz não estiver cadastrada, o sistema exibe:

> *"A Matriz Oficial do SPAECE ainda não foi cadastrada no sistema. Cadastre ou importe a versão oficial antes de criar conteúdos vinculados às habilidades."*

A matriz inicia **vazia** e só é preenchida por importação ou cadastro manual do administrador.

---

## 2. Como acessar

1. Abra o arquivo `index.html` (ou a URL publicada).
2. Faça login com o e-mail institucional.
3. No **primeiro acesso**, o sistema solicita a definição de uma senha pessoal (mínimo 6 caracteres). Nenhuma senha é armazenada em texto puro — todas são protegidas por hash SHA-256 com salt individual.

### Usuários iniciais (sem senha — definida no primeiro acesso)

| Nome | E-mail | Perfil |
|------|--------|--------|
| FRANCISCO ANTONIO NUNES GOMES | francisco.gomes@ararenda.ce.gov.br | Administrador da Secretaria |
| DJANAINE | djanaine@ararenda.ce.gov.br | Técnico da Secretaria |

> **Importante:** as senhas **não** estão no código. Cada usuário define a sua no primeiro acesso.

### Identificação no primeiro acesso

Ao detectar o primeiro acesso, o sistema **identifica o usuário** antes de pedir a senha, exibindo um cartão com:
- **Avatar** com as iniciais (colorido conforme o perfil);
- **Nome completo** do usuário;
- **Perfil** (Administrador da Secretaria, Técnico da Secretaria, Gestor Escolar ou Professor).

Assim o usuário confirma que está entrando com a conta correta antes de definir a senha.

### Entrar com Google

A tela de login (e também o bloco de **primeiro acesso**) oferece a opção **"Entrar com Google"**. O usuário informa o **e-mail institucional** cadastrado pela Secretaria e a autenticação é feita pela conta Google — **nenhuma senha é criada ou armazenada** nesse fluxo. O sistema valida o e-mail contra os usuários cadastrados:

- E-mail **cadastrado e ativo** → login realizado (registrado no log como "Login com Google").
- E-mail **não cadastrado** → mensagem: *"Este e-mail não está cadastrado no sistema. Procure a Secretaria Municipal de Educação."*
- Usuário **inativo** → acesso bloqueado.

> O login com Google **não** substitui o controle de acesso: apenas usuários previamente cadastrados pela Secretaria podem entrar.

---

## 3. Perfis de acesso

| Perfil | O que pode fazer |
|--------|------------------|
| **Administrador da Secretaria** | Tudo: matriz oficial, usuários, escolas, monitoramento, relatórios, logs |
| **Técnico da Secretaria** | Monitoramento, relatórios, matriz (conferência), acompanhamento das escolas |
| **Gestor Escolar** | Acompanhamento da própria escola, cobertura, alertas, relatórios da escola |
| **Professor** | Dashboard pedagógico, atividades, jogos, simulados, IA, minhas habilidades, registros |

O menu se adapta automaticamente ao perfil do usuário.

---

## 4. Escolas da rede

- EEF 21 DE DEZEMBRO
- EEF JOAQUIM FERREIRA DA SILVA
- EEF JOSE ALVES DE SENA
- EEF ANTONIO DE SOUZA BARROS
- EEIF 03 DE DEZEMBRO
- EEF FIRMINO JOSE

Nenhuma escola fictícia é criada. Novas escolas podem ser cadastradas pelo administrador.

---

## 5. Módulos do sistema

### 5.1 Matriz Oficial (área administrativa)
- Importação por **PDF, planilha, texto estruturado ou cadastro manual**.
- Tela de **conferência** antes da confirmação.
- Confirmação explícita pelo administrador.
- Enquanto não confirmada, o sistema bloqueia a criação de conteúdos vinculados.
- **Remover habilidade individual:** na aba **Conferência**, cada linha tem o botão *Remover*.
- **Excluir a Matriz inteira:** botão *🗑️ Excluir Matriz inteira* no cartão de status. Remove todas as habilidades e reinicia a matriz — útil quando os dados importados/colados estiverem incorretos. Exige digitar a palavra **EXCLUIR** para confirmar (proteção contra exclusão acidental).
- **Links de materiais (Drive):** na aba **🔗 Links de materiais**, o administrador cadastra manualmente o link de material de cada habilidade (ex.: pasta/arquivo do Google Drive). Ao clicar na habilidade, o professor vê o botão **📂 Abrir material** e é direcionado ao conteúdo. Também é possível cadastrar uma **📁 Pasta geral de materiais** (Drive) com todos os jogos, simulados e atividades — ela aparece como botão nas telas de Atividades, Jogos e Simulados.
- **Materiais com categoria (link ou PDF):** o administrador cadastra um material escolhendo **onde exibir** (📝 Atividades, 🎮 Jogos ou 📋 Simulados) e o **tipo**: **🔗 Link** (Drive/site) ou **📄 Arquivo PDF** enviado do computador. Os PDFs são guardados no **IndexedDB** do navegador (suporta arquivos grandes) e aparecem para os professores com o botão **📄 Abrir PDF**. Cada material pode ser vinculado a uma habilidade oficial (opcional).

### 5.2 Dashboard do Professor
- Cards grandes, com ícones e botões de acesso rápido (não menus pequenos).
- Indicadores de cobertura, registros, atividades e habilidades pendentes.

### 5.3 Repositório de Atividades e Banco de Questões
- Atividades vinculadas a habilidades oficiais.
- Banco de questões por habilidade.

### 5.4 Jogos Pedagógicos
- Jogos vinculados às habilidades da matriz.

### 5.5 Simulados
- Geração, aplicação e registro de resultados por turma.

### 5.6 IA Pedagógica (assistente, não substituto)
- **Criar Atividade com IA**, **Criar Plano com IA**, **Criar Jogo com IA**.
- Toda sugestão é marcada como `origemIA` e **exige revisão humana** antes de uso.
- A IA só trabalha com habilidades da Matriz Oficial.

### 5.7 Minhas Habilidades
Painel com status por habilidade:
- 🟢 **TRABALHADA**
- 🟡 **TRABALHADA — PRECISA DE RETOMADA**
- 🔴 **AINDA NÃO TRABALHADA**

### 5.8 Registro de Atividade, Evidências, Calendário e Histórico
- Registro do trabalho realizado (evidências pedagógicas).
- Calendário de ações.
- Histórico de atividades do sistema.

### 5.9 Monitoramento (Secretaria)
- **Painel de Monitoramento SPAECE** (cards).
- **Mapa de Cobertura da Matriz** (heatmap).
- **Painel por Escola** e **Comparação** — sem ranking e sem linguagem punitiva.
- **Alertas pedagógicos** e indicadores.
- **Relatórios** com impressão/PDF.
- Página **"Como estamos?"**.

---

## 6. Cobertura × Desempenho (distinção essencial)

O sistema separa rigorosamente dois conceitos:

- **COBERTURA** — indica se a habilidade **já foi trabalhada** (existe registro de trabalho). Não mede resultado.
- **DESEMPENHO** — indica o **resultado dos estudantes** (percentual de acerto em avaliações/simulados).

Uma habilidade pode estar **coberta** (trabalhada) e ainda assim ter **desempenho baixo** — o que gera o status 🟡 *precisa de retomada*.

---

## 7. Sem dados fictícios

O sistema **não cria dados fictícios**. Quando não há dados, exibe mensagens como *"AINDA NÃO HÁ DADOS REGISTRADOS"*. Todos os números exibidos vêm de registros reais feitos pelos usuários.

---

## 8. Segurança e LGPD

- Autenticação por e-mail e senha.
- Senhas protegidas por **SHA-256 + salt** (Web Crypto API). Nenhuma senha em texto puro.
- Controle de permissões por perfil (RBAC).
- Escopo de acesso por escola.
- Registro de logs de ações.
- Dados armazenados localmente no navegador (localStorage) nesta versão.

---

## 9. Responsividade e acessibilidade

- Layout responsivo para **desktop, tablet e celular**.
- Menu lateral recolhível em telas pequenas.
- Estilos de **impressão** para relatórios (impressão/PDF).
- Navegação por teclado, link "pular para o conteúdo", rótulos ARIA e foco visível.

---

## 10. Estrutura de arquivos

```
/
├── index.html          # Shell da SPA (login + aplicação)
├── css/
│   └── styles.css      # Design system institucional (responsivo + impressão)
├── js/
│   ├── store.js        # Camada de dados (localStorage) + seed
│   ├── auth.js         # Autenticação, perfis e permissões
│   ├── ui.js           # Utilitários de UI, gráficos e avisos
│   ├── ia.js           # IA pedagógica (valida contra a Matriz Oficial)
│   ├── paginas.js      # Renderização de todas as páginas
│   └── app.js          # Controlador principal, menu e eventos
├── README.md           # Esta documentação
└── todo.md             # Plano de execução do projeto
```

---

## 11. Tecnologia

- **HTML5 + CSS3 + JavaScript (vanilla)** — sem frameworks.
- Persistência em **localStorage**.
- **Web Crypto API** para hash de senhas.
- Gráficos em **HTML/CSS/SVG** (sem bibliotecas externas).
- Arquitetura modular e preparada para expansão futura (novos componentes/anos), mantendo **apenas Língua Portuguesa — 9º ano** nesta versão.

---

## 12. Como executar localmente

```bash
# Na pasta do projeto
python3 -m http.server 8080
# Acesse http://localhost:8080
```

---

## 13. Fluxo recomendado de implantação

1. Administrador faz login e define a senha.
2. Administrador importa/cadastra a **Matriz Oficial do SPAECE** e **confirma**.
3. Administrador cadastra usuários (gestores e professores) e vincula às escolas.
4. Professores planejam, criam atividades/jogos/simulados (com apoio da IA) e **registram** o trabalho.
5. Secretaria acompanha **cobertura**, **desempenho**, **alertas** e emite **relatórios**.

---

*Secretaria Municipal de Educação de Ararendá — Plataforma institucional de apoio e monitoramento do trabalho pedagógico com as habilidades da Matriz Oficial do SPAECE.*
