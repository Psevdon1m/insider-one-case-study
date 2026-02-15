import { defineStore } from "pinia";
import { freshHorses } from "../domain/horses";

import type { RaceHorse, RoundType, RaceResult } from "../domain/types";

export const useHorseStore = defineStore("horse", {
  state: () => ({
    horses: freshHorses,
    raceHorsesPerRound: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    } as Record<RoundType, RaceHorse[]>,
    resultsPerRound: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    } as Record<RoundType, RaceResult[]>,
  }),
  actions: {
    setRaceHorsesPerRound(round: RoundType, horses: RaceHorse[]) {
      this.raceHorsesPerRound[round] = horses;
    },
    setResultsPerRound(round: RoundType, results: RaceResult[]) {
      this.resultsPerRound[round] = results;
    },
    resetRaceHorsesPerRound() {
      this.raceHorsesPerRound = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
      };
    },
    resetResultsPerRound() {
      this.resultsPerRound = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
      };
    },
  },
});
