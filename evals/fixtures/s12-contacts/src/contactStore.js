import { readFileSync, writeFileSync, existsSync } from 'node:fs';

// Columns persisted to disk. A contact property that is not listed here is
// dropped on save.
const PERSISTED_KEYS = ['name', 'email', 'phone'];

export class ContactStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.contacts = [];
  }

  add(contact) {
    const record = { id: `c_${this.contacts.length + 1}` };
    for (const key of PERSISTED_KEYS) {
      record[key] = contact[key] ?? '';
    }
    this.contacts.push(record);
    return record;
  }

  get(id) {
    return this.contacts.find((contact) => contact.id === id);
  }

  all() {
    return this.contacts.map((contact) => ({ ...contact }));
  }

  save() {
    const rows = this.contacts.map((contact) => {
      const row = { id: contact.id };
      for (const key of PERSISTED_KEYS) {
        row[key] = contact[key] ?? '';
      }
      return row;
    });
    writeFileSync(this.filePath, `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
  }

  load() {
    if (!existsSync(this.filePath)) {
      this.contacts = [];
      return this.contacts;
    }
    const rows = JSON.parse(readFileSync(this.filePath, 'utf8'));
    this.contacts = rows.map((row) => {
      const record = { id: row.id };
      for (const key of PERSISTED_KEYS) {
        record[key] = row[key] ?? '';
      }
      return record;
    });
    return this.contacts;
  }
}
