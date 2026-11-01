# Olhar Público

**O poder é público. A informação também.**

MVP open source e apartidário para consulta contextualizada de dados públicos sobre políticos brasileiros. O diretório público consulta, por padrão, a API oficial da Câmara dos Deputados. PostgreSQL é opcional para a consulta pública e necessário apenas para administração e publicações editoriais persistidas.

Licença: MIT.

## Requisitos

- Node.js 20 ou superior
- pnpm 10
- PostgreSQL somente para persistência e administração

## Executar localmente

```bash
pnpm install
pnpm dev
```

Acesse `http://localhost:3000`. Sem `.env` e sem banco de dados, a home e o diretório consultam deputados federais na [API Dados Abertos da Câmara](https://dadosabertos.camara.leg.br/swagger/api.html?tab=api). A consulta é feita no servidor e usa cache de até uma hora. Quando a API não responde, a interface informa a indisponibilidade; não substitui dados reais por exemplos fictícios.

Para usar o painel administrativo, configure PostgreSQL: copie `.env.example` para `.env`, edite `DATABASE_URL` e `AUTH_SECRET`, e execute `pnpm db:migrate`. Para criar o primeiro administrador, defina `ADMIN_INITIAL_PASSWORD` no ambiente (mínimo de 12 caracteres) e execute:

```bash
pnpm admin:create admin@exemplo.org "Nome do editor"
```

No Windows PowerShell, copie `.env.example` com `Copy-Item .env.example .env` e defina a variável com `$env:ADMIN_INITIAL_PASSWORD="..."` antes do comando.

Para usar somente os perfis fictícios de demonstração, defina `PUBLIC_DATA_SOURCE=demo`. Para usar os perfis cadastrados no PostgreSQL como fonte pública, defina `PUBLIC_DATA_SOURCE=database`.

## Comandos

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
pnpm db:generate
pnpm db:migrate
```

Se o `pnpm` não estiver instalado globalmente, use `npx pnpm@10` no lugar de `pnpm`.

## Estrutura

- `src/app`: rotas públicas, administrativas e APIs do App Router.
- `src/domain`: validação e lógica por domínio; contratos dos agentes.
- `src/infrastructure/camara`: cliente da API da Câmara e validação das respostas.
- `src/lib`: Prisma, autenticação auxiliar e dados fictícios.
- `src/components`: interface reutilizável, incluindo componente base compatível com shadcn/ui.
- `src/components/efferd`: blocos do Efferd UI adaptados ao produto.
- `prisma/schema.prisma`: entidades, relações, estados editoriais e histórico de revisão.

## Fluxo editorial

Publicações começam em `DRAFT`, entram em `IN_REVIEW`, recebem `APPROVED` ou `REJECTED` e só então podem ser publicadas. A API impede aprovação do próprio texto e `PUBLISHED` sem fonte vinculada, aprovação prévia ou por quem escreveu o texto. Cada decisão cria uma revisão. As rotas de escrita exigem sessão de editor ou administrador via Auth.js.

## Fontes e integrações

O conector da Câmara fornece deputados federais, despesas parlamentares e histórico de exercício. O diretório tem paginação. O perfil limita despesas aos 50 registros retornados pela consulta e identifica a fonte de cada item; o gráfico agrega apenas esses registros. A plataforma não afirma que um conjunto vazio representa ausência de gastos. Os modelos de fonte persistida guardam URL, órgão publicador, data de publicação e data de acesso.

Perfis fictícios aparecem somente no modo `demo` e são identificados. Conteúdo encontrado em páginas soltas da internet pode entrar como fonte candidata para revisão, com URL e data de acesso; não é publicado automaticamente como acusação ou fato comprovado. Emendas, processos e checagens ainda precisam de conectores e revisão específicos. Nenhum agente de IA real foi implementado.

## Graphify

O Graphify está configurado para o Codex neste repositório. O grafo inicial está em `graphify-out/graph.json`; `graphify-out/GRAPH_REPORT.md` resume os módulos e `graphify-out/graph.html` permite explorá-los no navegador. A instalação local precisa ter o comando `graphify` no `PATH` (pacote Python `graphifyy`). O hook em `.codex/hooks.json` consulta o grafo antes do uso de ferramentas no Codex.

```bash
graphify query "Como as rotas públicas consultam a API da Câmara?"
graphify update .
graphify cluster-only . --no-label
```

Execute `graphify update .` após alterar código em cada worktree. Se recriar o grafo do zero, use `graphify extract . --code-only --max-workers 4` antes de `graphify cluster-only . --no-label`. A extração inicial usou apenas análise de código, sem LLM. Arquivos de cache locais ficam fora do Git. O arquivo `.graphifyignore` exclui artefatos gerados e dependências do mapeamento.

## Componentes Efferd UI

O [Efferd UI](https://github.com/shabanhr/efferd-ui) fornece blocos de código para projetos shadcn/ui. Foram adaptados `header-1` (navegação móvel), `faqs-1` (perguntas de metodologia), `form-2` (cadastro de fontes) e `not-found-1` (página 404). Os textos, cores e comportamentos foram ajustados ao Olhar Público. A origem e a licença MIT constam em `THIRD_PARTY_NOTICES.md`.

## Git e trabalho paralelo

O projeto usa `main` como branch de integração. Cada tarefa de agente deve ter sua própria branch e worktree. Veja [WORKTREES.md](WORKTREES.md) para os comandos de criação, integração e remoção.
