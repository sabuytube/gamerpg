'use client';
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api';

const BATTLE_DATA_KEY = 'mini6rpg_battle_data';

/** ===== Game Tunables ===== **/
const GRID_W = 22;
const GRID_H = 14;
const TILE = 48;                    // world tile size (คงที่)
const MOVE_DELAY = 140;             // จังหวะก้าวเดินของผู้เล่น (ms)
const MONSTER_REST_MIN = 700;       // พักต่ำสุดของมอนสเตอร์ (ms)
const MONSTER_REST_MAX = 1800;      // พักสูงสุดของมอนสเตอร์ (ms)
const MONSTER_IDLE_CHANCE = 0.45;   // โอกาสที่มอนสเตอร์จะ "ไม่เดิน" ต่อรอบ
const MAX_MONSTERS = 10;

const TILE_TYPE = { GRASS: 0, WALL: 1, WATER: 2, ROCK: 3 };

/** ===== Map Gen / Utils ===== **/
function generateMap() {
    const map = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(TILE_TYPE.GRASS));
    for (let x = 0; x < GRID_W; x++) { map[0][x] = TILE_TYPE.WALL; map[GRID_H-1][x] = TILE_TYPE.WALL; }
    for (let y = 0; y < GRID_H; y++) { map[y][0] = TILE_TYPE.WALL; map[y][GRID_W-1] = TILE_TYPE.WALL; }

    // meandering river
    let ry = Math.floor(GRID_H * 0.3);
    for (let x = 2; x < GRID_W - 2; x++) {
        map[ry][x] = TILE_TYPE.WATER;
        if (Math.random() < 0.4 && ry + 1 < GRID_H - 2) map[ry + 1][x] = TILE_TYPE.WATER;
        if (Math.random() < 0.4 && ry - 1 > 1)        map[ry - 1][x] = TILE_TYPE.WATER;
        ry += Math.random() < 0.5 ? 0 : (Math.random() < 0.5 ? 1 : -1);
        ry = Math.max(2, Math.min(GRID_H - 3, ry));
    }

    // rocks/walls sprinkled
    const rocks = Math.floor((GRID_W * GRID_H) * 0.08);
    for (let i = 0; i < rocks; i++) {
        const rx = 2 + Math.floor(Math.random() * (GRID_W - 4));
        const ry2 = 2 + Math.floor(Math.random() * (GRID_H - 4));
        const t = Math.random() < 0.6 ? TILE_TYPE.ROCK : TILE_TYPE.WALL;
        if (map[ry2][rx] === TILE_TYPE.GRASS) map[ry2][rx] = t;
    }
    return map;
}
function colorForTile(t) {
    switch (t) {
        case TILE_TYPE.GRASS: return 0x2A9D8F; // tealish grass
        case TILE_TYPE.WALL:  return 0x6B7280; // slate
        case TILE_TYPE.WATER: return 0x2563EB; // blue
        case TILE_TYPE.ROCK:  return 0x374151; // gray
        default: return 0x000000;
    }
}
function isWalkable(map, x, y) {
    if (x < 0 || y < 0 || x >= GRID_W || y >= GRID_H) return false;
    return map[y][x] === TILE_TYPE.GRASS;
}
function randEmpty(map, exclude = []) {
    let x, y, i = 0;
    do {
        x = 1 + Math.floor(Math.random() * (GRID_W - 2));
        y = 1 + Math.floor(Math.random() * (GRID_H - 2));
        i++;
        if (i > 500) break;
    } while (!isWalkable(map, x, y) || exclude.some(p => p.x === x && p.y === y));
    return { x, y };
}

