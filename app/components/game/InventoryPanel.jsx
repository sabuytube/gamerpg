'use client';

const EQUIPMENT_SLOTS = [
	{ key: 'weapon', label: 'Weapon', icon: '🗡️' },
	{ key: 'armor', label: 'Armor', icon: '🛡️' },
	{ key: 'charm', label: 'Charm', icon: '✨' },
];

export default function InventoryPanel({ equipment, inventory, onEquip, onDrop }) {
	const handleEquip = (item) => {
		if (!item.slot) {
			console.error('Item missing slot property:', item);
			return;
		}
		onEquip(item);
	};

	const handleDrop = (item) => {
		onDrop(item);
	};

	return (
		<div className="p-4 rounded-2xl border bg-white shadow-sm space-y-3">
			<div className="text-sm font-semibold">⚔️ Equipment</div>
			<div className="grid grid-cols-3 gap-2">
				{EQUIPMENT_SLOTS.map(({ key, label, icon }) => {
					const item = equipment[key];
					return (
						<div key={key} className="p-2 rounded-lg bg-slate-50 border min-h-20">
							<div className="text-[10px] text-gray-500 mb-1 flex items-center gap-1">
								<span>{icon}</span>
								<span>{label}</span>
							</div>
							{item ? (
								<div className="text-xs">
									<div className="font-semibold text-gray-800 truncate">{item.name}</div>
									<div className={`text-[10px] mt-0.5 ${
										item.rarity === 'legendary' ? 'text-orange-500' :
										item.rarity === 'epic' ? 'text-purple-500' :
										item.rarity === 'rare' ? 'text-blue-500' :
										'text-gray-500'
									}`}>
										⭐ {item.rarity}
									</div>
								</div>
							) : (
								<div className="text-xs text-gray-400">(empty)</div>
							)}
						</div>
					);
				})}
			</div>

			<div className="text-sm font-semibold mt-4">🎒 Inventory ({inventory.length})</div>
			<div className="space-y-2 max-h-64 overflow-auto pr-1">
				{inventory.length === 0 ? (
					<div className="text-xs text-gray-400 p-4 text-center bg-slate-50 rounded-lg">
						ไม่มีไอเทม<br/>
						เคลียร์ดันเจี้ยนเพื่อรับของรางวัล
					</div>
				) : (
					inventory.map((item, index) => (
						<div key={`${item.name}-${item.slot}-${index}`} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border hover:border-purple-300 transition-colors">
							<div className="flex-1 min-w-0">
								<div className="text-sm font-semibold text-gray-800 truncate">{item.name}</div>
								<div className="flex items-center gap-2 text-xs text-gray-600">
									<span className={
										item.rarity === 'legendary' ? 'text-orange-500 font-semibold' :
										item.rarity === 'epic' ? 'text-purple-500 font-semibold' :
										item.rarity === 'rare' ? 'text-blue-500 font-semibold' :
										'text-gray-500'
									}>
										⭐ {item.rarity}
									</span>
									<span className="text-gray-400">•</span>
									<span className="capitalize">{item.slot}</span>
								</div>
							</div>
							<div className="flex gap-1 flex-shrink-0">
								<button
									type="button"
									onClick={() => handleEquip(item)}
									className="text-xs px-3 py-1.5 rounded-md border bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300 hover:border-emerald-400 transition-colors font-medium"
								>
									สวม
								</button>
								<button
									type="button"
									onClick={() => handleDrop(item)}
									className="text-xs px-3 py-1.5 rounded-md border bg-red-50 hover:bg-red-100 text-red-700 border-red-300 hover:border-red-400 transition-colors font-medium"
								>
									ทิ้ง
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}