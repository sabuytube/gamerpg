import mongoose from 'mongoose';

const DropEntrySchema = new mongoose.Schema({
  // reference to the item template that can drop
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  // chance is direct probability 0..1 to drop when roll applies
  chance: { type: Number, min: 0, max: 1, default: 0.1 },
  // weight used for weighted-random selection when using pools
  weight: { type: Number, default: 1, min: 0 },
  // quantity range
  qty: { min: { type: Number, default: 1 }, max: { type: Number, default: 1 } },
  // whether this is a guaranteed drop (bypasses chance)
  guaranteed: { type: Boolean, default: false },
  // optional condition expression (e.g. "playerLevel>10") - stored as string for game logic to interpret
  condition: { type: String, default: null },
}, { _id: false });

const MonsterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'กรุณากรอกชื่อมอนสเตอร์'],
    trim: true,
  },
  nameEn: {
    type: String,
    trim: true,
  },
  icon: {
    type: String,
    default: '👾',
  },
  description: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['normal', 'elite', 'boss', 'world_boss'],
    default: 'normal',
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  stats: {
    hp: { type: Number, default: 100 },
    attack: { type: Number, default: 10 },
    defense: { type: Number, default: 5 },
    speed: { type: Number, default: 5 },
  },
  rewards: {
    exp: {
      min: { type: Number, default: 10 },
      max: { type: Number, default: 20 },
    },
    gold: {
      min: { type: Number, default: 5 },
      max: { type: Number, default: 15 },
    },
    dropRate: {
      type: Number,
      default: 0.3, // base 30% chance to roll drops
      min: 0,
      max: 1,
    },
  },
  // Drop Table - use DropEntry referencing item templates
  dropTable: [DropEntrySchema],
  spawnInfo: {
    respawnTime: {
      type: Number,
      default: 60, // seconds
    },
    location: {
      type: String,
      default: 'dungeon',
    },
    maxSpawn: {
      type: Number,
      default: 1,
    },
  },
  skills: [{ type: String }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
MonsterSchema.index({ type: 1, level: 1 });
MonsterSchema.index({ isActive: 1 });

export default mongoose.models.Monster || mongoose.model('Monster', MonsterSchema);
