# BadmintonPro — ระบบจัดการตารางคอร์ทแบดมินตัน

ระบบจัดการตารางการจองคอร์ทแบดมินตันสำหรับผู้ดูแลระบบ พร้อม real-time sync และสถิติการใช้งาน

## Features

- **Timeline Scheduler** — ตารางเวลาแบบ Google Calendar Resource View
- **Drag to Create** — ลากเพื่อสร้างการจอง หรือคลิกบนช่องว่าง
- **Real-time Sync** — อัปเดตทันทีผ่าน Supabase Realtime
- **Statistics Dashboard** — สถิติการใช้งาน พร้อมกราฟ Recharts
- **Dark Mode** — รองรับ dark mode
- **Export** — บันทึกเป็นรูปภาพ และพิมพ์
- **Keyboard Shortcuts** — `←` `→` เปลี่ยนวัน · `T` วันนี้ · `N` จองใหม่

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Realtime | Supabase Realtime |
| State | Zustand |
| Data Fetching | TanStack React Query |
| Charts | Recharts |
| Date | dayjs |
| Export | html-to-image |

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd badminton-scheduler
npm install
```

### 2. Create Supabase Project

1. ไปที่ [supabase.com](https://supabase.com) และสร้าง project ใหม่
2. ไปที่ **SQL Editor** และรัน `supabase/schema.sql`
3. (Optional) รัน `supabase/seed.sql` เพื่อเพิ่มข้อมูลตัวอย่าง

### 3. Create Admin User

ใน Supabase Dashboard → **Authentication** → **Users** → **Add User**

หรือใช้ SQL:
```sql
-- สร้างผู้ใช้ผ่าน Supabase Auth (แนะนำใช้ Dashboard)
```

### 4. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

แก้ไข `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

ค่าเหล่านี้หาได้ที่ **Supabase Dashboard** → **Project Settings** → **API**

### 5. Run Development Server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin <your-repo>
git push -u origin main
```

### 2. Deploy to Vercel

1. ไปที่ [vercel.com](https://vercel.com) → **New Project**
2. Import GitHub repository
3. เพิ่ม Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

### 3. Configure Supabase Auth Redirect URLs

ใน Supabase Dashboard → **Authentication** → **URL Configuration**:
- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: `https://your-app.vercel.app/**`

---

## Project Structure

```
badminton-scheduler/
├── app/
│   ├── (auth)/login/page.tsx       # หน้า login
│   ├── (dashboard)/
│   │   ├── layout.tsx              # layout พร้อม navbar
│   │   ├── page.tsx                # หน้าตารางจอง (หลัก)
│   │   └── statistics/page.tsx     # หน้าสถิติ
│   ├── layout.tsx                  # root layout
│   ├── globals.css
│   └── providers.tsx               # QueryClient + ThemeProvider
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── shared/                     # Navbar, Error/Empty states
│   ├── scheduler/                  # Grid, Cards, Modal, Navigation
│   └── dashboard/                  # Stats cards & charts
├── hooks/
│   ├── useBookings.ts              # React Query CRUD
│   ├── useRealtimeBookings.ts      # Supabase realtime
│   └── useStatistics.ts            # สถิติ
├── lib/
│   ├── supabase/                   # Supabase clients
│   ├── actions.ts                  # Server Actions
│   ├── colors.ts                   # สีการจอง
│   ├── constants.ts                # ค่าคงที่ grid
│   └── utils.ts                    # utility functions
├── store/schedulerStore.ts         # Zustand store
├── types/index.ts                  # TypeScript types
├── middleware.ts                   # Auth protection
└── supabase/
    ├── schema.sql                  # Database schema + RLS + Realtime
    └── seed.sql                    # ข้อมูลตัวอย่าง
```

## Database Schema

```sql
table bookings (
  id            uuid  PRIMARY KEY
  customer_name text  NOT NULL
  court_number  int   NOT NULL (1-6)
  booking_date  date  NOT NULL
  start_time    time  NOT NULL
  end_time      time  NOT NULL
  note          text  NULLABLE
  color         text  NOT NULL
  created_at    timestamptz DEFAULT now()
)
```

- Row Level Security เปิดใช้งาน: เฉพาะ authenticated users
- Trigger ป้องกันการจองทับซ้อน
- Realtime enabled

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | วันก่อนหน้า |
| `→` | วันถัดไป |
| `T` | กลับวันนี้ |
| `N` | สร้างการจองใหม่ |
| `Esc` | ปิด modal |

## Courts & Hours

- 6 คอร์ท: คอร์ท 1–6
- เปิดทำการ: 10:00–22:00 (12 ชั่วโมง)
- ช่วงเวลา: 30 นาที/slot (24 slots/วัน)
