'use client';

import StatSlider from '@/components/game/StatSlider';

const STAT_CONFIG = [
	{ key: 'STR', label: 'STR' },
	{ key: 'DEX', label: 'DEX' },
	{ key: 'INT', label: 'INT' },
	{ key: 'VIT', label: 'VIT' },
	{ key: 'AGI', label: 'AGI' },
	{ key: 'LUK', label: 'LUK' },
];

export default function GameBuilder({ stats, onStatChange, derivedPreview, skills }) {
	return (
		<div className="md:col-span-2 p-4 rounded-2xl border bg-white shadow-sm flex flex-col gap-4">
			<div className="text-sm font-semibold">Hero Builder</div>
			{STAT_CONFIG.map(({ key, label }) => (
				<StatSlider
					key={key}
					label={label}
					value={stats[key]}
					onChange={(value) => onStatChange(key, value)}
				/>
			))}

			<div className="grid grid-cols-2 gap-4 text-sm">
				<div className="p-3 rounded-xl bg-slate-50 border">
					<div className="font-semibold mb-2">Derived (preview)</div>
					<div className="space-y-1">
						<div>HP: {derivedPreview.maxHP}</div>
						<div>MP: {derivedPreview.maxMP}</div>
						<div>ATK: {Math.round(derivedPreview.atk)}</div>
						<div>SPD: {derivedPreview.spd.toFixed(1)}</div>
						<div>CRIT: {(derivedPreview.crit * 100).toFixed(0)}%</div>
						<div>EVA: {(derivedPreview.evade * 100).toFixed(0)}%</div>
						<div>ARM: {derivedPreview.armor.toFixed(2)}</div>
					</div>
				</div>
				<div className="p-3 rounded-xl bg-slate-50 border">
					<div className="font-semibold mb-2">Skills</div>
					<ul className="list-disc list-inside space-y-1">
						{skills.map((skill) => (
							<li key={skill.id}>
								<span className="font-semibold">{skill.name}</span> - MP {skill.mp}.{' '}
								<span className="text-gray-600">{skill.desc}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}