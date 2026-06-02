import { create } from 'zustand';
import { Artifact, ArtifactStore } from '../types';

export const useArtifactStore = create<ArtifactStore>((set) => ({
  artifacts: [],
  selectedArtifact: null,
  isDrawerOpen: false,
  setArtifacts: (artifacts: Artifact[]) => set({ artifacts }),
  selectArtifact: (artifact: Artifact | null) => set({ selectedArtifact: artifact }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false, selectedArtifact: null }),
}));
