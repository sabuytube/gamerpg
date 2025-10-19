# 🎮 GameRPG - Authentication System

## ระบบสมัครสมาชิกและ Login ที่ติดตั้งสำเร็จแล้ว! ✅

### ✨ ฟีเจอร์ที่พร้อมใช้งาน:

1. **Email & Password Login** 📧
   - สมัครสมาชิกด้วยอีเมลและรหัสผ่าน
   - เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
   - รหัสผ่านเข้ารหัสด้วย bcrypt

2. **Google OAuth** 🔵
   - เข้าสู่ระบบด้วยบัญชี Google
   - ต้องตั้งค่า credentials ที่ Google Cloud Console

3. **Facebook OAuth** 🔷
   - เข้าสู่ระบบด้วยบัญชี Facebook
   - ต้องตั้งค่า App ID ที่ Facebook Developers

4. **LINE OAuth** 🟢
   - เข้าสู่ระบบด้วยบัญชี LINE
   - ต้องตั้งค่า Channel ID ที่ LINE Developers

---

## 📂 โครงสร้างไฟล์ที่สร้างขึ้น:

```
gamerpg/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.js          # NextAuth API endpoint
│   │       └── register/
│   │           └── route.js          # Registration API
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.js              # หน้า Login
│   │   ├── signup/
│   │   │   └── page.js              # หน้า Sign Up
│   │   └── error/
│   │       └── page.js              # หน้า Error
│   └── components/
│       ├── AuthProvider.jsx         # Session Provider wrapper
│       └── AuthButton.jsx           # ปุ่ม Login/Logout ใน header
├── lib/
│   ├── auth.js                      # NextAuth configuration
│   └── prisma.js                    # Prisma client
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── dev.db                       # SQLite database
├── .env.local                       # Environment variables
└── AUTH_SETUP.md                    # คู่มือการตั้งค่า
```

---

## 🚀 วิธีใช้งาน:

### 1. ทดสอบด้วย Email/Password (ไม่ต้องตั้งค่า OAuth):

```bash
# รันเซิร์ฟเวอร์
npm run dev
```

จากนั้น:
1. เปิด http://localhost:3000
2. คลิก "สมัครสมาชิก"
3. กรอกชื่อ, อีเมล, รหัสผ่าน
4. คลิก "สมัครสมาชิก" - ระบบจะสร้างบัญชีและ login อัตโนมัติ
5. คุณจะเห็นชื่อและปุ่ม "ออกจากระบบ" ที่ header

### 2. ตั้งค่า OAuth Providers (ถ้าต้องการ):

ดูคู่มือโดยละเอียดใน `AUTH_SETUP.md`

**สำหรับ Google:**
- ไปที่ https://console.cloud.google.com/
- สร้าง OAuth credentials
- คัดลอก Client ID และ Secret ใส่ใน `.env.local`

**สำหรับ Facebook:**
- ไปที่ https://developers.facebook.com/
- สร้าง App และเปิดใช้ Facebook Login
- คัดลอก App ID และ Secret ใส่ใน `.env.local`

**สำหรับ LINE:**
- ไปที่ https://developers.line.biz/
- สร้าง LINE Login Channel
- คัดลอก Channel ID และ Secret ใส่ใน `.env.local`

---

## 🔐 ความปลอดภัย:

✓ รหัสผ่านเข้ารหัสด้วย bcrypt  
✓ ใช้ JWT สำหรับ session  
✓ CSRF protection  
✓ Secure cookie settings  
✓ Database-backed sessions  

---

## 📍 Routes ที่สำคัญ:

- `/` - หน้าแรกพร้อมปุ่ม Login/Signup
- `/auth/signin` - หน้า Login (รองรับทุกวิธี)
- `/auth/signup` - หน้า Sign Up (รองรับทุกวิธี)
- `/auth/error` - หน้า Error เมื่อ login ผิดพลาด
- `/game` - หน้าเกมหลัก (ต้อง login)
- `/map` - หน้าแผนที่
- `/battle` - หน้าต่อสู้

---

## 🎯 สิ่งที่ทำได้ทันที:

1. ✅ สมัครสมาชิกด้วยอีเมล
2. ✅ Login ด้วยอีเมล
3. ✅ ดูสถานะ Login ที่ header
4. ✅ Logout
5. ✅ Session จะยังอยู่แม้ refresh หน้า

## 🔄 สิ่งที่ต้องตั้งค่าเพิ่ม (ถ้าต้องการ):

- [ ] Google OAuth credentials
- [ ] Facebook App credentials  
- [ ] LINE Channel credentials

---

## 🐛 Troubleshooting:

**ปัญหา: Cannot connect to database**
- ลองรัน: `npx prisma db push`

**ปัญหา: Social login ไม่ทำงาน**
- ตรวจสอบว่าได้ตั้งค่า credentials ใน `.env.local` แล้ว
- ตรวจสอบ callback URLs ว่าตรงกับที่ตั้งไว้

**ปัญหา: Session หาย**
- ตรวจสอบว่า `NEXTAUTH_SECRET` ไม่เปลี่ยน
- ลองล้าง cookies และ login ใหม่

---

## 📝 Next Steps:

1. ทดสอบสมัครสมาชิกและ login
2. ตั้งค่า OAuth providers ที่ต้องการ
3. ปรับแต่ง UI ตามต้องการ
4. เพิ่ม protected routes (ใช้ middleware)
5. เพิ่ม user profile page

---

**เริ่มใช้งานได้เลย! 🚀**

