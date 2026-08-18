# 🎓 DIO Explorer — Documentação Completa do Projeto

> **Projeto Final · IBM Bob AI Agent · Digital Innovation One**

![Node.js 14+](https://img.shields.io/badge/Node.js-14%2B-green)
![Jest 29](https://img.shields.io/badge/Jest_29-100%25_Coverage-brightgreen)
![MCP Server](https://img.shields.io/badge/MCP_Server-stdio-purple)
![Slash Commands](https://img.shields.io/badge/Slash_Commands-3-orange)
![Trilhas DIO](https://img.shields.io/badge/Trilhas_DIO-32-blue)
![Testes](https://img.shields.io/badge/Testes-90_passando-brightgreen)

---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Arquitetura & Estrutura de Arquivos](#2-arquitetura--estrutura-de-arquivos)
3. [Stack Tecnológica](#3-stack-tecnológica)
4. [Prompts Utilizados durante o Desenvolvimento](#4-prompts-utilizados-durante-o-desenvolvimento)
5. [Bob Skills Criadas](#5-bob-skills-criadas)
6. [Servidor MCP Customizado](#6-servidor-mcp-customizado)
7. [Slash Commands — Referência Completa](#7-slash-commands--referência-completa)
8. [Testes Unitários & Cobertura](#8-testes-unitários--cobertura)
9. [Dicas de Uso](#9-dicas-de-uso)
10. [Insights para Futuros Profissionais](#10-insights-para-futuros-profissionais)
11. [Fluxo de Trabalho Recomendado](#11-fluxo-de-trabalho-recomendado)

---

## 1. Visão Geral do Projeto

O **DIO Explorer** é uma coleção de scripts CLI e um servidor MCP (Model Context Protocol) que simula slash commands para explorar a plataforma **Digital Innovation One (DIO)**. O projeto foi construído inteiramente com a ajuda do agente de IA **IBM Bob** dentro do VS Code, demonstrando como um agente de AI pode atuar como co-piloto de engenharia em todo o ciclo de desenvolvimento: da ideia inicial ao código testado e documentado.

O projeto entrega três capacidades principais acessíveis tanto pela **linha de comando** quanto pelo **chat do Bob** via ferramentas MCP:

| Capacidade | Descrição |
|---|---|
| 📚 `/trilha <tecnologia>` | Busca trilhas de estudo DIO e exibe plano de módulos, XP, badges e promoções ativas. |
| ⚔️ `/desafio <nivel> <tecnologia>` | Gera um desafio de código aleatório e prático com requisitos, dicas e XP em jogo. |
| 🎓 `/certificado <nome> <tecnologia>` | Emite um certificado fictício em Markdown com código único DIO, badges e conquistas. |
| 🔌 MCP Server (`dio-explorer`) | Expõe os 3 comandos como ferramentas MCP para uso direto no chat do Bob, sem CLI. |

---

## 2. Arquitetura & Estrutura de Arquivos

```
projeto_final_dio_bob/
├── README.md                         ← documentação rápida dos comandos CLI
├── DOCUMENTACAO.md                   ← este documento
│
├── .bob/                             ← configuração do agente Bob
│   ├── mcp.json                      ← registro do servidor MCP dio-explorer
│   └── skills/                       ← skills customizadas do Bob
│       ├── trilha/SKILL.md           ← instrução: como responder /trilha
│       ├── desafio/SKILL.md          ← instrução: como responder /desafio
│       └── certificado/SKILL.md      ← instrução: como responder /certificado
│
└── dio_explorer/                     ← pacote Node.js principal
    ├── package.json                  ← dependências (Jest 29) + scripts de teste
    ├── src/
    │   └── utils.js                  ← helpers compartilhados (loadData, findTrilhas, …)
    ├── commands/
    │   ├── trilha.js                 ← CLI: /trilha
    │   ├── desafio.js                ← CLI: /desafio
    │   └── certificado.js            ← CLI: /certificado
    ├── data/
    │   └── trilhas_dio.json          ← banco de dados com 32 trilhas DIO
    ├── tests/
    │   ├── utils.test.js             ← 26 testes · src/utils.js
    │   ├── trilha.test.js            ← 18 testes · commands/trilha.js
    │   ├── desafio.test.js           ← 29 testes · commands/desafio.js
    │   └── certificado.test.js       ← 17 testes · commands/certificado.js
    ├── certificados/                 ← arquivos .md gerados pelo /certificado
    ├── docs/
    │   └── test-results.txt          ← relatório completo de testes e execuções
    └── mcp/                          ← sub-pacote do servidor MCP (TypeScript/ESM)
        ├── package.json              ← dependências (@modelcontextprotocol/sdk, zod)
        ├── tsconfig.json             ← configuração TypeScript
        ├── src/
        │   └── index.ts              ← fonte TypeScript do MCP Server
        └── build/
            └── index.js              ← MCP Server compilado (ESM, stdio + HTTP opcional)
```

### Fluxo de dados

Todos os caminhos convergem para o mesmo dado central: `dio_explorer/data/trilhas_dio.json`, que contém os metadados das 32 trilhas. O acesso pode ocorrer por três vias distintas:

| Via | Ponto de entrada | Consumidor |
|---|---|---|
| CLI direto | `node dio_explorer/commands/*.js` | Terminal / scripts |
| Bob Skills | `/trilha`, `/desafio`, `/certificado` no chat | Bob AI Agent (lê o JSON via `read_file`) |
| MCP Tools | Ferramentas `mcp__dio-explorer__trilha` etc. | Bob Agent (chama o servidor MCP via stdio) |

---

## 3. Stack Tecnológica

| Componente | Detalhe |
|---|---|
| **Runtime** | Node.js (CJS para CLI, ESM para MCP server) |
| **Testes** | Jest 29 · cobertura ≥70% configurada em `dio_explorer/package.json` |
| **Linguagem MCP** | TypeScript 5 · compilado para ESM via `tsc` (tsconfig em `dio_explorer/mcp/`) |
| **MCP SDK** | `@modelcontextprotocol/sdk` · McpServer · StdioServerTransport |
| **Validação** | Zod · schemas de input para as 3 ferramentas MCP |
| **Sem framework web** | Zero dependências externas na CLI · apenas módulos nativos Node.js |
| **Agente de IA** | IBM Bob (VS Code) · Agent Mode · Skills + MCP customizados |

---

## 4. Prompts Utilizados durante o Desenvolvimento

A seguir estão os prompts principais que conduziram cada etapa do projeto, organizados cronologicamente. Eles mostram como comunicar intenções ao Bob de forma eficaz.

### Fase 1 — Configuração Inicial & Exploração do Bob

> **Prompt 1 — Hello World**
> _"Crie um arquivo hello-world.md com um Hello World básico para eu entender como o Bob funciona."_

> **Prompt 2 — Estrutura do Projeto**
> _"Quero criar um projeto chamado DIO Explorer com scripts Node.js que simulam slash commands (/trilha, /desafio, /certificado) para explorar a plataforma DIO. Crie a estrutura de pastas e o package.json."_

### Fase 2 — Banco de Dados das Trilhas

> **Prompt 3 — Criação do JSON de trilhas**
> _"Crie o arquivo dio_explorer/data/trilhas_dio.json com pelo menos 20 trilhas fictícias inspiradas na DIO. Cada trilha deve ter: id, nome, tecnologia, nivel, modulos, xp_total, lives_ao_vivo, badges[], vitalicio, promocao (ativa, desconto_percentual, validade)."_

> **Prompt 4 — Expansão do banco**
> _"Expanda o trilhas_dio.json para cobrir pelo menos 30 tecnologias diferentes, incluindo AWS, DevOps, Kotlin, Swift, Go, Rust, Blockchain, Power BI e UX/UI Design."_

### Fase 3 — Implementação dos Comandos CLI

> **Prompt 5 — /trilha command**
> _"Implemente o arquivo commands/trilha.js que lê o JSON, busca trilhas pela tecnologia (case-insensitive, match parcial) e exibe o plano de estudos formatado no terminal com emojis."_

> **Prompt 6 — /desafio command**
> _"Crie commands/desafio.js que gera um desafio de código aleatório dado um nível (basico/intermediario/avancado) e tecnologia. Inclua um banco de desafios hardcoded com pelo menos 2 desafios por tecnologia por nível."_

> **Prompt 7 — /certificado command**
> _"Implemente commands/certificado.js que gera um certificado fictício em Markdown, salva em dio_explorer/certificados/ com nome baseado em slug do aluno e tecnologia, e imprime no terminal."_

> **Prompt 8 — utils.js compartilhado**
> _"Extraia as funções comuns (loadData, findTrilhas, randomFrom, today, futureDate) para src/utils.js e refatore os comandos para importá-las."_

### Fase 4 — Testes Unitários

> **Prompt 9 — Suite de testes completa**
> _"Crie uma suite completa de testes Jest com cobertura mínima de 70% para o módulo src/utils.js e os helpers inline dos commands. Quero pelo menos 80 testes no total organizados em 4 arquivos de teste."_

> **Prompt 10 — Relatório de testes**
> _"Execute os testes, mostre o resultado completo com cobertura, e salve um relatório detalhado em dio_explorer/docs/test-results.txt incluindo exemplos de execução dos 3 comandos."_

### Fase 5 — Bob Skills

> **Prompt 11 — Skill /trilha**
> _"Crie uma Bob skill para o comando /trilha. A skill deve ler o arquivo de dados e retornar um plano de estudos formatado em Markdown com tabela de módulos, badges e promoções."_

> **Prompt 12 — Skill /desafio**
> _"Crie uma Bob skill para /desafio que pergunta tecnologia e nível caso não sejam fornecidos e gera um desafio prático formatado com requisitos funcionais e critérios de avaliação."_

> **Prompt 13 — Skill /certificado**
> _"Crie uma Bob skill para /certificado que gera um certificado DIO fictício em Markdown com o nome do aluno, dados da trilha do JSON, badges e um ID único no formato DIO-XXX-XXXXXXX."_

### Fase 6 — Servidor MCP

> **Prompt 14 — MCP Server**
> _"Construa um servidor MCP em Node.js ESM que exponha as 3 capacidades do DIO Explorer como ferramentas MCP (trilha, desafio, certificado) e um recurso MCP (dio://trilhas com o JSON completo). Use @modelcontextprotocol/sdk e Zod para validação."_

> **Prompt 15 — Registro do MCP**
> _"Registre o servidor MCP no arquivo .bob/mcp.json para que o Bob passe a usar as ferramentas do DIO Explorer automaticamente no chat."_

### Fase 7 — Documentação Final

> **Prompt 16 — README**
> _"Crie um README.md completo para o projeto com tabela de tecnologias disponíveis, exemplos de uso de todos os comandos, tabela de níveis de desafio e pré-requisitos."_

> **Prompt 17 — Documentação completa**
> _"Bob, gostaria que você documentasse todo o projeto feito até o momento com todos os prompts usados, modos de uso, dicas de uso e insights para futuros profissionais que vão aprender com nosso projeto."_

---

## 5. Bob Skills Criadas

Skills são instruções especializadas que ensinam o Bob a executar tarefas específicas quando um determinado padrão de comando é detectado no chat. Cada skill é um arquivo `SKILL.md` em `.bob/skills/<nome>/`.

### Estrutura de uma Skill

```markdown
---
name: trilha
description: Use when the user types /trilha followed by a technology name.
metadata:
  argument-hint: "[tecnologia]"
---

# /trilha — Plano de Estudos DIO
## Objetivo
...
## Passos
1. Identificar a tecnologia
2. Ler dio_explorer/data/trilhas_dio.json
3. Gerar módulos fictícios coerentes
4. Formatar em tabela Markdown
5. Encerrar com mensagem motivacional
```

### Tabela comparativa das Skills

| Skill | Ativação | Passos internos | Saída |
|---|---|---|---|
| `trilha` | `/trilha <tecnologia>` | Lê JSON → busca trilha → gera módulos → formata Markdown | Tabela de módulos, badges, promoção, XP |
| `desafio` | `/desafio` | Coleta nível+tech (pergunta se faltarem) → gera desafio criativo | Briefing com requisitos, dicas, XP, prazo |
| `certificado` | `/certificado` | Coleta nome+trilha → lê JSON → monta template → gera ID único | Certificado Markdown com tabela, badges, ID DIO-XXX |

---

## 6. Servidor MCP Customizado

O servidor MCP (_Model Context Protocol_) permite que o Bob use as capacidades do DIO Explorer como ferramentas nativas, com validação de schema e tipagem via Zod, sem precisar chamar scripts no terminal.

### Configuração (`.bob/mcp.json`)

```json
{
  "mcpServers": {
    "dio-explorer": {
      "command": "node",
      "args": ["C:\\Users\\User\\Documents\\projeto_final_dio_bob\\dio_explorer\\mcp\\build\\index.js"]
    }
  }
}
```

### Ferramentas Expostas

| Ferramenta MCP | Parâmetros | Retorno |
|---|---|---|
| `mcp__dio-explorer__trilha` | `tecnologia: string` | Plano de estudos Markdown completo |
| `mcp__dio-explorer__desafio` | `nivel: enum, tecnologia: string` | Desafio com descrição, requisitos, dica, XP |
| `mcp__dio-explorer__certificado` | `nome: string, tecnologia: string` | Certificado Markdown com ID único DIO-XXX |

### Recurso MCP

| URI | Tipo | Descrição |
|---|---|---|
| `dio://trilhas` | `application/json` | Catálogo completo das 32 trilhas DIO para navegação e descoberta |

> **💡 Dica:** O servidor MCP suporta dois modos de transporte. Em modo **stdio** (padrão) é iniciado automaticamente pelo Bob. Em modo **HTTP**, defina a variável de ambiente `DIO_MCP_HTTP=1` e opcionalmente `DIO_MCP_PORT=3456` para uso como servidor standalone.

---

## 7. Slash Commands — Referência Completa

### /trilha

| Forma de uso | Exemplo |
|---|---|
| CLI | `node dio_explorer/commands/trilha.js React` |
| CLI multi-palavra | `node dio_explorer/commands/trilha.js "Machine Learning"` |
| Chat Bob (skill) | `/trilha Python` |
| Chat Bob (MCP) | O Bob chama automaticamente via `mcp__dio-explorer__trilha` |

### /desafio — Níveis aceitos

| Alias aceito | Nível normalizado | XP faixa | Tecnologias |
|---|---|---|---|
| `basico` / `basic` / `iniciante` | 🟢 Básico | 500–800 XP | JavaScript, Python, HTML/CSS, SQL |
| `intermediario` / `intermediate` | 🟡 Intermediário | 1400–2200 XP | React, Node.js, TypeScript, Java |
| `avancado` / `advanced` / `expert` | 🔴 Avançado | 3500–5000 XP | Python, ML, AWS, DevOps, Rust |

### /certificado — Formatos aceitos

```bash
# Com aspas (recomendado para nomes com espaço)
node commands/certificado.js "Ana Silva" React

# Sem aspas (último argumento = tecnologia, resto = nome)
node commands/certificado.js Carlos Souza Java

# No chat do Bob
/certificado João Silva | React
/certificado Ana Lima, Trilha Python
```

---

## 8. Testes Unitários & Cobertura

**Total: 90 testes · 4 suítes · cobertura 100% do módulo central.**

| Métrica | Resultado | Meta |
|---|---|---|
| Statements | ✅ 100% | ≥ 70% |
| Branches | ✅ 100% | ≥ 70% |
| Functions | ✅ 100% | ≥ 70% |
| Lines | ✅ 100% | ≥ 70% |

### Distribuição dos testes

| Arquivo de Teste | Módulo Testado | Qtd. |
|---|---|---|
| `utils.test.js` | `src/utils.js` — loadData, findTrilhas, randomFrom, today, futureDate | 26 |
| `trilha.test.js` | `commands/trilha.js` — buildModulos, moduleTemplates, genericModules | 18 |
| `desafio.test.js` | `commands/desafio.js` — NIVEL_ALIAS, CHALLENGES, findTechKey | 29 |
| `certificado.test.js` | `commands/certificado.js` — slugify, certId, buildCertificate | 17 |

```bash
# Executar testes
cd dio_explorer
npx jest --coverage

# CI (sem abrir UI)
npm run test:ci
```

> **⚙️ Configuração importante:** O `coverageThreshold` no `package.json` exige mínimo de 70% em statements, branches, functions e lines. O build falha automaticamente se a cobertura cair abaixo desse limite — boa prática para projetos em equipe.

---

## 9. Dicas de Uso

### Usando no Chat do Bob (modo mais poderoso)

- Digite `/trilha React` diretamente no chat — o Bob detecta a skill e responde formatado.
- Para desafios sem especificar parâmetros, use só `/desafio` — o Bob pergunta nível e tecnologia interativamente.
- Para certificados: `/certificado Seu Nome | Tecnologia` — o Bob gera o Markdown e pode salvar o arquivo via ferramenta MCP.
- Combine comandos: primeiro `/trilha Python` para ver a trilha, depois `/desafio avancado Python` para praticar, e por fim `/certificado Seu Nome Python`.

### Usando via CLI (útil em automações e scripts)

```bash
# Verificar trilhas disponíveis para uma stack
node dio_explorer/commands/trilha.js JavaScript

# Busca parcial — "ml" encontra "Machine Learning"
node dio_explorer/commands/trilha.js ml

# Gerar desafio aleatório e salvar em arquivo
node dio_explorer/commands/desafio.js avancado AWS > desafio-aws.txt

# Emitir certificado batch para vários alunos
for nome in "Ana Silva" "Carlos Souza" "Maria Lima"; do
  node dio_explorer/commands/certificado.js "$nome" React
done
```

### Estendendo o banco de dados

Para adicionar novas trilhas, edite `dio_explorer/data/trilhas_dio.json` seguindo a estrutura existente. Os comandos e o MCP server carregam o arquivo em tempo de execução — nenhum código precisa ser alterado.

### Adicionando novos desafios

Novos desafios podem ser adicionados ao objeto `CHALLENGES` em `commands/desafio.js` e ao equivalente em `mcp/build/index.js`. Cada entrada precisa de: `titulo, descricao, requisitos[], exemplo, dica, xp, prazo`.

---

## 10. Insights para Futuros Profissionais

### 💡 Insight 1 — O prompt é a nova documentação de requisitos
Cada prompt enviado ao Bob é equivalente a uma história de usuário num sprint. Quanto mais específico e contextual o prompt, mais precisa e reutilizável é a saída. Escrever bons prompts é uma habilidade de engenharia — não apenas comunicação.

### 💡 Insight 2 — Decomponha antes de implementar
Este projeto começou com um `hello-world.md`. Cada fase introduziu exatamente uma camada (dados → comandos → testes → skills → MCP → documentação). Projetos com IA evoluem melhor em camadas pequenas e validáveis, não em big-bangs.

### 💡 Insight 3 — Testes não são opcionais, mesmo com IA
A IA pode gerar código incorreto com total confiança. Os 90 testes deste projeto foram o que garantiu que o código gerado estava correto. Cobertura 100% em `utils.js` significa que cada comportamento foi verificado independentemente.

### 💡 Insight 4 — Separe preocupações desde o início
`src/utils.js` surgiu quando os três comandos começaram a duplicar lógica. A extração para um módulo compartilhado foi trivial — e tornou os testes mais simples. Bob ajuda a refatorar, mas a decisão arquitetural ainda é sua.

### 💡 Insight 5 — Skills são "personas especializadas" do Bob
Uma skill não é um script — é uma instrução comportamental. Ela diz ao Bob _como pensar_ sobre um problema, qual dado ler, qual formato usar. Isso é mais poderoso que hardcodar lógica porque se beneficia de toda a capacidade de raciocínio do modelo de linguagem.

### 💡 Insight 6 — MCP é o próximo passo depois das skills
Skills pedem ao Bob para interpretar e executar passos manuais. MCP tools são funções reais com schema validado: entrada tipada, saída consistente, erro tratado. Use skills para fluxos conversacionais; use MCP para operações determinísticas.

### 💡 Insight 7 — Um arquivo JSON pode ser um produto
`trilhas_dio.json` é o coração do projeto. Todo o resto é interface. Manter dados separados do código torna o sistema extensível sem tocar em lógica — princípio de _single source of truth_ aplicado até mesmo em projetos de aprendizagem.

### 💡 Insight 8 — Documente o processo, não só o produto
Este documento existe porque o histórico de prompts é tão valioso quanto o código. Um profissional que documenta _como_ chegou à solução aprende mais e colabora melhor do que um que só entrega o resultado final.

### Habilidades desenvolvidas neste projeto

| Habilidade | Onde foi aplicada |
|---|---|
| Prompt Engineering | Todos os 17 prompts do projeto |
| Node.js (CJS + ESM) | `commands/` (CJS) e `mcp/build/index.js` (ESM) |
| Design de API (MCP) | Schema Zod para 3 ferramentas e 1 recurso |
| Testes unitários | Jest · 90 testes · 4 suítes · 100% cobertura |
| Design de dados | JSON com 32 entidades ricas e relacionamentos |
| Documentação técnica | README.md, test-results.txt, SKILL.md files, este documento |
| Arquitetura de agentes | Skills + MCP como duas camadas de integração |
| CLI Design | Parsing de args, aliases, fuzzy match, saída formatada |

---

## 11. Fluxo de Trabalho Recomendado

Se você for replicar ou expandir este projeto, siga este fluxo:

1. **Defina os dados primeiro** — o JSON de trilhas veio antes de qualquer código.
2. **Implemente os utilitários compartilhados** — `utils.js` antes dos commands.
3. **Implemente os commands um a um** — teste manualmente cada um antes de avançar.
4. **Escreva os testes** — Jest, cobertura mínima 70%, falha automática no CI.
5. **Crie as skills** — para experiência conversacional no chat do Bob.
6. **Construa o MCP server** — para integração nativa e schema-validado.
7. **Documente** — README para usuários, este documento para aprendizes.

> **🚀 Próximos passos sugeridos:** adicionar suporte a banco de dados real (Appwrite), criar um front-end web para os certificados, expandir o banco de desafios com soluções modelo, integrar com a API real da DIO quando disponível, ou publicar o MCP server no npm para uso por outros desenvolvedores.

---

**Tecnologias disponíveis no banco:**
React · Node.js · Python · Machine Learning · Angular · Java · AWS · DevOps · Vue.js · TypeScript · Data Science · Flutter · Kotlin · Swift · C#/.NET · Go · Cybersecurity · SQL · Azure · Google Cloud · IA Generativa · HTML/CSS · JavaScript · Blockchain · Power BI · Rust · PHP/Laravel · Ruby on Rails · UX/UI Design · Next.js · NestJS · Data Engineering

---

*Made with ❤️ by IBM Bob · DIO Explorer — Projeto Final · [dio.me](https://www.dio.me)*
