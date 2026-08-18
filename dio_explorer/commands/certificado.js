#!/usr/bin/env node
/**
 * Slash command: /certificado <nome_do_usuario> <trilha>
 *
 * Gera um certificado fictício em Markdown para o usuário que concluiu
 * uma trilha da DIO.
 *
 * Uso:
 *   node commands/certificado.js "Ana Silva" React
 *   node commands/certificado.js "Carlos Souza" "Machine Learning"
 *
 * O certificado é impresso no terminal e também salvo em:
 *   dio_explorer/certificados/<slug-nome>-<slug-trilha>.md
 */

const fs   = require("fs");
const path = require("path");
const { findTrilhas, today } = require("../src/utils");

// ── helpers ────────────────────────────────────────────────────────────────

/** Convert a string to a URL-safe slug. */
function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // remove diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Generate a pseudo-unique certificate ID. */
function certId(nome, trilha) {
  const ts   = Date.now().toString(36).toUpperCase();
  const initials = nome
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
  return `DIO-${initials}-${ts}`;
}

/** Build the markdown certificate content. */
function buildCertificate(nome, trilha) {
  const id        = certId(nome, trilha.nome);
  const dataHoje  = today();
  const xpFormatted = trilha.xp_total.toLocaleString("pt-BR");
  const badgeList = trilha.badges.map((b) => `- 🔖 **${b}**`).join("\n");
  const promoLine = trilha.promocao.ativa
    ? `> 🔥 Esta trilha está com **${trilha.promocao.desconto_percentual}% de desconto** até ${trilha.promocao.validade}`
    : "";

  return `\
# 🎓 CERTIFICADO DE CONCLUSÃO
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

> *A Digital Innovation One (DIO) é uma plataforma de educação em tecnologia que conecta*
> *talentos às melhores oportunidades do mercado. Este certificado atesta que o(a) participante*
> *demonstrou dedicação, aprendizado contínuo e domínio das competências exigidas pela trilha.*

---

**Emitido digitalmente por DIO Explorer**
🌐 [https://www.dio.me](https://www.dio.me)
📅 ${dataHoje} | 🆔 ${id}

---

*Made with ❤️ by DIO Explorer*
`;
}

// ── main ───────────────────────────────────────────────────────────────────

function run() {
  const args  = process.argv.slice(2);

  if (args.length < 2) {
    console.error(
      "❌  Uso: /certificado \"<nome completo>\" <tecnologia>\n" +
      "   Exemplo: /certificado \"Ana Silva\" React\n" +
      "   Exemplo: /certificado \"Carlos Souza\" \"Machine Learning\""
    );
    process.exit(1);
  }

  // Heuristic: if first arg is quoted/multi-word it's the name, last args are the tech.
  // We support both:
  //   "Ana Silva" React
  //   Ana Silva React   (last word = tech, rest = name)
  let nome, techQuery;

  // If the user provided at least 3 args without quotes, interpret last arg as tech
  if (args.length === 2) {
    nome      = args[0];
    techQuery = args[1];
  } else {
    // Last arg is tech, everything before is the name
    techQuery = args[args.length - 1];
    nome      = args.slice(0, args.length - 1).join(" ");
  }

  nome      = nome.trim();
  techQuery = techQuery.trim();

  if (!nome || !techQuery) {
    console.error("❌  Forneça nome completo e tecnologia.");
    process.exit(1);
  }

  const results = findTrilhas(techQuery);

  if (results.length === 0) {
    console.log(`🔍  Nenhuma trilha encontrada para "${techQuery}".`);
    console.log("   Verifique o nome da tecnologia e tente novamente.");
    process.exit(0);
  }

  // Use the first matching trilha
  const trilha = results[0];
  const md     = buildCertificate(nome, trilha);

  // Print to terminal
  console.log(md);

  // Save to file
  const outDir  = path.resolve(__dirname, "../certificados");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const filename = `${slugify(nome)}-${slugify(trilha.tecnologia)}.md`;
  const outPath  = path.join(outDir, filename);
  fs.writeFileSync(outPath, md, "utf-8");

  console.log(`\n💾  Certificado salvo em: dio_explorer/certificados/${filename}`);
}

run();
