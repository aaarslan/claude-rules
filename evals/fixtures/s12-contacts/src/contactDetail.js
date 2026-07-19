// Rows shown on the contact detail view, in display order. Rows with no value
// are hidden rather than shown blank.
const DETAIL_ROWS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
];

/** Renders one contact as the plain-text detail view. */
export function renderDetail(contact) {
  if (!contact) {
    return 'No contact selected';
  }
  const lines = [`Contact ${contact.id}`];
  for (const row of DETAIL_ROWS) {
    const value = contact[row.key];
    if (value) {
      lines.push(`${row.label}: ${value}`);
    }
  }
  return lines.join('\n');
}
