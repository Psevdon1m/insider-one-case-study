import { defineStore } from "pinia";

export const useHorseStore = defineStore("horse", {
    state: () => ({
        horses: []
    })
})