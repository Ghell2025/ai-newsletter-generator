'use client';

import { create } from 'zustand';
import type { ParsedData, NewsletterResult } from '@/types';

interface AppStore {
  parsedData: ParsedData | null;
  setParsedData: (data: ParsedData) => void;

  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;

  generationProgress: { current: number; total: number };
  setGenerationProgress: (p: { current: number; total: number }) => void;

  newsletters: NewsletterResult[];
  setNewsletters: (results: NewsletterResult[]) => void;
  addNewsletter: (result: NewsletterResult) => void;

  selectedProspectId: string | null;
  setSelectedProspectId: (id: string) => void;

  reset: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  parsedData: null,
  setParsedData: (data) => set({ parsedData: data }),

  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),

  generationProgress: { current: 0, total: 0 },
  setGenerationProgress: (p) => set({ generationProgress: p }),

  newsletters: [],
  setNewsletters: (results) => set({ newsletters: results }),
  addNewsletter: (result) =>
    set((state) => ({ newsletters: [...state.newsletters, result] })),

  selectedProspectId: null,
  setSelectedProspectId: (id) => set({ selectedProspectId: id }),

  reset: () =>
    set({
      parsedData: null,
      isGenerating: false,
      generationProgress: { current: 0, total: 0 },
      newsletters: [],
      selectedProspectId: null,
    }),
}));
