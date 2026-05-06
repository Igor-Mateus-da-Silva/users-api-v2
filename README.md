# Users API v2

API REST para cadastro e gestão de usuários, construída com **Node.js**, **TypeScript** e **Express**, persistência em **MongoDB** via **Mongoose** e deploy como função serverless na **Vercel**.

**Produção:** [https://users-api-v2.vercel.app/](https://users-api-v2.vercel.app/)

Resposta inicial da raiz (`GET /`):

```json
{
  "message": "Users API v2 online",
  "status": "ok"
}
```

---

## Sumário

- [Objetivo](#objetivo)
- [Stack e ferramentas](#stack-e-ferramentas)
- [Arquitetura](#arquitetura)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Configuração e execução local](#configuração-e-execução-local)
- [Consumo dos endpoints](#consumo-dos-endpoints)
- [Modelo de dados](#modelo-de-dados)
- [Deploy na Vercel](#deploy-na-vercel)
- [Decisões de design e evolução](#decisões-de-design-e-evolução)

---

## Objetivo

Expor operações CRUD sobre usuários com separação clara entre camadas (rotas → controlador → serviço → modelo), tipagem forte em TypeScript e uma instância estável na nuvem para testes e integração.

---

## Stack e ferramentas

| Camada | Tecnologia |
|--------|------------|
| Runtime | Node.js (ES modules) |
| Linguagem | TypeScript (strict, `module` / `moduleResolution`: NodeNext) |
| HTTP | Express 4 |
| Banco | MongoDB |
| ODM | Mongoose 9 |
| Config local | dotenv |
| Dev | `tsx` (watch em desenvolvimento) |
| Hospedagem | Vercel (`@vercel/node`, roteamento para `api/index.ts`) |

---

## Arquitetura

Fluxo típico de uma requisição:

1. **Express** recebe JSON (`express.json()`).
2. **Rotas** (`userRoutes`) encaminham para métodos do **controlador**.
3. O **controlador** valida parâmetros básicos, chama o **serviço** e define status HTTP.
4. O **serviço** orquestra chamadas ao **modelo Mongoose** (consultas e mutações).
5. Erros não tratados no controlador podem ser capturados pelo **middleware de erro** (ex.: validação Mongoose → 400).

Em ambiente **local**, o processo sobe com `src/server.ts`: conecta ao MongoDB e escuta uma porta TCP.

Em **produção na Vercel**, `api/index.ts` atua como handler serverless: garante conexão com o banco (com cache de conexão) e delega `req`/`res` ao mesmo `app` Express — um único código de aplicação serve dois modos de execução.

---

## Estrutura do repositório

```
├── api/
│   └── index.ts          # Entry serverless (Vercel)
├── src/
│   ├── app.ts            # Configuração Express, rotas e health checks
│   ├── server.ts         # Bootstrap local (listen + DB)
│   ├── config/
│   │   └── database.ts   # Conexão MongoDB (reuse em serverless)
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── types/
├── vercel.json           # Builds e rewrite para /api/index.ts
├── package.json
└── tsconfig.json
```

---

## Configuração e execução local

**Pré-requisitos:** Node.js, conta MongoDB Atlas (ou instância compatível com connection string).

1. Clone o repositório e instale dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz:

   ```env
   MONGODB_URI=mongodb+srv://usuario:senha@cluster.example.mongodb.net/nome-do-banco
   PORT=3000
   ```

3. Execute em modo desenvolvimento:

   ```bash
   npm run dev
   ```

4. Build e produção local:

   ```bash
   npm run build
   npm start
   ```

A API local fica disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

---

## Consumo dos endpoints

**Base URL (produção):** `https://users-api-v2.vercel.app`

**Headers recomendados:** `Content-Type: application/json`

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `GET` | `/` | Mensagem de status do serviço |
| `GET` | `/health` | Health check (`status`, `service`) |
| `POST` | `/users` | Cria usuário |
| `GET` | `/users` | Lista todos os usuários |
| `GET` | `/users/:id` | Busca por ID (ObjectId MongoDB) |
| `PUT` | `/users/:id` | Atualiza campos enviados (parcial) |
| `DELETE` | `/users/:id` | Remove usuário (resposta sem corpo em sucesso) |

### Exemplos com `curl`

**Health:**

```bash
curl -s https://users-api-v2.vercel.app/health
```

**Criar usuário:**

```bash
curl -s -X POST https://users-api-v2.vercel.app/users \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Maria Silva\",\"email\":\"maria@example.com\",\"senha\":\"uma-senha-segura\"}"
```

**Listar:**

```bash
curl -s https://users-api-v2.vercel.app/users
```

**Buscar por ID** (substitua `ID`):

```bash
curl -s https://users-api-v2.vercel.app/users/ID
```

**Atualizar:**

```bash
curl -s -X PUT https://users-api-v2.vercel.app/users/ID \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Maria S. Atualizada\"}"
```

**Excluir:**

```bash
curl -s -o NUL -w "%{http_code}" -X DELETE https://users-api-v2.vercel.app/users/ID
```

Em sucesso, `DELETE` retorna **204** sem corpo.

### Códigos HTTP usuais

- **200** — leitura ou atualização com sucesso  
- **201** — criação com sucesso  
- **204** — exclusão com sucesso  
- **400** — falha de validação (ex.: schema Mongoose)  
- **404** — usuário não encontrado (ou `id` ausente em rotas com parâmetro)  
- **500** — erro interno ou falha no controlador  

Respostas de erro do controlador podem incluir `message` e, em alguns casos, detalhes em `error`.

---

## Modelo de dados

Campos persistidos no MongoDB:

| Campo | Tipo | Observação |
|-------|------|------------|
| `nome` | string | obrigatório, trim |
| `email` | string | obrigatório, único, normalizado em minúsculas |
| `senha` | string | obrigatório no cadastro; **removida** nas serializações `toJSON` / `toObject` — respostas da API **não** devolvem a senha |
| `createdAt` / `updatedAt` | date | preenchidos automaticamente (`timestamps: true`) |

O documento também inclui `_id` gerado pelo MongoDB.

**Corpo típico na criação** (`POST /users`):

```json
{
  "nome": "string",
  "email": "string",
  "senha": "string"
}
```

**Atualização** (`PUT /users/:id`): envie apenas os campos que deseja alterar (objeto parcial).

---

## Deploy na Vercel

- `vercel.json` define build com `@vercel/node` a partir de `api/index.ts` e encaminha todas as rotas para esse handler.
- Variável de ambiente **`MONGODB_URI`** deve estar configurada no painel da Vercel (ou via CLI), com a mesma semântica do ambiente local.
- A função reutiliza conexão quando `connectDatabase` já marcou `isConnected`, reduzindo reconexões a cada invocação.

---

## Decisões de design e evolução

1. **Nome “v2” e TypeScript** — indica uma segunda geração da API com tipagem explícita, módulos ES e `strict` habilitado, facilitando refatoração e contratos estáveis entre camadas.

2. **Camadas explícitas** — controladores finos que delegam ao serviço e modelos Mongoose isolados atendem a manutenção e testes futuros sem misturar HTTP com detalhes de persistência.

3. **Um `app` para local e serverless** — `src/app.ts` concentra rotas e middlewares; `server.ts` só adiciona `listen` para desenvolvimento. Na Vercel, o mesmo `app` evita duplicação de regras de roteamento.

4. **Privacidade da senha nas respostas** — `toJSON` / `toObject` removem `senha` automaticamente, alinhado a boas práticas de não vazar credenciais em payloads.

5. **Próximos passos naturais** — autenticação (JWT ou sessão), hash de senha (ex.: bcrypt) antes de persistir, validação de entrada com schema dedicado (Zod/Joi), paginação em `GET /users`, versionamento de API (`/v1/users`) e testes automatizados. Esses itens não estão implementados no estado atual do repositório; listá-los aqui documenta a direção técnica esperada para evoluções de segurança e escala.

---

## Licença

ISC (conforme `package.json`).
