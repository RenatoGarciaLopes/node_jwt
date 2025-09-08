## Projeto: Autenticação com Node.js, Express, Sequelize, Redis e JWT

Este projeto implementa autenticação com registro, login, rotas protegidas por JWT, logout com blacklist no Redis e documentação via Swagger.

### Critérios de Aceite (atendidos)
- Usuário consegue se registrar e logar, recebendo um JWT válido
- Rotas protegidas retornam 401 Unauthorized se o token estiver ausente, inválido ou revogado (blacklist)
- Logout adiciona o token à blacklist no Redis com expiração correta (TTL conforme `exp` do JWT)
- Documentação Swagger funcional em `/api-docs`

### Requisitos
- Node.js 18+
- PostgreSQL rodando localmente (ou remoto)
- Redis rodando (pode usar Docker Compose deste repo)

### Subindo o Redis via Docker
```bash
docker compose -f redis.yml up -d
```

### Arquivo .env (na raiz do projeto)
Crie um arquivo `.env` com:
```
PORT=3000
DB_DIALECT=postgres
DATABASE_URL=postgres://postgres:password@localhost:5432/exemplo_node
JWT_SECRET=supersecretjwtkey
JWT_EXPIRES_IN=1h
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=null
```
Observação: a aplicação lê `process.env`. Garanta que o `.env` esteja carregado pelo seu ambiente (p. ex., Docker Compose, sua IDE, ou ferramenta equivalente que injete as variáveis ao iniciar o processo).

### Instalação e Execução
```bash
npm install
npm run dev
```
Servidor: `http://127.0.0.1:3000`

### Documentação (Swagger)
- Acesse: `http://127.0.0.1:3000/api-docs`
- Arquivo: `docs/swagger.yml`

### Endpoints principais
- `POST /auth/register` — registra usuário
- `POST /auth/login` — autentica e retorna JWT
- `POST /auth/logout` — invalida o token (blacklist no Redis). Requer header `Authorization: Bearer <token>`

### Fluxo demonstrativo (prints)
- Registro

![register](docs/prints/register.png)

- Login (retorna token JWT)

![login](docs/prints/login.png)

- Logout com sucesso (token é adicionado à blacklist)

![logoutComSucesso](docs/prints/logoutComSucesso.png)

- Logout repetido (token já revogado → 401 Unauthorized)

![logoutRepetido(invalido)](<docs/prints/logoutRepetido(invalido).png>)

### Notas técnicas
- Blacklist: chave no Redis `blacklist:token:<token>` com TTL baseado no `exp` do JWT
- Middleware de auth verifica blacklist antes de validar o token
- Configurações são lidas de `process.env` (`src/Config/index.js`)

### Entrega
- Repositório GitHub: substitua este texto pelo link do seu repositório público
- Inclua os prints acima na pasta `docs/prints/`


