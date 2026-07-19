# contacts

Contact manager. Contacts are held in memory and written to a JSON file so
they survive a restart.

## Layout

Each contact field appears in three places, and all three follow the same
shape, so the files stay in step:

- `src/contactForm.js` lists the form field descriptors (`FIELDS`) and
  validates a draft against them.
- `src/contactStore.js` lists the persisted columns (`PERSISTED_KEYS`) and uses
  that list for `add`, `save`, and `load`.
- `src/contactDetail.js` lists the detail view rows (`DETAIL_ROWS`) and renders
  the contact from them.

The fields today are name, email, and phone.

## Commands

- `npm start` creates a contact, writes it to a temporary JSON file, reloads it
  from disk, and prints the detail view.
- `npm test` runs the suite.
- `npm run typecheck` parses every source and test file.
- `npm run lint` runs the house style check.
