import { CartLine } from './aiActions';

const BASE = 'http://localhost:3000';

type Turn = { role: 'user' | 'assistant'; content: string };

export async function sendChat(messages: Turn[], cart: CartLine[]) {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, cart }),
  });
  if (!res.ok) throw new Error('Chat request failed');
  return res.json() as Promise<{ reply: string; actions: any[] }>;
}
