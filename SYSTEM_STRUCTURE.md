# 🎮 GameRPG - โครงสร้างระบบทั้งหมด

## 📋 สารบัญ
1. [ภาพรวมระบบ](#ภาพรวมระบบ)
2. [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
3. [โครงสร้างโฟลเดอร์](#โครงสร้างโฟลเดอร์)
4. [ระบบหลัก](#ระบบหลัก)
5. [ฐานข้อมูล](#ฐานข้อมูล)
6. [API Endpoints](#api-endpoints)
7. [ระบบเกม](#ระบบเกม)
8. [Flow การทำงาน](#flow-การทำงาน)

---

## 🎯 ภาพรวมระบบ

**GameRPG Playground** เป็นเกม RPG แบบ Turn-based ที่พัฒนาด้วย Next.js 14 (App Router) ผสานระบบ Authentication หลายช่องทาง และระบบเกม RPG แบบครบวงจร

### ✨ ฟีเจอร์หลัก:
- ✅ ระบบ Authentication (Email, Google, Facebook, LINE)
- ✅ ระบบสร้างตัวละคร (3 อาชีพ: นักดาบ, นักธนู, นักเวทย์)
- ✅ ระบบการต่อสู้แบบ Turn-based
- ✅ ระบบ Dungeon และการผจญภัย
- ✅ ระบบอุปกรณ์และไอเทม (Weapon, Armor, Charm)
- ✅ ระบบ Level และ EXP
- ✅ ระบบ Stats และการกระจาย Stat Points
- ✅ ระบบมอนสเตอร์ (Normal, Elite, Boss, World Boss)
- ✅ Admin Panel สำหรับจัดการมอนสเตอร์

---

## 🛠 เทคโนโลยีที่ใช้

### Frontend:
- **Next.js 14.2.7** - React Framework (App Router)
- **React 18.3.1** - UI Library
- **Tailwind CSS 3.4.13** - CSS Framework
- **NextAuth.js 4.24.11** - Authentication

### Backend:
- **Next.js API Routes** - RESTful API
- **MongoDB (Mongoose 8.19.1)** - Database
- **bcryptjs** - Password Hashing
- **crypto-js** - Encryption

### Development:
- **ESLint** - Code Linting
- **PostCSS** - CSS Processing
- **Autoprefixer** - CSS Compatibility

---

## 📁 โครงสร้างโฟลเดอร์

```
gamerpg/
│
├── app/                          # Next.js App Router
│   ├── globals.css              # Global Styles
│   ├── layout.js                # Root Layout
│   ├── page.js                  # Home Page
│   │
│   ├── admin/                   # 🔐 Admin Panel
│   │   ├── monsters/
│   │   │   ├── page.js         # Monster Management
│   │   │   ├── [id]/page.js    # Edit Monster
│   │   │   └── create/page.js  # Create Monster
│   │   └── seed/page.js        # Seed Data
│   │
│   ├── api/                     # 🔌 API Routes
│   │   ├── route.js            # Main API Proxy
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.js  # NextAuth Handler
│   │   │   └── register/route.js       # User Registration
│   │   ├── character/route.js   # Character CRUD
│   │   └── monsters/
│   │       ├── route.js         # Monster List/Create
│   │       ├── [id]/route.js    # Monster Update/Delete
│   │       └── seed/route.js    # Seed Monsters
│   │
│   ├── auth/                    # 🔐 Authentication Pages
│   │   ├── signin/page.js      # Login Page
│   │   ├── signup/page.js      # Register Page
│   │   └── error/page.js       # Auth Error Page
│   │
│   ├── battle/                  # ⚔️ Battle System
│   │   └── page.js
│   │
│   ├── character/               # 👤 Character Management
│   │   ├── create/page.js      # Character Creation
│   │   └── profile/page.js     # Character Profile
│   │
│   ├── game/                    # 🎮 Main Game
│   │   └── page.js
│   │
│   ├── map/                     # 🗺️ World Map
│   │   └── page.js
│   │
│   ├── stats/                   # 📊 Stats Page
│   │   └── page.js
│   │
│   └── components/              # 🧩 React Components
│       ├── AuthButton.jsx       # Login/Logout Button
│       ├── AuthProvider.jsx     # Session Provider
│       ├── BattlePage.jsx       # Battle Logic
│       ├── DynamicNav.jsx       # Navigation
│       ├── HomeRoutes.jsx       # Home Navigation
│       ├── RPGMap.jsx          # Map Component
│       └── StartRPG.jsx        # Start Game
│       └── game/                # Game Components
│           ├── BattleArena.jsx  # Battle UI
│           ├── BattleLog.jsx    # Combat Log
│           ├── CharacterSheet.jsx
│           ├── GameBuilder.jsx
│           ├── GameHeader.jsx
│           ├── InventoryPanel.jsx
│           ├── ItemCard.jsx
│           └── StatSlider.jsx
│
├── lib/                         # 📚 Libraries & Utilities
│   ���── api.js                  # API Service (Encrypted)
│   ├── auth.js                 # NextAuth Config
│   ├── mongodb.js              # MongoDB Connection
│   ├── utils.js                # Utility Functions
│   └── game/                   # 🎲 Game Logic
│       ├── classes.js          # Character Classes
│       ├── combat.js           # Combat Calculations
│       ├── dungeon.js          # Dungeon System
│       ├── enemies.js          # Enemy Spawning
│       ├── entities.js         # Entity Management
│       ├── gear.js             # Equipment System
│       ├── items.js            # Item Database
│       ├── math.js             # Math Utilities
│       └── skills.js           # Skill System
│
├── models/                      # 🗄️ Database Models
│   ├── Account.js              # OAuth Accounts
│   ├── Character.js            # Player Characters
│   ├── Monster.js              # Monster Data
│   ├── Session.js              # User Sessions
│   └── User.js                 # User Accounts
│
├── scripts/                     # 🔧 Utility Scripts
│   └── seedMonsters.js         # Seed Monster Data
│
├── jsconfig.json               # JS Configuration
├── next.config.js              # Next.js Config
├── package.json                # Dependencies
├── postcss.config.js           # PostCSS Config
└── tailwind.config.js          # Tailwind Config
```

---

## 🔐 ระบบหลัก

### 1. **Authentication System**

#### Providers รองรับ:
- ✅ **Email/Password** - ระบบสมัครและเข้าสู่ระบบด้วยอีเมล
- ✅ **Google OAuth** - เข้าสู่ระบบด้วย Google
- ✅ **Facebook OAuth** - เข้าสู่ระบบด้วย Facebook
- ✅ **LINE OAuth** - เข้าสู่ระบบด้วย LINE

#### ความปลอดภัย:
- 🔒 Password Hashing ด้วย bcryptjs
- 🔒 JWT Session Strategy
- 🔒 CSRF Protection
- 🔒 Encrypted API Communication

#### Files:
- `lib/auth.js` - NextAuth Configuration
- `app/api/auth/[...nextauth]/route.js` - Auth Handler
- `app/api/auth/register/route.js` - Registration API
- `app/auth/signin/page.js` - Login UI
- `app/auth/signup/page.js` - Register UI

---

### 2. **Character System**

#### อาชีพ (Classes):
##### ⚔️ **Warrior (นักดาบ)**
```javascript
Base Stats: { STR: 8, VIT: 7, DEX: 4, INT: 2, AGI: 3, LUK: 3 }
Bonuses: { HP: +20, ATK: +5, DEF: +3 }
Starting Weapon: Iron Sword
Skills: Slash, Guard, Power Strike
```

##### 🏹 **Archer (นักธนู)**
```javascript
Base Stats: { DEX: 8, AGI: 7, STR: 4, VIT: 4, INT: 3, LUK: 4 }
Bonuses: { HP: +5, MP: +5, ATK: +4, DEF: +1 }
Starting Weapon: Short Bow
Skills: Quick Shot, Multi Shot, Guard
```

##### 🔮 **Mage (นักเวทย์)**
```javascript
Base Stats: { INT: 8, LUK: 5, AGI: 4, DEX: 3, VIT: 3, STR: 2 }
Bonuses: { MP: +20, ATK: +2 }
Starting Weapon: Wooden Staff
Skills: Fireball, Heal, Guard
```

#### Stat System:
- **STR** (Strength) - โจมตีทางกายภาพ
- **DEX** (Dexterity) - ความแม่นยำ, Critical Rate
- **INT** (Intelligence) - พลังเวทย์, MP
- **VIT** (Vitality) - HP, Defense
- **AGI** (Agility) - ความเร็ว, Evasion
- **LUK** (Luck) - โชค, Critical, Drop Rate

#### Files:
- `lib/game/classes.js` - Class Definitions
- `models/Character.js` - Character Schema
- `app/character/create/page.js` - Character Creation UI
- `app/character/profile/page.js` - Character Profile

---

### 3. **Combat System**

#### Battle Types:
- **Turn-based** - ผลัดกันโจมตี
- **Physical Damage** - ใช้ STR, DEX, Crit
- **Magic Damage** - ใช้ INT, พลังเวทย์
- **Evasion** - หลบหลีกจาก AGI
- **Guard** - ลด damage 40%

#### Damage Calculation:
```javascript
Physical = (ATK + STR * 1.2) * multiplier * crit / armor
Magic = (WPOW + INT * 2.2) * multiplier / resist
Critical = DEX * 0.02 + LUK * 0.01 + gear mods
```

#### Files:
- `lib/game/combat.js` - Combat Calculations
- `lib/game/entities.js` - Entity Management
- `app/components/BattlePage.jsx` - Battle Logic
- `app/components/game/BattleArena.jsx` - Battle UI

---

### 4. **Equipment System**

#### Slot Types:
- **Weapon** - อาวุธ (เพิ่ม ATK, Crit)
- **Armor** - เกราะ (เพิ่ม VIT, Defense)
- **Charm** - เครื่องรางของขลัง (เพิ่ม Stats พิเศษ)

#### Rarity Levels:
- **C (Common)** - 65% drop rate
- **B (Rare)** - 28% drop rate
- **A (Epic)** - 7% drop rate

#### Sample Items:
```javascript
Weapons: Stick, Dagger, Wand, Sword, Blazing Rod
Armors: Cloth Shirt, Leather Vest, Chainmail, Mystic Robe, Iron Plate
Charms: Lucky Clover, Fleet Anklet, Focus Bead, Heart Locket, Assassin Seal
```

#### Files:
- `lib/game/items.js` - Item Database
- `lib/game/gear.js` - Equipment Logic
- `app/components/game/InventoryPanel.jsx` - Inventory UI

---

### 5. **Skill System**

#### Available Skills:
1. **Attack** - Basic physical attack (0 MP)
2. **Quick Strike** - Fast attack with high crit (2 MP)
3. **Power Smash** - Heavy damage (3 MP)
4. **Mind Bolt** - Magic attack (4 MP)
5. **Fire Orb** - Heavy magic attack (6 MP)
6. **Heal** - Restore HP (5 MP)
7. **Guard** - Reduce damage + restore 2 MP (0 MP)

#### Files:
- `lib/game/skills.js` - Skill Definitions

---

### 6. **Dungeon System**

#### Dungeons:
```javascript
1. Sunny Meadow - Levels 1-4 (Boss at Room 4)
2. Ancient Ruins - Levels 3-6 (Boss at Room 4)
```

#### Enemy Types:
- **Normal Enemies:** Slime, Goblin, Wolf, Apprentice Mage, Bandit, Stone Golem
- **Boss:** Orc Chief

#### Files:
- `lib/game/dungeon.js` - Dungeon Config
- `lib/game/enemies.js` - Enemy Spawning

---

### 7. **Monster Management System**

#### Monster Types:
- **normal** - มอนสเตอร์ธรรมดา
- **elite** - มอนสเตอร์แกร่ง
- **boss** - บอส
- **world_boss** - บอสใหญ่

#### Monster Schema:
```javascript
{
  name: String,          // ชื่อภาษาไทย
  nameEn: String,        // ชื่อภาษาอังกฤษ
  icon: String,          // ไอคอน emoji
  type: Enum,            // ประเภท
  level: Number,         // เลเวล
  stats: {
    hp: Number,          // พลังชีวิต
    attack: Number,      // พลังโจมตี
    defense: Number,     // พลังป้องกัน
    speed: Number        // ความเร็ว
  },
  rewards: {
    exp: { min, max },   // EXP ที่ได้
    gold: { min, max },  // Gold ที่ได้
    dropRate: Number     // โอกาสดรอปไอเทม
  }
}
```

#### Files:
- `models/Monster.js` - Monster Schema
- `app/admin/monsters/page.js` - Monster List
- `app/admin/monsters/create/page.js` - Create Monster
- `scripts/seedMonsters.js` - Seed Script

---

## 🗄️ ฐานข้อมูล

### Database: **MongoDB**

### Models:

#### 1. **User Model**
```javascript
{
  name: String,          // ชื่อผู้ใช้
  email: String,         // อีเมล (unique)
  password: String,      // รหัสผ่าน (hashed)
  image: String,         // รูปโปรไฟล์
  emailVerified: Date,   // วันที่ยืนยันอีเมล
  provider: Enum,        // credentials | google | facebook | line
  providerId: String,    // OAuth Provider ID
  timestamps: true       // createdAt, updatedAt
}
```

#### 2. **Character Model**
```javascript
{
  userId: ObjectId,      // ref to User
  name: String,          // ชื่อตัวละคร (max 30)
  class: {               // อาชีพ
    id: String,          // warrior | archer | mage
    name: String,
    nameEn: String,
    icon: String
  },
  level: Number,         // เลเวล (default: 1)
  exp: Number,           // EXP (default: 0)
  expToNext: Number,     // EXP ที่ต้องการเลเวลอัพ
  statPoints: Number,    // คะแนนสถิติที่เหลือ
  stats: {               // สถิติ
    STR, DEX, INT, VIT, AGI, LUK
  },
  equipment: {           // อุปกรณ์
    weapon: Mixed,
    armor: Mixed,
    charm: Mixed
  },
  inventory: [Mixed],    // กระเป๋า
  materials: {           // วัตถุดิบ
    ores: [Mixed],
    crystals: [Mixed],
    essences: [Mixed],
    scrolls: [Mixed]
  },
  dungeonProgress: {     // ความคืบหน้า
    dungeonIndex: Number,
    roomIndex: Number
  },
  gold: Number,          // เงิน
  isActive: Boolean,     // สถานะใช้งาน
  timestamps: true
}
```

#### 3. **Monster Model**
```javascript
{
  name: String,          // ชื่อมอนสเตอร์
  nameEn: String,        // ชื่ออังกฤษ
  icon: String,          // ไอคอน
  description: String,   // คำอธิบาย
  type: Enum,            // normal | elite | boss | world_boss
  level: Number,         // เลเวล
  stats: {
    hp, attack, defense, speed
  },
  rewards: {
    exp: { min, max },
    gold: { min, max },
    dropRate: Number
  },
  isActive: Boolean,     // สถานะใช้งาน
  timestamps: true
}
```

#### 4. **Account Model** (NextAuth)
```javascript
{
  userId: ObjectId,
  type: String,
  provider: String,
  providerAccountId: String,
  access_token: String,
  refresh_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String
}
```

#### 5. **Session Model** (NextAuth)
```javascript
{
  sessionToken: String,
  userId: ObjectId,
  expires: Date
}
```

---

## 🔌 API Endpoints

### Authentication:
```
POST   /api/auth/register        # สมัครสมาชิก
GET    /api/auth/[...nextauth]   # NextAuth endpoints
POST   /api/auth/[...nextauth]   # NextAuth endpoints
```

### Character:
```
GET    /api/character             # ดึงข้อมูลตัวละคร
POST   /api/character             # สร้างตัวละคร
PUT    /api/character             # อัพเดทตัวละคร
DELETE /api/character             # ลบตัวละคร
```

### Monsters:
```
GET    /api/monsters              # ดึงรายการมอนสเตอร์
POST   /api/monsters              # สร้างมอนสเตอร์ (Admin)
GET    /api/monsters/[id]         # ดึงข้อมูลมอนสเตอร์
PUT    /api/monsters/[id]         # แก้ไขมอนสเตอร์ (Admin)
DELETE /api/monsters/[id]         # ลบมอนสเตอร์ (Admin)
POST   /api/monsters/seed         # Seed มอนสเตอร์ (Admin)
```

### Main API Proxy:
```
POST   /api                       # Encrypted API Proxy
```

---

## 🎲 ระบบเกม

### 1. **Stat Calculation**
```javascript
Derived Stats = Base Stats + Gear Modifiers

maxHP = 30 + VIT * 10 + gear.HP
maxMP = 10 + INT * 6 + gear.MP
ATK = 4 + STR * 3 + gear.ATK
SPD = 5 + AGI * 2 + DEX * 0.5 + gear.SPD
CRIT = 0.03 + DEX * 0.02 + LUK * 0.01 + gear.CRIT
EVA = AGI * 0.01 + gear.EVA (max 0.35)
ARMOR = 1 + VIT * 0.04 + gear.ARM
WPOW = 6 + INT * 2.8 + gear.WPOW
```

### 2. **Level System**
- เริ่มที่ Level 1
- EXP to Next Level = Dynamic (เริ่มที่ 20)
- เลเวลอัพได้ Stat Points
- ได้ EXP จากการเอาชนะมอนสเตอร์

### 3. **Loot System**
- Drop Rate ขึ้นอยู่กับมอนสเตอร์
- Rarity: C (65%), B (28%), A (7%)
- Random Item จาก Loot Pool

### 4. **Progression System**
- Story Mode: ผ่าน Dungeons ทีละห้อง
- Free Roam: สุ่มต่อสู้บนแผนที่
- Boss Battles: ห้องพิเศษใน Dungeon

---

## 🔄 Flow การทำงาน

### 1. **User Registration Flow**
```
User ─> Signup Page ─> POST /api/auth/register 
     ─> Create User in MongoDB 
     ─> Auto SignIn 
     ─> Redirect to Home
```

### 2. **Character Creation Flow**
```
User ─> Character Create Page 
     ─> Select Class (Warrior/Archer/Mage)
     ─> Enter Name
     ─> Confirm
     ─> POST /api/character
     ─> Save to MongoDB
     ─> Redirect to Game
```

### 3. **Battle Flow**
```
Start Battle ─> Spawn Enemy (from Dungeon/Map)
            ─> Calculate Turn Order (by SPD)
            ─> Player/Enemy Turn:
               ├─> Select Skill
               ├─> Calculate Damage
               ├─> Apply Damage
               ├─> Check Death
               └─> Switch Turn
            ─> Battle End:
               ├─> Victory: Gain EXP, Gold, Loot
               ├─> Defeat: Return to previous state
               └─> Update Character to MongoDB
```

### 4. **Equipment Flow**
```
Gain Item ─> Add to Inventory
          ─> View Inventory
          ─> Equip Item
          ─> Recalculate Stats
          ─> Update Character
          ─> Save to MongoDB
```

---

## 🔧 Utility Functions

### Math Utilities (`lib/game/math.js`):
- `clamp(value, min, max)` - จำกัดค่า
- `rand(min, max)` - สุ่มทศนิยม
- `irand(min, max)` - สุ่มจำนวนเต็ม
- `chance(probability)` - ตรวจสอบโอกาส
- `calculateDerivedStats()` - คำนวณสถิติ

### API Service (`lib/api.js`):
- Encrypted API Communication
- Methods: `get`, `post`, `put`, `patch`, `delete`
- Auto resolve origin for absolute URLs

### Utils (`lib/utils.js`):
- `encrypt(data)` - เข้ารหัสข้อมูล
- `checkPayload(payload, required)` - ตรวจสอบ payload

---

## 📊 สถิติโปรเจค

### Total Files: ~50+ files
### Total Lines of Code: ~5,000+ lines
### Database Collections: 5 (User, Character, Monster, Account, Session)
### API Endpoints: 10+
### Components: 15+
### Game Mechanics: 7+ systems

---

## 🚀 การใช้งาน

### Development:
```bash
npm run dev      # เริ่ม dev server (port 3000)
npm run build    # Build production
npm start        # เริ่ม production server
npm run lint     # ตรวจสอบ code
npm run seed     # Seed monster data
```

### Environment Variables (.env.local):
```env
# MongoDB
MONGO_URI=mongodb://...
MONGO_DB_NAME=gamerpg

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# OAuth Providers
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
LINE_CLIENT_ID=...
LINE_CLIENT_SECRET=...

# Encryption
ENCRYPTION_SECRET_KEY=...
ENCRYPTION_SECRET_IV=...
```

---

## 📝 สรุป

ระบบ **GameRPG Playground** เป็นเกม RPG ที่มีความสมบูรณ์ ประกอบด้วย:

### ✅ ระบบที่พร้อมใช้งาน:
1. **Authentication** - 4 ช่องทาง (Email, Google, Facebook, LINE)
2. **Character System** - 3 อาชีพพร้อม Stats และ Equipment
3. **Combat System** - Turn-based battles with skills
4. **Dungeon System** - Progressive story mode
5. **Monster Management** - Admin panel พร้อม CRUD
6. **Database Integration** - MongoDB with Mongoose
7. **Encrypted API** - Security layer

### 🎯 จุดเด่น:
- ⚡ Modern Stack (Next.js 14 + React 18)
- 🎨 Beautiful UI (Tailwind CSS)
- 🔐 Secure Authentication (NextAuth.js)
- 📱 Responsive Design
- 🎮 Complete RPG Mechanics
- 💾 Cloud Database (MongoDB)

### 🔮 พัฒนาต่อได้:
- PvP System (ต่อสู้ผู้เล่อง vs ผู้เล่อง)
- Guild System (ระบบกิลด์)
- Crafting System (ระบบคราฟท์)
- Achievement System (ระบบความสำเร็จ)
- Leaderboard (กระดานผู้นำ)
- Real-time Multiplayer

---

**สร้างเมื่อ:** 2025-10-13  
**Version:** 1.0.0  
**Framework:** Next.js 14.2.7

