# Offside Community — Full-Stack Turf Booking

Production-ready Next.js 14 + Prisma + Postgres platform for football turf booking in Vadodara & Ahmedabad.

Live target: **www.theoffsidecommunity.com**

---

## Tech
- Next.js 14 App Router, TypeScript
- PostgreSQL + Prisma
- JWT access (15m) + refresh rotation (httpOnly secure cookie)
- Zustand state
- Tailwind CSS — dark navy + neon green `#5EE85C`
- Cloudinary image uploads (payment screenshots)
- Manual UPI / QR (Razorpay interface stubbed at `/lib/payments`)
- Resend ready (email verification hook)

## Features implemented
- PLAYER: register/login, profile, browse matches by city, match detail with confirmed player list, UPI booking + screenshot upload, booking status, cancel/refund request, reviews
- ADMIN: dashboard, matches CRUD + weekly scheduler UI, bookings verify/reject, refunds process, user promotion, venues management, reviews moderation endpoint
- Security: bcrypt (12), Zod validation everywhere, RBAC server-side, rate limiting, file type/size validation, audit logs, CSRF sameSite cookies, no raw SQL
- Prevents double-booking + overbooking server-side

## Quick start
1. cp .env.example .env — set DATABASE_URL + JWT secrets + CLOUDINARY keys
2. npm install
3. npx prisma migrate dev --name init
4. npx prisma db seed   # or: npm run db:seed
5. npm run dev
   → http://localhost:3000

Seed accounts:
- Admin: admin@theoffsidecommunity.com / Admin@123
- Player: player@test.com / Player@123

## Environment
See `.env.example` — required:
- DATABASE_URL
- JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
- CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET
- NEXT_PUBLIC_APP_URL
Optional: RESEND_API_KEY, RATE_LIMIT_UPSTASH_*

## Key routes
Public: `/`, `/matches`, `/matches/[id]`, `/about`, `/reviews`, `/login`, `/register`
Player: `/profile`, `/matches/[id]/book`
Admin: `/admin`, `/admin/matches`, `/admin/bookings`, `/admin/refunds`, `/admin/users`, `/admin/venues`, `/admin/reviews`

API:
- POST /api/auth/register|login|refresh|logout
- GET /api/matches?city=Vadodara
- POST /api/bookings
- POST /api/bookings/[id]/cancel
- POST /api/upload (Cloudinary)
- /api/admin/* (ADMIN only)

## Payment flow (manual UPI)
1. Admin sets UPI ID / QR in AppConfig
2. Player pays externally, submits UPI ID used + screenshot → PENDING
3. Admin verifies → VERIFIED / REJECTED
4. Cancel → refundRequested → admin marks PROCESSED
Overbooking guarded server-side. Swap to Razorpay via `/lib/payments/index.ts`.

## Deploy
- Vercel (Next.js)
- Neon / Supabase Postgres
- Set env vars in Vercel
- Domain: www.theoffsidecommunity.com → Vercel DNS
- Cloudinary: create unsigned preset `offside_payments` (or use signed server upload as implemented)

## Content seeds
- Vadodara — Sportingo Turf — Chief Parth — https://maps.app.goo.gl/PsPSaG8aWEnbuKgv8?g_st=ic
- Ahmedabad — Chief Rudra — venue TBD
- Contact: 9313074629
- Instagram: @theoffsidesociety
- Standard ₹299 / PLUS ₹449
- Schedule refreshed Sundays

Academy placeholder included on /about.

---
Built secure, client-deploy ready. Audit log in DB. All admin actions tracked (`verifiedById`).
