import { create } from 'zustand';

export const useAppStore = create((set) => ({
  showMainContent: false,
  contentIndex: 0,
  isDark: localStorage.getItem('theme') === 'dark',
  setShowMainContent: (show) => set({ showMainContent: show }),
  nextContent: () => set((state) => ({ contentIndex: Math.min(state.contentIndex + 1, 2) })),
  prevContent: () => set((state) => ({ contentIndex: Math.max(state.contentIndex - 1, 0) })),
  toggleTheme: () => set((state) => {
    const newTheme = !state.isDark;
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    return { isDark: newTheme };
  }),
}));
