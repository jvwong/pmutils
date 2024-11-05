import fetch from 'node-fetch';
import _ from 'lodash';

const EUTILS_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
const EFETCH_PATH = 'efetch.fcgi';


async function safeFetch (url, options) {
  const failOnBadStatus = res => {
    if (!res.ok) {
      throw new Error(`Fetch failed due to bad status code : ${res.statusText} : ${res.url}`);
    } else {
      return res;
    }
  };
  return fetch(url, options).then(failOnBadStatus);
}

export async function efetch (id, opts) {
  const url = `${EUTILS_BASE_URL}${EFETCH_PATH}`;
  const DEFAULT_EFETCH_OPTS = {
    db: 'pubmed',
    api_key: 'b99e10ebe0f90d815a7a99f18403aab08008',
    retmode: 'xml'
  };
  const efetch_opts = _.defaults({ id }, opts, DEFAULT_EFETCH_OPTS );
  const body = new URLSearchParams( efetch_opts );
  const fetch_opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  }

  try {
    return safeFetch(url, fetch_opts);
  } catch (err) {
    console.error(`Error in efetch: ${err}`);
    throw err;
  }
};

// ********* Public API *********** //

/**
 * Retrieve the article metadata items
 *
 * @param {string} id list of article IDs (comma or space separated)
 * @returns {string} article metadata items
 */
export async function download (id) {
  const toText = res => res.text();
  try {
    const res = await efetch(id);
    return toText( res );

  } catch (err) {
    console.error(`Error in download: ${err}`);
    throw err;
  }
}
