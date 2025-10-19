import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // type is the broad category of the item (template)
    type: {
      type: String,
      required: true,
      enum: ['weapon', 'armor', 'charm', 'consumable', 'material', 'key', 'quest'],
    },
    // slot is where the item can be equipped (if applicable)
    slot: {
      type: String,
      required: false,
      enum: ['weapon', 'head', 'body', 'charm', 'accessory', 'offhand', 'none'],
      default: 'none',
    },
    rarity: {
      type: String,
      required: true,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
      default: 'common',
    },
    description: {
      type: String,
      default: '',
    },
    // base stats / modifiers for the template (e.g. +5 STR, +10 HP)
    stats: {
      type: Map,
      of: Number,
      default: {},
    },
    icon: {
      type: String,
      default: '📦',
    },
    level: {
      // recommended level / item level
      type: Number,
      default: 1,
      min: 1,
    },
    price: {
      type: Number,
      default: 0,
    },
    sellPrice: {
      type: Number,
      default: 0,
    },
    // stacking rules for consumables/materials
    stackable: {
      type: Boolean,
      default: false,
    },
    maxStack: {
      type: Number,
      default: 1,
    },
    // class restriction(s) - empty or ['all'] means usable by all
    allowedClasses: {
      type: [String],
      enum: ['warrior', 'archer', 'mage', 'all'],
      default: ['all'],
    },
    // binding and trade rules
    bindType: {
      type: String,
      enum: ['none', 'onPickup', 'onEquip', 'onUse'],
      default: 'none',
    },
    tradable: {
      type: Boolean,
      default: true,
    },
    // durability for equippable gear
    durabilityMax: {
      type: Number,
      default: null,
    },
    // crafting / material requirements (template references)
    craftIngredients: {
      type: [{ item: mongoose.Schema.Types.ObjectId, qty: Number }],
      default: [],
    },
    // pool weight for loot table selection (optional)
    baseDropWeight: {
      type: Number,
      default: 1,
      min: 0,
    },
    // optional tags for filtering
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
ItemSchema.index({ type: 1, rarity: 1 });
ItemSchema.index({ name: 1 });
ItemSchema.index({ allowedClasses: 1 });

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
