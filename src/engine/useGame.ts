import { useSyncExternalStore } from 'react';
import { subscribe, getVersion } from './bus.ts';
import { S } from './engine.ts';

/** Re-renders the component whenever game state is saved. Returns the (mutable) state object. */
export function useGame() {
  useSyncExternalStore(subscribe, getVersion);
  return S;
}
