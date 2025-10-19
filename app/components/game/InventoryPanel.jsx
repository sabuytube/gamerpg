'use client';

import ItemCard from '@/components/game/ItemCard';

const EQUIPMENT_SLOTS = [
	{ key: 'weapon', label: 'Weapon' },
	{ key: 'armor', label: 'Armor' },
	{ key: 'charm', label: 'Charm' },
];

export default function InventoryPanel({ equipment, inventory, onEquip, onDrop }) {
	return (
		<div className="p-4 rounded-2xl border bg-white shadow-sm space-y-3">
			<div className="text-sm font-semibold">Equipment</div>
			<div className="grid grid-cols-3 gap-2">
				{EQUIPMENT_SLOTS.map(({ key, label }) => {
					const item = equipment[key];
					return (
						<div key={key} className="p-2 rounded-lg bg-slate-50 border min-h-20">
							<div className="text-[10px] text-gray-500 mb-1">{label}</div>
							{item ? (
								<ItemCard item={item} actionLabel="Equipped" />
							) : (
								<div className="text-xs text-gray-400">(empty)</div>
							)}
						</div>
					);
				})}
			</div>

			<div className="text-sm font-semibold mt-2">Inventory ({inventory.length})</div>
			<div className="space-y-2 max-h-64 overflow-auto pr-1">
				{inventory.length === 0 ? (
					<div className="text-xs text-gray-400">No items yet. Clear rooms to get loot.</div>
				) : (
					inventory.map((item, index) => (
						<div key={`${item.id}-${index}`} className="flex items-center gap-2">
							<ItemCard item={item} />
							<button
								type="button"
								onClick={() => onEquip(item)}
								className="text-xs px-2 py-1 rounded border bg-emerald-50 hover:bg-emerald-100"
							>
								Equip
							</button>
							<button
								type="button"
								onClick={() => onDrop(item.id)}
								className="text-xs px-2 py-1 rounded border bg-red-50 hover:bg-red-100"
							>
								Drop
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
}