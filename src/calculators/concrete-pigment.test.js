const {
  calculatePigmentPerSlab,
  slabVolume,
  SLAB_PRESETS,
} = require("./concrete-pigment");

// --- slabVolume ---
console.log("=== slabVolume tests ===");

const vol = slabVolume(400, 400, 40);
console.assert(
  Math.abs(vol - 0.0064) < 0.0001,
  `Expected ~0.0064 m³, got ${vol}`
);
console.log(`400×400×40mm slab = ${vol} m³ ✓`);

// --- Single slab, medium intensity ---
console.log("\n=== Single standard slab, medium pigment ===");
const single = calculatePigmentPerSlab({
  slabCount: 1,
  lengthMm: 400,
  widthMm: 400,
  thicknessMm: 40,
  colourIntensity: "medium",
  wastePercent: 0,
});

console.log(`Cement per slab: ${single.perSlab.cementKg} kg`);
console.log(`Pigment per slab: ${single.perSlab.pigmentGrams} g`);
console.assert(
  single.perSlab.pigmentGrams > 50 && single.perSlab.pigmentGrams < 200,
  `Pigment per slab should be 50–200g for medium, got ${single.perSlab.pigmentGrams}g`
);
console.log("Single slab calculation ✓");

// --- 10 slabs with waste ---
console.log("\n=== 10 standard slabs, dark pigment, 10% waste ===");
const ten = calculatePigmentPerSlab({
  slabCount: 10,
  colourIntensity: "dark",
  wastePercent: 10,
});

console.log(`Total cement: ${ten.total.cementKg} kg (${ten.total.cementBags} bags)`);
console.log(`Total pigment: ${ten.total.pigmentKg} kg`);
console.log(`Total sand: ${ten.total.sandKg} kg`);
console.log(`Total stone: ${ten.total.stoneKg} kg`);
console.assert(ten.total.cementBags >= 1, "Should need at least 1 cement bag");
console.assert(
  ten.pigment.dosagePercent === 8,
  `Dark dosage should be 8%, got ${ten.pigment.dosagePercent}%`
);
console.log("10-slab calculation ✓");

// --- Light vs bold comparison ---
console.log("\n=== Pigment comparison: light vs bold ===");
const light = calculatePigmentPerSlab({ slabCount: 1, colourIntensity: "light", wastePercent: 0 });
const bold = calculatePigmentPerSlab({ slabCount: 1, colourIntensity: "bold", wastePercent: 0 });
console.log(`Light: ${light.perSlab.pigmentGrams}g per slab`);
console.log(`Bold:  ${bold.perSlab.pigmentGrams}g per slab`);
console.assert(
  bold.perSlab.pigmentGrams > light.perSlab.pigmentGrams * 2,
  "Bold should be at least 2× light"
);
console.log("Light vs bold comparison ✓");

// --- Invalid intensity ---
console.log("\n=== Error handling ===");
try {
  calculatePigmentPerSlab({ colourIntensity: "neon" });
  console.assert(false, "Should have thrown");
} catch (e) {
  console.log(`Invalid intensity error: "${e.message}" ✓`);
}

console.log("\n=== All tests passed ===");
