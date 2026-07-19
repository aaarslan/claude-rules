# Upload prototype

A small demo of the asset upload screen. It is meant for showing the
interaction to the design team on a laptop, nothing more.

## Run it

```bash
npm start
```

That serves `public/` on <http://localhost:3000>. There is no other command:
no install step, no build, no deploy. The project has no dependencies.

## What is here

```
server.js             static file server built on node:http
public/index.html     the demo screen
public/app.js         browser code for the picker and the file list
public/sample-logo.svg  a placeholder asset to drop into the picker
src/uploadStore.js    keeps chosen files in memory for the session
```

## Local use only

Uploaded files live in memory and disappear when the process stops. Nothing is
written to disk, nothing leaves the machine, and there is no authentication in
front of the page. Do not put anything on a shared host or point it at real
customer assets. When the flow graduates past the demo, the in-memory store is
the seam to replace with a real storage adapter.
