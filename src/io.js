import { writeFile, readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const print = str => console.log(str);
export const read = async file => await readFile(file);
export const write = async ( data, file ) => await writeFile(file, data);
