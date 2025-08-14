import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const entryFile = resolve('assets/js/bootstrap.js');
const outFile = resolve('cleverlux-quote/assets/build/calculator.js');

mkdirSync(dirname(outFile), { recursive: true });

build({
  entryPoints: [entryFile],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2018'],
  outfile: outFile,
  sourcemap: false,
  minify: false,
  logLevel: 'info',
  loader: {
    '.json': 'json',
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
}).catch((err) => {
  console.error(err);
  process.exit(1);
});