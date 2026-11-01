# Git e worktrees

O repositório principal fica na branch `main`. Uma worktree permite que cada agente trabalhe em uma branch e pasta próprias, compartilhando o histórico Git. Consulte a [documentação oficial do Git](https://git-scm.com/docs/git-worktree).

## Criar uma tarefa paralela

No PowerShell, a partir da pasta principal:

```powershell
git status --short --branch
git worktree list
git worktree add -b agent/minha-tarefa ..\olhar-publico-worktrees\minha-tarefa main
cd ..\olhar-publico-worktrees\minha-tarefa
npx -y pnpm@10 install
```

Passe a pasta da nova worktree como diretório de trabalho do agente. Use um nome diferente para cada tarefa. `node_modules`, caches e `.env` não são compartilhados entre worktrees. Para consultar as páginas públicas, a configuração padrão usa a API da Câmara e dispensa banco. O painel administrativo continua exigindo PostgreSQL e `AUTH_SECRET`.

## Entregar e integrar

Na worktree da tarefa:

```powershell
npx -y pnpm@10 typecheck
npx -y pnpm@10 lint
git status --short
git add .
git commit -m "Descreva a mudança"
```

Na pasta principal, revise e integre uma branch por vez:

```powershell
git switch main
git log --oneline main..agent/minha-tarefa
git diff main...agent/minha-tarefa
git merge --no-ff agent/minha-tarefa
```

Depois de validar a integração, remova a worktree com `git worktree remove ..\olhar-publico-worktrees\minha-tarefa`. O Git recusará a remoção se houver mudanças não registradas. A exclusão da branch com `git branch -d agent/minha-tarefa` é opcional depois do merge.

## Regras de coordenação

- Não use a mesma branch em duas worktrees nem faça dois agentes editarem a mesma pasta.
- Defina escopos de arquivos claros para tarefas simultâneas; revise conflitos na integração.
- Não coloque segredos em commits. `.env*` é ignorado, com exceção de `.env.example`.
- Para mudanças de banco, integre migrações em sequência e valide o schema final.
