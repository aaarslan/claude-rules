const RECORDS = [
  { id: 'rec-101', title: 'Quarterly supplier audit', status: 'open', owner: 'nadia', updatedAt: '2026-02-11' },
  { id: 'rec-102', title: 'Warehouse intake sheet', status: 'closed', owner: 'jonas', updatedAt: '2026-01-28' },
  { id: 'rec-103', title: 'Cold chain exception log', status: 'open', owner: 'priya', updatedAt: '2026-03-02' },
  { id: 'rec-104', title: 'Vehicle inspection notes', status: 'archived', owner: 'jonas', updatedAt: '2025-11-19' },
  { id: 'rec-105', title: 'Returns reconciliation', status: 'open', owner: 'nadia', updatedAt: '2026-03-14' },
  { id: 'rec-106', title: 'Packaging defect report', status: 'closed', owner: 'ines', updatedAt: '2026-02-27' }
];

/**
 * Return records, newest first. Pass `status` to restrict to one status and
 * `limit` to cap the result length. Callers get their own copies.
 */
export function fetchAll({ status, limit } = {}) {
  let selected = RECORDS.slice();
  if (status) {
    selected = selected.filter((record) => record.status === status);
  }
  selected.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (typeof limit === 'number') {
    selected = selected.slice(0, limit);
  }
  return selected.map((record) => ({ ...record }));
}

/** Return a single record by id, or undefined when there is no such record. */
export function fetchById(id) {
  const found = RECORDS.find((record) => record.id === id);
  return found ? { ...found } : undefined;
}

/** Every status currently present in the store, sorted. */
export function knownStatuses() {
  return [...new Set(RECORDS.map((record) => record.status))].sort();
}
