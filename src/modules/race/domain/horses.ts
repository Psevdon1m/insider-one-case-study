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
  "0, 85%, 55%", // red
  "25, 90%, 50%", // orange
  "45, 95%, 55%", // amber
  "60, 90%, 45%", // yellow
  "90, 70%, 45%", // lime green
  "120, 65%, 40%", // green
  "150, 60%, 45%", // spring green
  "170, 65%, 45%", // turquoise
  "190, 75%, 50%", // cyan
  "210, 80%, 55%", // sky blue
  "230, 70%, 50%", // blue
  "250, 65%, 55%", // indigo
  "270, 70%, 60%", // violet
  "290, 75%, 55%", // purple
  "310, 80%, 60%", // magenta
  "330, 85%, 55%", // pink
  "350, 80%, 45%", // crimson
  "40, 60%, 35%", // brownish
  "200, 30%, 60%", // muted blue
  "160, 35%, 55%", // muted teal
];

export const freshHorses: Horse[] = HORSE_NAMES.map((name, i) => ({
  id: i + 1,
  name,
  condition: Math.floor(Math.random() * 40) + 60,
  color: HORSE_COLORS[i] ? HORSE_COLORS[i] : "0, 0%,0%",
}));
