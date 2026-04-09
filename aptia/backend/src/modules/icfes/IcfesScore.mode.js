const mongoose = require('mongoose');

const score = (max) => ({ type: Number, required: true, min: [0, 'Mínimo 0'], max: [max, `Máximo ${max}`] });

const schema = new mongoose.Schema(
  {
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scoreMath:     score(300),
    scoreReading:  score(300),
    scoreSciences: score(300),
    scoreSocial:   score(300),
    scoreEnglish:  score(300),
    scoreGlobal:   score(500),
    confirmed:     { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('IcfesScore', schema);