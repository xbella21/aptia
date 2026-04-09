const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName:     { type: String, required: [true, 'El nombre es obligatorio'], trim: true, maxlength: 150 },
    email:        { type: String, required: [true, 'El email es obligatorio'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Email inválido'] },
    documentId:   { type: String, required: [true, 'El documento es obligatorio'], unique: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role:         { type: String, enum: ['aspirante', 'admin'], default: 'aspirante' },
    municipality: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('User', userSchema);