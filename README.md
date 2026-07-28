# JORNADA — Gestão de Excursões da sua Igreja

> **Assinatura**: Gestão de excursões da sua igreja.  
> Sistema completo, responsivo, funcional e de alta performance desenvolvido para o gerenciamento administrativo de excursões realizadas por igrejas, congregações, departamentos, grupos de jovens e ministérios.

---

## 🏛️ Visão Geral

O **JORNADA** permite organizar viagens de van, micro-ônibus, ônibus ou veículos próprios com total controle sobre:
- **Cadastro e Gestão de Excursões**: datas, horários, pontos de embarque, lotação e políticas.
- **Passageiros e Inscrições**: formulário público com aprovação manual, cadastro individual, dados de emergência e menores de idade.
- **Controle Financeiro e Comprovantes**: pagamentos parcelados, arrecadação por Pix, recibos impressos e módulo de análise de comprovantes.
- **Gestão de Veículos e Assentos**: mapa de assentos configurável ou distribuição simples por veículo.
- **Embarque & Check-in Mobile**: modo otimizado para celulares no dia da viagem com suporte a operação offline e sincronização automática.
- **Central de Mensagens WhatsApp**: gerador de modelos com tags dinâmicas (`{nome}`, `{excursao}`, `{valor_total}`, `{chave_pix}`).
- **Documentos e Auditoria**: armazenamento seguro de contratos e histórico de ações.
- **Relatórios Imprimíveis**: exportação em CSV e listas prontas para impressão sem menus.

---

## 🎨 Identidade Visual e Design

- **Cor Principal (Navegação & Destaque Administrativo)**: Azul Profundo `#172A3A`
- **Cor de Destaque / Ação**: Terracotta `#C45D3C`
- **Fundo Principal**: Marfim Suave `#F6F2E9`
- **Cor Positiva / Confirmados**: Verde Escuro `#356859`
- **Cor de Alerta / Pendências**: Vermelho Sóbrio `#B54747`
- **Tipografia**: **Archivo** (Títulos, métricas, botões) e **Source Sans 3** (Textos, tabelas, formulários)

---

## 🚀 Tecnologias Utilizadas

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Banco de Dados & Autenticação**: [PostgreSQL / Supabase](https://supabase.com/)
- **Armazenamento de Arquivos**: Supabase Storage (Buckets privados com URLs assinadas temporárias)
- **Isolamento Multi-tenant**: Row Level Security (RLS) por igreja (`church_id`)

---

## 🛠️ Instruções para Execução Local

### 1. Clonar o Repositório e Instalar Dependências

```bash
git clone https://github.com/usuario/jornada-gestao-excursoes.git
cd jornada-gestao-excursoes
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com base no arquivo `.env.example`:

```bash
cp .env.example .env.local
```

Preencha com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-publica
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-privada
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Executar o Servidor de Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🗄️ Configuração do Banco de Dados e Armazenamento no Supabase

### 1. Criar as Tabelas e Políticas de Segurança (RLS)

1. Acesse o **SQL Editor** do seu projeto no Supabase Dashboard.
2. Execute o conteúdo do arquivo SQL localizado em:
   `supabase/migrations/20260728000000_jornada_schema.sql`

Este script criará todas as tabelas (`churches`, `church_users`, `excursions`, `vehicles`, `passengers`, `payments`, `payment_receipts`, `expenses`, `excursion_documents`, `audit_logs`), os índices e as políticas de segurança RLS.

### 2. Configurar os Buckets de Armazenamento de Arquivos

No SQL Editor do Supabase, execute o script em:
`supabase/storage.sql`

Isso criará os buckets privados `receipts` (comprovantes) e `documents` (contratos), e o bucket público `logos`.

---

## 🌐 Publicação na Vercel (Deployment)

1. Faça o push do código para o seu repositório no GitHub:
   ```bash
   git add .
   git commit -m "feat: Sistema JORNADA pronto para produção"
   git branch -M main
   git push -u origin main
   ```
2. Na [Vercel](https://vercel.com/), clique em **"Add New"** > **"Project"** e importe o repositório `jornada-gestao-excursoes`.
3. Na seção **Environment Variables**, cadastre as seguintes variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (URL final da Vercel, ex: `https://jornada-sua-igreja.vercel.app`)
4. Clique em **Deploy**.
5. No Supabase Dashboard em **Authentication** > **URL Configuration**, adicione a URL da Vercel em **Site URL** e **Redirect URLs**.

---

## 📜 Licença

Propriedade administrativa desenvolvida para igrejas e congregações.
