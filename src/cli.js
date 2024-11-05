#! /usr/bin/env node
import { program } from 'commander';
import { download as doDownload } from './download.js';
import { compile } from './xslt.js';
import { write, print } from './io.js';


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
  program
    .name('pmutils')
    .description('A CLI to perform various data processing jobs for NCBI EUTILS output');

  program.command('compile')
    .option('-s, --stylebase <file>', 'The name of the XSLT stylesheet')
    .description('Compile a XSLT stylesheet to json format')
    .action(compile);

  program.command('download')
    .argument('<string>', 'PubMed IDs (comma or space separated)')
    .option('-o, --output <file>', 'Data file (standard output by default)')
    .description('Download a PubMed article set')
    .action(download);

  await program.parseAsync();
}

main();
