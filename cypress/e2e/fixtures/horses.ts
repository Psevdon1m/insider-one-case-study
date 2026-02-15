import type { Horse } from '../../../src/modules/race/domain/types';

/**
 * Test fixture data for horses
 */
export const testHorses: Horse[] = [
    {
        id: 1,
        name: "Thunder Bolt",
        condition: 85,
        color: "0, 85%, 55%"
    },
    {
        id: 2,
        name: "Silver Arrow",
        condition: 90,
        color: "25, 90%, 50%"
    },
    {
        id: 3,
        name: "Golden Spirit",
        condition: 75,
        color: "45, 95%, 55%"
    },
    {
        id: 4,
        name: "Dark Storm",
        condition: 80,
        color: "60, 90%, 45%"
    },
    {
        id: 5,
        name: "Wild Fire",
        condition: 88,
        color: "90, 70%, 45%"
    }
];
