/**
 * Field descriptors for the contact form. The form UI iterates this list, so
 * a field appears on screen once it is listed here.
 */
export const FIELDS = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'phone', label: 'Phone', type: 'tel', required: false },
];

/** Builds the descriptors with the current values filled in. */
export function buildFields(contact = {}) {
  return FIELDS.map((field) => ({
    ...field,
    value: contact[field.key] ?? '',
  }));
}

/** Returns a list of human-readable problems, empty when the form is valid. */
export function validate(contact = {}) {
  const problems = [];
  for (const field of FIELDS) {
    const value = contact[field.key];
    if (field.required && !value) {
      problems.push(`${field.label} is required`);
    }
  }
  return problems;
}
