/**
 * Displays an alert warning in the alert box based on outlier zone data.
 *
 * @param {Object} outlier - Zone with the largest deviation from average.
 * @param {string} unitLabel - Unit of measurement (e.g., °C, dBA, PPM).
 * @param {string} zMult - Z-score multiplier (e.g., "2.1x").
 * @param {string} direction - "above" or "below" the mean.
 */
export function showAlert(outlier, unitLabel, zMult, direction) {
  const alertBox = document.getElementById("alert-box");
  if (!alertBox || !outlier) return;

  alertBox.classList.remove("hidden");

  alertBox.innerHTML = `
    <div>WARNING</div>
    <div>${outlier.avg.toFixed(2)} ${unitLabel} on Floor ${outlier.floor}, Zone ${outlier.zoneId}</div>
    <div>${zMult}x ${direction} average</div>
  `;
}
