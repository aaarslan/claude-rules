import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ContactStore } from './contactStore.js';
import { renderDetail } from './contactDetail.js';
import { validate } from './contactForm.js';

const dataDir = mkdtempSync(join(tmpdir(), 'contacts-'));
const dataFile = join(dataDir, 'contacts.json');

const draft = {
  name: 'Priya Raman',
  email: 'priya@example.com',
  phone: '+1 555 0142',
};

const problems = validate(draft);
if (problems.length > 0) {
  console.error(`Cannot save: ${problems.join(', ')}`);
  process.exit(1);
}

const store = new ContactStore(dataFile);
const created = store.add(draft);
store.save();
console.log(`Saved ${created.id} to ${dataFile}`);

const reloaded = new ContactStore(dataFile);
reloaded.load();
console.log('');
console.log(renderDetail(reloaded.get(created.id)));
