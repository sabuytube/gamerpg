import mongoose from 'mongoose';

const CharacterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'กรุณากรอกชื่อตัวละคร'],
    trim: true,
    maxLength: [30, 'ชื่อตัวละครต้องไม่เกิน 30 ตัวอักษร'],
  },
  class: {
    id: {
      type: String,
      required: true,
      enum: ['warrior', 'archer', 'mage'],
    },
    name: String,
    nameEn: String,
    icon: String,
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
  },
  exp: {
    type: Number,
    default: 0,
    min: 0,
  },
  expToNext: {
    type: Number,
    default: 20,
  },
  stats: {
    STR: { type: Number, default: 0 },
    DEX: { type: Number, default: 0 },
    INT: { type: Number, default: 0 },
    VIT: { type: Number, default: 0 },
    AGI: { type: Number, default: 0 },
    LUK: { type: Number, default: 0 },
  },
  equipment: {
    weapon: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    armor: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    charm: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  inventory: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  dungeonProgress: {
    dungeonIndex: {
      type: Number,
      default: 0,
    },
    roomIndex: {
      type: Number,
      default: 0,
    },
  },
  gold: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
CharacterSchema.index({ userId: 1, isActive: 1 });
CharacterSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Character || mongoose.model('Character', CharacterSchema);

