const PsychometricQuestion = require('./PsychometricQuestion.model');
const VocationalProfile    = require('./VocationalProfile.model');

const getActiveQuestions = async () => {
  return await PsychometricQuestion.find({ isActive: true }).sort({ displayOrder: 1 });
};

const processAnswers = async (userId, answers) => {
  const scores = { logico_matematica:0, cientifica:0, comunicativa:0, social_liderazgo:0, creativa:0, administrativa:0 };
  answers.forEach(a => { if (scores[a.area] !== undefined) scores[a.area] += a.value; });
  const total = Object.values(scores).reduce((s, v) => s + v, 0) || 1;
  const percentages = {};
  Object.keys(scores).forEach(k => { percentages[k] = Math.round((scores[k] / total) * 100); });
  const profile = await VocationalProfile.findOneAndUpdate(
    { userId },
    { userId, scores, percentages },
    { upsert: true, new: true }
  );
  return profile;
};

module.exports = { getActiveQuestions, processAnswers };