import mongoose from 'mongoose';

// An ItemInstance represents a concrete copy/stack of an Item template owned by a user/character
const AffixSchema = new mongoose.Schema({
  key: String,
  value: Number,
  name: String,
}, { _id: false });

const EnchantSchema = new mongoose.Schema({
  id: String,
  level: Number,
  data: mongoose.Schema.Types.Mixed,
}, { _id: false });

const ItemInstanceSchema = new mongoose.Schema({
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  ownerType: { type: String, enum: ['Character', 'User', 'Account'], default: 'Character' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  // For stackable items, qty > 1
  qty: { type: Number, default: 1, min: 1 },
  // binding state: null or one of ['onPickup','onEquip','onUse'] when applied
  boundTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', default: null },
  boundAt: { type: Date, default: null },
  // durability for equippable gear
  durability: { type: Number, default: null },
  durabilityMax: { type: Number, default: null },
  // randomized affixes or stat rolls attached to this instance
  affixes: { type: [AffixSchema], default: [] },
  enchants: { type: [EnchantSchema], default: [] },
  // source metadata: where it came from (drop, craft, purchase)
  source: { type: String, enum: ['drop', 'craft', 'purchase', 'quest', 'admin'], default: 'drop' },
  sourceRef: { type: mongoose.Schema.Types.ObjectId, default: null },
  // if the item expires (temporary buffs, event items)
  expiresAt: { type: Date, default: null },
  // locked flag to prevent selling/trading
  locked: { type: Boolean, default: false },
  // arbitrary JSON metadata for future needs
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  // unique instance id for easy lookup and trading
  instanceId: { type: String, index: true },
}, { timestamps: true });

ItemInstanceSchema.index({ ownerId: 1, ownerType: 1 });
ItemInstanceSchema.index({ template: 1 });

export default mongoose.models.ItemInstance || mongoose.model('ItemInstance', ItemInstanceSchema);

