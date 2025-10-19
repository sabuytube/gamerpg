import mongoose from 'mongoose';

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
      default: 0.3, // 30% โอกาสดรอปไอเทม
      min: 0,
      max: 1,
    },
  },
  spawnInfo: {
    respawnTime: {
      type: Number,
      default: 60, // วินาที
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
  skills: [{
    type: String,
  }],
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

