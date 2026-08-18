# DIO Explorer

Coleção de scripts CLI + servidor MCP que simulam slash commands para explorar a plataforma DIO.

## Estrutura

```
projeto_final_dio_bob/
├── README.md
├── DOCUMENTACAO.md              ← documentação completa do projeto
│
├── .bob/
│   ├── mcp.json                 ← registro do servidor MCP dio-explorer
│   └── skills/
│       ├── trilha/SKILL.md      ← skill: responder /trilha
│       ├── desafio/SKILL.md     ← skill: responder /desafio
│       └── certificado/SKILL.md ← skill: responder /certificado
│
└── dio_explorer/
    ├── package.json             ← dependências (Jest 29) + scripts de teste
    ├── src/
    │   └── utils.js             ← helpers compartilhados (loadData, findTrilhas, …)
    ├── commands/
    │   ├── trilha.js            ← CLI: /trilha <tecnologia>
    │   ├── desafio.js           ← CLI: /desafio <nivel> <tecnologia>
    │   └── certificado.js       ← CLI: /certificado "<nome>" <tecnologia>
    ├── data/
    │   └── trilhas_dio.json     ← banco de dados com 32 trilhas DIO
    ├── tests/
    │   ├── utils.test.js
    │   ├── trilha.test.js
    │   ├── desafio.test.js
    │   └── certificado.test.js
    ├── certificados/            ← arquivos .md gerados pelo /certificado
    ├── docs/
    │   └── test-results.txt     ← relatório completo de testes
    └── mcp/
        ├── package.json
        ├── tsconfig.json
        ├── src/index.ts         ← fonte TypeScript do servidor MCP
        └── build/index.js       ← servidor MCP compilado (ESM, stdio)
```

---

## Pré-requisitos

- Node.js 14+

---

## `/trilha` — Plano de Estudos

Busca trilhas da DIO pela tecnologia e exibe o plano de estudos completo com módulos, badges e informações de promoção.

**Uso:**
```bash
node dio_explorer/commands/trilha.js <tecnologia>
```

**Exemplos:**
```bash
node dio_explorer/commands/trilha.js React
node dio_explorer/commands/trilha.js "Machine Learning"
node dio_explorer/commands/trilha.js Python
node dio_explorer/commands/trilha.js AWS
```

**Saída inclui:**
- Nome e nível da trilha
- Módulos numerados com tópicos detalhados
- XP total, lives ao vivo e badges
- Status de promoção com desconto e validade
- Informação de acesso vitalício

---

## `/desafio` — Gerador de Desafios de Código

Gera um desafio de código aleatório baseado no nível e tecnologia escolhidos.

**Uso:**
```bash
node dio_explorer/commands/desafio.js <nivel> <tecnologia>
```

**Níveis aceitos:**

| Alias | Nível |
|-------|-------|
| `basico`, `básico`, `basic`, `iniciante` | 🟢 Básico |
| `intermediario`, `intermediário`, `intermediate` | 🟡 Intermediário |
| `avancado`, `avançado`, `advanced`, `expert` | 🔴 Avançado |

**Exemplos:**
```bash
node dio_explorer/commands/desafio.js basico JavaScript
node dio_explorer/commands/desafio.js intermediario React
node dio_explorer/commands/desafio.js avancado Python
node dio_explorer/commands/desafio.js avancado AWS
node dio_explorer/commands/desafio.js intermediario Java
```

**Tecnologias com desafios disponíveis:**

| Nível | Tecnologias |
|-------|-------------|
| Básico | JavaScript, Python, HTML/CSS, SQL |
| Intermediário | React, Node.js, TypeScript, Java |
| Avançado | Python, Machine Learning, AWS, DevOps, Rust |

**Saída inclui:**
- Título e descrição detalhada do desafio
- Lista de requisitos técnicos
- Exemplo de uso/interface esperada
- Dica do mentor
- XP em jogo e prazo sugerido

---

## `/certificado` — Certificado Fictício Markdown

Gera um certificado fictício em Markdown para um usuário que concluiu uma trilha, com código único de verificação.

**Uso:**
```bash
node dio_explorer/commands/certificado.js "<nome completo>" <tecnologia>
```

**Exemplos:**
```bash
node dio_explorer/commands/certificado.js "Ana Silva" React
node dio_explorer/commands/certificado.js "Carlos Souza" "Machine Learning"
node dio_explorer/commands/certificado.js "Maria Oliveira" DevOps
node dio_explorer/commands/certificado.js João Python
```

> **Nota:** Use aspas quando o nome tiver espaços: `"Ana Silva"`.  
> Sem aspas, o último argumento é interpretado como tecnologia e o restante como nome.

**Saída inclui:**
- Certificado formatado em Markdown (impresso no terminal)
- Tabela com dados da trilha (nível, módulos, XP, lives)
- Lista de badges conquistadas
- Código de certificado único (`DIO-XXX-XXXXXXX`)
- Arquivo `.md` salvo automaticamente em `dio_explorer/certificados/`

