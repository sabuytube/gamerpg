import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'กรุณากรอกชื่อ'],
  },
  email: {
    type: String,
    required: [true, 'กรุณากรอกอีเมล'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.provider || this.provider === 'credentials';
    },
  },
  image: {
    type: String,
    default: null,
  },
  emailVerified: {
    type: Date,
    default: null,
  },
  provider: {
    type: String,
    enum: ['credentials', 'google', 'facebook', 'line'],
    default: 'credentials',
  },
  providerId: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
