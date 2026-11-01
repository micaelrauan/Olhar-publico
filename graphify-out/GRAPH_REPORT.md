# Graph Report - olhar-publico  (2026-11-01)

## Corpus Check
- 70 files · ~20,584 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 373 nodes · 437 edges · 34 communities (22 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f389efe4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- repository.ts
- dependencies
- compilerOptions
- devDependencies
- [slug]/page.tsx
- admin/politicos/page.tsx
- components.json
- scripts
- contracts.ts
- prisma.ts
- site-header.tsx
- auth.ts
- metodologia/page.tsx
- next-auth.d.ts
- eslint.config.mjs
- create-admin.mjs
- next.config.ts
- next-env.d.ts
- postcss.config.mjs
- { GET, POST }
- Olhar Público
- What You Must Do When Invoked
- Olhar Público
- graphify reference: extra exports and benchmark
- graphify reference: query, path, explain
- Direção visual — Olhar Público
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- THIRD_PARTY_NOTICES.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `requireEditor()` - 13 edges
3. `What You Must Do When Invoked` - 12 edges
4. `getPolitician()` - 11 edges
5. `/graphify` - 10 edges
6. `Olhar Público` - 10 edges
7. `scripts` - 9 edges
8. `Convenções para agentes e contribuidores` - 9 edges
9. `Olhar Público` - 9 edges
10. `graphify reference: extra exports and benchmark` - 8 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getPolitician()`  [EXTRACTED]
  src/app/api/politicians/[slug]/route.ts → src/domain/politicians/repository.ts
- `generateMetadata()` --calls--> `getPolitician()`  [EXTRACTED]
  src/app/politicos/[slug]/page.tsx → src/domain/politicians/repository.ts
- `PATCH()` --calls--> `requireEditor()`  [EXTRACTED]
  src/app/api/politicians/[slug]/route.ts → src/lib/admin.ts
- `GET()` --calls--> `listPoliticians()`  [EXTRACTED]
  src/app/api/politicians/route.ts → src/domain/politicians/repository.ts
- `POST()` --calls--> `requireEditor()`  [EXTRACTED]
  src/app/api/politicians/route.ts → src/lib/admin.ts

## Import Cycles
- None detected.

## Communities (34 total, 12 thin omitted)

### Community 0 - "repository.ts"
Cohesion: 0.12
Nodes (24): GET(), Home(), metadata, Politicians(), getPolitician(), listPoliticians(), listPoliticiansPage(), mode() (+16 more)

### Community 1 - "dependencies"
Cohesion: 0.06
Nodes (35): bcryptjs, class-variance-authority, clsx, @fontsource/ibm-plex-sans, @fontsource/source-serif-4, lucide-react, next, next-auth (+27 more)

### Community 2 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 3 - "devDependencies"
Cohesion: 0.09
Nodes (23): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, prisma (+15 more)

### Community 4 - "[slug]/page.tsx"
Cohesion: 0.15
Nodes (14): metadata, News(), generateMetadata(), Profile(), MenuToggleIcon(), ExpenseChart(), Source, SourceReference() (+6 more)

### Community 6 - "components.json"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+7 more)

### Community 7 - "scripts"
Cohesion: 0.14
Nodes (13): name, packageManager, private, scripts, admin:create, build, db:generate, db:migrate (+5 more)

### Community 8 - "contracts.ts"
Cohesion: 0.18
Nodes (8): AgentContract, AgentDraft, AgentInput, AgentLog, AgentName, agentNames, Evidence, mockAgentLogs

### Community 9 - "prisma.ts"
Cohesion: 0.10
Nodes (17): POST(), GET(), PATCH(), input, POST(), GET(), input, POST() (+9 more)

### Community 10 - "site-header.tsx"
Cohesion: 0.24
Nodes (6): metadata, links, SiteHeader(), ThemeProvider(), ThemeToggle(), useScroll()

### Community 12 - "metodologia/page.tsx"
Cohesion: 0.40
Nodes (3): metadata, MethodologyFaq(), questions

### Community 13 - "next-auth.d.ts"
Cohesion: 0.33
Nodes (5): JWT, next-auth, next-auth/jwt, Session, User

### Community 21 - "Olhar Público"
Cohesion: 0.08
Nodes (23): Arquitetura, Convenções para agentes e contribuidores, Dados e evidências, Desenvolvimento, Git e trabalho paralelo, Graphify, graphify, Missão (+15 more)

### Community 22 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 23 - "Olhar Público"
Cohesion: 0.20
Nodes (9): Brand Commitments, Capabilities and Constraints, Evidence on Hand, Olhar Público, Platform, Product Principles, Product Purpose, Stack (+1 more)

### Community 24 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 25 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 26 - "Direção visual — Olhar Público"
Cohesion: 0.33
Nodes (5): Direção visual — Olhar Público, Linguagem, Padrões, Responsividade, Tipografia e cor

### Community 27 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 28 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 29 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **184 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `css` (+179 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `scripts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `scripts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _184 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `repository.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12183908045977011 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._