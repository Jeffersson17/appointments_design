# AgendaPro — Sistema de Agendamento Online

Frontend do painel administrativo para barbearias, construído com **Vue 3 + Vite + JavaScript** (Composition API), Pinia, Vue Router e Axios.

> Projeto exclusivamente em JavaScript. Não utiliza TypeScript.

---

## Como executar

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

---

## Configuração da API

Arquivo `.env` (ou `.env.example`):

```env
VITE_API_URL=http://localhost:8000/api
```

A URL base é consumida pelo cliente Axios em `src/api/client.js`.

---

## Estrutura das pastas

```text
src/
├── api/            # Axios + endpoints preparados para Django REST
├── assets/         # Estilos globais
├── components/     # Componentes reutilizáveis (tabela, modal, layout…)
├── composables/    # Lógica compartilhada (busca/paginação)
├── layouts/        # AuthLayout e AppLayout (sidebar + topbar)
├── mocks/          # Dados mockados para desenvolvimento visual
├── router/         # Rotas e guards de autenticação/perfil
├── services/       # Camada de dados usada pelas views (mocks → API)
├── stores/         # Pinia (auth, sidebar)
├── types/          # Constantes JS (roles, status) — sem TypeScript
├── utils/          # Formatação e permissões
├── views/          # Páginas
├── App.vue
└── main.js
```

---

## Dependências

**Produção**

- `vue`
- `vue-router`
- `pinia`
- `axios`

**Desenvolvimento**

- `vite`
- `@vitejs/plugin-vue`

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/auth/login` | Tela de login (visual) |
| `/cliente/agendar` | Agendamento do cliente (ROLE `CLIENT`) |
| `/app/dashboard` | Dashboard (ADMIN / ENTERPRISE) |
| `/app/enterprises` | Empresas |
| `/app/clients` | Clientes |
| `/app/services` | Serviços / Cortes |
| `/app/appointments` | Agendamentos |

Redirecionamento após login:

- `ADMIN` / `ENTERPRISE` → `/app/dashboard`
- `CLIENT` → `/cliente/agendar`

Contas de teste no login:

- `joao@agendapro.com` → Admin
- `empresa@agendapro.com` → Empresa
- `cliente@agendapro.com` → Cliente

---

## Como os mocks funcionam

Enquanto a API Django não estiver disponível:

1. Os dados ficam em `src/mocks/` (`companies.js`, `clients.js`, `services.js`, `appointments.js`, `user.js`).
2. As views **não** importam mocks diretamente.
3. As views usam `src/services/`, que hoje lê os mocks e simula latência.
4. A pasta `src/api/` contém o cliente Axios e os endpoints, **sem** chamadas automáticas a rotas inexistentes.

---

## Como substituir mocks pela API

Em cada arquivo de `src/services/`:

1. Descomente os imports de `@/api/...`.
2. Troque o retorno mockado pela chamada Axios correspondente.
3. Mantenha a mesma assinatura das funções (`getCompanies`, `removeClient`, etc.).

Exemplo (`companiesService.js`):

```js
import { fetchCompanies } from '@/api/companies'

export const getCompanies = async () => {
  const { data } = await fetchCompanies()
  return data
}
```

Assim a interface permanece intacta.

---

## Controle de acesso por perfil

Perfis previstos (constantes em `src/types/roles.js`):

- `ADMIN`
- `ENTERPRISE`
- `CLIENT`

Permissões por rota em `src/utils/permissions.js`:

| Rota | Perfis |
|------|--------|
| Dashboard / painel | `ADMIN`, `ENTERPRISE` |
| Empresas | `ADMIN` |
| Clientes | `ADMIN`, `ENTERPRISE` |
| Serviços | `ADMIN`, `ENTERPRISE` |
| Agendamentos (painel) | `ADMIN`, `ENTERPRISE` |
| Agendar (cliente) | `CLIENT` |

O guard em `src/router/index.js` verifica autenticação e perfil.  
Usuários mockados ficam em `src/mocks/user.js` e são escolhidos pelo e-mail no login.

A store `auth` já prevê:

- usuário autenticado
- `access_token` / `refresh_token`
- perfil (`role`)
- empresa selecionada (`selectedEnterpriseId`)
- flag `isAuthenticated`

---

## Funcionalidades da interface

- Layout administrativo com sidebar, topbar, logo, avatar e menu do usuário
- Login visual (sem autenticação própria / sem banco local)
- Tabelas com busca, paginação (10 itens) e estado vazio
- Empresas: editar, ativar/desativar, deletar (com confirmação)
- Clientes, Serviços e Agendamentos: editar/deletar (com confirmação)
- Agendamentos: filtros por cliente, data inicial e data final
- Tela de agendamento do cliente (data → horários → cortes)
- Responsivo para desktop, notebook, tablet e celular

