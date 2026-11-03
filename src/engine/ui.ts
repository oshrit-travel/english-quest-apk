import { create } from 'zustand';
import { useWorld } from '../world/store.ts';

export type Route = { name: string; arg?: any };
type UIState = {
  stack: Route[];
  toasts: { id: number; text: string }[];
  dialog: { npc: string } | null;
  levelUp: number | null;
  go: (name: string, arg?: any) => void;
  replace: (name: string, arg?: any) => void;
  back: () => boolean;
  reset: (name: string) => void;
  toast: (text: string) => void;
  openDialog: (npc: string | null) => void;
  setLevelUp: (n: number | null) => void;
};
let tid = 1;
export const useUI = create<UIState>((set, get) => ({
  stack: [{ name: 'menu' }],
  toasts: [],
  dialog: null,
  levelUp: null,
  go: (name, arg) => set((s) => ({ stack: [...s.stack, { name, arg }], dialog: null })),
  replace: (name, arg) => set((s) => ({ stack: [...s.stack.slice(0, -1), { name, arg }] })),
  back: () => { const s = get(); if (s.dialog) { set({ dialog: null }); return true; } if (s.stack.length > 1) { set({ stack: s.stack.slice(0, -1) }); return true; } return false; },
  reset: (name) => set({ stack: [{ name }], dialog: null }),
  toast: (text) => { const id = tid++; set((s) => ({ toasts: [...s.toasts.slice(-2), { id, text }] })); setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2600); },
  openDialog: (npc) => set({ dialog: npc ? { npc } : null }),
  setLevelUp: (n) => set({ levelUp: n }),
}));

/** The 3D scene runs only on the menu and world screens; every other screen freezes it behind a blurred overlay. */
export const worldModeFor = (name: string) => (name === 'world' ? 'play' : name === 'menu' ? 'menu' : 'frozen');
export function syncWorldMode() { useWorld.getState().setMode(worldModeFor(useUI.getState().stack.at(-1)!.name) as any); }
