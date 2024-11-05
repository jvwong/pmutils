import _ from 'lodash';
import path from 'path';
import { exec } from 'child_process';
import SaxonJS from 'saxon-js';

import { __dirname, write } from './io.js';

const STYLESHEET_BASE = path.join(__dirname, 'stylesheets');
const DATASOURCE_BASE = path.resolve(__dirname, '../data');
const SAXONJS_TRANSFORM_OPTS = {
  DESTINATION: {
    REPLACE_BODY: 'replaceBody',
    APPEND_TO_BODY: 'appendToBody',
    PREPEND_TO_BODY: 'prependToBody',
    RAW: 'raw',
    DOCUMENT: 'document',
    APPLICATION: 'application',
    FILE: 'file',
    STDOUT: 'stdout',
    SERIALIZED: 'serialized'
  }
};
// ********* Public API *********** //

/**
 * Compile the xslt stylesheet to json format
 * See command line: {@link https://www.saxonica.com/saxon-js/documentation2/index.html#!nodejs/command-line}
 * See compile: {@link https://www.saxonica.com/saxon-js/documentation2/index.html#!starting/export/compiling-using-XX}
 *
 * @param {object} opts the commander opts
 * @param {string} opts.stylebase the name of the stylesheet file (without extension)
 */
export async function compile (opts) {
  try {
    const { stylebase } = opts;
    const stylepath = path.join(STYLESHEET_BASE, `${stylebase}`);
    let cmd = 'node node_modules/xslt3/xslt3.js -t '
            + `-xsl:${stylepath}.xsl `
            + `-export:${stylepath}.sef.json `
            + '-nogo -ns:##html5';

    console.log(`Compiling XSL: ${cmd}`);
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

/**
 * Transform an XML document using an xslt stylesheet
 * See command line: {@link https://www.saxonica.com/saxon-js/documentation2/index.html#!nodejs/command-line}
 * See transform: {@link https://www.saxonica.com/saxon-js/documentation2/index.html#!api/transform}
 *
 * @param {object} opts the commander opts
 * @param {string} opts.input the name of the XML document file (without extension)
 * @param {string} opts.stylebase the name of the stylesheet file (without extension)
 * @returns {string} the transformed document
 */
export async function transform (opts) {
  try {
    const { stylebase, input } = opts;
    const stylepath = path.join(STYLESHEET_BASE, `${stylebase}`);
    const inputPath = path.join(DATASOURCE_BASE, `${input}`);
    const DEFAULT_TRANSFORM_OPTS = {
      stylesheetFileName: `${stylepath}.sef.json`,
      sourceFileName: `${inputPath}.xml`,
      destination: 'serialized'//SAXONJS_TRANSFORM_OPTS.DESTINATION.SERIALIZED
    }
    const transformOpts = _.defaults({}, DEFAULT_TRANSFORM_OPTS);
    const { principalResult } = await SaxonJS.transform(transformOpts, 'async');
    return write(principalResult, `${inputPath}.html`);

  } catch (err) {
    console.error(`Error in transform: ${err}`);
    throw err;
  }
}
