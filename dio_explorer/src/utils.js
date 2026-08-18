/**
 * DIO Explorer — shared utilities
 * Loads trilhas_dio.json and exposes lookup / formatting helpers.
 */

const path = require("path");
const fs   = require("fs");

const DATA_PATH = path.resolve(__dirname, "../data/trilhas_dio.json");

/** @returns {{ fonte: string, descricao: string, trilhas: object[] }} */
function loadData() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

/**
 * Find trilhas whose "tecnologia" field matches the query (case-insensitive,
 * partial match allowed).
 * @param {string} query
 * @returns {object[]}
 */
function findTrilhas(query) {
  const { trilhas } = loadData();
  const q = query.trim().toLowerCase();
  return trilhas.filter((t) => t.tecnologia.toLowerCase().includes(q));
}

/**
 * Pick a random element from an array.
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Return a zero-padded date string (DD/MM/YYYY) for today.
 * @returns {string}
 */
function today() {
  const d = new Date();
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Return a future date string (DD/MM/YYYY) offset by `days` from today.
 * @param {number} days
 * @returns {string}
 */
function futureDate(days) {
  const d = new Date(Date.now() + days * 86_400_000);
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

module.exports = { loadData, findTrilhas, randomFrom, today, futureDate };
