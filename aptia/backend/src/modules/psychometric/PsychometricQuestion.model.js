const mongoose = require('mongoose');

const AREAS = ['logico_matematica','cientifica','comunicativa','social_liderazgo','creativa','administrativa'];

const schema = new mongoose.Schema(
  {
    statement:    { type: String, required: true, trim: true },
    area:         { type: String, enum: AREAS, required: true },
    displayOrder: { type: Number, required: true, unique: true },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('PsychometricQuestion', schema);