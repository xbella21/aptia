const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    name:        { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    isActive:    { type: Boolean, default: true },
    weights: {
      math:     { type: Number, default: 20, min: 0, max: 100 },
      reading:  { type: Number, default: 20, min: 0, max: 100 },
      sciences: { type: Number, default: 20, min: 0, max: 100 },
      social:   { type: Number, default: 20, min: 0, max: 100 },
      english:  { type: Number, default: 20, min: 0, max: 100 },
    },
    relatedVocationalAreas: [{ type: String }],
  },
  { timestamps: true, versionKey: false }
);

schema.pre('save', function (next) {
  const { math, reading, sciences, social, english } = this.weights;
  const sum = math + reading + sciences + social + english;
  if (sum !== 100) return next(new Error(`Las ponderaciones deben sumar 100. Suma actual: ${sum}`));
  next();
});

module.exports = mongoose.model('AcademicProgram', schema);