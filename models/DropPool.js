import mongoose from 'mongoose';

// A reusable drop pool that can be referenced by monsters or encounters
const PoolEntrySchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  chance: { type: Number, min: 0, max: 1, default: 0.1 },
  weight: { type: Number, default: 1, min: 0 },
  qty: { min: { type: Number, default: 1 }, max: { type: Number, default: 1 } },
  guaranteed: { type: Boolean, default: false },
}, { _id: false });

const DropPoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  entries: { type: [PoolEntrySchema], default: [] },
  // global pool drop rate modifier (applied after monster's base roll if used)
  poolRate: { type: Number, min: 0, max: 1, default: 1 },
  tags: { type: [String], default: [] },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

DropPoolSchema.index({ name: 1 });
DropPoolSchema.index({ tags: 1 });

export default mongoose.models.DropPool || mongoose.model('DropPool', DropPoolSchema);

