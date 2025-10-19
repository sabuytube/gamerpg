'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const BATTLE_DATA_KEY = 'mini6rpg_battle_data';

export default function RPGMap() {
    const canvasRef = useRef(null);
    const joystickRef = useRef(null);
    const router = useRouter();
    const [player, setPlayer] = useState({ x: 5, y: 5 });
    const [playerDisplay, setPlayerDisplay] = useState({ x: 5, y: 5 });
    const [monsters, setMonsters] = useState([]);
    const [joystickActive, setJoystickActive] = useState(false);
    const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
    const [canvasSize, setCanvasSize] = useState({ width: 640, height: 480 });
    const lastMoveTimeRef = useRef(0);
    const animationFrameRef = useRef(null);
    const movementLoopRef = useRef(null);
    const monsterMoveIntervalRef = useRef(null);

    const MAP_WIDTH = 20;
    const MAP_HEIGHT = 15;
    const JOYSTICK_MAX_DISTANCE = 50;
    const MOVE_DELAY = 100;
    const LERP_SPEED = 0.25;
    const MONSTER_COUNT = 5;
    const MONSTER_MOVE_DELAY = 800; // Monster เดินช้ากว่าผู้เล่น

    // แผนที่ (0 = พื้นหญ้า, 1 = กำแพง, 2 = น้ำ)
    const map = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];

    // Mock Monster Data
    const monsterTypes = [
        { id: 1, name: 'Slime', emoji: '🟢', hp: 50, attack: 10, defense: 5 },
        { id: 2, name: 'Goblin', emoji: '👺', hp: 80, attack: 15, defense: 8 },
        { id: 3, name: 'Dragon', emoji: '🐉', hp: 150, attack: 30, defense: 20 },
        { id: 4, name: 'Skeleton', emoji: '💀', hp: 70, attack: 12, defense: 6 },
        { id: 5, name: 'Ghost', emoji: '👻', hp: 60, attack: 18, defense: 4 },
        { id: 6, name: 'Zombie', emoji: '🧟', hp: 90, attack: 14, defense: 10 },
        { id: 7, name: 'Demon', emoji: '😈', hp: 120, attack: 25, defense: 15 },
        { id: 8, name: 'Spider', emoji: '🕷️', hp: 40, attack: 8, defense: 3 },
    ];

    // สุ่มตำแหน่งว่าง
    const getRandomEmptyPosition = (excludePositions = []) => {
        let x, y;
        let attempts = 0;
        do {
            x = Math.floor(Math.random() * (MAP_WIDTH - 2)) + 1;
            y = Math.floor(Math.random() * (MAP_HEIGHT - 2)) + 1;
            attempts++;
            if (attempts > 100) break; // ป้องกัน infinite loop
        } while (
            map[y][x] !== 0 ||
            excludePositions.some(pos => pos.x === x && pos.y === y)
            );
        return { x, y };
    };

    // สร้าง Monsters เมื่อเริ่มเกม
    useEffect(() => {
        const initialMonsters = [];
        const excludePositions = [player];

        for (let i = 0; i < MONSTER_COUNT; i++) {
            const position = getRandomEmptyPosition([...excludePositions, ...initialMonsters]);
            const monsterType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];

            initialMonsters.push({
                ...position,
                displayX: position.x,
                displayY: position.y,
                type: monsterType,
                id: `monster-${i}-${Date.now()}`
            });
        }

        setMonsters(initialMonsters);
    }, []);

    // Monster AI - สุ่มเดิน
    useEffect(() => {
        monsterMoveIntervalRef.current = setInterval(() => {
            setMonsters(prevMonsters => {
                return prevMonsters.map(monster => {
                    // สุ่มทิศทาง (-1, 0, 1) สำหรับ x และ y
                    const directions = [-1, 0, 1];
                    const dx = directions[Math.floor(Math.random() * directions.length)];
                    const dy = directions[Math.floor(Math.random() * directions.length)];

                    const newX = monster.x + dx;
                    const newY = monster.y + dy;

                    // ตรวจสอบว่าตำแหน่งใหม่เดินได้ไหม และไม่ซ้อนกับ monster อื่น
                    if (canMove(newX, newY)) {
                        const hasMonster = prevMonsters.some(m =>
                            m.id !== monster.id && m.x === newX && m.y === newY
                        );

                        if (!hasMonster) {
                            return { ...monster, x: newX, y: newY };
                        }
                    }

                    return monster;
                });
            });
        }, MONSTER_MOVE_DELAY);

        return () => {
            if (monsterMoveIntervalRef.current) {
                clearInterval(monsterMoveIntervalRef.current);
            }
        };
    }, []);

    // Smooth monster movement
    useEffect(() => {
        const monsterAnimationId = requestAnimationFrame(function animateMonsters() {
            setMonsters(prevMonsters => {
                return prevMonsters.map(monster => {
                    const newDisplayX = lerp(monster.displayX, monster.x, LERP_SPEED);
                    const newDisplayY = lerp(monster.displayY, monster.y, LERP_SPEED);

                    const distX = Math.abs(monster.x - newDisplayX);
                    const distY = Math.abs(monster.y - newDisplayY);

                    return {
                        ...monster,
                        displayX: distX < 0.01 ? monster.x : newDisplayX,
                        displayY: distY < 0.01 ? monster.y : newDisplayY
                    };
                });
            });

            requestAnimationFrame(animateMonsters);
        });

        return () => cancelAnimationFrame(monsterAnimationId);
    }, []);

    // ปรับขนาด Canvas ตามหน้าจอ
    useEffect(() => {
        const updateCanvasSize = () => {
            const maxWidth = window.innerWidth - 20;
            const maxHeight = window.innerHeight * 0.5;

            const aspectRatio = MAP_WIDTH / MAP_HEIGHT;
            let width = maxWidth;
            let height = width / aspectRatio;

            if (height > maxHeight) {
                height = maxHeight;
                width = height * aspectRatio;
            }

            setCanvasSize({ width: Math.floor(width), height: Math.floor(height) });
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    // Linear Interpolation
    const lerp = (start, end, speed) => {
        return start + (end - start) * speed;
    };

    // Smooth animation loop
    useEffect(() => {
        const animate = () => {
            setPlayerDisplay(prev => {
                const newX = lerp(prev.x, player.x, LERP_SPEED);
                const newY = lerp(prev.y, player.y, LERP_SPEED);

                const distX = Math.abs(player.x - newX);
                const distY = Math.abs(player.y - newY);

                return {
                    x: distX < 0.01 ? player.x : newX,
                    y: distY < 0.01 ? player.y : newY
                };
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [player]);

    // วาดแผนที่
    const drawMap = (ctx) => {
        const tileWidth = canvasSize.width / MAP_WIDTH;
        const tileHeight = canvasSize.height / MAP_HEIGHT;

        ctx.imageSmoothingEnabled = false;

        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                const tile = map[y][x];

                if (tile === 0) {
                    ctx.fillStyle = '#90EE90';
                } else if (tile === 1) {
                    ctx.fillStyle = '#696969';
                } else if (tile === 2) {
                    ctx.fillStyle = '#4169E1';
                }

                ctx.fillRect(
                    Math.floor(x * tileWidth),
                    Math.floor(y * tileHeight),
                    Math.ceil(tileWidth),
                    Math.ceil(tileHeight)
                );
            }
        }
    };

    // วาด Monster
    const drawMonster = (ctx, monster) => {
        const tileWidth = canvasSize.width / MAP_WIDTH;
        const tileHeight = canvasSize.height / MAP_HEIGHT;
        const radius = Math.min(tileWidth, tileHeight) / 3;

        const centerX = monster.displayX * tileWidth + tileWidth / 2;
        const centerY = monster.displayY * tileHeight + tileHeight / 2;

        // วงกลมพื้นหลัง
        ctx.fillStyle = '#8B008B';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // ขอบ
        ctx.strokeStyle = '#4B0082';
        ctx.lineWidth = 2;
        ctx.stroke();

        // วาด Emoji
        ctx.font = `${radius * 1.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(monster.type.emoji, centerX, centerY);
    };

    // วาดตัวละคร
    const drawPlayer = (ctx, x, y) => {
        const tileWidth = canvasSize.width / MAP_WIDTH;
        const tileHeight = canvasSize.height / MAP_HEIGHT;
        const radius = Math.min(tileWidth, tileHeight) / 3;

        const centerX = x * tileWidth + tileWidth / 2;
        const centerY = y * tileHeight + tileHeight / 2;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    };

    // ตรวจสอบว่าเดินได้หรือไม่
    const canMove = (x, y) => {
        if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
        return map[y][x] === 0;
    };

    // ตรวจสอบการชน Monster
    const checkMonsterCollision = (x, y) => {
        return monsters.find(monster => monster.x === x && monster.y === y);
    };

    // เริ่ม Battle กับ Monster
    const startBattleWithMonster = (monster) => {
        // Save battle data to localStorage
        const battleData = {
            source: 'map',
            enemyData: {
                name: monster.type.name,
                emoji: monster.type.emoji,
                level: 1, // หรือจะใช้ระดับตามพื้นที่ก็ได้
                attack: monster.type.attack,
                defense: monster.type.defense,
                hp: monster.type.hp,
            },
        };

        if (typeof window !== 'undefined') {
            localStorage.setItem(BATTLE_DATA_KEY, JSON.stringify(battleData));
        }

        // Navigate to battle page
        router.push('/battle');
    };

    // ฟังก์ชันเดิน
    const tryMove = (joyX, joyY) => {
        const threshold = 15;

        if (Math.abs(joyX) > threshold || Math.abs(joyY) > threshold) {
            setPlayer((prevPlayer) => {
                let dx = 0;
                let dy = 0;

                if (joyX < -threshold) dx = -1;
                else if (joyX > threshold) dx = 1;

                if (joyY < -threshold) dy = -1;
                else if (joyY > threshold) dy = 1;

                const newX = prevPlayer.x + dx;
                const newY = prevPlayer.y + dy;

                // ตรวจสอบการชน Monster
                const hitMonster = checkMonsterCollision(newX, newY);
                if (hitMonster) {
                    startBattleWithMonster(hitMonster);
                    return prevPlayer;
                }

                if (canMove(newX, newY)) {
                    return { x: newX, y: newY };
                }
                return prevPlayer;
            });
        }
    };

    // จัดการ Joystick
    const handleJoystickStart = (e) => {
        e.preventDefault();
        setJoystickActive(true);
        lastMoveTimeRef.current = 0;
    };

    const handleJoystickMove = (e) => {
        if (!joystickActive) return;
        e.preventDefault();

        const joystick = joystickRef.current;
        if (!joystick) return;

        const rect = joystick.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let clientX, clientY;
        if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        let deltaX = clientX - centerX;
        let deltaY = clientY - centerY;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > JOYSTICK_MAX_DISTANCE) {
            deltaX = (deltaX / distance) * JOYSTICK_MAX_DISTANCE;
            deltaY = (deltaY / distance) * JOYSTICK_MAX_DISTANCE;
        }

        setJoystickPosition({ x: deltaX, y: deltaY });
    };

    const handleJoystickEnd = (e) => {
        e.preventDefault();
        setJoystickActive(false);
        setJoystickPosition({ x: 0, y: 0 });
    };

    // Movement loop
    useEffect(() => {
        const moveLoop = (timestamp) => {
            if (!joystickActive) return;

            if (lastMoveTimeRef.current === 0 || timestamp - lastMoveTimeRef.current >= MOVE_DELAY) {
                tryMove(joystickPosition.x, joystickPosition.y);
                lastMoveTimeRef.current = timestamp;
            }

            movementLoopRef.current = requestAnimationFrame(moveLoop);
        };

        if (joystickActive) {
            movementLoopRef.current = requestAnimationFrame(moveLoop);
        }

        return () => {
            if (movementLoopRef.current) {
                cancelAnimationFrame(movementLoopRef.current);
            }
        };
    }, [joystickActive, joystickPosition, monsters]);

    // จัดการคีย์บอร์ด
    useEffect(() => {
        const handleKeyPress = (e) => {
            setPlayer((prevPlayer) => {
                let dx = 0;
                let dy = 0;

                switch(e.key) {
                    case 'ArrowUp': case 'w': case 'W': dy = -1; break;
                    case 'ArrowDown': case 's': case 'S': dy = 1; break;
                    case 'ArrowLeft': case 'a': case 'A': dx = -1; break;
                    case 'ArrowRight': case 'd': case 'D': dx = 1; break;
                    case 'q': case 'Q': dy = -1; dx = -1; break;
                    case 'e': case 'E': dy = -1; dx = 1; break;
                    case 'z': case 'Z': dy = 1; dx = -1; break;
                    case 'c': case 'C': dy = 1; dx = 1; break;
                    default: return prevPlayer;
                }

                const newX = prevPlayer.x + dx;
                const newY = prevPlayer.y + dy;

                // ตรวจสอบการชน Monster
                const hitMonster = checkMonsterCollision(newX, newY);
                if (hitMonster) {
                    startBattleWithMonster(hitMonster);
                    return prevPlayer;
                }

                if (canMove(newX, newY)) {
                    return { x: newX, y: newY };
                }
                return prevPlayer;
            });
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [monsters]);

    // วาด canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawMap(ctx);

        // วาด monsters
        monsters.forEach(monster => {
            drawMonster(ctx, monster);
        });

        // วาด player
        drawPlayer(ctx, playerDisplay.x, playerDisplay.y);
    }, [playerDisplay, monsters, canvasSize]);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1a1a1a',
            touchAction: 'none',
            userSelect: 'none'
        }}>
            {/* Header */}
            <div style={{
                padding: '10px',
                backgroundColor: '#2d2d2d',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
                <h2 style={{
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    margin: '0 0 5px 0',
                    fontWeight: 'bold'
                }}>
                    🎮 RPG Mobile Game
                </h2>
                <p style={{
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    margin: 0,
                    color: '#4CAF50'
                }}>
                    ตำแหน่ง: X: {player.x}, Y: {player.y} | Monsters: {monsters.length}
                </p>
                <p style={{
                    fontSize: 'clamp(10px, 2.5vw, 12px)',
                    margin: '5px 0 0 0',
                    color: joystickActive ? '#FF4444' : '#999'
                }}>
                    {joystickActive ? '🔴 กำลังเดิน...' : '⚪ รอคำสั่ง'}
                </p>
            </div>

            {/* Canvas Container */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                minHeight: 0
            }}>
                <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    style={{
                        border: '2px solid #444',
                        backgroundColor: '#000',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        imageRendering: 'pixelated'
                    }}
                />
            </div>

            {/* Joystick Container */}
            <div style={{
                padding: '20px',
                paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#2d2d2d'
            }}>
                {/* Virtual Joystick */}
                <div
                    ref={joystickRef}
                    onTouchStart={handleJoystickStart}
                    onTouchMove={handleJoystickMove}
                    onTouchEnd={handleJoystickEnd}
                    onTouchCancel={handleJoystickEnd}
                    onMouseDown={handleJoystickStart}
                    onMouseMove={handleJoystickMove}
                    onMouseUp={handleJoystickEnd}
                    onMouseLeave={handleJoystickEnd}
                    style={{
                        position: 'relative',
                        width: 'clamp(140px, 35vw, 180px)',
                        height: 'clamp(140px, 35vw, 180px)',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(100, 100, 100, 0.5)',
                        border: '4px solid rgba(255, 255, 255, 0.5)',
                        touchAction: 'none',
                        userSelect: 'none',
                        cursor: 'pointer',
                        boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.6)'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '16px'
                    }}>↑</div>
                    <div style={{
                        position: 'absolute',
                        bottom: '5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '16px'
                    }}>↓</div>
                    <div style={{
                        position: 'absolute',
                        left: '5px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '16px'
                    }}>←</div>
                    <div style={{
                        position: 'absolute',
                        right: '5px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '16px'
                    }}>→</div>

                    <div style={{
                        position: 'absolute',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }} />

                    <div
                        style={{
                            position: 'absolute',
                            width: 'clamp(60px, 15vw, 80px)',
                            height: 'clamp(60px, 15vw, 80px)',
                            borderRadius: '50%',
                            backgroundColor: joystickActive ? '#FF4444' : '#4CAF50',
                            border: '4px solid white',
                            top: '50%',
                            left: '50%',
                            transform: `translate(calc(-50% + ${joystickPosition.x}px), calc(-50% + ${joystickPosition.y}px))`,
                            transition: joystickActive ? 'none' : 'all 0.2s ease',
                            boxShadow: '0 6px 12px rgba(0,0,0,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'clamp(24px, 6vw, 32px)'
                        }}
                    >
                        🎮
                    </div>
                </div>

                {/* Instructions */}
                <div style={{
                    fontSize: 'clamp(11px, 2.8vw, 13px)',
                    color: '#aaa',
                    textAlign: 'center',
                    lineHeight: '1.6',
                    maxWidth: '300px'
                }}>
                    <p style={{ margin: '4px 0', fontWeight: 'bold' }}>📱 วิธีเล่น:</p>
                    <p style={{ margin: '2px 0' }}>• ลาก Joystick เพื่อเดิน</p>
                    <p style={{ margin: '2px 0' }}>• เดินชน Monster เพื่อต่อสู้!</p>
                    <p style={{ margin: '2px 0' }}>• PC: ใช้ลูกศร, WASD, QEZC</p>
                </div>
            </div>
        </div>
    );
}