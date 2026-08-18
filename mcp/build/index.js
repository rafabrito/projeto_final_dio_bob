#!/usr/bin/env node
/**
 * DIO Explorer — MCP Server
 *
 * Exposes the three core DIO Explorer capabilities as MCP tools:
 *   • trilha      — find study tracks by technology
 *   • desafio     — generate a random coding challenge
 *   • certificado — generate a fictional completion certificate
 *
 * Also exposes one MCP resource:
 *   • dio://trilhas  — full list of available tracks (JSON)
 *
 * Transport: stdio (default) or HTTP (set DIO_MCP_HTTP=1 + optional DIO_MCP_PORT)
 *
 * Usage (stdio, registered in mcp.json):
 *   node build/index.js
 *
 * Usage (HTTP, standalone server):
 *   DIO_MCP_HTTP=1 DIO_MCP_PORT=3456 node build/index.js
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { z } from "zod";
// ── data loading ─────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "../../dio_explorer/data/trilhas_dio.json");
function loadData() {
    const raw = readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
}
function findTrilhas(query) {
    const { trilhas } = loadData();
    const q = query.trim().toLowerCase();
    return trilhas.filter((t) => t.tecnologia.toLowerCase().includes(q));
}
function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function today() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}
function futureDate(days) {
    const d = new Date(Date.now() + days * 86_400_000);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}
function slugify(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
function certId(nome) {
    const ts = Date.now().toString(36).toUpperCase();
    const initials = nome
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 3);
    return `DIO-${initials}-${ts}`;
}
// ── module templates (kept in sync with commands/trilha.js) ──────────────────
const MODULE_TEMPLATES = {
    React: [
        "Fundamentos do React e JSX",
        "Componentes e Props",
        "Estado e Ciclo de Vida",
        "Hooks essenciais (useState, useEffect)",
        "Hooks avançados (useContext, useReducer)",
        "React Router & navegação",
        "Gerenciamento de estado com Redux",
        "Redux Toolkit na prática",
        "Testes com React Testing Library",
        "Performance e otimização",
        "Deploy com Vercel / Netlify",
        "Projeto final: App React completo",
    ],
    "Node.js": [
        "Fundamentos do Node.js e módulos",
        "Sistema de arquivos e streams",
        "Criando um servidor HTTP nativo",
        "Express.js do zero",
        "Middlewares e roteamento avançado",
        "Integração com banco de dados (MySQL / Postgres)",
        "Autenticação com JWT",
        "Documentação com Swagger",
        "Testes com Jest & Supertest",
        "Deploy na nuvem (Heroku / Railway)",
    ],
    Python: [
        "Introdução ao Python e ambiente",
        "Tipos de dados e operadores",
        "Estruturas de controle",
        "Funções e escopos",
        "Programação Orientada a Objetos",
        "Manipulação de arquivos",
        "Bibliotecas padrão essenciais",
        "Introdução ao pip e virtualenv",
        "Projeto final: aplicação Python",
    ],
    Java: [
        "Java SE e configuração do ambiente",
        "Tipos primitivos e controle de fluxo",
        "Orientação a Objetos (encapsulamento, herança, polimorfismo)",
        "Interfaces e classes abstratas",
        "Generics e Collections",
        "Tratamento de exceções",
        "Entrada/saída e serialização",
        "Introdução ao Spring Framework",
        "Spring Boot e REST APIs",
        "Spring Data JPA",
        "Segurança com Spring Security",
        "Testes com JUnit e Mockito",
        "Docker para projetos Java",
        "Projeto final: API Java com Spring Boot",
    ],
    JavaScript: [
        "Variáveis, tipos e operadores",
        "Funções e escopo",
        "Arrays e objetos",
        "DOM e eventos",
        "ES6+: arrow functions, destructuring, spread",
        "Promises e async/await",
        "Fetch API e consumo de APIs",
        "Módulos ES e bundlers",
        "Testes unitários com Jest",
        "Projeto final: aplicação JavaScript",
    ],
};
function genericModules(tecnologia) {
    return [
        `Introdução a ${tecnologia}`,
        "Fundamentos e configuração do ambiente",
        "Conceitos essenciais",
        "Estruturas de dados e algoritmos",
        "Boas práticas e padrões",
        "Integração com ferramentas do ecossistema",
        `Tópicos avançados de ${tecnologia}`,
        "Testes e qualidade de código",
        "Deploy e publicação",
        "Projeto integrador",
        "Tópico especializado I",
        "Tópico especializado II",
        "Tópico especializado III",
        "Tópico especializado IV",
        "Revisão geral e certificação",
        "Workshop ao vivo I",
        "Workshop ao vivo II",
        "Mentoria e career guidance",
        "Hackathon final",
        "Encerramento e próximos passos",
    ];
}
function buildModulos(trilha) {
    const templates = MODULE_TEMPLATES[trilha.tecnologia] ?? genericModules(trilha.tecnologia);
    return Array.from({ length: trilha.modulos }, (_, i) => {
        const base = templates[i % templates.length];
        return `${i + 1}. ${base}`;
    });
}
const CHALLENGES = {
    basico: {
        JavaScript: [
            {
                titulo: "Calculadora de IMC",
                descricao: "Crie uma função `calcularIMC(peso, altura)` que recebe peso em kg e altura em metros e retorna o IMC com a classificação (Abaixo do peso, Normal, Sobrepeso, Obesidade).",
                requisitos: [
                    "A função deve validar entradas (números positivos)",
                    "Retornar um objeto `{ imc: number, classificacao: string }`",
                    "Cobrir os 4 intervalos da tabela da OMS",
                ],
                exemplo: "calcularIMC(70, 1.75) // { imc: 22.86, classificacao: 'Normal' }",
                dica: "IMC = peso / (altura * altura). Use comparações encadeadas para a classificação.",
                xp: 800,
                prazo: 3,
            },
            {
                titulo: "Palíndromo Checker",
                descricao: "Implemente `isPalindromo(str)` que retorna `true` se a string for um palíndromo, ignorando espaços, pontuação e capitalização.",
                requisitos: [
                    "Ignorar espaços e caracteres especiais",
                    "Ser case-insensitive",
                    "Funcionar com frases completas (ex.: 'A man a plan a canal Panama')",
                ],
                exemplo: "isPalindromo('racecar') // true\nisPalindromo('hello') // false",
                dica: "Remova os não-alfanuméricos com regex, converta para minúsculas e compare com o reverse.",
                xp: 600,
                prazo: 2,
            },
        ],
        Python: [
            {
                titulo: "FizzBuzz Avançado",
                descricao: "Escreva uma função `fizzbuzz(n)` que retorna uma lista com os números de 1 a n substituindo múltiplos de 3 por 'Fizz', múltiplos de 5 por 'Buzz' e múltiplos de ambos por 'FizzBuzz'.",
                requisitos: [
                    "Retornar uma lista, não imprimir",
                    "Aceitar qualquer inteiro positivo n",
                    "Usar list comprehension",
                ],
                exemplo: "fizzbuzz(15)  # [1, 2, 'Fizz', 4, 'Buzz', ..., 'FizzBuzz']",
                dica: "Use o operador % para verificar divisibilidade. A ordem das condições importa!",
                xp: 500,
                prazo: 2,
            },
        ],
        "HTML/CSS": [
            {
                titulo: "Card de Perfil Responsivo",
                descricao: "Construa um card de perfil de desenvolvedor usando apenas HTML e CSS. O card deve exibir avatar, nome, cargo, bio curta e links para redes sociais.",
                requisitos: [
                    "Responsivo (mobile-first)",
                    "Usar CSS Flexbox ou Grid",
                    "Sem frameworks externos",
                    "Hover suave nos links sociais",
                ],
                exemplo: "Resultado visual: card centralizado na tela, sombra leve, tipografia limpa.",
                dica: "Use `border-radius: 50%` para o avatar e `box-shadow` para a elevação.",
                xp: 600,
                prazo: 3,
            },
        ],
        SQL: [
            {
                titulo: "Consultas de Agregação",
                descricao: "Dado um banco com tabelas `clientes` e `pedidos`, escreva queries que respondam: (1) total de pedidos por cliente, (2) cliente com maior valor de compras, (3) média de valor por categoria.",
                requisitos: [
                    "Usar JOIN, GROUP BY e ORDER BY",
                    "Query 2 com subconsulta ou CTE",
                    "Alias legíveis nas colunas",
                ],
                exemplo: "SELECT c.nome, COUNT(p.id) AS total_pedidos FROM clientes c JOIN pedidos p ...",
                dica: "CTEs (`WITH`) deixam queries complexas muito mais legíveis.",
                xp: 750,
                prazo: 3,
            },
        ],
    },
    intermediario: {
        React: [
            {
                titulo: "Hook de Fetch com Cache",
                descricao: "Crie um custom hook `useFetch(url)` que busca dados de uma API, gerencia os estados loading/error/data e implementa cache em memória para evitar requisições repetidas à mesma URL.",
                requisitos: [
                    "Tipagem com TypeScript",
                    "Cache via useRef ou Map externo ao componente",
                    "Cancelar requisição se o componente desmontar (AbortController)",
                    "Retornar `{ data, loading, error, refetch }`",
                ],
                exemplo: "const { data, loading, error } = useFetch('https://api.github.com/users/...');",
                dica: "AbortController e o cleanup do useEffect são cruciais para evitar memory leaks.",
                xp: 1500,
                prazo: 5,
            },
        ],
        "Node.js": [
            {
                titulo: "API REST com Autenticação JWT",
                descricao: "Construa uma API Node.js/Express com rotas de usuários (registro, login, perfil) protegidas por JWT, incluindo refresh token e logout seguro.",
                requisitos: [
                    "Hash de senha com bcrypt",
                    "Access token (15 min) + refresh token (7 dias)",
                    "Middleware de autenticação reutilizável",
                    "Rota de logout que invalida o refresh token",
                ],
                exemplo: "POST /auth/register → POST /auth/login → GET /users/me (Authorization: Bearer <token>)",
                dica: "Armazene refresh tokens em uma lista negra (in-memory ou Redis) para suportar logout real.",
                xp: 2000,
                prazo: 7,
            },
        ],
        TypeScript: [
            {
                titulo: "Sistema de Types Genérico para API",
                descricao: "Crie um conjunto de tipos TypeScript genéricos para padronizar respostas de API: `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError` e um helper `isApiError(res)`.",
                requisitos: [
                    "Usar generics e conditional types",
                    "Discriminated unions para success/error",
                    "Type guards para narrowing",
                    "Exemplos de uso em comentários JSDoc",
                ],
                exemplo: "const res: ApiResponse<User> = await fetchUser(id);",
                dica: "Use `never` para garantir exhaustive checks e `infer` para extrair tipos internos.",
                xp: 1400,
                prazo: 4,
            },
        ],
        Java: [
            {
                titulo: "CRUD com Spring Boot e JPA",
                descricao: "Desenvolva uma API RESTful completa com Spring Boot para gerenciar uma entidade `Produto` (CRUD completo), com validações via Bean Validation e tratamento global de erros.",
                requisitos: [
                    "@RestController, @Service, @Repository",
                    "Validações: @NotBlank, @Min, @Email etc.",
                    "@ControllerAdvice para exceções",
                    "H2 ou Postgres em memória para testes",
                ],
                exemplo: "GET /produtos | POST /produtos | PUT /produtos/{id} | DELETE /produtos/{id}",
                dica: "Use `ResponseEntity<?>` para controlar o status HTTP de cada resposta.",
                xp: 2200,
                prazo: 10,
            },
        ],
    },
    avancado: {
        Python: [
            {
                titulo: "Web Scraper Assíncrono",
                descricao: "Construa um web scraper com `asyncio` + `aiohttp` + `BeautifulSoup` que extrai títulos, links e datas de artigos de um blog público, salvando os resultados em CSV e SQLite simultaneamente.",
                requisitos: [
                    "Concorrência com asyncio.gather",
                    "Rate limiting (max 5 req/s)",
                    "Retry automático com backoff exponencial",
                    "Logging estruturado (JSON)",
                ],
                exemplo: "python scraper.py --url https://blog.example.com --pages 10 --output artigos",
                dica: "Use `asyncio.Semaphore` para o rate limit e `aiofiles` para escrita assíncrona.",
                xp: 3500,
                prazo: 14,
            },
        ],
        "Machine Learning": [
            {
                titulo: "Pipeline de Classificação End-to-End",
                descricao: "Implemente um pipeline completo de ML para classificação binária: ingestão de dados, EDA, pré-processamento, treino de 3 modelos (LR, RF, XGBoost), tuning de hiperparâmetros e serving via API FastAPI.",
                requisitos: [
                    "scikit-learn Pipeline com transformadores customizados",
                    "Cross-validation e métricas (AUC-ROC, F1, precision, recall)",
                    "MLflow para tracking de experimentos",
                    "Endpoint POST /predict retornando probabilidade e classe",
                ],
                exemplo: "curl -X POST /predict -d '{\"features\": [...]}'",
                dica: "Encapsule todo o pré-processamento dentro do Pipeline para evitar data leakage.",
                xp: 5000,
                prazo: 21,
            },
        ],
        AWS: [
            {
                titulo: "Serverless ETL com Lambda + S3 + DynamoDB",
                descricao: "Crie uma arquitetura serverless que, ao receber um arquivo CSV no S3, dispara uma Lambda para validar, transformar e persistir os registros no DynamoDB, notificando via SNS em caso de erro.",
                requisitos: [
                    "IaC com AWS CDK ou Terraform",
                    "Lambda em Python ou Node.js",
                    "Dead Letter Queue para falhas",
                    "Alarme CloudWatch se taxa de erro > 5%",
                ],
                exemplo: "Upload CSV → S3 Event → Lambda → DynamoDB + SNS alert",
                dica: "Use `boto3 paginator` para leitura de grandes arquivos e `DynamoDB.batch_write_item` para escrita eficiente.",
                xp: 4500,
                prazo: 14,
            },
        ],
        DevOps: [
            {
                titulo: "Pipeline CI/CD Multi-Stage",
                descricao: "Construa um pipeline GitHub Actions completo para uma aplicação Node.js: lint → testes → build Docker → push ECR → deploy ECS com rollback automático em caso de falha no health check.",
                requisitos: [
                    "Jobs paralelos para lint e testes",
                    "Cache de dependências do npm",
                    "Matrix strategy para Node 18 e 20",
                    "Notificação Slack no sucesso/falha",
                ],
                exemplo: "push → CI (lint + test) → build image → push ECR → deploy ECS Blue/Green",
                dica: "Use `actions/cache` com a chave baseada no hash do `package-lock.json`.",
                xp: 4000,
                prazo: 14,
            },
        ],
        Rust: [
            {
                titulo: "CLI de Compressão de Arquivos",
                descricao: "Implemente uma ferramenta CLI em Rust que comprime e descomprime arquivos usando o algoritmo LZ4, suportando múltiplos arquivos em paralelo com Rayon.",
                requisitos: [
                    "Interface CLI com `clap`",
                    "Compressão paralela com `rayon`",
                    "Barra de progresso com `indicatif`",
                    "Tratamento de erros idiomático com `anyhow`",
                ],
                exemplo: "cargo run -- compress file1.log file2.log -o archive.lz4",
                dica: "Use `std::fs::File` + `BufReader/BufWriter` para I/O eficiente e `rayon::par_iter` para paralelismo.",
                xp: 4200,
                prazo: 14,
            },
        ],
    },
};
const NIVEL_ALIAS = {
    basico: "basico",
    básico: "basico",
    basic: "basico",
    iniciante: "basico",
    intermediario: "intermediario",
    intermediário: "intermediario",
    intermediate: "intermediario",
    avancado: "avancado",
    avançado: "avancado",
    advanced: "avancado",
    expert: "avancado",
};
// ── server setup ─────────────────────────────────────────────────────────────
const server = new McpServer({
    name: "dio-explorer",
    version: "1.0.0",
});
// ── resource: trilhas list ───────────────────────────────────────────────────
server.resource("trilhas-list", "dio://trilhas", {
    description: "Full JSON catalogue of all DIO study tracks. Use this to browse available technologies before calling the trilha tool.",
    mimeType: "application/json",
}, async () => {
    const data = loadData();
    return {
        contents: [
            {
                uri: "dio://trilhas",
                mimeType: "application/json",
                text: JSON.stringify(data.trilhas.map((t) => ({
                    id: t.id,
                    nome: t.nome,
                    tecnologia: t.tecnologia,
                    nivel: t.nivel,
                    modulos: t.modulos,
                    xp_total: t.xp_total,
                })), null, 2),
            },
        ],
    };
});
// ── tool: trilha ─────────────────────────────────────────────────────────────
server.tool("trilha", "Find DIO study tracks by technology and return a detailed study plan. " +
    "Returns track metadata (level, modules, XP, badges, promotions) and a " +
    "numbered list of study modules.", {
    tecnologia: z
        .string()
        .min(1)
        .describe("Technology name to search for (e.g. 'React', 'Python', 'Machine Learning'). " +
        "Partial and case-insensitive matches are supported."),
}, async ({ tecnologia }) => {
    const results = findTrilhas(tecnologia);
    if (results.length === 0) {
        return {
            content: [
                {
                    type: "text",
                    text: `No tracks found for "${tecnologia}".\n\nAvailable technologies: React, Node.js, Python, Java, TypeScript, Angular, Vue.js, Flutter, Kotlin, Swift, Go, Rust, PHP/Laravel, Ruby on Rails, Machine Learning, Data Science, Data Engineering, Generative AI, AWS, Azure, Google Cloud, DevOps, Cybersecurity, SQL, Blockchain, Power BI, UX/UI Design, HTML/CSS, JavaScript, Next.js, NestJS, C#/.NET`,
                },
            ],
            isError: false,
        };
    }
    const output = results
        .map((trilha) => {
        const promo = trilha.promocao.ativa
            ? `🔥 Active promotion: ${trilha.promocao.desconto_percentual}% OFF (valid until ${trilha.promocao.validade})`
            : "No active promotion";
        const acesso = trilha.vitalicio ? "✅ Lifetime access" : "⏳ Limited-time access";
        const modulos = buildModulos(trilha);
        return [
            `${"═".repeat(60)}`,
            `📚  ${trilha.nome}`,
            `${"═".repeat(60)}`,
            `🏷️   Technology : ${trilha.tecnologia}`,
            `📊  Level       : ${trilha.nivel}`,
            `🎯  Modules     : ${trilha.modulos}`,
            `⭐  Total XP    : ${trilha.xp_total.toLocaleString("pt-BR")} XP`,
            `🎙️   Live sessions: ${trilha.lives_ao_vivo}`,
            acesso,
            promo,
            ``,
            `🗂️  Study Plan:`,
            ...modulos.map((m) => `   ${m}`),
            ``,
            `🏅  Badges earned on completion:`,
            ...trilha.badges.map((b) => `   🔖 ${b}`),
            ``,
            `🌐  Access at: https://www.dio.me`,
        ].join("\n");
    })
        .join("\n\n");
    return { content: [{ type: "text", text: output }] };
});
// ── tool: desafio ─────────────────────────────────────────────────────────────
server.tool("desafio", "Generate a random DIO-style coding challenge for a given level and technology. " +
    "Returns title, description, requirements, example, mentor tip, XP reward and deadline.", {
    nivel: z
        .enum(["basico", "intermediario", "avancado"])
        .describe("Challenge difficulty level. Aliases accepted: básico/basic/iniciante, intermediário/intermediate, avançado/advanced/expert"),
    tecnologia: z
        .string()
        .min(1)
        .describe("Target technology (e.g. 'JavaScript', 'React', 'Python'). " +
        "Available per level — basico: JavaScript, Python, HTML/CSS, SQL; " +
        "intermediario: React, Node.js, TypeScript, Java; " +
        "avancado: Python, Machine Learning, AWS, DevOps, Rust"),
}, async ({ nivel, tecnologia }) => {
    const nivelKey = NIVEL_ALIAS[nivel] ?? nivel;
    const bank = CHALLENGES[nivelKey];
    if (!bank) {
        return {
            content: [{ type: "text", text: `Level "${nivel}" not recognised. Use: basico, intermediario, or avancado` }],
            isError: true,
        };
    }
    const techKey = Object.keys(bank).find((k) => k.toLowerCase().includes(tecnologia.toLowerCase()) ||
        tecnologia.toLowerCase().includes(k.toLowerCase()));
    if (!techKey) {
        const available = Object.keys(bank).join(", ");
        return {
            content: [
                {
                    type: "text",
                    text: `No challenge found for "${tecnologia}" at level "${nivelKey}".\nAvailable technologies at this level: ${available}`,
                },
            ],
            isError: false,
        };
    }
    const pool = bank[techKey];
    const desafio = randomFrom(pool);
    const inicio = today();
    const fim = futureDate(desafio.prazo);
    const nivelLabel = {
        basico: "🟢 Básico",
        intermediario: "🟡 Intermediário",
        avancado: "🔴 Avançado",
    };
    const output = [
        `${"═".repeat(60)}`,
        `⚡  DIO CHALLENGE — ${nivelLabel[nivelKey]}`,
        `${"═".repeat(60)}`,
        ``,
        `🎯  ${desafio.titulo}`,
        `🏷️   Technology : ${techKey}`,
        `⭐  XP at stake  : ${desafio.xp.toLocaleString("pt-BR")} XP`,
        `📅  Period       : ${inicio} → ${fim} (${desafio.prazo} days)`,
        ``,
        `📝  Description:`,
        `   ${desafio.descricao}`,
        ``,
        `✅  Requirements:`,
        ...desafio.requisitos.map((r) => `   • ${r}`),
        ``,
        `💡  Example:`,
        `   ${desafio.exemplo}`,
        ``,
        `🔧  Mentor tip:`,
        `   ${desafio.dica}`,
        ``,
        `🚀  Good luck! Submit your repo at https://www.dio.me`,
        `${"═".repeat(60)}`,
    ].join("\n");
    return { content: [{ type: "text", text: output }] };
});
// ── tool: certificado ────────────────────────────────────────────────────────
server.tool("certificado", "Generate a fictional DIO completion certificate in Markdown for a user who finished a study track. " +
    "Returns formatted Markdown ready to save or display.", {
    nome: z.string().min(1).describe("Full name of the student (e.g. 'Ana Silva')"),
    tecnologia: z
        .string()
        .min(1)
        .describe("Technology / track to certify (e.g. 'React', 'Machine Learning')"),
}, async ({ nome, tecnologia }) => {
    const results = findTrilhas(tecnologia);
    if (results.length === 0) {
        return {
            content: [
                {
                    type: "text",
                    text: `No track found for "${tecnologia}". Check the technology name and try again.`,
                },
            ],
            isError: false,
        };
    }
    const trilha = results[0];
    const id = certId(nome);
    const dataHoje = today();
    const xpFormatted = trilha.xp_total.toLocaleString("pt-BR");
    const badgeList = trilha.badges.map((b) => `- 🔖 **${b}**`).join("\n");
    const promoLine = trilha.promocao.ativa
        ? `> 🔥 This track has **${trilha.promocao.desconto_percentual}% discount** until ${trilha.promocao.validade}`
        : "";
    const slugNome = slugify(nome);
    const slugTech = slugify(trilha.tecnologia);
    const md = `# 🎓 CERTIFICATE OF COMPLETION
## Digital Innovation One — DIO

---

> *This certificate is a fictional document generated by DIO Explorer for educational purposes.*

---

## ✅ This certifies that

# ${nome}

successfully completed the training track:

---

## 📚 ${trilha.nome}

| Field              | Detail                            |
|--------------------|-----------------------------------|
| 🏷️ Technology      | ${trilha.tecnologia}              |
| 📊 Level           | ${trilha.nivel}                   |
| 🎯 Modules         | ${trilha.modulos} modules         |
| ⭐ XP earned       | ${xpFormatted} XP                 |
| 🎙️ Live sessions   | ${trilha.lives_ao_vivo} sessions  |
| 📅 Issue date      | ${dataHoje}                       |
| 🆔 Code            | \`${id}\`                         |

---

## 🏅 Badges Earned

${badgeList}

---

## 🌟 Achievements

- ✔️ Completed all ${trilha.modulos} training modules
- ✔️ Attended ${trilha.lives_ao_vivo} live sessions with specialists
- ✔️ Acquired practical skills in **${trilha.tecnologia}**
- ✔️ Completed coding challenges and real projects
${trilha.vitalicio ? "- ✔️ **Lifetime** access to content guaranteed" : "- ℹ️ Limited-time access"}

---

${promoLine}

---

**Digitally issued by DIO Explorer**
🌐 [https://www.dio.me](https://www.dio.me)
📅 ${dataHoje} | 🆔 ${id}

---

*Suggested filename: \`${slugNome}-${slugTech}.md\`*
*Made with ❤️ by DIO Explorer*
`;
    return { content: [{ type: "text", text: md }] };
});
// ── transport: stdio or HTTP ──────────────────────────────────────────────────
async function main() {
    const useHttp = process.env["DIO_MCP_HTTP"] === "1";
    if (useHttp) {
        const port = parseInt(process.env["DIO_MCP_PORT"] ?? "3456", 10);
        const httpServer = createServer(async (req, res) => {
            // CORS — allow any origin (adjust as needed for production)
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
            if (req.method === "OPTIONS") {
                res.writeHead(204);
                res.end();
                return;
            }
            // Health / discovery endpoint
            if (req.method === "GET" && req.url === "/health") {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ status: "ok", server: "dio-explorer", version: "1.0.0" }));
                return;
            }
            const transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: undefined, // stateless mode
            });
            res.on("close", () => {
                transport.close().catch(() => { });
            });
            await server.connect(transport);
            await transport.handleRequest(req, res);
        });
        httpServer.listen(port, () => {
            console.error(`[dio-explorer-mcp] HTTP server listening on http://localhost:${port}`);
            console.error(`[dio-explorer-mcp] MCP endpoint: POST http://localhost:${port}/mcp`);
            console.error(`[dio-explorer-mcp] Health check: GET  http://localhost:${port}/health`);
        });
    }
    else {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("[dio-explorer-mcp] Running on stdio");
    }
}
main().catch((error) => {
    console.error("[dio-explorer-mcp] Fatal error:", error);
    process.exit(1);
});
