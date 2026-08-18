#!/usr/bin/env node
/**
 * Slash command: /trilha <tecnologia>
 *
 * Exibe o plano de estudos formatado para uma trilha da DIO.
 *
 * Uso:
 *   node commands/trilha.js React
 *   node commands/trilha.js "Machine Learning"
 */

const { findTrilhas } = require("../src/utils");

// ── helpers ────────────────────────────────────────────────────────────────

/** Generates numbered study modules for a trilha based on its metadata. */
function buildModulos(trilha) {
  const templates = moduleTemplates[trilha.tecnologia] || genericModules(trilha);
  const count = trilha.modulos;
  // Use the template list; cycle if needed
  return Array.from({ length: count }, (_, i) => {
    const base = templates[i % templates.length];
    return `${i + 1}. ${base}`;
  });
}

const moduleTemplates = {
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

/** Fallback generic module titles for technologies without a template. */
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

// ── main ───────────────────────────────────────────────────────────────────

function run() {
  const query = process.argv.slice(2).join(" ").trim();

  if (!query) {
    console.error("❌  Uso: /trilha <tecnologia>\n   Exemplo: /trilha React");
    process.exit(1);
  }

  const results = findTrilhas(query);

  if (results.length === 0) {
    console.log(`🔍  Nenhuma trilha encontrada para "${query}".\n`);
    console.log("Tecnologias disponíveis: React, Node.js, Python, Java, TypeScript, Angular,");
    console.log("  Vue.js, Flutter, Kotlin, Swift, Go, Rust, PHP / Laravel, Ruby on Rails,");
    console.log("  Machine Learning, Data Science, Data Engineering, IA Generativa,");
    console.log("  AWS, Azure, Google Cloud, DevOps, Cybersecurity, SQL, Blockchain,");
    console.log("  Power BI, UX/UI Design, HTML/CSS, JavaScript, Next.js, NestJS, C# / .NET");
    process.exit(0);
  }

  results.forEach((trilha) => {
    const promo = trilha.promocao.ativa
      ? `🔥 Promoção ativa: ${trilha.promocao.desconto_percentual}% OFF (válida até ${trilha.promocao.validade})`
      : "Sem promoção ativa no momento";

    const acesso = trilha.vitalicio ? "✅ Acesso vitalício" : "⏳ Acesso por tempo limitado";
    const modulos = buildModulos(trilha);

    console.log(`\n${"═".repeat(60)}`);
    console.log(`📚  ${trilha.nome}`);
    console.log(`${"═".repeat(60)}`);
    console.log(`🏷️   Tecnologia : ${trilha.tecnologia}`);
    console.log(`📊  Nível       : ${trilha.nivel}`);
    console.log(`🎯  Módulos     : ${trilha.modulos}`);
    console.log(`⭐  XP Total    : ${trilha.xp_total.toLocaleString("pt-BR")} XP`);
    console.log(`🎙️   Lives ao vivo: ${trilha.lives_ao_vivo}`);
    console.log(`${acesso}`);
    console.log(`${promo}`);
    console.log(`\n🗂️  Plano de Estudos:`);
    modulos.forEach((m) => console.log(`   ${m}`));
    console.log(`\n🏅  Badges conquistados ao completar:`);
    trilha.badges.forEach((b) => console.log(`   🔖 ${b}`));
    console.log(`\n🌐  Acesse em: https://www.dio.me`);
  });
}

run();
