const { expect } = require('@jest/globals');
const reporter = require('./reporter');

it('generates all report', () => {
  const sportPlacement = {
    placement_id: 99,
    name: 'Sports',
    start: '11/11/2011',
    end: '12/12/2012',
    cpm: '9',
    impressions: '2000000',
    cost: '18000'
  }
  const output = 'Sports (11/11/2011-12/12/2012): 2,000,000 impressions @ $9 CPM = $18,000\n';
  expect(reporter.generateReport(sportPlacement)).toBe(output);
});

it('generates a custom report', () => {
  const sportPlacement = {
    placement_id: 99,
    name: '',
    start: '11/11/2011',
    end: '12/12/2012',
    cpm: '',
    impressions: '2000000',
    cost: '18000'
  }
  const output = 'Total (11/11/2011-12/12/2012): 2,000,000 impressions, $18,000\n';
  expect(reporter.generateReport(sportPlacement)).toBe(output);
});