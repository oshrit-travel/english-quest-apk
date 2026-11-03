import { create } from 'zustand';

export type WorldMode = 'menu' | 'play' | 'frozen';

/** Mutable per-frame input (never triggers React renders). */
export const input = { joyX: 0, joyY: 0, keys: {} as Record<string, boolean> };
/** Mutable player state shared between the controller, camera, NPCs and the HUD. */
export const player = { x: -31, z: 0, a: Math.PI / 2, v: 0, wave: 0, cheer: 0 };

type WorldState = {
  mode: WorldMode;
  near: string | null;
  zoom: number;
  quality: 'high' | 'low';
  setMode: (m: WorldMode) => void;
  setNear: (n: string | null) => void;
  zoomBy: (f: number) => void;
  setQuality: (q: 'high' | 'low') => void;
};

export const useWorld = create<WorldState>((set) => ({
  mode: 'menu',
  near: null,
  zoom: 1,
  quality: 'high',
  setMode: (mode) => set({ mode }),
  setNear: (near) => set({ near }),
  zoomBy: (f) => set((s) => ({ zoom: Math.max(0.7, Math.min(1.8, s.zoom * f)) })),
  setQuality: (quality) => set({ quality }),
}));
