/**
 * Concrete Pigment Calculator for Garden Stone Slabs
 *
 * Calculates the amount of concrete pigment, cement, sand, and stone
 * needed per slab of concrete garden stone.
 *
 * Standard garden slab sizes (South Africa):
 *   - 400×400×40mm (most common DIY)
 *   - 500×500×50mm (large paver)
 *   - 300×300×30mm (stepping stone)
 *
 * Concrete mix ratio (by volume): 1 cement : 2 sand : 3 stone (standard)
 * Pigment dosage: 2–10% of cement weight depending on colour intensity.
 */

// Concrete density ≈ 2,300 kg/m³
const CONCRETE_DENSITY_KG_M3 = 2300;

// Cement content in standard 1:2:3 mix ≈ 320 kg/m³ of concrete
const CEMENT_KG_PER_M3 = 320;

// Standard cement bag size in South Africa
const CEMENT_BAG_KG = 50;

// Pigment dosage as fraction of cement weight
const PIGMENT_DOSAGE = {
  light: 0.03, // 3% — pastels, light buff, cream
  medium: 0.05, // 5% — terracotta, brown, grey
  dark: 0.08, // 8% — charcoal, black, deep red
  bold: 0.10, // 10% — maximum intensity
};

// Common garden slab dimensions in mm
const SLAB_PRESETS = {
  stepping: { length: 300, width: 300, thickness: 30, label: "Stepping Stone 300×300×30mm" },
  standard: { length: 400, width: 400, thickness: 40, label: "Standard Paver 400×400×40mm" },
  large: { length: 500, width: 500, thickness: 50, label: "Large Paver 500×500×50mm" },
};

/**
 * Calculate the volume of a single slab in cubic metres.
 * @param {number} lengthMm - Slab length in mm
 * @param {number} widthMm  - Slab width in mm
 * @param {number} thicknessMm - Slab thickness in mm
 * @returns {number} Volume in m³
 */
function slabVolume(lengthMm, widthMm, thicknessMm) {
  return (lengthMm / 1000) * (widthMm / 1000) * (thicknessMm / 1000);
}

/**
 * Calculate materials needed for a given number of concrete garden slabs.
 *
 * @param {Object} options
 * @param {number} options.slabCount       - Number of slabs to make
 * @param {number} options.lengthMm        - Slab length in mm (default 400)
 * @param {number} options.widthMm         - Slab width in mm (default 400)
 * @param {number} options.thicknessMm     - Slab thickness in mm (default 40)
 * @param {string} options.colourIntensity - "light" | "medium" | "dark" | "bold"
 * @param {number} [options.wastePercent]  - Waste allowance (default 10%)
 * @returns {Object} Bill of materials with quantities and per-slab breakdown
 */
function calculatePigmentPerSlab({
  slabCount = 1,
  lengthMm = 400,
  widthMm = 400,
  thicknessMm = 40,
  colourIntensity = "medium",
  wastePercent = 10,
}) {
  const dosage = PIGMENT_DOSAGE[colourIntensity];
  if (!dosage) {
    throw new Error(
      `Invalid colourIntensity "${colourIntensity}". Use: ${Object.keys(PIGMENT_DOSAGE).join(", ")}`
    );
  }

  const wasteFactor = 1 + wastePercent / 100;

  // Per-slab calculations
  const volumePerSlab = slabVolume(lengthMm, widthMm, thicknessMm);
  const concreteWeightPerSlab = volumePerSlab * CONCRETE_DENSITY_KG_M3;
  const cementPerSlab = volumePerSlab * CEMENT_KG_PER_M3;
  const pigmentPerSlab = cementPerSlab * dosage;

  // Total for all slabs (with waste)
  const totalVolume = volumePerSlab * slabCount * wasteFactor;
  const totalCement = totalVolume * CEMENT_KG_PER_M3;
  const totalPigment = totalCement * dosage;
  const cementBags = Math.ceil(totalCement / CEMENT_BAG_KG);

  // Sand and stone (by weight for 1:2:3 mix by volume)
  // Cement:Sand:Stone ≈ 1:2:3 by volume → roughly 320:640:960 kg/m³
  const totalSand = totalVolume * 640;
  const totalStone = totalVolume * 960;

  return {
    slabDimensions: {
      length: lengthMm,
      width: widthMm,
      thickness: thicknessMm,
      label: `${lengthMm}×${widthMm}×${thicknessMm}mm`,
    },
    perSlab: {
      volumeM3: round(volumePerSlab, 5),
      concreteWeightKg: round(concreteWeightPerSlab, 2),
      cementKg: round(cementPerSlab, 3),
      pigmentGrams: round(pigmentPerSlab * 1000, 1),
    },
    total: {
      slabCount,
      wastePercent,
      volumeM3: round(totalVolume, 4),
      cementKg: round(totalCement, 2),
      cementBags,
      pigmentKg: round(totalPigment, 3),
      sandKg: round(totalSand, 1),
      stoneKg: round(totalStone, 1),
    },
    pigment: {
      intensity: colourIntensity,
      dosagePercent: dosage * 100,
      note: `${dosage * 100}% of cement weight`,
    },
  };
}

function round(value, decimals) {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

module.exports = {
  calculatePigmentPerSlab,
  slabVolume,
  SLAB_PRESETS,
  PIGMENT_DOSAGE,
  CEMENT_BAG_KG,
};