/** ===== Scene Factory ===== **/
function makeScene({ fetchMonsters, onEnterBattle }) {
    return class MapScene extends Phaser.Scene {
        constructor() {
            super('map');
            this.map = generateMap();
            this.player = { x: 3, y: 3 };
            this.playerNode = null;
            this.playerAura = null;
            this.monsters = []; // {grid, body, aura, label, name, data, timer}
            this.ui = {};
            this.joy = { active: false, sx: 0, sy: 0, dx: 0, dy: 0, bg: null, knob: null };
        }

        /** ให้ React เรียกเพื่อ fit ภาพลง container โดยใช้ camera zoom (ไม่ resize world) */
        fitToContainer(pw, ph) {
            const worldW = GRID_W * TILE;
            const worldH = GRID_H * TILE;
            const zoom = Math.max(1, Math.floor(Math.min(pw / worldW, ph / worldH) * 100) / 100);
            const cam = this.cameras.main;
            cam.setZoom(zoom);
            // center ในกรอบ
            const viewW = worldW * zoom;
            const viewH = worldH * zoom;
            const offX = Math.max(0, (pw - viewW) / 2) / zoom;
            const offY = Math.max(0, (ph - viewH) / 2) / zoom;
            cam.setScroll(-offX, -offY);
        }

        create() {
            const W = GRID_W * TILE;
            const H = GRID_H * TILE;

            this.cameras.main.setBackgroundColor('#0B1021');
            this.cameras.main.roundPixels = true;   // กันพิกเซลกระพริบ
            this.cameras.main.setScroll(0, 0);

            // draw map (Graphics)
            const g = this.add.graphics();
            for (let y = 0; y < GRID_H; y++) {
                for (let x = 0; x < GRID_W; x++) {
                    g.fillStyle(colorForTile(this.map[y][x]), 1);
                    g.fillRect(x * TILE, y * TILE, TILE, TILE);
                }
            }
            g.lineStyle(1, 0x0f172a, 0.5);
            for (let y = 0; y <= GRID_H; y++) g.strokeLineShape(new Phaser.Geom.Line(0, y*TILE, W, y*TILE));
            for (let x = 0; x <= GRID_W; x++) g.strokeLineShape(new Phaser.Geom.Line(x*TILE, 0, x*TILE, H));

            // spawn player
            const ppos = randEmpty(this.map);
            this.player.x = ppos.x; this.player.y = ppos.y;
            const px = ppos.x*TILE + TILE/2;
            const py = ppos.y*TILE + TILE/2;
            this.playerNode = this.add.circle(px, py, TILE*0.32, 0xEF4444).setStrokeStyle(4, 0xB91C1C);
            this.playerAura = this.add.circle(px, py, TILE*0.58, 0xEF4444, 0.15);

            // HUD
            this.buildHUD(); this.updateHUD();

            // keyboard
            this.keys = this.input.keyboard.addKeys({
                up:'UP', down:'DOWN', left:'LEFT', right:'RIGHT',
                w:'W', a:'A', s:'S', d:'D', q:'Q', e:'E', z:'Z', c:'C'
            });

            // virtual joystick (touch anywhere)
            this.input.on('pointerdown', (p) => { this.joy.active = true; this.joy.sx = p.x; this.joy.sy = p.y; this.joy.dx = 0; this.joy.dy = 0; this.drawJoystick(true); });
            this.input.on('pointerup',   ()  => { this.joy.active = false; this.joy.dx = 0; this.joy.dy = 0; this.drawJoystick(false); });
            this.input.on('pointermove', (p) => { if (!this.joy.active) return; this.joy.dx = p.x - this.joy.sx; this.joy.dy = p.y - this.joy.sy; this.drawJoystick(true); });

            // player step loop
            this.time.addEvent({ delay: MOVE_DELAY, loop: true, callback: () => this.stepPlayer() });

            // load monsters then schedule “walk-rest”
            (async () => {
                let data = [];
                try {
                    const res = await fetchMonsters();
                    data = Array.isArray(res?.monsters) ? res.monsters : [];
                } catch (e) { data = []; }
                this.spawnMonsters(data);
                this.startMonsterSchedulers();
                this.updateHUD();
            })();

            // clean timers on shutdown
            this.events.on('shutdown', () => this.cleanupMonsterTimers());
            this.events.on('destroy',  () => this.cleanupMonsterTimers());
        }

        buildHUD() {
            const bar = this.add.rectangle(0, 0, GRID_W*TILE, 48, 0x111827, 1).setOrigin(0,0).setAlpha(0.95).setStrokeStyle(1, 0x1f2937, 1);
            const title = this.add.text(16, 12, '🌲 Verdant Crossing', { fontSize: '16px', color: '#93c5fd' });
            const coords = this.add.text(260, 12, '', { fontSize: '14px', color: '#e5e7eb' });
            const mobs   = this.add.text(430, 12, '', { fontSize: '14px', color: '#c4b5fd' });
            // HUD จะถูกซูมตามกล้อง; หากอยาก “ไม่ซูม” ให้ย้ายไปใช้ DOM overlay นอก Phaser
            this.ui = { bar, title, coords, mobs };
        }
        updateHUD() {
            if (!this.ui.coords || !this.ui.mobs) return;
            this.ui.coords.setText(`📍 (${this.player.x}, ${this.player.y})`);
            this.ui.mobs.setText(`👾 ${this.monsters.length} mobs`);
        }

        drawJoystick(show) {
            if (this.joy.bg) { this.joy.bg.destroy(); this.joy.knob?.destroy(); this.joy.bg = null; this.joy.knob = null; }
            if (!show) return;
            const r = 70;
            this.joy.bg = this.add.circle(this.joy.sx, this.joy.sy, r, 0x6D28D9, 0.12).setStrokeStyle(3, 0x8B5CF6, 0.4);
            const dist = Math.min(r, Math.hypot(this.joy.dx, this.joy.dy));
            const ang = Math.atan2(this.joy.dy, this.joy.dx);
            const kx = this.joy.sx + Math.cos(ang) * dist;
            const ky = this.joy.sy + Math.sin(ang) * dist;
            this.joy.knob = this.add.circle(kx, ky, 26, 0x8B5CF6, 0.9).setStrokeStyle(3, 0xFFFFFF, 0.9);
        }

        spawnMonsters(apiMonsters) {
            const placeholders = [
                { _id: 'slime',   name:'Slime',   nameEn:'Slime',   icon:'🟢', level:1,  type:'normal', stats:{hp:30, attack:6,  defense:2,  speed:5 } },
                { _id: 'goblin',  name:'Goblin',  nameEn:'Goblin',  icon:'👺', level:3,  type:'elite',  stats:{hp:60, attack:12, defense:6,  speed:7 } },
                { _id: 'dragon',  name:'Dragon',  nameEn:'Dragon',  icon:'🐉', level:10, type:'boss',   stats:{hp:220,attack:28, defense:18, speed:8 } },
                { _id: 'ghost',   name:'Ghost',   nameEn:'Ghost',   icon:'👻', level:4,  type:'normal', stats:{hp:40, attack:10, defense:4,  speed:12} },
            ];
            const pool = apiMonsters.length ? apiMonsters : placeholders;
            const taken = [{ x: this.player.x, y: this.player.y }];
            const count = Math.min(MAX_MONSTERS, pool.length * 2);

            for (let i = 0; i < count; i++) {
                const pos = randEmpty(this.map, taken); taken.push(pos);
                const raw = pool[Math.floor(Math.random() * pool.length)];
                const auraColor = (raw.type === 'boss' || raw.type === 'world_boss') ? 0xDC2626
                    : raw.type === 'elite' ? 0xF59E0B
                        : 0xA855F7;

                const cx = pos.x*TILE + TILE/2;
                const cy = pos.y*TILE + TILE/2;

                const body = this.add.circle(cx, cy, TILE*0.3, auraColor, 0.95).setStrokeStyle(3, (raw.type === 'boss' ? 0x991B1B : 0x7C3AED));
                const aura = this.add.circle(cx, cy, TILE*0.5, auraColor, 0.15);
                const label = this.add.text(cx, cy, raw.icon || '👾', { fontSize: `${Math.floor(TILE*0.6)}px` }).setOrigin(0.5);
                const name  = this.add.text(cx, cy + TILE*0.55, raw.name || 'Monster', { fontSize: '12px', color:'#fff', stroke:'#000', strokeThickness:3 }).setOrigin(0.5);

                this.monsters.push({ grid:{x:pos.x, y:pos.y}, body, aura, label, name, data: raw, timer: null });
            }
        }

        startMonsterSchedulers() {
            this.monsters.forEach((m, i) => {
                this.time.delayedCall(Phaser.Math.Between(100, 600) + i*30, () => this.scheduleMonster(m));
            });
        }
        scheduleMonster(m) {
            const rest = Phaser.Math.Between(MONSTER_REST_MIN, MONSTER_REST_MAX);
            if (m.timer) m.timer.remove(false);
            m.timer = this.time.delayedCall(rest, () => {
                this.tryMoveMonster(m);
                this.scheduleMonster(m);
            });
        }
        tryMoveMonster(m) {
            if (Math.random() < MONSTER_IDLE_CHANCE) return;
            const dirs = [
                {dx: 1, dy: 0}, {dx:-1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy:-1},
                {dx: 1, dy: 1}, {dx: 1, dy:-1}, {dx:-1, dy: 1}, {dx:-1, dy:-1},
            ];
            Phaser.Utils.Array.Shuffle(dirs);
            for (const d of dirs) {
                const nx = m.grid.x + d.dx, ny = m.grid.y + d.dy;
                if (!isWalkable(this.map, nx, ny)) continue;
                if (this.monsters.some(o => o !== m && o.grid.x === nx && o.grid.y === ny)) continue;

                m.grid.x = nx; m.grid.y = ny;
                const tx = nx*TILE + TILE/2, ty = ny*TILE + TILE/2;
                const dur = Phaser.Math.Between(120, 200);
                this.tweens.add({ targets:[m.body, m.aura, m.label, m.name], x:tx, y:ty, duration:dur, ease:'Quad.easeOut' });
                break;
            }
        }
        cleanupMonsterTimers() {
            this.monsters.forEach(m => { if (m.timer) { m.timer.remove(false); m.timer = null; } });
        }

        stepPlayer() {
            let dx = 0, dy = 0;
            const isDown = k => k && k.isDown;
            if (isDown(this.keys.up) || isDown(this.keys.w)) dy = -1;
            else if (isDown(this.keys.down) || isDown(this.keys.s)) dy = 1;
            if (isDown(this.keys.left) || isDown(this.keys.a)) dx = -1;
            else if (isDown(this.keys.right) || isDown(this.keys.d)) dx = 1;
            if (isDown(this.keys.q)) { dx = -1; dy = -1; }
            if (isDown(this.keys.e)) { dx =  1; dy = -1; }
            if (isDown(this.keys.z)) { dx = -1; dy =  1; }
            if (isDown(this.keys.c)) { dx =  1; dy =  1; }

            // virtual joystick with threshold
            if (dx === 0 && dy === 0 && this.joy.active) {
                const TH = 18;
                if (Math.abs(this.joy.dx) > TH) dx = this.joy.dx < 0 ? -1 : 1;
                if (Math.abs(this.joy.dy) > TH) dy = this.joy.dy < 0 ? -1 : 1;
            }
            if (dx === 0 && dy === 0) return;

            const nx = this.player.x + dx, ny = this.player.y + dy;
            const hit = this.monsters.find(m => m.grid.x === nx && m.grid.y === ny);
            if (hit) { this.enterBattle(hit); return; }

            if (isWalkable(this.map, nx, ny)) {
                this.player.x = nx; this.player.y = ny;
                const tx = nx*TILE + TILE/2, ty = ny*TILE + TILE/2;
                this.tweens.add({ targets:[this.playerNode, this.playerAura], x:tx, y:ty, duration:MOVE_DELAY, ease:'Quad.easeOut' });
                this.updateHUD();
            }
        }

        enterBattle(mon) {
            const m = mon.data;
            const battleData = {
                source: 'map',
                enemyData: {
                    id: m._id, name: m.name, nameEn: m.nameEn,
                    icon: m.icon || '👾', level: m.level,
                    hp: m.stats?.hp, attack: m.stats?.attack, defense: m.stats?.defense, speed: m.stats?.speed,
                    type: m.type, rewards: m.rewards, dropTable: m.dropTable || [],
                },
            };
            onEnterBattle(battleData);
        }
    };
}

