'use client';

export default function StatSlider({ label, value, onChange, min = 1, max = 10 }) {
  return (
    <label className="grid grid-cols-4 items-center gap-2 text-sm text-gray-600">
      <span>
        {label}: <span className="font-semibold text-gray-800">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="col-span-3"
      />
    </label>
  );
}