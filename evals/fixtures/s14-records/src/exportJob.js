import { fetchAll } from './records.js';

const COLUMNS = ['id', 'title', 'status', 'owner', 'updatedAt'];

function toRow(record) {
  return COLUMNS.map((column) => String(record[column]).replaceAll(',', ' ')).join(',');
}

/** Render every record, or every record of one status, as CSV text. */
export function exportRecordsCsv(status) {
  const records = fetchAll(status ? { status } : {});
  return [COLUMNS.join(','), ...records.map(toRow)].join('\n');
}

/** Summary of what an export would contain, without rendering it. */
export function describeExport(status) {
  const records = fetchAll(status ? { status } : {});
  return { rowCount: records.length, columns: COLUMNS.slice(), status: status ?? 'all' };
}
