import _ from 'lodash';
import path from 'path';
import { exec } from 'child_process';

import { __dirname } from './io.js';

const STYLESHEET_BASE = path.join(__dirname, 'stylesheets');

// ********* Public API *********** //

/**
 * Compile the xslt stylesheet to json format
 *
 * @param {string} file file path to the .xsl stylesheet
 * @returns {string} corresponding sef.json for the stylesheet
 */
export async function compile (opts) {
  try {
    const { stylebase } = opts;
    const stylepath = path.join(STYLESHEET_BASE, `${stylebase}`);
    let cmd = 'node node_modules/xslt3/xslt3.js -t '
            + `-xsl:${stylepath}.xsl `
            + `-export:${stylepath}.sef.json `
            + '-nogo -ns:##html5';

    console.log('Compiling XSL with xslt3.js');
    const child = exec(cmd, (error, stdout) => {
      if (stdout) {
        console.log(stdout);
      }
      if (error) {
        console.log(error);
      }
    });

  } catch (err) {
    console.error(`Error in compile: ${err}`);
    throw err;
  }
}
