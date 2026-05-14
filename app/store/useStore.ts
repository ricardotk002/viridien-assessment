import { create } from 'zustand';
import { CartLine, applyActions } from '../utils/aiActions';
import { sendChat } from '../utils/api';
import { MENU_BY_ID } from '../constants/menu';

export type Message =
  | { id: string; kind: 'asst-text'; text: string }
  | { id: string; kind: 'user-text'; text: string }
  | { id: string; kind: 'chips'; chips: string[] }
  | { id: string; kind: 'order'; added: { menuId: string; qty: number; notes: string }[]; removed: { menuId: string; qty: number }[] }
  | { id: string; kind: 'suggest'; ids: string[] }
  | { id: string; kind: 'checkout'; total: number; count: number };

type Sheets = { menu: boolean; cart: boolean; placed: boolean };

type Turn = { role: 'user' | 'assistant'; content: string };

const SEED_MESSAGES: Message[] = [
  { id: 'm0', kind: 'asst-text', text: "Evening — I'm your server tonight. Tell me what you're in the mood for and I'll get it on your tab." },
  { id: 'm1', kind: 'chips', chips: ["What's popular?", "Something spicy", "I'm vegetarian", "Surprise me"] },
];

let msgCounter = 2;
const newId = () => `m${msgCounter++}_${Date.now()}`;

type State = {
  messages: Message[];
  cart: CartLine[];
  draft: string;
  thinking: boolean;
  sheets: Sheets;
  transcript: Turn[];
  lastTotal: number;

  setDraft: (draft: string) => void;
  openSheet: (sheet: keyof Sheets) => void;
  closeSheet: (sheet: keyof Sheets) => void;
  sendMessage: (text: string) => Promise<void>;
  addItem: (menuId: string, qty?: number) => void;
  changeQty: (index: number, qty: number) => void;
  clearCart: () => void;
  checkout: () => void;
  reset: () => void;
};

export const useStore = create<State>((set, get) => ({
  messages: SEED_MESSAGES,
  cart: [],
  draft: '',
  thinking: false,
  sheets: { menu: false, cart: false, placed: false },
  transcript: [],
  lastTotal: 0,

  setDraft: (draft) => set({ draft }),

  openSheet: (sheet) => set((s) => ({ sheets: { ...s.sheets, [sheet]: true } })),
  closeSheet: (sheet) => set((s) => ({ sheets: { ...s.sheets, [sheet]: false } })),

  sendMessage: async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const { cart, transcript } = get();
    const userMsg: Message = { id: newId(), kind: 'user-text', text: trimmed };
    const newTranscript: Turn[] = [...transcript, { role: 'user', content: trimmed }];

    set((s) => ({ messages: [...s.messages, userMsg], thinking: true, transcript: newTranscript }));

    let reply = "I had a hiccup. Could you try that again?";
    let actions: any[] = [];

    try {
      const result = await sendChat(newTranscript, cart);
      reply = result.reply;
      actions = result.actions;
    } catch {}

    const applied = applyActions(cart, actions);
    const nextMessages: Message[] = [];

    if (reply) nextMessages.push({ id: newId(), kind: 'asst-text', text: reply });
    if (applied.added.length || applied.removed.length) {
      nextMessages.push({ id: newId(), kind: 'order', added: applied.added, removed: applied.removed });
    }
    if (applied.suggestions?.length) {
      nextMessages.push({ id: newId(), kind: 'suggest', ids: applied.suggestions });
    }
    if (applied.checkout) {
      const subtotal = applied.cart.reduce((s, l) => s + l.qty * l.price, 0);
      nextMessages.push({ id: newId(), kind: 'checkout', total: subtotal * 1.0875, count: applied.cart.reduce((s, l) => s + l.qty, 0) });
    }

    set((s) => ({
      messages: [...s.messages, ...nextMessages],
      cart: applied.cart,
      thinking: false,
      transcript: [...newTranscript, ...(reply ? [{ role: 'assistant' as const, content: reply }] : [])],
    }));
  },

  addItem: (menuId, qty = 1) => {
    const item = MENU_BY_ID[menuId];
    if (!item) return;
    set((s) => {
      const idx = s.cart.findIndex((l) => l.menuId === menuId && !l.notes);
      const cart = s.cart.slice();
      if (idx >= 0) cart[idx] = { ...cart[idx], qty: cart[idx].qty + qty };
      else cart.push({ menuId, qty, notes: '', price: item.price });
      const orderMsg: Message = { id: newId(), kind: 'order', added: [{ menuId, qty, notes: '' }], removed: [] };
      return { cart, messages: [...s.messages, orderMsg] };
    });
  },

  changeQty: (index, qty) => {
    set((s) => {
      const cart = s.cart.slice();
      if (qty <= 0) cart.splice(index, 1);
      else cart[index] = { ...cart[index], qty };
      return { cart };
    });
  },

  clearCart: () => {
    set((s) => ({
      cart: [],
      messages: [...s.messages, { id: newId(), kind: 'asst-text', text: 'Cleared. Start fresh whenever.' }],
    }));
  },

  checkout: () => {
    const { cart } = get();
    if (!cart.length) return;
    const subtotal = cart.reduce((s, l) => s + l.qty * l.price, 0);
    set({ lastTotal: subtotal * 1.0875, sheets: { menu: false, cart: false, placed: true } });
  },

  reset: () => {
    set({
      cart: [],
      lastTotal: 0,
      sheets: { menu: false, cart: false, placed: false },
      transcript: [],
      messages: [
        { id: newId(), kind: 'asst-text', text: "Anything else for you? I can put together another round." },
        { id: newId(), kind: 'chips', chips: ["See the menu", "Just dessert", "Recommend something"] },
      ],
    });
  },
}));
