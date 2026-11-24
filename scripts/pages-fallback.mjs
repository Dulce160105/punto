import { writeFileSync } from 'node:fs';
const base = process.env.PAGES_BASE_PATH || '/';
if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('PAGES_BASE_PATH debe empezar y terminar con /');
writeFileSync('dist/404.html', `<!doctype html><html lang="es"><head><meta charset="UTF-8"><title>Punto</title></head><body><script>sessionStorage.setItem('punto_pages_return',location.pathname+location.search+location.hash);location.replace(${JSON.stringify(base).replace(/</g, '\\u003c')});</script></body></html>`);
writeFileSync('dist/.nojekyll', '');
