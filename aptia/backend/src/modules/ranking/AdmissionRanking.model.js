const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    programId:      { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicProgram', required: true },
    icfesId:        { type: mongoose.Schema.Types.ObjectId, ref: 'IcfesScore', required: true },
    weightedScore:  { type: Number, required: true },
    alignmentLevel: { type: String, enum: ['alta', 'parcial', 'sin_coincidencia'], required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('AdmissionRanking', schema);