import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const requests = [
  { id: 1, title: 'Add CSV export to reports', app: 'Analytics', status: 'Planned', priority: 'High', description: 'Let workspace owners download their filtered report.' },
  { id: 2, title: 'Improve mobile navigation', app: 'Customer portal', status: 'In progress', priority: 'High', description: 'Make account navigation easier on smaller screens.' },
  { id: 3, title: 'Add webhook retry history', app: 'API', status: 'Review', priority: 'Medium', description: 'Show delivery attempts and useful failure messages.' },
  { id: 4, title: 'Remember dashboard preferences', app: 'Analytics', status: 'Planned', priority: 'Low', description: 'Restore the last selected dashboard view.' },
  { id: 5, title: 'Show password reset confirmation', app: 'Customer portal', status: 'Done', priority: 'Medium', description: 'Give clear feedback after requesting a reset link.' },
  { id: 6, title: 'Document API pagination', app: 'API', status: 'Done', priority: 'Low', description: 'Add examples for cursor based result pages.' }
];
const root = fileURLToPath(new URL('./public/', import.meta.url));
const files = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/styles.css': ['styles.css', 'text/css'] };
export function filterRequests(items, { q = '', status = '' } = {}) {
  const query = q.trim().toLowerCase();
  return items.filter(item => (!status || item.status === status) &&
    (!query || [item.title, item.description, item.app].some(value => value.toLowerCase().includes(query))));
}
export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (req.method !== 'GET') { res.writeHead(405, { Allow: 'GET' }); return res.end(); }
      if (url.pathname === '/api/requests') {
        const status = url.searchParams.get('status') || '';
        if (status && !['Planned', 'In progress', 'Review', 'Done'].includes(status)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid status' }));
        }
        const items = filterRequests(requests, { q: url.searchParams.get('q') || '', status });
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        return res.end(JSON.stringify({ items, total: items.length }));
      }
      const file = files[url.pathname];
      if (!file) { res.writeHead(404); return res.end('Not found'); }
      const content = await readFile(path.join(root, file[0]));
      res.writeHead(200, { 'Content-Type': `${file[1]}; charset=utf-8`, 'X-Content-Type-Options': 'nosniff' });
      res.end(content);
    } catch { res.writeHead(500); res.end('Something went wrong'); }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createServer().listen(Number(process.env.PORT || 3000), '127.0.0.1', () => console.log('Feature board: http://127.0.0.1:3000'));
}
