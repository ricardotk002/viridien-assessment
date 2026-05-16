import { Controller, Get, Delete, Param, Res, HttpCode } from '@nestjs/common';
import type { Response } from 'express';
import { PrismaService } from '../prisma.service';

const fmt = (n: number) => `$${n.toFixed(2)}`;
const fmtDate = (d: Date) =>
  new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

const BASE_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; background: #f5f5f4; color: #1c1816; }
  header { background: #1c1816; color: #fff; padding: 16px 24px; display: flex; align-items: center; gap: 12px; }
  header h1 { font-size: 18px; font-weight: 600; }
  header a { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 13px; }
  header a:hover { color: #fff; }
  .container { max-width: 1100px; margin: 0 auto; padding: 24px; display: flex; flex-direction: column; gap: 32px; }
  .section-head { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .section-head h2 { font-size: 15px; font-weight: 600; }
  .section-head .count { background: #e5e5e3; border-radius: 99px; padding: 1px 8px; font-size: 12px; font-weight: 500; color: #5d564f; }
  .section-head .spacer { flex: 1; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  th { text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #5d564f; background: #fafaf9; border-bottom: 1px solid #e7e5e4; }
  td { padding: 10px 14px; border-bottom: 1px solid #f0eeec; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  .clickable-row { cursor: pointer; }
  .clickable-row:hover td { background: #fafaf9; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
  .badge.placed { background: rgba(217,155,60,0.15); color: #8a5e1a; }
  .badge.preparing { background: rgba(92,117,86,0.15); color: #3d6137; }
  .badge.ready { background: rgba(28,24,22,0.1); color: #1c1816; }
  .empty { padding: 32px; text-align: center; color: #9d9791; }
  .btn-danger { background: none; border: 1px solid rgba(200,79,47,0.4); color: #c84f2f; font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: 6px; cursor: pointer; }
  .btn-danger:hover { background: rgba(200,79,47,0.06); }
`;

@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async dashboard(@Res() res: Response) {
    const [orders, items] = await Promise.all([
      this.prisma.order.findMany({ orderBy: { createdAt: 'desc' } }),
      this.prisma.menuItem.findMany({ orderBy: { cat: 'asc' } }),
    ]);

    const orderRows = orders
      .map((o) => {
        const lineItems: { menuId: string; qty: number; price: number }[] = JSON.parse(o.items);
        const summary = lineItems.map((l) => `${l.qty}× ${l.menuId}`).join(', ');
        return `<tr class="clickable-row" onclick="location.href='/admin/orders/${o.id}'">
          <td>${o.id.slice(0, 8)}</td>
          <td>${fmtDate(o.createdAt)}</td>
          <td style="color:#5d564f;font-size:12.5px;max-width:300px">${summary}</td>
          <td>${fmt(o.total)}</td>
          <td><span class="badge ${o.status}">${o.status}</span></td>
        </tr>`;
      })
      .join('');

    const itemRows = items
      .map((i) => {
        const tags: string[] = JSON.parse(i.tags);
        return `<tr>
          <td>${i.id}</td>
          <td>${i.cat}</td>
          <td>${i.name}</td>
          <td>${fmt(Number(i.price))}</td>
          <td>${tags.join(', ') || '—'}</td>
        </tr>`;
      })
      .join('');

    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Viridien Admin</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <header><h1>Viridien</h1><span style="opacity:0.4">Admin</span></header>
  <div class="container">
    <section>
      <div class="section-head">
        <h2>Orders</h2><span class="count">${orders.length}</span>
        <span class="spacer"></span>
        ${orders.length > 0 ? `<button class="btn-danger" onclick="clearOrders()">Clear all</button>` : ''}
      </div>
      <table>
        <thead><tr><th>ID</th><th>Time</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>${orderRows || '<tr><td colspan="5" class="empty">No orders yet</td></tr>'}</tbody>
      </table>
    </section>
    <section>
      <div class="section-head"><h2>Menu</h2><span class="count">${items.length}</span></div>
      <table>
        <thead><tr><th>ID</th><th>Category</th><th>Name</th><th>Price</th><th>Tags</th></tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
    </section>
  </div>
  <script>
    async function clearOrders() {
      if (!confirm('Delete all orders?')) return;
      await fetch('/admin/orders', { method: 'DELETE' });
      location.reload();
    }
  </script>
</body>
</html>`);
  }

  @Get('orders/:id')
  async orderDetail(@Param('id') id: string, @Res() res: Response) {
    const [order, menuItems] = await Promise.all([
      this.prisma.order.findUnique({ where: { id } }),
      this.prisma.menuItem.findMany(),
    ]);

    if (!order) {
      res.status(404).send('Order not found');
      return;
    }

    const menuMap = Object.fromEntries(menuItems.map((m) => [m.id, m]));
    const lineItems: { menuId: string; qty: number; price: number; notes?: string }[] = JSON.parse(order.items);

    const lineRows = lineItems
      .map((l) => {
        const item = menuMap[l.menuId];
        return `<tr>
          <td>${item?.name ?? l.menuId}</td>
          <td style="color:#5d564f">${item?.cat ?? '—'}</td>
          <td>${l.qty}</td>
          <td>${fmt(l.price)}</td>
          <td>${fmt(l.qty * l.price)}</td>
          ${l.notes ? `<td style="color:#5d564f;font-size:12.5px">${l.notes}</td>` : '<td style="color:#9d9791">—</td>'}
        </tr>`;
      })
      .join('');

    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Order ${order.id.slice(0, 8)} · Viridien Admin</title>
  <style>
    ${BASE_STYLES}
    .meta { display: flex; gap: 32px; background: #fff; border-radius: 10px; padding: 20px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .meta-item label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9d9791; display: block; margin-bottom: 4px; }
    .meta-item value { font-size: 15px; font-weight: 500; }
    .total-row td { font-weight: 600; border-top: 1px solid #e7e5e4; }
  </style>
</head>
<body>
  <header>
    <h1>Viridien</h1>
    <a href="/admin">← Admin</a>
  </header>
  <div class="container">
    <div class="meta">
      <div class="meta-item"><label>Order ID</label><value>${order.id.slice(0, 8)}</value></div>
      <div class="meta-item"><label>Time</label><value>${fmtDate(order.createdAt)}</value></div>
      <div class="meta-item"><label>Status</label><value><span class="badge ${order.status}">${order.status}</span></value></div>
      <div class="meta-item"><label>Total</label><value>${fmt(order.total)}</value></div>
    </div>
    <section>
      <div class="section-head"><h2>Items</h2><span class="count">${lineItems.length}</span></div>
      <table>
        <thead><tr><th>Item</th><th>Category</th><th>Qty</th><th>Unit price</th><th>Subtotal</th><th>Notes</th></tr></thead>
        <tbody>
          ${lineRows}
          <tr class="total-row">
            <td colspan="4" style="text-align:right;color:#5d564f">Total (incl. tax)</td>
            <td>${fmt(order.total)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</body>
</html>`);
  }

  @Delete('orders')
  @HttpCode(200)
  async clearOrders() {
    await this.prisma.order.deleteMany();
    return { ok: true };
  }
}
