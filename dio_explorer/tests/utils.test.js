/**
 * Unit tests — src/utils.js
 */

const path = require("path");
const { loadData, findTrilhas, randomFrom, today, futureDate } = require("../src/utils");

// ─── loadData ──────────────────────────────────────────────────────────────

describe("loadData", () => {
  test("returns an object with fonte, descricao and trilhas array", () => {
    const data = loadData();
    expect(data).toHaveProperty("fonte");
    expect(data).toHaveProperty("descricao");
    expect(Array.isArray(data.trilhas)).toBe(true);
    expect(data.trilhas.length).toBeGreaterThan(0);
  });

  test("each trilha has required fields", () => {
    const { trilhas } = loadData();
    const REQUIRED = ["id", "nome", "tecnologia", "nivel", "modulos", "xp_total", "badges", "promocao", "vitalicio", "lives_ao_vivo"];
    trilhas.forEach((t) => {
      REQUIRED.forEach((field) => {
        expect(t).toHaveProperty(field);
      });
    });
  });

  test("badges is always an array", () => {
    const { trilhas } = loadData();
    trilhas.forEach((t) => {
      expect(Array.isArray(t.badges)).toBe(true);
    });
  });

  test("xp_total is a positive number for all trilhas", () => {
    const { trilhas } = loadData();
    trilhas.forEach((t) => {
      expect(t.xp_total).toBeGreaterThan(0);
    });
  });
});

// ─── findTrilhas ───────────────────────────────────────────────────────────

describe("findTrilhas", () => {
  test("finds Java trilha by exact name (case-insensitive)", () => {
    const results = findTrilhas("Java");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].tecnologia).toBe("Java");
  });

  test("finds Java trilha by lowercase query", () => {
    const results = findTrilhas("java");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].tecnologia.toLowerCase()).toContain("java");
  });

  test("finds React trilha", () => {
    const results = findTrilhas("React");
    expect(results.length).toBeGreaterThanOrEqual(1);
    const techs = results.map((t) => t.tecnologia.toLowerCase());
    expect(techs.some((t) => t.includes("react"))).toBe(true);
  });

  test("returns empty array for non-existent technology", () => {
    const results = findTrilhas("TecnologiaInexistente99");
    expect(results).toEqual([]);
  });

  test("trims whitespace from query", () => {
    const results = findTrilhas("  Java  ");
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  test("partial match: 'py' matches Python", () => {
    const results = findTrilhas("py");
    const techs = results.map((t) => t.tecnologia.toLowerCase());
    expect(techs.some((t) => t.includes("py"))).toBe(true);
  });
});

// ─── randomFrom ───────────────────────────────────────────────────────────

describe("randomFrom", () => {
  test("returns an element that exists in the array", () => {
    const arr = ["a", "b", "c", "d", "e"];
    const result = randomFrom(arr);
    expect(arr).toContain(result);
  });

  test("works with a single-element array", () => {
    expect(randomFrom([42])).toBe(42);
  });

  test("returns a value within the array across multiple runs", () => {
    const arr = [1, 2, 3];
    for (let i = 0; i < 20; i++) {
      expect(arr).toContain(randomFrom(arr));
    }
  });
});

// ─── today ────────────────────────────────────────────────────────────────

describe("today", () => {
  test("returns a string in DD/MM/YYYY format", () => {
    const result = today();
    expect(typeof result).toBe("string");
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  test("year is the current year", () => {
    const result = today();
    const currentYear = new Date().getFullYear().toString();
    expect(result.slice(-4)).toBe(currentYear);
  });
});

// ─── futureDate ───────────────────────────────────────────────────────────

describe("futureDate", () => {
  test("returns a string in DD/MM/YYYY format", () => {
    const result = futureDate(7);
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  test("future date with 0 days equals today", () => {
    expect(futureDate(0)).toBe(today());
  });

  test("future date with 365 days contains next year or same year", () => {
    const result = futureDate(365);
    const year = parseInt(result.slice(-4), 10);
    const currentYear = new Date().getFullYear();
    expect(year).toBeGreaterThanOrEqual(currentYear);
  });
});
