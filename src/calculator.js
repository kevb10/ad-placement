const moment = require('moment');
const reporter = require('./reporter');

const { ALLOWED_DATE_FORMAT,
  DATE_FORMAT_STRICT_MODE,
  DATE_COMPARISON_INCLUSIVE,
} = require('./dateHelper');

/**
 * Calculate the total number of impressions delivered 
 * and final cost of each placement.
 * @param {Object} deliveries - Delivery info.
 * @param {Object} placements - Placement info.
 * @param {Object} dateRange - Custom date range.
 * @returns {Object} Placement info with updated impressions and cost.
 */
function calculatePlacementImpressionsAndCost(deliveries, placements, dateRange) {  
  return placements?.map(placement => {
    /**
     * For this placement, return delivery entries between
     * the placement start and end dates (inclusive). 
     */
    const relevantDeliveries = deliveries
      ?.filter(delivery => {
        const entryDate = moment(delivery.date, ALLOWED_DATE_FORMAT, DATE_FORMAT_STRICT_MODE);
        const startDate = dateRange.areDatesValid
          ? dateRange.start
          : moment(placement.start.trim(), ALLOWED_DATE_FORMAT, DATE_FORMAT_STRICT_MODE);
        const endDate = dateRange.areDatesValid
          ? dateRange.end
          : moment(placement.end.trim(), ALLOWED_DATE_FORMAT, DATE_FORMAT_STRICT_MODE);

        return placement.id === delivery.placement_id &&
           entryDate.isBetween(startDate, endDate, undefined, DATE_COMPARISON_INCLUSIVE);
      });

    /**
     * For this placement, calculate total cost for the given date range. 
     */
    const cost = Math.round(relevantDeliveries
      ?.reduce((accumulator, delivery) =>
        accumulator + ((delivery.impressions / 1000) * placement.cpm)
        , 0));
    
    /**
     * For this placement, calculate total impressions for the given date range. 
     */
    const impressions = relevantDeliveries?.reduce(impressionsReducer, 0);
        
    return {...placement, cost, impressions};
  });
}

/**
 * Reducer function for adding up impressions.
 * @param {number} accumulator - Remembers the previous addition.
 * @param {number} currentValue - The current value.
 * @returns {number} The impressions subtotal
 */
function impressionsReducer(accumulator, currentValue) {
  return accumulator + parseInt(currentValue.impressions);
}

/**
 * Reducer function for adding up costs.
 * @param {number} accumulator - Remembers the previous addition.
 * @param {number} currentValue - The current value.
 * @returns {number} The cost subtotal
 */
function costReducer(accumulator, currentValue) {
  return accumulator + currentValue.cost;
}

/**
 * Calculate the total impressions and costs for a date range.
 * @param {Object} deliveries - Delivery info.
 * @param {Object} placements - Placement info.
 * @param {Object} dateRange - Custom date range.
 */
function calculateTotalImpressionsAndCostForRange(deliveries, placements, dateRange) {
  const total = calculatePlacementImpressionsAndCost(deliveries, placements, dateRange);
  
  // If the date is invalid or missing, we just give back the subtotal.
  if (!dateRange.areDatesValid) {
    let output = '';
    total.forEach(subtotal => {  
      output += reporter.generateReport(subtotal);
    });
    return output;
  }

    const subtotal = {
      start: dateRange.start.format(ALLOWED_DATE_FORMAT[0]), // use the format M/D/YYYY
      end: dateRange.end.format(ALLOWED_DATE_FORMAT[0]), // use the format M/D/YYYY
      impressions: total.reduce(impressionsReducer, 0), // add up impressions subtotals
      cost: total.reduce(costReducer, 0), // add up cost subtotals 
    }
    return reporter.generateReport(subtotal)
}

module.exports = {
  calculateTotalImpressionsAndCostForRange,
 }
