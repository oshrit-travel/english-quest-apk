type L = () => void;
const subs = new Set<L>();
let version = 0;
/** Called whenever game state changes; React subscribes through useGame(). */
export const bump = () => { version++; subs.forEach((l) => l()); };
export const subscribe = (l: L) => { subs.add(l); return () => { subs.delete(l); }; };
export const getVersion = () => version;

const handlers: Record<string, Set<(p?: any) => void>> = {};
export const bus = {
  on(ev: string, f: (p?: any) => void) { (handlers[ev] ||= new Set()).add(f); return () => { handlers[ev].delete(f); }; },
  emit(ev: string, p?: any) { handlers[ev]?.forEach((f) => f(p)); },
};
export const toast = (m: string) => bus.emit('toast', m);
