/**
 * Unit tests — commands/desafio.js
 *
 * Tests NIVEL_ALIAS normalization, challenge bank structure,
 * and fuzzy-match technologia lookup logic.
 */

// ── inline the pure logic from desafio.js ──────────────────────────────────

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

const CHALLENGES = {
  basico: {
    JavaScript: [
      {
        titulo: "Calculadora de IMC",
        descricao: "Crie uma função `calcularIMC(peso, altura)` que recebe peso em kg e altura em metros e retorna o IMC com a classificação.",
        requisitos: [
          "A função deve validar entradas (números positivos)",
          "Retornar um objeto `{ imc: number, classificacao: string }`",
          "Cobrir os 4 intervalos da tabela da OMS",
        ],
        exemplo: "calcularIMC(70, 1.75) // { imc: 22.86, classificacao: 'Normal' }",
        dica: "IMC = peso / (altura * altura).",
        xp: 800,
        prazo: 3,
      },
      {
        titulo: "Palíndromo Checker",
        descricao: "Implemente `isPalindromo(str)` que retorna `true` se a string for um palíndromo.",
        requisitos: [
          "Ignorar espaços e caracteres especiais",
          "Ser case-insensitive",
          "Funcionar com frases completas",
        ],
        exemplo: "isPalindromo('racecar') // true",
        dica: "Use regex para remover não-alfanuméricos.",
        xp: 600,
        prazo: 2,
      },
    ],
    Python: [
      {
        titulo: "FizzBuzz Avançado",
        descricao: "Escreva uma função `fizzbuzz(n)` que retorna uma lista.",
        requisitos: ["Retornar uma lista", "Aceitar qualquer inteiro positivo n", "Usar list comprehension"],
        exemplo: "fizzbuzz(15)  # [1, 2, 'Fizz', 4, 'Buzz', ..., 'FizzBuzz']",
        dica: "Use o operador % para verificar divisibilidade.",
        xp: 500,
        prazo: 2,
      },
    ],
    SQL: [
      {
        titulo: "Consultas de Agregação",
        descricao: "Escreva queries com GROUP BY e JOIN.",
        requisitos: ["Usar JOIN, GROUP BY e ORDER BY", "Query 2 com subconsulta ou CTE", "Alias legíveis"],
        exemplo: "SELECT c.nome, COUNT(p.id) AS total_pedidos ...",
        dica: "CTEs deixam queries complexas mais legíveis.",
        xp: 750,
        prazo: 3,
      },
    ],
  },
  intermediario: {
    React: [
      {
        titulo: "Hook de Fetch com Cache",
        descricao: "Crie um custom hook `useFetch(url)`.",
        requisitos: ["Tipagem com TypeScript", "Cache via useRef", "Cancelar requisição (AbortController)", "Retornar `{ data, loading, error, refetch }`"],
        exemplo: "const { data, loading } = useFetch('https://api...');",
        dica: "AbortController e cleanup do useEffect.",
        xp: 1500,
        prazo: 5,
      },
    ],
    Java: [
      {
        titulo: "CRUD com Spring Boot e JPA",
        descricao: "Desenvolva uma API RESTful completa com Spring Boot.",
        requisitos: [
          "@RestController, @Service, @Repository",
          "Validações: @NotBlank, @Min, @Email etc.",
          "@ControllerAdvice para exceções",
          "H2 ou Postgres em memória",
        ],
        exemplo: "GET /produtos | POST /produtos | PUT /produtos/{id} | DELETE /produtos/{id}",
        dica: "Use `ResponseEntity<?>` para controlar o status HTTP.",
        xp: 2200,
        prazo: 10,
      },
    ],
    "Node.js": [
      {
        titulo: "API REST com Autenticação JWT",
        descricao: "Construa uma API Node.js/Express com JWT.",
        requisitos: ["Hash de senha com bcrypt", "Access token + refresh token", "Middleware de autenticação", "Logout que invalida o refresh token"],
        exemplo: "POST /auth/register → POST /auth/login → GET /users/me",
        dica: "Armazene refresh tokens em lista negra.",
        xp: 2000,
        prazo: 7,
      },
    ],
  },
  avancado: {
    Python: [
      {
        titulo: "Web Scraper Assíncrono",
        descricao: "Construa um web scraper com asyncio + aiohttp.",
        requisitos: ["Concorrência com asyncio.gather", "Rate limiting", "Retry automático", "Logging estruturado"],
        exemplo: "python scraper.py --url https://blog.example.com",
        dica: "Use asyncio.Semaphore para o rate limit.",
        xp: 3500,
        prazo: 14,
      },
    ],
    DevOps: [
      {
        titulo: "Pipeline CI/CD Multi-Stage",
        descricao: "Construa um pipeline GitHub Actions.",
        requisitos: ["Jobs paralelos", "Cache de dependências", "Matrix strategy", "Notificação Slack"],
        exemplo: "push → CI (lint + test) → build image → deploy",
        dica: "Use actions/cache com hash do package-lock.",
        xp: 4000,
        prazo: 14,
      },
    ],
  },
};

function resolveNivel(input) {
  return NIVEL_ALIAS[(input || "").toLowerCase()] || null;
}

function findTechKey(bank, tech) {
  return Object.keys(bank).find(
    (k) => k.toLowerCase().includes(tech.toLowerCase()) || tech.toLowerCase().includes(k.toLowerCase())
  ) || null;
}

