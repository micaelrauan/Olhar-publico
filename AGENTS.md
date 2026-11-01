# Convenções para agentes e contribuidores

## Missão

Olhar Público é uma plataforma apartidária de transparência. Preserve contexto, origem, data e linguagem precisa. Nunca trate denúncia ou investigação como culpa comprovada.

## Arquitetura

- `src/app`: interface e pontos de entrada HTTP. Server Components por padrão.
- `src/domain/<domínio>`: tipos, regras e esquemas Zod. Evite dependência de React.
- `src/infrastructure/<fonte>`: clientes de APIs públicas. Valide respostas, limite consultas e preserve URL e data de acesso.
- `src/lib`: acesso ao banco, autenticação e utilitários.
- `src/components`: componentes de interface reutilizáveis; `ui` guarda bases shadcn/ui.
- `src/components/efferd`: adaptações de blocos Efferd UI; preserve a atribuição e a licença em `THIRD_PARTY_NOTICES.md`.
- `prisma`: contratos de persistência. Migrações devem acompanhar mudanças de schema.

APIs são organizadas por domínio, validam entrada com Zod e retornam erros sem expor detalhes internos. Toda mutação administrativa verifica sessão e papel no servidor.

## Dados e evidências

Cada gasto, emenda, declaração, processo ou evento deve estar associado a uma fonte. Guarde contexto e datas. Dados fictícios são marcados `isDemo` e identificados visualmente. Não misture mocks com dados reais sem sinalização.

Na consulta pública, `PUBLIC_DATA_SOURCE=camara` é o padrão e não exige banco. `demo` e `database` são modos explícitos. Falhas da API devem aparecer como indisponibilidade, nunca como ausência de registros nem como dados fictícios substitutos. Dados de páginas soltas entram apenas como fontes candidatas à revisão humana.

## Publicação e agentes

Agentes possuem somente contratos TypeScript e mocks. Não conecte LLMs nem permita que agentes publiquem conteúdo. Qualquer acusação ou conteúdo sensível precisa de revisão humana. Preserve histórico de revisões, fontes e autoria.

## Desenvolvimento

Use TypeScript estrito, módulos pequenos e nomes claros. Prefira Server Components para leitura e Client Components apenas para interação. Teste `pnpm typecheck`, `pnpm lint` e `pnpm build` antes de entregar mudanças significativas.

## Git e trabalho paralelo

- `main` é a linha de integração. Cada tarefa de agente usa uma branch própria `agent/<tarefa>` em uma worktree própria, fora da pasta principal.
- Um agente não edita arquivos na worktree de outro agente. Antes de iniciar, confira `git status --short --branch` e `git worktree list`.
- Registre commits pequenos e descritivos na sua branch. Não faça merge em `main` sem revisar o diff e executar as verificações relevantes.
- Worktrees compartilham os commits Git, mas cada uma tem seus próprios arquivos ignorados (`node_modules`, `.next`, `.env`). Instale dependências na worktree e configure segredos localmente quando necessário.
- Ao alterar o schema Prisma ou migrações, combine a integração com os outros agentes para evitar migrações concorrentes para o mesmo modelo.
- Use `git worktree remove <caminho>` ao encerrar uma tarefa já integrada; não apague a pasta manualmente. Consulte [WORKTREES.md](WORKTREES.md) para o fluxo completo.

## Graphify

Mantenha importações explícitas e fronteiras de domínio claras para facilitar análise do grafo de dependências. Não presuma comandos ou APIs do Graphify: consulte a documentação oficial da instalação disponível antes de configurar a integração.
