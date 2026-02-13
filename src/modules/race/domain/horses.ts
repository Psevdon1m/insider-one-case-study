import type { Horse } from "./types";

const HORSE_NAMES = [
  "Thunder Bolt",
  "Silver Arrow",
  "Golden Spirit",
  "Dark Storm",
  "Wild Fire",
  "Blue Moon",
  "Red Fury",
  "Star Runner",
  "Night Shadow",
  "Iron Will",
  "Lucky Charm",
  "Swift Wind",
  "Brave Heart",
  "Crystal Wave",
  "Mystic Dream",
  "Royal Flash",
  "Desert Rose",
  "Ocean Breeze",
  "Amber Blaze",
  "Phantom Ride",
];

const HORSE_COLORS = [
  "0 72% 51%",
  "25 95% 53%",
  "45 93% 47%",
  "142 71% 45%",
  "199 89% 48%",
  "262 83% 58%",
  "330 81% 60%",
  "0 0% 25%",
  "15 80% 50%",
  "180 60% 40%",
  "210 70% 50%",
  "280 60% 55%",
  "350 70% 50%",
  "60 70% 45%",
  "120 50% 40%",
  "240 60% 55%",
  "300 50% 45%",
  "30 90% 50%",
  "170 60% 45%",
  "220 80% 50%",
];

export const horses: Horse[] = HORSE_NAMES.map((name, i) => ({
  id: i + 1,
  name,
  condition: Math.floor(Math.random() * 40) + 60,
  color: HORSE_COLORS[i] ? HORSE_COLORS[i] : "0, 0%,0%",
}));