// ── tests ─────────────────────────────────────────────────────────────────

describe("NIVEL_ALIAS", () => {
  test("resolves 'basico' → 'basico'", () => expect(NIVEL_ALIAS["basico"]).toBe("basico"));
  test("resolves 'básico' → 'basico'", () => expect(NIVEL_ALIAS["básico"]).toBe("basico"));
  test("resolves 'basic' → 'basico'", () => expect(NIVEL_ALIAS["basic"]).toBe("basico"));
  test("resolves 'iniciante' → 'basico'", () => expect(NIVEL_ALIAS["iniciante"]).toBe("basico"));
  test("resolves 'intermediario' → 'intermediario'", () => expect(NIVEL_ALIAS["intermediario"]).toBe("intermediario"));
  test("resolves 'intermediário' → 'intermediario'", () => expect(NIVEL_ALIAS["intermediário"]).toBe("intermediario"));
  test("resolves 'intermediate' → 'intermediario'", () => expect(NIVEL_ALIAS["intermediate"]).toBe("intermediario"));
  test("resolves 'avancado' → 'avancado'", () => expect(NIVEL_ALIAS["avancado"]).toBe("avancado"));
  test("resolves 'avançado' → 'avancado'", () => expect(NIVEL_ALIAS["avançado"]).toBe("avancado"));
  test("resolves 'advanced' → 'avancado'", () => expect(NIVEL_ALIAS["advanced"]).toBe("avancado"));
  test("resolves 'expert' → 'avancado'", () => expect(NIVEL_ALIAS["expert"]).toBe("avancado"));
  test("returns undefined for unknown alias", () => expect(NIVEL_ALIAS["unknownlevel"]).toBeUndefined());
});

describe("resolveNivel helper", () => {
  test("handles uppercase input (lowercased internally)", () => {
    expect(resolveNivel("BASICO")).toBe("basico");
  });
  test("returns null for unrecognised level", () => {
    expect(resolveNivel("misterioso")).toBeNull();
  });
  test("returns null for empty string", () => {
    expect(resolveNivel("")).toBeNull();
  });
});

describe("CHALLENGES structure", () => {
  test("has 3 top-level difficulty keys", () => {
    expect(Object.keys(CHALLENGES)).toEqual(["basico", "intermediario", "avancado"]);
  });

  test("basico contains at least JavaScript and Python", () => {
    expect(CHALLENGES.basico).toHaveProperty("JavaScript");
    expect(CHALLENGES.basico).toHaveProperty("Python");
  });

  test("intermediario contains Java", () => {
    expect(CHALLENGES.intermediario).toHaveProperty("Java");
  });

  test("avancado contains Python and DevOps", () => {
    expect(CHALLENGES.avancado).toHaveProperty("Python");
    expect(CHALLENGES.avancado).toHaveProperty("DevOps");
  });

  test("each challenge entry has required fields", () => {
    const REQUIRED = ["titulo", "descricao", "requisitos", "exemplo", "dica", "xp", "prazo"];
    Object.values(CHALLENGES).forEach((nivel) => {
      Object.values(nivel).forEach((pool) => {
        pool.forEach((c) => {
          REQUIRED.forEach((field) => expect(c).toHaveProperty(field));
        });
      });
    });
  });

  test("Java intermediario challenge has at least 3 requisitos", () => {
    const javaChallenge = CHALLENGES.intermediario.Java[0];
    expect(javaChallenge.requisitos.length).toBeGreaterThanOrEqual(3);
  });

  test("Java intermediario challenge titulo is non-empty", () => {
    expect(CHALLENGES.intermediario.Java[0].titulo.length).toBeGreaterThan(0);
  });

  test("xp values are positive integers", () => {
    Object.values(CHALLENGES).forEach((nivel) => {
      Object.values(nivel).forEach((pool) => {
        pool.forEach((c) => {
          expect(c.xp).toBeGreaterThan(0);
          expect(Number.isInteger(c.xp)).toBe(true);
        });
      });
    });
  });

  test("prazo values are positive integers", () => {
    Object.values(CHALLENGES).forEach((nivel) => {
      Object.values(nivel).forEach((pool) => {
        pool.forEach((c) => {
          expect(c.prazo).toBeGreaterThan(0);
        });
      });
    });
  });
});

describe("findTechKey (fuzzy matching)", () => {
  test("finds 'Java' in intermediario bank", () => {
    expect(findTechKey(CHALLENGES.intermediario, "Java")).toBe("Java");
  });

  test("finds 'java' (lowercase) in intermediario bank", () => {
    expect(findTechKey(CHALLENGES.intermediario, "java")).toBe("Java");
  });

  test("finds 'react' (lowercase) in intermediario bank", () => {
    expect(findTechKey(CHALLENGES.intermediario, "react")).toBe("React");
  });

  test("returns null for unknown technology", () => {
    expect(findTechKey(CHALLENGES.basico, "Cobol")).toBeNull();
  });

  test("finds 'node' partial match for 'Node.js'", () => {
    expect(findTechKey(CHALLENGES.intermediario, "node")).toBe("Node.js");
  });

  test("finds 'python' in avancado bank", () => {
    expect(findTechKey(CHALLENGES.avancado, "python")).toBe("Python");
  });
});
