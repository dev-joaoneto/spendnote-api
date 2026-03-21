💸 SpendNote API

API robusta para gerenciamento de finanças pessoais, projetada para fornecer controle completo sobre receitas, despesas e análise financeira em tempo real.

O SpendNote foi desenvolvido com foco em escalabilidade, segurança e organização de código, oferecendo uma base sólida para aplicações modernas de controle financeiro.

📌 Visão Geral

O SpendNote API é o backend responsável por toda a lógica de negócio de uma aplicação de finanças pessoais. Ele permite que usuários registrem, consultem e analisem suas transações financeiras de forma eficiente.

A API foi construída seguindo princípios de arquitetura limpa, separação de responsabilidades e boas práticas amplamente utilizadas no mercado.

Um dos diferenciais do projeto é a utilização do Firebase Authentication, garantindo um fluxo seguro e moderno de autenticação baseado em tokens confiáveis.

🚀 Tecnologias Utilizadas
**Backend**

-Node.js

-TypeScript

-Axios

Banco de Dados

- MongoDB

- Prisma 

Autenticação e Segurança

- Firebase Authentication

- Firebase Admin SDK

- ID Token (JWT do Firebase)

- CORS

Validação e Utilitários

- Zod

- Day.js

DevOps e Qualidade

- Biome

🔐 Autenticação (Firebase)

- A autenticação é feita utilizando o Firebase Authentication.

🔑 Fluxo de autenticação

O usuário realiza login no frontend via Firebase

O Firebase gera um ID Token (JWT)

O frontend envia o token para a API

A API valida o token com o Firebase Admin SDK

O usuário é autenticado nas rotas protegidas

🔒 Benefícios

Tokens seguros e assinados

Sem necessidade de gerenciar senha no backend

Integração simples com frontend

Pronto para escala

⚙️ Funcionalidades

👤 Autenticação segura com Firebase

💰 Registro de transações (income/expense)

📊 Histórico financeiro por período

📅 Filtro por mês e ano

📈 Resumo financeiro

🔐 Proteção de rotas

🧾 Dados isolados por usuário
