# วิธีการตั้งค่า OAuth Providers

## 🔐 คู่มือการตั้งค่าระบบ Login

### 1. Google OAuth Setup

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างโปรเจกต์ใหม่หรือเลือกโปรเจกต์ที่มีอยู่
3. ไปที่ "APIs & Services" → "Credentials"
4. คลิก "Create Credentials" → "OAuth client ID"
5. เลือก "Web application"
6. ตั้งค่า:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
7. คัดลอก **Client ID** และ **Client Secret**
8. เพิ่มใน `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

---

### 2. Facebook OAuth Setup

1. ไปที่ [Facebook Developers](https://developers.facebook.com/)
2. สร้างแอพใหม่ (Create App)
3. เลือก "Consumer" เป็นประเภทแอพ
4. ไปที่ Settings → Basic
5. คัดลอก **App ID** และ **App Secret**
6. เพิ่ม Facebook Login:
   - ไปที่ Products → Facebook Login → Settings
   - ใส่ Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/callback/facebook`
7. เพิ่มใน `.env.local`:
   ```
   FACEBOOK_CLIENT_ID=your-app-id-here
   FACEBOOK_CLIENT_SECRET=your-app-secret-here
   ```

---

### 3. LINE OAuth Setup

1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. สร้าง Provider ใหม่ (ถ้ายังไม่มี)
3. สร้าง Channel ใหม่:
   - เลือกประเภท "LINE Login"
   - กรอกข้อมูลที่จำเป็น
4. ไปที่แท็บ "LINE Login"
5. ตั้งค่า Callback URL: `http://localhost:3000/api/auth/callback/line`
6. คัดลอก **Channel ID** และ **Channel Secret** จากแท็บ "Basic settings"
7. เพิ่มใน `.env.local`:
   ```
   LINE_CLIENT_ID=your-channel-id-here
   LINE_CLIENT_SECRET=your-channel-secret-here
   ```

---

### 4. NextAuth Secret

สร้าง secret key สำหรับ NextAuth:

```bash
# สร้าง random secret (ใน terminal)
openssl rand -base64 32
```

เพิ่มใน `.env.local`:
```
NEXTAUTH_SECRET=generated-secret-here
NEXTAUTH_URL=http://localhost:3000
```

---

## 📝 ไฟล์ .env.local ตัวอย่างสมบูรณ์

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# LINE OAuth
LINE_CLIENT_ID=your-line-channel-id
LINE_CLIENT_SECRET=your-line-channel-secret

# Database
DATABASE_URL="file:./dev.db"
```

---

## 🚀 การใช้งาน

### สมัครสมาชิกด้วยอีเมล
```
1. ไปที่ /auth/signup
2. กรอกชื่อ, อีเมล, รหัสผ่าน
3. คลิก "สมัครสมาชิก"
```

### เข้าสู่ระบบด้วยอีเมล
```
1. ไปที่ /auth/signin
2. กรอกอีเมล, รหัสผ่าน
3. คลิก "เข้าสู่ระบบ"
```

### เข้าสู่ระบบด้วย Social Login
```
1. ไปที่ /auth/signin หรือ /auth/signup
2. คลิกปุ่ม "ดำเนินการต่อด้วย Google/Facebook/LINE"
3. อนุญาตสิทธิ์ในหน้า popup
4. ระบบจะสร้างบัญชีอัตโนมัติ (ถ้ายังไม่มี)
```

---

## 🔒 ความปลอดภัย

- รหัสผ่านถูกเข้ารหัสด้วย bcrypt
- ใช้ JWT สำหรับ session
- รองรับ CSRF protection
- ข้อมูลผู้ใช้เก็บใน SQLite database

---

## 🛠️ Production Setup

เมื่อ deploy ไป production:

1. เปลี่ยน `NEXTAUTH_URL` เป็น domain จริง
2. อัปเดต callback URLs ในทุก OAuth providers
3. ใช้ database ที่เหมาะสม (PostgreSQL, MySQL)
4. เพิ่ม HTTPS
5. ใช้ secret key ที่แข็งแรง

---

## 📦 Dependencies

```json
{
  "next-auth": "^4.x",
  "@next-auth/prisma-adapter": "^1.x",
  "prisma": "^5.x",
  "@prisma/client": "^5.x",
  "bcryptjs": "^2.x"
}
```
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages = {
    Configuration: 'มีปัญหาในการตั้งค่าระบบ กรุณาติดต่อผู้ดูแลระบบ',
    AccessDenied: 'คุณไม่ได้รับอนุญาตให้เข้าถึง',
    Verification: 'ลิงก์ยืนยันหมดอายุหรือถูกใช้งานแล้ว',
    Default: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง',
  };

  const message = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h1>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
          >
            ลองเข้าสู่ระบบอีกครั้ง
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-all duration-200"
          >
            กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}

