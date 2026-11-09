import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server.js';
async function withServer(run) {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}
test('returns all seeded requests as JSON', () => withServer(async base => {
  const response = await fetch(`${base}/api/requests`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.total, 6);
  assert.equal(data.items.length, 6);
}));
test('serves app and rejects missing routes and writes', () => withServer(async base => {
  assert.match(await (await fetch(base)).text(), /Feature Board/);
  assert.equal((await fetch(`${base}/missing`)).status, 404);
  assert.equal((await fetch(`${base}/api/requests`, {method:'POST'})).status, 405);
}));
