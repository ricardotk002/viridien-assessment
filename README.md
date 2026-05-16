# Viridien

Ordering app for a neighbourhood bistro. Guests order through a conversational assistant using text or voice.

## Structure

```
viridien/
├── app/                        # React Native (Expo)
│   ├── app/                    # Expo Router screens
│   ├── components/             # UI components
│   │   ├── chat/               # Bubbles, avatar, item thumbnails
│   │   └── sheets/             # Menu, cart, confirmation sheets
│   ├── constants/              # Colors, menu data
│   ├── store/                  # Zustand state
│   └── utils/                  # API client, action logic
│
├── server/                     # NestJS
│   ├── src/
│   │   ├── chat/               # AI endpoint (POST /chat)
│   │   ├── menu/               # Menu endpoint (GET /menu)
│   │   ├── orders/             # Orders endpoint (POST /orders)
│   │   └── admin/              # Admin dashboard (GET /admin)
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
│
└── Makefile
```

## Requirements

- Node.js 18+
- PostgreSQL running locally
- Xcode (for iOS build)
- `ANTHROPIC_API_KEY` set in `server/.env`

## Getting started

```bash
# Install dependencies
cd app && npm install
cd server && npm install

# Seed the database
make db-seed
```

Run both app and server in two terminals:

```bash
make dev-server   # NestJS on http://localhost:3000
make dev-app      # Expo on iOS simulator/device
```

Admin dashboard: `http://localhost:3000/admin`
