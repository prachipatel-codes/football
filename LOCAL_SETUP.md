# Offside Community — Run Locally (2 min)

You have the full Next.js 14 code in this workspace at `/home/user` — which is the project root (`package.json` is here).

### 1. Get the code
Download the whole `/home/user` folder from Arena, or `git init` + push it.
On your laptop:
```bash
# if you downloaded as zip, unzip then:
cd offside-community
```

### 2. Install
Node 18+ / 20+ required.
```bash
npm install
# ~90 sec first time
```

### 3. Database — 3 options, pick 1

A) **Fastest — Neon free cloud (recommended)**
- go neon.tech → new project → copy Postgres URL
- paste in `.env` as DATABASE_URL

B) **Local Postgres**
```bash
# mac
brew install postgresql@15
brew services start postgresql@15
createdb offside
# DATABASE_URL="postgresql://yourmacuser@localhost:5432/offside"
# windows: install Postgres 15, create DB "offside"
```

C) **Docker one-liner**
```bash
docker run --name offside-db -e POSTGRES_PASSWORD=offside -e POSTGRES_DB=offside -p 5432:5432 -d postgres:15
# DATABASE_URL="postgresql://postgres:offside@localhost:5432/offside"
```

### 4. .env
```bash
cp .env.example .env
```
Edit `.env` minimum:
```
DATABASE_URL="postgresql://..."
JWT_ACCESS_SECRET="dev_access_32+_random_chars_change_me_please"
JWT_REFRESH_SECRET="dev_refresh_different_32+_random_chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=123
CLOUDINARY_API_SECRET=abc
# Cloudinary can be fake for local UI — upload will fail, but everything else works.
# For real uploads: free cloudinary.com account → copy 3 keys.
```

### 5. DB migrate + seed
```bash
npx prisma migrate dev --name init
npm run db:seed
```
Seed gives you:
- Admin: admin@theoffsidecommunity.com / Admin@123
- Player: player@test.com / Player@123
- Vadodara Sportingo + Ahmedabad venue
- 2 upcoming matches

### 6. Run
```bash
npm run dev
```
Open: http://localhost:3000

Login:
- Player → /login → player@test.com / Player@123 → Book a match
- Admin → admin@theoffsidecommunity.com / Admin@123 → /admin → verify payments

### Common issues (Ahmedabad/Vadodara devs)

`P1001 Can't reach database` → your DATABASE_URL wrong / Postgres not running. Try Neon cloud — 30 sec.

`prisma generate` ENOENT → run `npx prisma generate` once after npm install.

Port 3000 busy → `PORT=3001 npm run dev`

Cloudinary 401 on upload → put real Cloudinary keys, or use test mode: in `/src/app/matches/[id]/book/page.tsx` you can temporarily paste any image URL to test booking flow.

JWT error → make sure JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are DIFFERENT and 32+ chars.

Windows PowerShell: use `copy .env.example .env` instead of `cp`.

### Quick reset
```bash
npx prisma migrate reset --force
npm run db:seed
```

That’s it bhai — `npm run dev` at project root (`/home/user` in Arena, `offside-community/` on your machine). Need me to bundle a zip, or push to your GitHub?
