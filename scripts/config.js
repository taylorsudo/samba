// ========================
// Configuration Constants
// ========================

// Maps each floor to its zone IDs
export const zonesPerFloor = {
  0: [243, 402, 403, 430, 431],
  25: [26],
  26: [27],
  27: [51],
  28: [47, 48, 49, 50],
  29: [52],
  30: [8, 30, 31, 46, 244],
};

// Maps each floor label to a z-position in the 3D plot
export const floorLabelToZ = {
  0: 0,
  25: 1,
  26: 2,
  27: 3,
  28: 4,
  29: 5,
  30: 6,
};

// Maps each season to the months it includes (used for filtering data by time)
export const monthGroups = {
  Summer: [12, 1, 2],
  Autumn: [3, 4, 5],
  Winter: [6, 7, 8],
  Spring: [9, 10, 11],
};

// Optional: get the default (topmost) floor
export const defaultFloor = Math.max(...Object.keys(zonesPerFloor).map(Number));
