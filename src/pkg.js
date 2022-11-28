import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
