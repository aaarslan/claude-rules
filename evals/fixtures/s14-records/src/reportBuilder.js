import { fetchAll, knownStatuses } from './records.js';

/** Count of records per status, plus the total. */
export function buildStatusReport() {
  const records = fetchAll();
  const counts = {};
  for (const status of knownStatuses()) {
    counts[status] = 0;
  }
  for (const record of records) {
    counts[record.status] += 1;
  }
  return { total: records.length, counts };
}

/** The most recently updated records, newest first. */
export function buildRecentDigest(limit = 3) {
  return fetchAll({ limit }).map((record) => `${record.updatedAt} ${record.id} ${record.title}`);
}
