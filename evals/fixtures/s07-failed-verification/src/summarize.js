export function summarize(records) {
  let totalCents = 0;
  for (const record of records) {
    totalCents += record.amountCents;
  }
  return { count: records.length, totalCents };
}
