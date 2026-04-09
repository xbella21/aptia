const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scores: {
      logico_matematica: { type: Number, default: 0 },
      cientifica:        { type: Number, default: 0 },
      comunicativa:      { type: Number, default: 0 },
      social_liderazgo:  { type: Number, default: 0 },
      creativa:          { type: Number, default: 0 },
      administrativa:    { type: Number, default: 0 },
    },
    percentages: {
      logico_matematica: { type: Number, default: 0 },
      cientifica:        { type: Number, default: 0 },
      comunicativa:      { type: Number, default: 0 },
      social_liderazgo:  { type: Number, default: 0 },
      creativa:          { type: Number, default: 0 },
      administrativa:    { type: Number, default: 0 },
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('VocationalProfile', schema);