#! /usr/bin/env node

import fs from 'fs';
import { writeFile } from 'fs/promises';
import { promisify } from 'util';
import { program } from 'commander';

// const readFile = promisify(fs.readFile);
// const formatJSON = obj => JSON.stringify(obj, null, 2);

export async function doit (options) {
  console.log('doit!');
}

// async function getInput (options) {
//   if (options.input) {
//     const file = options.input;
//     const fileData = await readFile(file, { encoding: 'utf8' });

//     return JSON.parse(fileData);
//   } else {
//     const fileData = await getStdin();

//     return JSON.parse(fileData);
//   }
// }

async function main () {
  (program
    .name('pmutils')
    .description('A CLI to perform various data processing jobs for NCBI EUTILS output')
  );

  (program.command('search')
    // .argument('<string>', 'string to use as search query')
    // .option('-i, --input <file>', 'JSON input file from Biorxiv (standard input by default)')
    .description('Command line scripts')
    .action(doit)
  );

  await program.parseAsync();
}

main();
