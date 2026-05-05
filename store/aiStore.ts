import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AIStore {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

export const useAIStore = create<AIStore>()(
  persist(
    (set) => ({
      apiKey: '',
      setApiKey: (key: string) => set({ apiKey: key }),
      clearApiKey: () => set({ apiKey: '' }),
    }),
    { name: 'resume-forge-ai-key' }
  )
);
