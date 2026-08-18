#!/usr/bin/env node
/**
 * Slash command: /desafio <nivel> <tecnologia>
 *
 * Gera um desafio de código aleatório baseado no nível e tecnologia escolhidos.
 *
 * Uso:
 *   node commands/desafio.js basico JavaScript
 *   node commands/desafio.js intermediario React
 *   node commands/desafio.js avancado Python
 */

const { randomFrom, today, futureDate } = require("../src/utils");

// ── challenge bank ─────────────────────────────────────────────────────────

/**
 * Each entry: { titulo, descricao, requisitos[], exemplo, dica, xp, prazo (days) }
 */
const CHALLENGES = {
  basico: {
    JavaScript: [
      {
        titulo: "Calculadora de IMC",
        descricao:
          "Crie uma função `calcularIMC(peso, altura)` que recebe peso em kg e altura em metros e retorna o IMC com a classificação (Abaixo do peso, Normal, Sobrepeso, Obesidade).",
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
        descricao:
          "Implemente `isPalindromo(str)` que retorna `true` se a string for um palíndromo, ignorando espaços, pontuação e capitalização.",
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
        descricao:
          "Escreva uma função `fizzbuzz(n)` que retorna uma lista com os números de 1 a n substituindo múltiplos de 3 por 'Fizz', múltiplos de 5 por 'Buzz' e múltiplos de ambos por 'FizzBuzz'.",
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
      {
        titulo: "Contador de Palavras",
        descricao:
          "Crie `contar_palavras(texto)` que recebe uma string e retorna um dicionário com a frequência de cada palavra (case-insensitive, sem pontuação).",
        requisitos: [
          "Ignorar pontuação e capitalização",
          "Ordenar o resultado por frequência decrescente",
          "Retornar um `dict`",
        ],
        exemplo: "contar_palavras('O rato roeu a roupa do rei') # {'o': 1, 'rato': 1, ...}",
        dica: "Use `str.split()`, `str.lower()` e `re.sub()` para limpar o texto. `collections.Counter` pode ajudar.",
        xp: 700,
        prazo: 3,
      },
    ],
    "HTML/CSS": [
      {
        titulo: "Card de Perfil Responsivo",
        descricao:
          "Construa um card de perfil de desenvolvedor usando apenas HTML e CSS. O card deve exibir avatar, nome, cargo, bio curta e links para redes sociais.",
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
        descricao:
          "Dado um banco com tabelas `clientes` e `pedidos`, escreva queries que respondam: (1) total de pedidos por cliente, (2) cliente com maior valor de compras, (3) média de valor por categoria.",
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
        descricao:
          "Crie um custom hook `useFetch(url)` que busca dados de uma API, gerencia os estados loading/error/data e implementa cache em memória para evitar requisições repetidas à mesma URL.",
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
      {
        titulo: "Formulário Multi-Etapas",
        descricao:
          "Implemente um formulário com 3 etapas (dados pessoais, endereço, revisão) com validação por etapa, barra de progresso e possibilidade de voltar sem perder os dados.",
        requisitos: [
          "React Hook Form ou validação manual",
          "Estado global da etapa atual",
          "Resumo editável na etapa final",
          "Animação de transição entre etapas",
        ],
        exemplo: "Etapa 1 → Etapa 2 → Etapa 3 (revisão) → Submit",
        dica: "Guarde o estado de cada etapa em um objeto centralizado e só avance após validação.",
        xp: 1800,
        prazo: 7,
      },
    ],
    "Node.js": [
      {
        titulo: "API REST com Autenticação JWT",
        descricao:
          "Construa uma API Node.js/Express com rotas de usuários (registro, login, perfil) protegidas por JWT, incluindo refresh token e logout seguro.",
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
        descricao:
          "Crie um conjunto de tipos TypeScript genéricos para padronizar respostas de API: `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError` e um helper `isApiError(res)`.",
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
        descricao:
          "Desenvolva uma API RESTful completa com Spring Boot para gerenciar uma entidade `Produto` (CRUD completo), com validações via Bean Validation e tratamento global de erros.",
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
        descricao:
          "Construa um web scraper com `asyncio` + `aiohttp` + `BeautifulSoup` que extrai títulos, links e datas de artigos de um blog público, salvando os resultados em CSV e SQLite simultaneamente.",
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
        descricao:
          "Implemente um pipeline completo de ML para classificação binária: ingestão de dados, EDA, pré-processamento, treino de 3 modelos (LR, RF, XGBoost), tuning de hiperparâmetros e serving via API FastAPI.",
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
        descricao:
          "Crie uma arquitetura serverless que, ao receber um arquivo CSV no S3, dispara uma Lambda para validar, transformar e persistir os registros no DynamoDB, notificando via SNS em caso de erro.",
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
        descricao:
          "Construa um pipeline GitHub Actions completo para uma aplicação Node.js: lint → testes → build Docker → push ECR → deploy ECS com rollback automático em caso de falha no health check.",
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
        descricao:
          "Implemente uma ferramenta CLI em Rust que comprime e descomprime arquivos usando o algoritmo LZ4, suportando múltiplos arquivos em paralelo com Rayon.",
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

// Nivel aliases
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

// ── main ───────────────────────────────────────────────────────────────────

function run() {
  const args  = process.argv.slice(2);
  const nivel = (args[0] || "").toLowerCase();
  const tech  = args.slice(1).join(" ").trim();

  if (!nivel || !tech) {
    console.error(
      "❌  Uso: /desafio <nivel> <tecnologia>\n" +
      "   Níveis aceitos: basico | intermediario | avancado\n" +
      "   Exemplo: /desafio intermediario React"
    );
    process.exit(1);
  }

  const nivelKey = NIVEL_ALIAS[nivel];
  if (!nivelKey) {
    console.error(`❌  Nível "${nivel}" não reconhecido.\n   Use: basico, intermediario ou avancado`);
    process.exit(1);
  }

  const bank = CHALLENGES[nivelKey];

  // Fuzzy-match tecnologia
  const techKey = Object.keys(bank).find(
    (k) => k.toLowerCase().includes(tech.toLowerCase()) || tech.toLowerCase().includes(k.toLowerCase())
  );

  if (!techKey) {
    const available = Object.keys(bank).join(", ");
    console.log(`🔍  Nenhum desafio encontrado para "${tech}" no nível "${nivelKey}".`);
    console.log(`   Tecnologias disponíveis neste nível: ${available}`);
    process.exit(0);
  }

  const pool    = bank[techKey];
  const desafio = randomFrom(pool);
  const inicio  = today();
  const fim     = futureDate(desafio.prazo);

  const nivelLabel = { basico: "🟢 Básico", intermediario: "🟡 Intermediário", avancado: "🔴 Avançado" }[nivelKey];

  console.log(`\n${"═".repeat(60)}`);
  console.log(`⚡  DESAFIO DIO — ${nivelLabel}`);
  console.log(`${"═".repeat(60)}`);
  console.log(`\n🎯  ${desafio.titulo}`);
  console.log(`🏷️   Tecnologia : ${techKey}`);
  console.log(`⭐  XP em jogo  : ${desafio.xp.toLocaleString("pt-BR")} XP`);
  console.log(`📅  Período     : ${inicio} → ${fim} (${desafio.prazo} dias)`);
  console.log(`\n📝  Descrição:`);
  console.log(`   ${desafio.descricao}`);
  console.log(`\n✅  Requisitos:`);
  desafio.requisitos.forEach((r) => console.log(`   • ${r}`));
  console.log(`\n💡  Exemplo:`);
  console.log(`   ${desafio.exemplo}`);
  console.log(`\n🔧  Dica do mentor:`);
  console.log(`   ${desafio.dica}`);
  console.log(`\n🚀  Boa sorte! Submeta seu repositório em https://www.dio.me`);
  console.log(`${"═".repeat(60)}\n`);
}

run();
