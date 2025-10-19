import { spawnEnemyForRoom } from './enemies';

export const DUNGEONS = [
  {
    id: 'meadow',
    name: 'Sunny Meadow',
    rooms: [{ lvl: 1 }, { lvl: 2 }, { lvl: 3, boss: false }, { lvl: 4, boss: true }],
  },
  {
    id: 'ruins',
    name: 'Ancient Ruins',
    rooms: [{ lvl: 3 }, { lvl: 4 }, { lvl: 5 }, { lvl: 6, boss: true }],
  },
];

export const pickEnemyForRoom = (room) => spawnEnemyForRoom(room);