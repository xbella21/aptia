const IcfesScore = require('./IcfesScore.model');

const saveScore = async (userId, body) => {
  const { scoreMath, scoreReading, scoreSciences, scoreSocial, scoreEnglish, scoreGlobal } = body;
  const score = await IcfesScore.findOneAndUpdate(
    { userId, confirmed: false },
    { userId, scoreMath, scoreReading, scoreSciences, scoreSocial, scoreEnglish, scoreGlobal, confirmed: false },
    { upsert: true, new: true, runValidators: true }
  );
  return score;
};

const confirmScore = async (userId) => {
  const score = await IcfesScore.findOneAndUpdate(
    { userId, confirmed: false },
    { confirmed: true },
    { new: true }
  );
  if (!score) { const e = new Error('No hay puntaje pendiente de confirmar'); e.statusCode = 404; throw e; }
  return score;
};

const getScoreByUser = async (userId) => {
  const score = await IcfesScore.findOne({ userId }).sort({ createdAt: -1 });
  if (!score) { const e = new Error('No se encontraron puntajes'); e.statusCode = 404; throw e; }
  return score;
};

module.exports = { saveScore, confirmScore, getScoreByUser };