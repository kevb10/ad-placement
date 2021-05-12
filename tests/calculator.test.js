const { expect } = require('@jest/globals');
const calculator = require('../src/calculator');
const moment = require('moment');
const { ALLOWED_DATE_FORMAT,
  DATE_FORMAT_STRICT_MODE,
} = require('../src/dateHelper');

it('calculates and gives a report for all', () => {
  const deliveries = [{
    id: '1',
    date: '11/11/2011',
    impressions: 1000000
  },
  {
    id: '1',
    date: '12/12/2012',
    impressions: 1000000
  },{
    id: '2',
    date: '9/9/2019',
    impressions: 500000
  },
  {
    id: '2',
    date: '10/10/2020',
    impressions: 500000
  }]
    ;
  const placements = [{
    placement_id: '1',
    name: 'Sports',
    start: '11/11/2011',
    end: '12/12/2012',
    cpm: '9',
  },
  {
    placement_id: '2',
    name: 'News',
    start: '9/9/2019',
    end: '10/10/2020',
    cpm: '2',
  }]
  const output = 'Sports (11/11/2011-12/12/2012): 2,000,000 impressions @ $9 CPM = $18,000\n'
    + 'News (9/9/2019-10/10/2020): 1,000,000 impressions @ $2 CPM = $2,000\n';
  const results = calculator.calculateTotalImpressionsAndCostForRange(deliveries, placements, {});
  expect(results).toBe(output);
});

it('calculates and gives a custom report for the total', () => {
  const deliveries = [{
    placement_id: '1',
    date: '11/11/2011',
    impressions: 1000000
  },
  {
    placement_id: '1',
    date: '12/12/2012',
    impressions: 1000000
  },{
    placement_id: '2',
    date: '9/9/2019',
    impressions: 500000
  },
  {
    placement_id: '2',
    date: '10/10/2020',
    impressions: 500000
  }]
    ;
  const placements = [{
    id: '1',
    name: 'Sports',
    start: '11/11/2011',
    end: '12/12/2012',
    cpm: '9',
  },
  {
    id: '2',
    name: 'News',
    start: '9/9/2019',
    end: '10/10/2020',
    cpm: '2',

    }]
  
  const dateRange = {
    start: moment('12/12/2012', ALLOWED_DATE_FORMAT, DATE_FORMAT_STRICT_MODE),
    end: moment('10/10/2020', ALLOWED_DATE_FORMAT, DATE_FORMAT_STRICT_MODE),
    areDatesValid: true,
    }
  const output = 'Total (12/12/2012-10/10/2020): 2,000,000 impressions, $11,000\n';
  const results = calculator.calculateTotalImpressionsAndCostForRange(deliveries, placements, dateRange);
  expect(results).toBe(output);
});