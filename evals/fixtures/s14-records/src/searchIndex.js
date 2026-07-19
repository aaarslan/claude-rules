import { fetchAll } from './records.js';

function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
}

/** Build a token to record-id index over every record. */
export function buildIndex() {
  const index = new Map();
  for (const record of fetchAll()) {
    for (const token of tokenize(record.title)) {
      if (!index.has(token)) {
        index.set(token, new Set());
      }
      index.get(token).add(record.id);
    }
  }
  return index;
}

/** Record ids whose titles contain every token in the query. */
export function search(query, index = buildIndex()) {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return [];
  }
  let hits = null;
  for (const token of tokens) {
    const matches = index.get(token) ?? new Set();
    hits = hits === null ? new Set(matches) : new Set([...hits].filter((id) => matches.has(id)));
  }
  return [...hits].sort();
}
