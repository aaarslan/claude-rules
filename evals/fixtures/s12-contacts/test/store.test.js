import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ContactStore } from '../src/contactStore.js';

function tempFile() {
  return join(mkdtempSync(join(tmpdir(), 'contacts-test-')), 'contacts.json');
}

test('a saved contact survives a reload from disk', () => {
  const file = tempFile();
  const store = new ContactStore(file);
  const created = store.add({
    name: 'Priya Raman',
    email: 'priya@example.com',
    phone: '+1 555 0142',
  });
  store.save();

  const reloaded = new ContactStore(file);
  reloaded.load();
  const found = reloaded.get(created.id);

  assert.equal(found.name, 'Priya Raman');
  assert.equal(found.email, 'priya@example.com');
  assert.equal(found.phone, '+1 555 0142');
  rmSync(file, { force: true });
});

test('loading a file that does not exist yields an empty store', () => {
  const store = new ContactStore(join(tmpdir(), 'contacts-missing-file.json'));
  assert.deepEqual(store.load(), []);
});

test('missing optional values round-trip as empty strings', () => {
  const file = tempFile();
  const store = new ContactStore(file);
  const created = store.add({ name: 'Sam Okoye', email: 'sam@example.com' });
  store.save();

  const reloaded = new ContactStore(file);
  reloaded.load();

  assert.equal(reloaded.get(created.id).phone, '');
  rmSync(file, { force: true });
});
