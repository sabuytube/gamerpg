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
  statPoints: {
    type: Number,
    default: 0,
    min: 0,
  },
  stats: {
    STR: { type: Number, default: 0 },
    DEX: { type: Number, default: 0 },
    INT: { type: Number, default: 0 },
    VIT: { type: Number, default: 0 },
    AGI: { type: Number, default: 0 },
    LUK: { type: Number, default: 0 },
  },
  // Equipment should reference specific item instances owned by the character
  equipment: {
    weapon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemInstance',
      default: null,
    },
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemInstance',
      default: null,
    },
    body: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemInstance',
      default: null,
    },
    charm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemInstance',
      default: null,
    },
    accessory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemInstance',
      default: null,
    },
    offhand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemInstance',
      default: null,
    },
  },
  // Inventory now stores references to ItemInstance documents (or a quantity for stackable items)
  inventory: {
    type: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemInstance' }, qty: { type: Number, default: 1 } }],
    default: [],
  },
  materials: {
    ores: { type: [mongoose.Schema.Types.Mixed], default: [] }, // แร่
    crystals: { type: [mongoose.Schema.Types.Mixed], default: [] }, // คริสตัล
    essences: { type: [mongoose.Schema.Types.Mixed], default: [] }, // สาระ
    scrolls: { type: [mongoose.Schema.Types.Mixed], default: [] }, // สูตร
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
