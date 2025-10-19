'use client';

export default function GameHeader({ level, xp, xpToNext, dungeonName, roomIndex, totalRooms, onStartRoom }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
      <span className="px-2 py-1 rounded bg-white border shadow-sm">
        Level: <b>{level}</b>
      </span>
      <span className="px-2 py-1 rounded bg-white border shadow-sm">
        XP: <b>{xp}</b> / {xpToNext}
      </span>
      <span className="px-2 py-1 rounded bg-white border shadow-sm">
        Dungeon: <b>{dungeonName}</b> | Room {roomIndex + 1}/{totalRooms}
      </span>
      <button
        type="button"
        onClick={onStartRoom}
        className="ml-auto px-3 py-1.5 rounded-lg bg-purple-600 text-white shadow hover:brightness-110"
      >
        Start/Next Room
      </button>
    </div>
  );
}