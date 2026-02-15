import { ROUND_TO_DISTANCE } from "./constatns";

export interface Horse {
  id: number;
  name: string;
  condition: number; // 1-100
  color: string; // HSL color
}

export interface RaceHorse extends Horse {
  progress: number; // 0-100
  lane: number;
  finished: boolean;
}

export type RoundType = keyof typeof ROUND_TO_DISTANCE;
