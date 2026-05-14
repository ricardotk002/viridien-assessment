import { MENU_BY_ID } from '../constants/menu';

export type CartLine = { menuId: string; qty: number; notes: string; price: number };

type Action =
  | { type: 'add'; menuId: string; qty?: number; notes?: string }
  | { type: 'remove'; menuId: string; notes?: string }
  | { type: 'setQty'; menuId: string; qty: number; notes?: string }
  | { type: 'clear' }
  | { type: 'suggest'; menuIds: string[] }
  | { type: 'checkout' };

export type ApplyResult = {
  cart: CartLine[];
  added: { menuId: string; qty: number; notes: string }[];
  removed: { menuId: string; qty: number }[];
  suggestions: string[] | null;
  checkout: boolean;
};

export function applyActions(cart: CartLine[], actions: Action[]): ApplyResult {
  let next = cart.map((l) => ({ ...l }));
  const added: ApplyResult['added'] = [];
  const removed: ApplyResult['removed'] = [];
  let checkout = false;
  let suggestions: string[] | null = null;

  const findLine = (menuId: string, notes?: string) =>
    next.findIndex((l) => l.menuId === menuId && (l.notes || '') === (notes || ''));

  for (const a of actions) {
    if (a.type === 'add') {
      const item = MENU_BY_ID[a.menuId];
      if (!item) continue;
      const qty = Math.max(1, parseInt(String(a.qty ?? 1), 10) || 1);
      const idx = findLine(a.menuId, a.notes);
      if (idx >= 0) {
        next[idx].qty += qty;
      } else {
        next.push({ menuId: a.menuId, qty, notes: a.notes || '', price: item.price });
      }
      added.push({ menuId: a.menuId, qty, notes: a.notes || '' });
    } else if (a.type === 'remove') {
      const idx = findLine(a.menuId, a.notes);
      if (idx >= 0) {
        removed.push({ menuId: a.menuId, qty: next[idx].qty });
        next.splice(idx, 1);
      }
    } else if (a.type === 'setQty') {
      const qty = parseInt(String(a.qty), 10);
      const idx = findLine(a.menuId, a.notes);
      if (idx >= 0) {
        if (qty <= 0) { removed.push({ menuId: a.menuId, qty: next[idx].qty }); next.splice(idx, 1); }
        else next[idx].qty = qty;
      } else if (qty > 0) {
        const item = MENU_BY_ID[a.menuId];
        if (item) next.push({ menuId: a.menuId, qty, notes: a.notes || '', price: item.price });
      }
    } else if (a.type === 'clear') {
      next.forEach((l) => removed.push({ menuId: l.menuId, qty: l.qty }));
      next = [];
    } else if (a.type === 'suggest') {
      suggestions = (a.menuIds || []).filter((id) => !!MENU_BY_ID[id]);
    } else if (a.type === 'checkout') {
      checkout = true;
    }
  }

  return { cart: next, added, removed, suggestions, checkout };
}
