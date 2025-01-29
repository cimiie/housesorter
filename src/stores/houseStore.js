import { create } from 'zustand';

export const useHouseStore = create((set) => ({
  houses: Array(4).fill().map((_, i) => ({
    id: `house-${i}`,
    name: ''
  })),
  updateHouses: (newHouses) => set({ houses: newHouses }),
  houseTotals: {},
  updateHouseTotals: (totals) => set({ houseTotals: totals }),
}));