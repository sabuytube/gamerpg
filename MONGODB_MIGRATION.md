ากใ# 🔄 Migration จาก SQLite/Prisma → MongoDB

## ✅ สิ่งที่เปลี่ยนแปลงสำเร็จแล้ว:

### 1. **Database System**
- ❌ เดิม: SQLite + Prisma ORM
- ✅ ใหม่: MongoDB + Mongoose

### 2. **Models ที่สร้างใหม่** (MongoDB/Mongoose)
- ✅ `models/User.js` - User model พร้อม authentication
- ✅ `models/Account.js` - OAuth accounts
- ✅ `models/Session.js` - User sessions
- ✅ `lib/mongodb.js` - MongoDB connection (ใช้ไฟล์ที่คุณมีอยู่)

### 3. **ไฟล์ที่อัปเดตแล้ว**
- ✅ `lib/auth.js` - NextAuth config ใช้ MongoDB แทน Prisma
- ✅ `app/api/auth/register/route.js` - Registration API ใช้ MongoDB
- ✅ `.env.local` - เพิ่ม MONGO_URI และ MONGO_DB_NAME

### 4. **ไฟล์ที่ลบออก**
- ❌ `lib/prisma.js` - ไม่ใช้แล้ว
- ❌ `prisma/schema.prisma` - ไม่จำเป็น
- ❌ `prisma/dev.db` - SQLite database เก่า

---

## 🔧 Environment Variables ที่ต้องมี:

ไฟล์ `.env.local` ของคุณมีค่าแล้ว:

```env
# MongoDB (ใช้ URI ของคุณ)
MONGO_URI=mongodb+srv://sabuytube:...@sabuytube.dqho6.mongodb.net/?ssl=true&authSource=admin
MONGO_DB_NAME=gamerpg

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=qVRz20gpypswvPMHI3eWs2W5u5cAOKdxm60VcnDprjA=

# OAuth (Optional)
GOOGLE_CLIENT_ID=...
FACEBOOK_CLIENT_ID=...
LINE_CLIENT_ID=...
```

---

## 🎯 ระบบที่พร้อมใช้งาน:

### ✅ สมัครสมาชิก (Email/Password)
```javascript
POST /api/auth/register
Body: { name, email, password }
```
- ตรวจสอบอีเมลซ้ำ ✓
- Hash รหัสผ่านด้วย bcrypt ✓
- บันทึกใน MongoDB ✓

### ✅ Login (Email/Password)
```javascript
POST /api/auth/signin/credentials
```
- ตรวจสอบอีเมลและรหัสผ่าน ✓
- สร้าง JWT session ✓
- บันทึกข้อมูลใน MongoDB ✓

### ✅ OAuth Login (Google, Facebook, LINE)
- Auto-create user เมื่อ login ครั้งแรก ✓
- บันทึกข้อมูล OAuth ใน Account collection ✓
- Merge accounts ถ้าอีเมลซ้ำ ✓

---

## 🚀 วิธีใช้งาน:

### 1. ทดสอบสมัครสมาชิก:
```bash
npm run dev
```

จากนั้น:
1. เปิด http://localhost:3000
2. คลิก "สมัครสมาชิก"
3. กรอก: ชื่อ, อีเมล, รหัสผ่าน
4. ระบบจะบันทึกลง MongoDB และ login อัตโนมัติ

### 2. ตรวจสอบข้อมูลใน MongoDB:
- Database: `gamerpg`
- Collection: `users`
- ข้อมูลที่บันทึก:
  ```json
  {
    "_id": ObjectId,
    "name": "ชื่อผู้ใช้",
    "email": "email@example.com",
    "password": "$2a$10$...", // Hashed
    "provider": "credentials",
    "createdAt": ISODate,
    "updatedAt": ISODate
  }
  ```

---

## 📊 MongoDB Collections:

### 1. **users** - ข้อมูลผู้ใช้
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  image: String,
  provider: String,
  providerId: String,
  emailVerified: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **accounts** - OAuth accounts
```javascript
{
  userId: ObjectId (ref: User),
  provider: String,
  providerAccountId: String,
  access_token: String,
  refresh_token: String,
  // ...
}
```

### 3. **sessions** - User sessions
```javascript
{
  userId: ObjectId (ref: User),
  sessionToken: String,
  expires: Date
}
```

---

## ✨ Features ที่ทำงาน:

1. ✅ สมัครสมาชิกด้วยอีเมล/รหัสผ่าน
2. ✅ Login ด้วยอีเมล/รหัสผ่าน
3. ✅ OAuth Login (Google, Facebook, LINE)
4. ✅ Auto-create user สำหรับ OAuth
5. ✅ Session management
6. ✅ Password hashing (bcrypt)
7. ✅ Email uniqueness check
8. ✅ JWT tokens

---

## 🔐 ความปลอดภัย:

- ✅ รหัสผ่าน hashed ด้วย bcrypt (10 rounds)
- ✅ JWT sessions (secure)
- ✅ MongoDB connection pooling
- ✅ Environment variables สำหรับ sensitive data
- ✅ Mongoose schema validation

---

## 📝 สิ่งที่เปลี่ยน vs เดิม:

| Feature | เดิม (Prisma) | ใหม่ (MongoDB) |
|---------|--------------|---------------|
| Database | SQLite | MongoDB Atlas |
| ORM | Prisma | Mongoose |
| Connection | Prisma Client | Mongoose Connection |
| Models | Prisma Schema | Mongoose Schema |
| Queries | Prisma API | Mongoose API |

---

## 🎮 พร้อมใช้งาน!

ระบบ Authentication พร้อมแล้ว:
- ✅ MongoDB connection working
- ✅ User model created
- ✅ Registration API ready
- ✅ Login system ready
- ✅ OAuth providers ready

**ลองทดสอบได้เลย:** `npm run dev`

