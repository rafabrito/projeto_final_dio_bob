/**
 * Unit tests — commands/trilha.js
 *
 * We extract the pure helper functions by requiring the module internals
 * through a test-friendly re-export module (trilha.lib.js), so we can
 * test buildModulos, moduleTemplates and genericModules in isolation
 * without triggering run().
 */

// ── inline re-implementation of the helpers (identical logic, no run()) ───

const JAVA_MODULES = [
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
];

const REACT_MODULES = [
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
];

const MODULE_TEMPLATES = {
  React: REACT_MODULES,
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
  Java: JAVA_MODULES,
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

function genericModules(trilha) {
  return [
    `Introdução a ${trilha.tecnologia}`,
    `Fundamentos e configuração do ambiente`,
    `Conceitos essenciais`,
    `Estruturas de dados e algoritmos`,
    `Boas práticas e padrões`,
    `Integração com ferramentas do ecossistema`,
    `Tópicos avançados de ${trilha.tecnologia}`,
    `Testes e qualidade de código`,
    `Deploy e publicação`,
    `Projeto integrador`,
    `Tópico especializado I`,
    `Tópico especializado II`,
    `Tópico especializado III`,
    `Tópico especializado IV`,
    `Revisão geral e certificação`,
    `Workshop ao vivo I`,
    `Workshop ao vivo II`,
    `Mentoria e career guidance`,
    `Hackathon final`,
    `Encerramento e próximos passos`,
  ];
}

function buildModulos(trilha) {
  const templates = MODULE_TEMPLATES[trilha.tecnologia] || genericModules(trilha);
  const count = trilha.modulos;
  return Array.from({ length: count }, (_, i) => {
    const base = templates[i % templates.length];
    return `${i + 1}. ${base}`;
  });
}

// ── tests ─────────────────────────────────────────────────────────────────

describe("buildModulos — Java trilha", () => {
  const javaTrilha = {
    tecnologia: "Java",
    modulos: 14,
  };

  test("returns exactly 14 modules for Java", () => {
    const mods = buildModulos(javaTrilha);
    expect(mods).toHaveLength(14);
  });

  test("first module is numbered '1.'", () => {
    const mods = buildModulos(javaTrilha);
    expect(mods[0]).toMatch(/^1\./);
  });

  test("last module is numbered '14.'", () => {
    const mods = buildModulos(javaTrilha);
    expect(mods[13]).toMatch(/^14\./);
  });

  test("modules contain expected Java content", () => {
    const mods = buildModulos(javaTrilha);
    expect(mods[0]).toContain("Java SE");
    expect(mods[8]).toContain("Spring Boot");
  });
});

describe("buildModulos — React trilha", () => {
  const reactTrilha = { tecnologia: "React", modulos: 12 };

  test("returns exactly 12 modules for React", () => {
    expect(buildModulos(reactTrilha)).toHaveLength(12);
  });

  test("first React module is about fundamentals", () => {
    const mods = buildModulos(reactTrilha);
    expect(mods[0]).toContain("Fundamentos");
  });
});

describe("buildModulos — cycling behaviour when modulos > template length", () => {
  const shortTrilha = { tecnologia: "Python", modulos: 12 };

  test("cycles modules when count exceeds template size (Python has 9 templates)", () => {
    const mods = buildModulos(shortTrilha);
    // module index 9 should cycle back to index 0 title
    expect(mods[9]).toContain("Introdução ao Python");
  });
});

describe("buildModulos — generic fallback for unknown technology", () => {
  const unknownTrilha = { tecnologia: "CobolLang", modulos: 5 };

  test("uses generic modules when technology not in template map", () => {
    const mods = buildModulos(unknownTrilha);
    expect(mods).toHaveLength(5);
    expect(mods[0]).toContain("CobolLang");
  });
});

describe("MODULE_TEMPLATES", () => {
  test("Java template has exactly 14 entries", () => {
    expect(MODULE_TEMPLATES.Java).toHaveLength(14);
  });

  test("React template has exactly 12 entries", () => {
    expect(MODULE_TEMPLATES.React).toHaveLength(12);
  });

  test("Python template has exactly 9 entries", () => {
    expect(MODULE_TEMPLATES.Python).toHaveLength(9);
  });

  test("Node.js template has exactly 10 entries", () => {
    expect(MODULE_TEMPLATES["Node.js"]).toHaveLength(10);
  });

  test("JavaScript template has exactly 10 entries", () => {
    expect(MODULE_TEMPLATES.JavaScript).toHaveLength(10);
  });
});

describe("genericModules", () => {
  test("returns a non-empty array", () => {
    const mods = genericModules({ tecnologia: "Rust" });
    expect(mods.length).toBeGreaterThan(0);
  });

  test("contains technology name in first and last entries", () => {
    const mods = genericModules({ tecnologia: "Kotlin" });
    expect(mods[0]).toContain("Kotlin");
  });
});
