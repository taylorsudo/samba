import { zonesPerFloor } from './config.js';

/**
 * Returns a unit label for a given IEQ variable name.
 * Defaults to uppercase variable name if not listed.
 */
export function getUnitLabel(varName) {
  const units = {
    spl: "dBA",
    co2: "PPM",
    rh: "%"
  };
  return units[varName] || varName.toUpperCase();
}

/**
 * Converts a 24-hour time value into 12-hour AM/PM format.
 * Example: 14 -> "2:00pm"
 */
export function formatHour(hour) {
  const suffix = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:00${suffix}`;
}

/**
 * Calculates the average of a numeric array.
 * Returns 0 if the array is empty or invalid.
 */
export function calculateAverage(values) {
  if (!Array.isArray(values) || values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Groups sensor readings by zone, then averages them for the given variable.
 *
 * @param {Array<Object>} filteredData - Array of data objects (e.g., from one floor).
 * @param {string} variable - Variable to average (e.g., "ppd", "co2").
 * @param {number|null} floorFilter - Optional floor number to restrict results.
 * @returns {Array<Object>} - Array of { floor, zoneId, avg }.
 */
export function getZoneAveragesAcrossBuilding(filteredData, variable, floorFilter = null) {
  const zoneMap = {};

  filteredData.forEach(d => {
    if (floorFilter !== null && d.floor !== floorFilter) return;

    const { floor, zone_id: zone, [variable]: value } = d;
    if (value === undefined || value === null) return;

    const key = `${floor}_${zone}`;
    if (!zoneMap[key]) {
      zoneMap[key] = { floor, zoneId: zone, values: [] };
    }
    zoneMap[key].values.push(value);
  });

  return Object.values(zoneMap).map(({ floor, zoneId, values }) => ({
    floor,
    zoneId,
    avg: calculateAverage(values)
  }));
}
