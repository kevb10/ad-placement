/**
 * Generate a report on the console.
 * @param {Object} placementInfo - The placement information.
 */
function generateReport(placementInfo) {
  const name = placementInfo.name || 'Total';
  const impressions = parseInt(placementInfo.impressions).toLocaleString();
  const cost = parseInt(placementInfo.cost).toLocaleString();
  const cpmText = placementInfo.cpm ? ` @ $${placementInfo.cpm} CPM =` : ',';

  return (`${name} (${placementInfo.start}-${placementInfo.end}): ${impressions} impressions${cpmText} $${cost}\n`);
}

module.exports = { generateReport };