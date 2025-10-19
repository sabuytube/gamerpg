Task: Admin CRUD pages + API + checks (เต็มระบบ)

วัตถุประสงค์
- สร้าง/ตรวจสอบ CRUD ทั้งฝั่งหน้า (admin UI pages) และ backend (app/api/* routes) สำหรับทุกระบบหลักของโปรเจค
- ตรวจสอบการรีเฟรช/รีส (client-side revalidation / server responses) ให้ UX ไม่ค้าง
- เพิ่ม test / smoke checks เล็ก ๆ เพื่อยืนยันความถูกต้อง

สรุปงาน (high-level)
1. ตรวจสอบ resource หลักในโปรเจค
   - monsters, items, map, skills, classes, exp 
   - characters, users, account/session, inventory, itemInstances, monsters seed
2. สำหรับแต่ละ resource สร้าง/ตรวจสอบ:
   - Admin pages:
     - List page: `app/admin/<resource>/page.js` (ตาราง / รายการ)
     - Create page: `app/admin/<resource>/create/page.js` (ฟอร์มสร้าง)
     - Edit page: `app/admin/<resource>/[id]/page.js` (ฟอร์มแก้ไข)
   - API routes (Next.js App router style):
     - `app/api/<resource>/route.js` -> GET list, POST create
     - `app/api/<resource>/<id>/route.js` -> GET by id, PATCH update, DELETE
   - โมดูล service/DB:  และ helper ใน `lib/mongodb.js` หรือ `lib/api.js` เพื่อเรียกใช้งาน
   - Authorization: ตรวจสอบ `lib/auth.js` / next-auth; ให้เฉพาะแอดมินเข้าถึงได้ (middleware หรือเช็กใน route)
   - Validation: ตรวจ input ใน API (ขนาด ฟอร์แมต required fields)

Contract / Acceptance Criteria (สำหรับแต่ละ resource)
- Inputs: JSON payload ตาม model (ตัวอย่างมีใน `api/<resource>/seed`)
- Outputs: JSON { success: boolean, message?: string, error?: string, <resource>: {...} }
- Error modes: validation error (400), not found (404), server error (500), unauthorized (401/403)
- UI: list, create, edit ทำงานได้ (fetch/submit), หลังสร้าง/แก้ไข redirect กลับไปหน้า list และแสดง toast/alert success

ไฟล์ที่ต้องสร้าง/แก้ไข (ตัวอย่างแบบแผน)
- app/admin/<resource>/page.js                # list
- app/admin/<resource>/create/page.js         # create form
- app/admin/<resource>/[id]/page.js           # edit form
- app/api/<resource>/route.js                 # GET list, POST create
- app/api/<resource>/<id>/route.js            # GET by id, PATCH, DELETE
- (ถ้าใช้ services) lib/services/<resource>.js
- tests/admin.<resource>.spec.js (optional)

ตัวอย่าง endpoints (pattern)
- GET  /api/<resource>          -> list (support ?limit=&page=&search=)
- POST /api/<resource>          -> create
- GET  /api/<resource>/:id      -> get single
- PATCH /api/<resource>/:id     -> update
- DELETE /api/<resource>/:id    -> remove

งานละเอียด (per-resource checklist)
- monsters
  - [ ] Verify existing `app/admin/monsters` pages (list/create/edit). If missing, create.
  - [ ] Ensure API: `app/api/monsters/route.js` and `app/api/monsters/[id]/route.js` exist and use `models/Monster.js`.
  - [ ] Ensure seeds and summary endpoints kept (e.g., `api/monsters/seed`).
  - [ ] Validate fields: name, nameEn, icon, type, level, stats, rewards, spawnInfo, isActive
- items
  - [ ] Admin pages for list/create/edit
  - [ ] API endpoints and validation (type, rarity, icon, stats)
  - [ ] Consider ItemInstance vs Item model distinctions (scripts/migrateToItemInstances.js)
- map, skills, classes, exp
  - [ ] Provide create/edit pages where appropriate
  - [ ] API CRUD
- characters
  - [ ] Admin list + view + delete (watch sensitive fields)
- users / accounts
  - [ ] Admin: list, view, change roles, disable/enable
  - [ ] Protect with admin auth
- inventory, iteminstances
  - [ ] Admin view to inspect DB instances

UX: การรีเฟรชข้อมูล (เช็ครีส)
- หลัง POST/PATCH ให้ใช้ router.push หรือ revalidation (if using next/cache) เพื่อรีเฟรชข้อมูล
- ตรวจสอบว่าหน้า list จะดึงข้อมูลใหม่ทันทีหลังการแก้ไข/ลบ (optimistic update optional)

Security / Auth
- ทุก API admin ต้องเช็ก session / role ก่อนยอมรับการกระทำ
- ไม่ส่งข้อมูลลับกลับไปยัง client (เช่น password hashes)

Testing & Quality Gates
- Build & lint: `npm run build` / `npm run lint` (ถ้ามี)
- Smoke test: เรียก API endpoints ด้วย curl/postman หรือ script node
- Unit tests (optional): เพิ่ม 2 tests ต่อ resource (happy path + 1 error)

Dev commands (Windows cmd)
- Install: cd C:\Users\monch\WebstormProjects\gamerpg && npm install
- Run dev: cd C:\Users\monch\WebstormProjects\gamerpg && npm run dev
- Build: cd C:\Users\monch\WebstormProjects\gamerpg && npm run build

Priority & Suggested order
1. monsters, items (core gameplay data)
2. skills, classes, exp, map
3. users/accounts, characters
4. inventories, itemInstances

小 proactive extras (แนะนำเพิ่ม)
- เพิ่ม middleware admin checker (e.g., `lib/middleware/admin.js`)
- เพิ่ม a small `lib/services` wrapper per resource to centralize DB logic
- Add simple UI components for admin table, form fields, and a shared `ConfirmDialog`
- Add seed endpoints checks in admin panel (already existing `app/admin/seed`)

Deliverables จากงานนี้
- `task.md` (ไฟล์นี้)
- ตัวอย่างไฟล์ template สำหรับ 1 resource (ถ้าต้องการ ผมสร้าง template ให้)
- รายการไฟล์ที่จะเพิ่ม/แก้ไข (explicit list) — ให้ผม generate

Next actions (เลือกหนึ่งข้อ)
- A) ผมสร้างตัวอย่าง CRUD สำหรับ resource หนึ่ง (เช่น `items` หรือ `monsters`) ทั้งหน้าและ API (preferred)
- B) ผมสร้าง templates (boilerplate) สำหรับทั้ง repo ที่เหลือให้ dev นำไปใช้
- C) แค่ต้องการไฟล์ task.md นี้และจะลงมือเอง

หากต้องการให้ผมลงมือแก้จริง ๆ ให้ตอบ: "เริ่ม A: resource" (ตัวอย่าง: "เริ่ม A: monsters")


---
ภาษา/คำอธิบายเพิ่มเติม (สั้น)
- ผมจัดเป็นรายการ actionable และไฟล์/endpoint patterns เพื่อให้สามารถ implement แบบเป็นระบบได้ทันที
- ถ้าต้องการ ผมจะสร้างโค้ดตัวอย่างและรันทดสอบ smoke เพื่อยืนยันการทำงานให้ครบ