**Arquivo gerado:**
```
dio_explorer/certificados/<slug-nome>-<slug-tecnologia>.md
```
Exemplo: `ana-silva-react.md`

---

## Testes

```bash
cd dio_explorer
npx jest --coverage   # relatório completo com cobertura
npm run test:ci       # modo CI (sem UI)
```

**90 testes · 4 suítes · cobertura 100% do módulo `src/utils.js`**

| Arquivo de Teste | Testes |
|------------------|--------|
| `utils.test.js` | 26 |
| `trilha.test.js` | 18 |
| `desafio.test.js` | 29 |
| `certificado.test.js` | 17 |

---

## Servidor MCP (`dio-explorer`)

O servidor MCP expõe as três capacidades do DIO Explorer como ferramentas nativas do Bob, sem necessidade de usar o terminal.

**Configuração (`.bob/mcp.json`):**
```json
{
  "mcpServers": {
    "dio-explorer": {
      "command": "node",
      "args": ["C:\\...\\dio_explorer\\mcp\\build\\index.js"]
    }
  }
}
```

**Ferramentas disponíveis:**

| Ferramenta MCP | Parâmetros | Retorno |
|----------------|------------|---------|
| `mcp__dio-explorer__trilha` | `tecnologia: string` | Plano de estudos Markdown |
| `mcp__dio-explorer__desafio` | `nivel: enum, tecnologia: string` | Desafio com requisitos, dica e XP |
| `mcp__dio-explorer__certificado` | `nome: string, tecnologia: string` | Certificado Markdown com ID único |

**Recurso MCP:**

| URI | Tipo | Descrição |
|-----|------|-----------|
| `dio://trilhas` | `application/json` | Catálogo completo das 32 trilhas |

**Construir o servidor:**
```bash
cd dio_explorer/mcp
npm install
npm run build   # compila src/index.ts → build/index.js
```

---

## Bob Skills

Três skills ensinam o Bob a responder aos slash commands diretamente no chat:

| Skill | Ativação | Arquivo |
|-------|----------|---------|
| `trilha` | `/trilha <tecnologia>` | `.bob/skills/trilha/SKILL.md` |
| `desafio` | `/desafio` | `.bob/skills/desafio/SKILL.md` |
| `certificado` | `/certificado` | `.bob/skills/certificado/SKILL.md` |

---

## Tecnologias disponíveis no banco de dados

| ID | Trilha | Tecnologia | Nível |
|----|--------|------------|-------|
| 1 | Formação React Developer | React | Intermediário |
| 2 | Formação Node.js Backend Developer | Node.js | Intermediário |
| 3 | Formação Python Developer | Python | Básico |
| 4 | Formação Machine Learning Specialist | Machine Learning | Avançado |
| 5 | Formação Angular Developer | Angular | Intermediário |
| 6 | Formação Java Developer | Java | Intermediário |
| 7 | Formação Cloud AWS Architect | AWS | Avançado |
| 8 | Formação DevOps Engineer | DevOps | Avançado |
| 9 | Formação Vue.js Developer | Vue.js | Básico |
| 10 | Formação TypeScript Full Stack | TypeScript | Intermediário |
| 11 | Formação Data Science com Python | Data Science | Avançado |
| 12 | Formação Flutter Mobile Developer | Flutter | Intermediário |
| 13 | Formação Kotlin Android Developer | Kotlin | Intermediário |
| 14 | Formação Swift iOS Developer | Swift | Avançado |
| 15 | Formação C# .NET Developer | C# / .NET | Intermediário |
| 16 | Formação Go Developer | Go | Avançado |
| 17 | Formação Segurança da Informação | Cybersecurity | Avançado |
| 18 | Formação SQL & Banco de Dados | SQL | Básico |
| 19 | Formação Microsoft Azure Developer | Azure | Avançado |
| 20 | Formação Google Cloud Engineer | Google Cloud | Avançado |
| 21 | Formação Inteligência Artificial Generativa | IA Generativa | Avançado |
| 22 | Formação HTML & CSS Web Developer | HTML/CSS | Básico |
| 23 | Formação JavaScript Developer | JavaScript | Básico |
| 24 | Formação Blockchain Developer | Blockchain | Avançado |
| 25 | Formação Power BI & Data Analytics | Power BI | Intermediário |
| 26 | Formação Rust Systems Developer | Rust | Avançado |
| 27 | Formação PHP Laravel Developer | PHP / Laravel | Intermediário |
| 28 | Formação Ruby on Rails Developer | Ruby on Rails | Intermediário |
| 29 | Formação UX/UI Design para Devs | UX/UI Design | Básico |
| 30 | Formação Next.js Full Stack Developer | Next.js | Intermediário |
| 31 | Formação NestJS API Developer | NestJS | Avançado |
| 32 | Formação Engenharia de Dados | Data Engineering | Avançado |

---

*Made with ❤️ by DIO Explorer | [https://www.dio.me](https://www.dio.me)*
