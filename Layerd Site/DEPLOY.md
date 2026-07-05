# Layerd Studios — Guia de Deploy Completo
## Vercel + Supabase + Domínio Cloudflare

---

## PARTE 1 — Supabase (banco de dados + autenticação)

### 1.1 Criar conta e projeto

1. Acesse **supabase.com** e crie uma conta gratuita
2. Clique em **New Project**
3. Dê o nome `layerd-studios`
4. Escolha uma senha forte para o banco (guarde ela)
5. Região: **South America (São Paulo)** — mais rápido para usuários BR
6. Clique em **Create new project** e aguarde ~2 minutos

---

### 1.2 Criar a tabela de scores

1. No painel do Supabase, clique em **SQL Editor** (ícone de terminal no menu esquerdo)
2. Clique em **New query**
3. Cole o conteúdo do arquivo `supabase-schema.sql` (que está na raiz do projeto)
4. Clique em **Run** (ou Ctrl+Enter)
5. Você verá `Success. No rows returned` — isso é correto

---

### 1.3 Pegar as chaves da API

No menu esquerdo, vá em **Project Settings → API**. Você vai precisar de 3 valores:

| Variável                     | Onde está no painel Supabase                    |
|------------------------------|-------------------------------------------------|
| `SUPABASE_URL`               | "Project URL" (ex: `https://xxxx.supabase.co`) |
| `SUPABASE_ANON_KEY`          | "Project API keys → anon public"               |
| `SUPABASE_SERVICE_ROLE_KEY`  | "Project API keys → service_role secret"       |

⚠️ A `SERVICE_ROLE_KEY` tem acesso total ao banco. Nunca exponha no frontend.

---

### 1.4 Ativar autenticação por e-mail

1. No menu esquerdo: **Authentication → Providers**
2. **Email** já vem ativo por padrão — não precisa mudar
3. Opcional: em **Authentication → Email Templates** você pode customizar o e-mail de confirmação com a identidade da Layerd

---

## PARTE 2 — GitHub (repositório do projeto)

### 2.1 Criar repositório

1. Acesse **github.com** e faça login (ou crie conta)
2. Clique em **New repository**
3. Nome: `layerd-studios`
4. Deixe **Private** (recomendado)
5. Clique em **Create repository**

### 2.2 Subir os arquivos

No terminal (Mac/Linux) ou Git Bash (Windows), dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "primeiro deploy"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/layerd-studios.git
git push -u origin main
```

Substitua `SEU_USUARIO` pelo seu nome de usuário no GitHub.

---

## PARTE 3 — Vercel (hospedagem)

### 3.1 Criar conta e importar projeto

1. Acesse **vercel.com** e crie conta (pode usar "Continue with GitHub" — mais fácil)
2. Clique em **Add New → Project**
3. Selecione o repositório `layerd-studios`
4. Clique em **Import**

### 3.2 Configurar o projeto

Na tela de configuração:

- **Framework Preset**: Other
- **Root Directory**: deixe em branco (raiz)
- **Build Command**: deixe em branco (sem build step)
- **Output Directory**: deixe em branco

### 3.3 Adicionar variáveis de ambiente

Antes de clicar em **Deploy**, clique em **Environment Variables** e adicione as 3 chaves do Supabase:

```
SUPABASE_URL               = https://xxxx.supabase.co
SUPABASE_ANON_KEY          = eyJ...
SUPABASE_SERVICE_ROLE_KEY  = eyJ...
```

Para cada uma: escreva o nome, cole o valor, clique em **Add**.

### 3.4 Deploy

Clique em **Deploy**. A Vercel vai:
- Detectar as API routes em `/api/*.js`
- Servir o `/public/index.html` como página principal
- Dar um URL tipo `layerd-studios.vercel.app`

Teste esse URL antes de apontar o domínio.

---

## PARTE 4 — Domínio Cloudflare

### 4.1 Adicionar o domínio na Vercel

1. No painel da Vercel, vá em **Settings → Domains**
2. Digite seu domínio (ex: `layerdstudios.com.br`) e clique em **Add**
3. A Vercel vai te dar dois registros DNS para adicionar

### 4.2 Configurar DNS no Cloudflare

1. Acesse **cloudflare.com** e vá no seu domínio
2. Clique em **DNS → Records**
3. Adicione os registros que a Vercel indicou. Geralmente são:

```
Tipo: CNAME
Nome: @  (ou www)
Conteúdo: cname.vercel-dns.com
```

```
Tipo: CNAME
Nome: www
Conteúdo: cname.vercel-dns.com
```

4. **Importante:** no Cloudflare, desative o proxy (nuvem laranja → nuvem cinza) para os registros que apontam pra Vercel. A Vercel gerencia o SSL sozinha e o proxy do Cloudflare pode causar conflito.

5. Aguarde até 10 minutos para o DNS propagar. A Vercel vai emitir o certificado SSL automaticamente.

---

## PARTE 5 — Deploy contínuo (o mais importante)

A partir de agora, **qualquer mudança no código** que você der push pro GitHub atualiza o site automaticamente:

```bash
# Fez alteração no site?
git add .
git commit -m "descrição da mudança"
git push
```

A Vercel detecta o push e faz deploy em ~30 segundos. Você recebe notificação por e-mail.

---

## Estrutura final do projeto

```
layerd-studios/
├── public/
│   └── index.html          ← o site completo
├── api/
│   ├── auth.js             ← login, cadastro, verificação de token
│   └── ranking.js          ← GET ranking global / POST novo score
├── lib/
│   └── supabase.js         ← cliente Supabase compartilhado
├── supabase-schema.sql     ← rode isso no Supabase SQL Editor
├── package.json
└── vercel.json
```

---

## Resumo de custos

| Serviço   | Plano gratuito inclui                                    |
|-----------|----------------------------------------------------------|
| Vercel    | 100GB bandwidth/mês, deployments ilimitados, 1 domínio  |
| Supabase  | 500MB banco, 50.000 usuários auth, 2GB storage           |
| Cloudflare| Domínio + DNS gratuito (você já tem)                     |

Para o volume de um estúdio em crescimento, o plano gratuito dos três serve tranquilamente por muito tempo.

---

## Problemas comuns

**"Cannot find module '@supabase/supabase-js'"**
→ No painel da Vercel, vá em **Settings → Functions** e confirme que Node.js 18+ está selecionado. Depois refaça o deploy.

**Ranking não aparece / API retorna 500**
→ Verifique se as variáveis de ambiente foram adicionadas corretamente na Vercel. Lembre que depois de adicionar variáveis você precisa refazer o deploy (Deployments → Redeploy).

**Domínio não funciona depois de 10 minutos**
→ Verifique se o proxy do Cloudflare (nuvem laranja) está desligado para os registros da Vercel.

**Usuário cadastrou mas não consegue logar**
→ Por padrão o Supabase envia e-mail de confirmação. Para desativar isso durante testes: **Authentication → Providers → Email → desative "Confirm email"**.
