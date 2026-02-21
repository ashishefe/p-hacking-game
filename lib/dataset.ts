import type { Farm } from "./types";

// Simple seeded LCG (Linear Congruential Generator)
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) & 0xffffffff;
    return (this.seed >>> 0) / 0xffffffff;
  }

  // Normal distribution via Box-Muller transform
  nextNormal(mean: number, sd: number): number {
    const u1 = this.next();
    const u2 = this.next();
    const z = Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
    return Math.round((mean + sd * z) * 10) / 10;
  }

  // Integer in [min, max] inclusive
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Choose from array
  nextChoice<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

export function generateDataset(seed: number): Farm[] {
  const rng = new SeededRandom(seed);
  const cropTypes: Farm["crop_type"][] = ["wheat", "rice", "sorghum", "maize", "cotton"];
  const soilTypes: Farm["soil_type"][] = ["clay", "loam", "sandy"];
  const irrigationTypes: Farm["irrigation"][] = ["drip", "flood", "rainfed"];

  const farms: Farm[] = [];

  for (let i = 1; i <= 200; i++) {
    const farm: Farm = {
      farm_id: i,
      uses_growmax: rng.next() > 0.5 ? 1 : 0,
      yield_kg_per_hectare: Math.max(1200, rng.nextNormal(2500, 400)),
      crop_type: rng.nextChoice(cropTypes),
      soil_type: rng.nextChoice(soilTypes),
      irrigation: rng.nextChoice(irrigationTypes),
      rainfall_mm: Math.max(300, rng.nextNormal(800, 200)),
      altitude_m: Math.max(50, rng.nextNormal(500, 150)),
      farm_size_hectares: Math.max(1, rng.nextNormal(10, 4)),
      years_since_rotation: rng.nextInt(1, 5),
      avg_march_temp_c: Math.max(15, rng.nextNormal(28, 5)),
    };

    // Round continuous values to sensible precision
    farm.yield_kg_per_hectare = Math.round(farm.yield_kg_per_hectare);
    farm.rainfall_mm = Math.round(farm.rainfall_mm);
    farm.altitude_m = Math.round(farm.altitude_m);
    farm.farm_size_hectares = Math.round(farm.farm_size_hectares * 10) / 10;
    farm.avg_march_temp_c = Math.round(farm.avg_march_temp_c * 10) / 10;

    farms.push(farm);
  }

  return farms;
}

export function datasetToCSV(data: Farm[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]) as (keyof Farm)[];
  const headerRow = headers.join(",");
  const rows = data.map((row) =>
    headers.map((h) => String(row[h])).join(",")
  );

  return [headerRow, ...rows].join("\n");
}

export function generateSeed(): number {
  return Math.floor(Math.random() * 1000000);
}
