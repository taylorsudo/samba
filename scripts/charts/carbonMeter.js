import { zonesPerFloor } from "../config.js";

// Global cache to store flattened ci_direct values by [season][hour]
const carbonCache = new Map();

/**
 * Precomputes and caches ci_direct values for each hour and season.
 * 
 * @param {string} season - e.g., "Summer"
 * @param {Object} seasonData - The data for the selected season
 */
function buildCarbonCache(season, seasonData) {
  const hourMap = new Map();

  for (let hour = 0; hour < 24; hour++) {
    const values = [];

    Object.entries(zonesPerFloor).forEach(([floorStr, zones]) => {
      const floor = parseInt(floorStr);
      zones.forEach((zoneId) => {
        const val = seasonData?.[floor]?.[zoneId]?.[hour]?.ci_direct;
        if (val !== undefined) {
          values.push(val);
        }
      });
    });

    hourMap.set(hour, values);
  }

  carbonCache.set(season, hourMap);
}

/**
 * Updates the carbon intensity meter with the average ci_direct value.
 *
 * @param {number} selectedHour - Current hour (0–23).
 * @param {string} selectedSeason - Season key (e.g. "Summer").
 * @param {Object} data - Full SAMBA dataset.
 */
export function updateCarbonMeter(selectedHour, selectedSeason, data) {
  // Build cache if it doesn't exist for this season
  if (!carbonCache.has(selectedSeason)) {
    const seasonData = data[selectedSeason];
    if (!seasonData) return;
    buildCarbonCache(selectedSeason, seasonData);
  }

  // Retrieve precomputed values
  const seasonMap = carbonCache.get(selectedSeason);
  const values = seasonMap.get(selectedHour) || [];

  // Compute average
  const avgCI = values.length > 0
    ? values.reduce((a, b) => a + b, 0) / values.length
    : 0;

  // Update meter UI
  const ciGlobal = document.getElementById("ci-global");
  if (ciGlobal) {
    ciGlobal.value = avgCI.toFixed(2);
  }
}
