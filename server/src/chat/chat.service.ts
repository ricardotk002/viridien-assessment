import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { MenuService } from '../menu/menu.service';

const client = new Anthropic();

type CartLine = { menuId: string; qty: number; notes: string; price: number };
type Turn = { role: 'user' | 'assistant'; content: string };

@Injectable()
export class ChatService {
  constructor(private menu: MenuService) {}

  async chat(messages: Turn[], cart: CartLine[]) {
    const menuItems = await this.menu.findAll();

    const menuLines = menuItems
      .map((m) => {
        const sizes = m.sizes ? ` [sizes: ${m.sizes.join('/')}]` : '';
        return `- ${m.id} | ${m.name} ($${m.price}) — ${m.desc}${sizes}`;
      })
      .join('\n');

    const system = `You are the friendly ordering assistant at Viridien, a neighborhood bistro. You help guests build an order through conversation. Speak warmly but briefly — 1–2 short sentences max per reply, no emoji, no exclamation overload.

MENU (use the id when adding items):
${menuLines}

You MUST respond with ONLY a single valid JSON object, no prose outside it. Schema:
{
  "reply": "short friendly assistant message",
  "actions": [
    { "type": "add",    "menuId": "spicy-chicken", "qty": 2, "notes": "extra spicy" },
    { "type": "remove", "menuId": "water" },
    { "type": "setQty", "menuId": "truffle-fries", "qty": 3 },
    { "type": "clear" },
    { "type": "suggest", "menuIds": ["margherita", "burrata"] },
    { "type": "checkout" }
  ]
}

Rules:
- Match items by meaning, not exact text. "spicy chicken sando" → spicy-chicken. "fries" → truffle-fries. "water" → water (size large if mentioned).
- Default qty is 1. Always emit add/remove/setQty actions when the user expresses intent; don't just talk about it.
- If the user is browsing or asks for a recommendation, return actions: [{"type":"suggest","menuIds":[...]}] with 2–4 ids. Keep "reply" to one sentence.
- If the user says they're ready / done / "checkout" / "place order", emit {"type":"checkout"}.
- If you can't find a match, ask a brief clarifying question and leave actions: [].
- For sized items (water), pass the size in notes ("Large").
- Never invent items not on the menu.
- Output ONLY the JSON object. No markdown fences, no commentary.`;

    const cartSummary =
      cart.length === 0
        ? 'empty'
        : cart
            .map((l) => {
              const item = menuItems.find((m) => m.id === l.menuId);
              return `${l.qty}× ${item?.name ?? l.menuId}${l.notes ? ` (${l.notes})` : ''}`;
            })
            .join(', ');

    const subtotal = cart.reduce((s, l) => s + l.qty * l.price, 0);

    const messagesForModel: Turn[] = [
      { role: 'user', content: `Current cart: ${cartSummary}. Subtotal: $${subtotal.toFixed(2)}.` },
      ...messages.slice(-8),
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system,
      messages: messagesForModel,
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text : '';
    return this.parseResponse(raw);
  }

  private parseResponse(raw: string) {
    if (!raw) return { reply: "I had a hiccup. Could you try that again?", actions: [] };
    let txt = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
    const a = txt.indexOf('{');
    const b = txt.lastIndexOf('}');
    if (a >= 0 && b > a) txt = txt.slice(a, b + 1);
    try {
      const obj = JSON.parse(txt);
      return { reply: obj.reply || '', actions: Array.isArray(obj.actions) ? obj.actions : [] };
    } catch {
      return { reply: raw.slice(0, 200), actions: [] };
    }
  }
}
