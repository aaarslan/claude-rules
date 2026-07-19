import test from 'node:test';
import assert from 'node:assert/strict';
import { renderDetail } from '../src/contactDetail.js';
import { buildFields, validate } from '../src/contactForm.js';

test('the detail view lists every filled field in order', () => {
  const view = renderDetail({
    id: 'c_1',
    name: 'Priya Raman',
    email: 'priya@example.com',
    phone: '+1 555 0142',
  });

  assert.equal(
    view,
    [
      'Contact c_1',
      'Name: Priya Raman',
      'Email: priya@example.com',
      'Phone: +1 555 0142',
    ].join('\n'),
  );
});

test('empty fields are hidden rather than shown blank', () => {
  const view = renderDetail({ id: 'c_2', name: 'Sam Okoye', email: 'sam@example.com', phone: '' });
  assert.equal(view, ['Contact c_2', 'Name: Sam Okoye', 'Email: sam@example.com'].join('\n'));
});

test('the form carries current values and reports missing required ones', () => {
  const fields = buildFields({ name: 'Sam Okoye' });
  assert.deepEqual(fields.map((field) => field.key), ['name', 'email', 'phone']);
  assert.equal(fields[0].value, 'Sam Okoye');
  assert.equal(fields[2].value, '');
  assert.deepEqual(validate({ name: 'Sam Okoye' }), ['Email is required']);
});
