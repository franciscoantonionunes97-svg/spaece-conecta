# 🚀 Como publicar o SPAECE Conecta no GitHub

Este guia mostra, passo a passo, como enviar o projeto para o GitHub.

---

## ✅ O que já está pronto

O repositório Git **já foi criado localmente** com:
- Commit inicial com todo o projeto
- Arquivo `.gitignore` configurado
- Licença MIT (`LICENSE`)
- Workflow de publicação automática no GitHub Pages (`.github/workflows/deploy-pages.yml`)

Falta apenas **criar o repositório no GitHub** e **enviar (push)** os arquivos.

---

## 📋 Pré-requisitos

1. Ter uma conta no **GitHub** (https://github.com).
2. Ter o **Git** instalado no seu computador.
3. (Opcional) Ter o **GitHub CLI** (`gh`) instalado.

---

## 🅰️ Opção A — Pelo site do GitHub (mais simples)

### 1. Crie o repositório no GitHub
1. Acesse https://github.com/new
2. Em **Repository name**, digite: `spaece-conecta`
3. Escolha **Public** (público) ou **Private** (privado)
4. **NÃO** marque "Add a README file" (já temos um)
5. Clique em **Create repository**

### 2. Envie os arquivos pelo terminal
No terminal, dentro da pasta do projeto, rode:

```bash
git remote add origin https://github.com/SEU-USUARIO/spaece-conecta.git
git push -u origin main
```

> Troque `SEU-USUARIO` pelo seu nome de usuário do GitHub.

Quando pedir login, use seu **usuário** e um **Personal Access Token** como senha
(o GitHub não aceita mais senha comum — veja como criar o token abaixo).

---

## 🅱️ Opção B — Pelo GitHub CLI (mais rápido)

Se você tem o `gh` instalado e autenticado:

```bash
gh auth login
gh repo create spaece-conecta --public --source=. --push
```

Pronto! O repositório é criado e enviado automaticamente.

---

## 🔑 Como criar um Personal Access Token (PAT)

Se o Git pedir senha, use um token:

1. Acesse https://github.com/settings/tokens
2. Clique em **Generate new token** → **Generate new token (classic)**
3. Dê um nome (ex.: `spaece-conecta`)
4. Marque o escopo **`repo`** (acesso completo a repositórios)
5. Clique em **Generate token**
6. **Copie o token** (ele só aparece uma vez!) e use como senha no `git push`

---

## 🌐 Publicar automaticamente no GitHub Pages

O projeto já inclui um workflow que publica o site automaticamente. Para ativar:

1. No repositório, vá em **Settings** → **Pages**
2. Em **Source**, selecione **GitHub Actions**
3. Faça um `push` para a branch `main`
4. O site ficará disponível em:
   `https://SEU-USUARIO.github.io/spaece-conecta/`

---

## 📁 Estrutura do repositório

```
spaece-conecta/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml   # Publicação automática no GitHub Pages
├── css/
│   └── styles.css             # Design system institucional
├── js/
│   ├── store.js               # Camada de dados (localStorage)
│   ├── auth.js                # Autenticação e perfis
│   ├── ui.js                  # Utilitários de interface
│   ├── ia.js                  # IA pedagógica
│   ├── paginas.js             # Páginas / telas
│   └── app.js                 # Controlador principal
├── index.html                 # Página principal (SPA)
├── README.md                  # Documentação
├── LICENSE                    # Licença MIT
├── .gitignore                 # Arquivos ignorados
└── COMO-PUBLICAR-NO-GITHUB.md # Este guia
```

---

## 🆘 Problemas comuns

**"remote origin already exists"**
```bash
git remote set-url origin https://github.com/SEU-USUARIO/spaece-conecta.git
```

**"Authentication failed"**
Use um Personal Access Token (veja acima) em vez da senha.

**"failed to push some refs"**
Se o repositório remoto já tiver arquivos:
```bash
git pull origin main --rebase
git push -u origin main
```

---

*Secretaria Municipal de Educação de Ararendá — SPAECE Conecta*
