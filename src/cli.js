#! /usr/bin/env node
import fs from 'fs';
import { writeFile } from 'fs/promises';
import { program } from 'commander';
import { download as doDownload } from './download.js';

// const readFile = promisify(fs.readFile);
const print = str => console.log(str);
export const write = async (data, file) => await writeFile(file, data);

export async function sendOutput (data, options) {
  if ( options.output ) {
    await write(data, options.output);
  } else {
    print(data);
  }
}

/**
 * Retrieve the article data from source to file
 *
 * @param {string} id a comma-separated list of PubMed IDs
 */
export async function download (id, options) {
  try {
    const data = await doDownload(id);
    await sendOutput(data, options);
  } catch (err) {
    console.error(`Error in download: ${err}`);
    throw err;
  }
}

async function main () {
  (program
    .name('pmutils')
    .description('A CLI to perform various data processing jobs for NCBI EUTILS output')
  );

  (program.command('download')
    .argument('<string>', 'PubMed IDs (comma or space separated)')
    .option('-o, --output <file>', 'Data file (standard output by default)')
    .description('Command line scripts')
    .action(download)
  );

  await program.parseAsync();
}

main();
