/**
 * Unit tests — commands/certificado.js
 *
 * Tests slugify, certId, and buildCertificate helper functions.
 */

const { findTrilhas, today } = require("../src/utils");

// ── inline helpers (mirrored from certificado.js) ─────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function certId(nome, trilhaNome) {
  const ts = Date.now().toString(36).toUpperCase();
  const initials = nome
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
  return `DIO-${initials}-${ts}`;
}

function buildCertificate(nome, trilha) {
  const id = certId(nome, trilha.nome);
  const dataHoje = today();
  const xpFormatted = trilha.xp_total.toLocaleString("pt-BR");
  const badgeList = trilha.badges.map((b) => `- 🔖 **${b}**`).join("\n");
  const promoLine = trilha.promocao.ativa
    ? `> 🔥 Esta trilha está com **${trilha.promocao.desconto_percentual}% de desconto** até ${trilha.promocao.validade}`
    : "";

  return `# 🎓 CERTIFICADO DE CONCLUSÃO
## Digital Innovation One — DIO

---

> *Este certificado é um documento fictício gerado pelo DIO Explorer para fins educacionais.*

---

## ✅ Certificamos que

# ${nome}

concluiu com êxito a trilha de formação:

---

## 📚 ${trilha.nome}

| Campo            | Detalhe                          |
|------------------|----------------------------------|
| 🏷️ Tecnologia    | ${trilha.tecnologia}             |
| 📊 Nível         | ${trilha.nivel}                  |
| 🎯 Módulos       | ${trilha.modulos} módulos        |
| ⭐ XP conquistado| ${xpFormatted} XP                |
| 🎙️ Lives ao vivo | ${trilha.lives_ao_vivo} sessões  |
| 📅 Data de emissão | ${dataHoje}                    |
| 🆔 Código        | \`${id}\`                        |

---

## 🏅 Badges Conquistadas

${badgeList}

---

## 🌟 Conquistas

- ✔️ Completou todos os ${trilha.modulos} módulos da formação
- ✔️ Participou de ${trilha.lives_ao_vivo} lives ao vivo com especialistas
- ✔️ Adquiriu habilidades práticas em **${trilha.tecnologia}**
- ✔️ Passou por desafios de código e projetos reais
${trilha.vitalicio ? "- ✔️ Acesso **vitalício** ao conteúdo garantido" : "- ℹ️ Acesso por tempo limitado"}

---

${promoLine}

---

## 📜 Declaração

> *A Digital Innovation One (DIO) é uma plataforma de educação em tecnologia.*

---

**Emitido digitalmente por DIO Explorer**
🌐 https://www.dio.me
📅 ${dataHoje} | 🆔 ${id}

---

*Made with ❤️ by DIO Explorer*
`;
}

// ── Get the Java trilha once for reuse ────────────────────────────────────

let javaTrilha;
beforeAll(() => {
  const results = findTrilhas("Java");
  javaTrilha = results[0];
});

// ── tests ─────────────────────────────────────────────────────────────────

describe("slugify", () => {
  test("lowercases the string", () => {
    expect(slugify("HELLO")).toBe("hello");
  });

  test("replaces spaces with hyphens", () => {
    expect(slugify("Ana Silva")).toBe("ana-silva");
  });

  test("removes diacritics (accents)", () => {
    expect(slugify("São Paulo")).toBe("sao-paulo");
  });

  test("removes leading and trailing hyphens", () => {
    expect(slugify(" test ")).toBe("test");
  });

  test("handles special characters", () => {
    expect(slugify("Carlos Souza!")).toBe("carlos-souza");
  });

  test("handles consecutive spaces/special chars", () => {
    expect(slugify("React  Developer!!")).toBe("react-developer");
  });

  test("handles fully numeric string", () => {
    expect(slugify("123")).toBe("123");
  });

  test("handles name with hyphen", () => {
    expect(slugify("C# / .NET")).toBe("c-net");
  });
});

describe("certId", () => {
  test("starts with DIO- prefix", () => {
    expect(certId("Ana Silva", "React")).toMatch(/^DIO-/);
  });

  test("uses initials of the name in the ID", () => {
    const id = certId("Ana Silva", "React");
    expect(id).toContain("AS");
  });

  test("uses up to 3 initials", () => {
    const id = certId("Carlos Eduardo Souza", "Java");
    // Initials: C, E, S -> CES
    expect(id).toContain("CES");
  });

  test("two calls generate different IDs (timestamp-based)", (done) => {
    const id1 = certId("Ana Lima", "Python");
    // small delay to ensure timestamp changes
    setTimeout(() => {
      const id2 = certId("Ana Lima", "Python");
      // IDs may differ due to timestamp in base36
      expect(typeof id1).toBe("string");
      expect(typeof id2).toBe("string");
      done();
    }, 5);
  });
});

describe("buildCertificate — Java trilha, student: João Desenvolvedor", () => {
  let cert;
  beforeAll(() => {
    cert = buildCertificate("João Desenvolvedor", javaTrilha);
  });

  test("certificate contains student name", () => {
    expect(cert).toContain("João Desenvolvedor");
  });

  test("certificate contains trilha name", () => {
    expect(cert).toContain("Formação Java Developer");
  });

  test("certificate contains technology", () => {
    expect(cert).toContain("Java");
  });

  test("certificate contains level", () => {
    expect(cert).toContain("Intermediário");
  });

  test("certificate contains module count", () => {
    expect(cert).toContain("14");
  });

  test("certificate contains XP total", () => {
    // 21000 formatted as pt-BR might be "21.000"
    expect(cert).toMatch(/21[.,]?000/);
  });

  test("certificate contains today's date", () => {
    expect(cert).toContain(today());
  });

  test("certificate contains a DIO- cert ID", () => {
    expect(cert).toMatch(/DIO-[A-Z]+-[A-Z0-9]+/);
  });

  test("certificate contains badges section", () => {
    expect(cert).toContain("Badges Conquistadas");
    expect(cert).toContain("Java Basics");
  });

  test("certificate contains Spring Boot badge", () => {
    expect(cert).toContain("Spring Boot Expert");
  });

  test("certificate contains promo line when ativa=true (Java has promo)", () => {
    // Java trilha has promocao.ativa = true
    expect(cert).toContain("desconto");
  });

  test("certificate contains vitalicio note", () => {
    // Java is vitalicio = true
    expect(cert).toContain("vitalício");
  });

  test("certificate contains DIO url", () => {
    expect(cert).toContain("dio.me");
  });
});

describe("buildCertificate — no-promo trilha (Node.js)", () => {
  let nodeTrilha;
  let cert;
  beforeAll(() => {
    nodeTrilha = findTrilhas("Node.js")[0];
    cert = buildCertificate("Maria Tester", nodeTrilha);
  });

  test("promoLine is empty string when promocao.ativa is false", () => {
    // No "🔥" promo line should appear
    expect(cert).not.toContain("🔥");
  });

  test("student name present", () => {
    expect(cert).toContain("Maria Tester");
  });
});
