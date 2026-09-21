#!/bin/bash
set -e
echo "⚽ Offside Community — local setup"
command -v node >/dev/null || { echo "Install Node 18+ first"; exit 1; }
echo "Node $(node -v)"
[ -f .env ] || cp .env.example .env && echo "→ .env created — EDIT DATABASE_URL + JWT secrets now"
echo ""
echo "1) Edit .env — set DATABASE_URL"
echo "   Neon free: https://neon.tech"
echo "   or local: postgresql://postgres:postgres@localhost:5432/offside"
read -p "Press Enter after .env is saved..."
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
echo ""
echo "✅ Done."
echo "Admin: admin@theoffsidecommunity.com / Admin@123"
echo "Player: player@test.com / Player@123"
echo ""
npm run dev