/** ===== React Component ===== **/
export default function RPGPhaser() {
    const mountRef = useRef(null);
    const gameRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (!mountRef.current) return;

        const fetchMonsters = async () => {
            return await apiService.get('monsters', { isActive: 'true' });
        };
        const onEnterBattle = (battleData) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem(BATTLE_DATA_KEY, JSON.stringify(battleData));
            }
            router.push('/battle');
        };

        const MapScene = makeScene({ fetchMonsters, onEnterBattle });

        const config = {
            type: Phaser.AUTO,
            parent: mountRef.current,
            backgroundColor: '#0B1021',
            width: GRID_W * TILE,             // world size (fixed)
            height: GRID_H * TILE,
            pixelArt: true,
            render: { antialias: false, pixelArt: true, roundPixels: true },
            scene: [MapScene],
            physics: { default: 'arcade', arcade: { debug: false } },
            scale: { mode: Phaser.Scale.NONE }, // ไม่ใช้ FIT เพื่อกันเด้ง
        };

        gameRef.current = new Phaser.Game(config);

        // fit camera zoom ให้พอดีกับ container — ไม่มีเด้ง/สั่น
        const fit = () => {
            const scene = gameRef.current?.scene?.getScene('map');
            const parent = mountRef.current;
            if (!scene || !parent) return;
            const pw = parent.clientWidth || window.innerWidth;
            const ph = parent.clientHeight || Math.floor(window.innerHeight * 0.66);
            scene.fitToContainer(pw, ph);
        };
        const onResize = () => requestAnimationFrame(fit);
        window.addEventListener('resize', onResize);
        // รอบแรก
        setTimeout(fit, 0);

        return () => {
            window.removeEventListener('resize', onResize);
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div style={{ width:'100vw', height:'100vh', display:'flex', flexDirection:'column', background:'#0b1021' }}>
            <div style={{ padding:10, color:'#E5E7EB', textAlign:'center', background:'#0f172a', borderBottom:'1px solid #1f2937' }}>
                <strong>🎮 Mini-6 RPG — Phaser Edition</strong>
                <div style={{ fontSize:12, opacity:.8 }}>
                    แตะหน้าจอเพื่อใช้จอยเสมือน • ปุ่ม: WASD / ↑↓←→ / Q,E,Z,C
                </div>
            </div>
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:10 }}>
                {/* container จริง: world fixed, ใช้ camera zoom fit ลงพื้นที่นี้ */}
                <div
                    ref={mountRef}
                    style={{
                        width:'min(100%, 1100px)',
                        height:'min(66vh, 720px)',
                        border:'2px solid #1f2937',
                        borderRadius:12,
                        overflow:'hidden',
                        boxShadow:'0 10px 30px rgba(0,0,0,.35)',
                        background:'#000'
                    }}
                />
            </div>
        </div>
    );
}
