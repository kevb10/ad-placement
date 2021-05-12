const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const moment = require('moment');
const calculator = require('./calculator');

const { ALLOWED_DATE_FORMAT,
  DATE_FORMAT_STRICT_MODE,
} = require('./dateHelper');

const COMMAND_LINE_ARG = process.argv[2];

/**
 * Create a read stream and read file.
 * @param {string} filename - The name of the file to be processed.
 * @returns {Promise} 
 */
function readFile(filename) {
  return new Promise((resolve, reject) => {
    const data = [];

    fs.createReadStream(path.resolve(__dirname + '/datasource/', filename))
      .pipe(csv.parse({ headers: true }))
      .on('error', error => {
        console.error(error);
        reject(error);
      })
      .on('data', row => data.push(row))
      .on('end', () => {
        resolve(data);
      });
  })
}

/**
 * This function is immediately invoked when this file runs.
 * Let errors propagate.
 * @param {string} dateRange - A custom date range.
 */
(async function (dateRange = '') {
  const [startDate, endDate] = dateRange.split('-');

  const start = moment(startDate?.trim(), ALLOWED_DATE_FORMAT, DATE_FORMAT_STRICT_MODE);
  const end = moment(endDate?.trim(), ALLOWED_DATE_FORMAT, DATE_FORMAT_STRICT_MODE);
  const areDatesValid = start.isValid() && end.isValid();

  const range = {
    start,
    end,
    areDatesValid
  }

  /**
   * Read and convert our csv files into objects
   */
  const [deliveries, placements] = await Promise.all([readFile('delivery.csv'), readFile('placements.csv')]);

  /**
   * If a date range was provided but isn't valid, show this message.
   */
  if (dateRange && !range.areDatesValid) {
    console.log('😫 Invalid date or range. Please make sure it is in the right format');
    console.log('Example: node main 11/22/2020-12/5/2020');
  } else {
    const results = calculator.calculateTotalImpressionsAndCostForRange(deliveries, placements, range);
    console.log(results);
  }
})(COMMAND_LINE_ARG);

