const IcfesScore       = require('../icfes/IcfesScore.model');
const AcademicProgram = require('../admin/AcademicProgrma.model');const VocationalProfile = require('../psychometric/VocationalProfile.model');
const AdmissionRanking = require('./AdmissionRanking.model');

const calculateWeighted = (scores, weights) => (
  (scores.scoreMath     * weights.math)     +
  (scores.scoreReading  * weights.reading)  +
  (scores.scoreSciences * weights.sciences) +
  (scores.scoreSocial   * weights.social)   +
  (scores.scoreEnglish  * weights.english)
) / 100;

const getAlignment = (profile, areas) => {
  if (!profile) return 'sin_coincidencia';
  const map = {
    logico_matematica: profile.percentages.logico_matematica,
    cientifica:        profile.percentages.cientifica,
    comunicativa:      profile.percentages.comunicativa,
    social_liderazgo:  profile.percentages.social_liderazgo,
    creativa:          profile.percentages.creativa,
    administrativa:    profile.percentages.administrativa,
  };
  const max = Math.max(...areas.map(a => map[a] || 0));
  if (max >= 60) return 'alta';
  if (max >= 35) return 'parcial';
  return 'sin_coincidencia';
};

const generateRanking = async (userId) => {
  const icfes = await IcfesScore.findOne({ userId, confirmed: true }).sort({ createdAt: -1 });
  if (!icfes) { const e = new Error('Debes confirmar tus puntajes ICFES primero'); e.statusCode = 400; throw e; }
  const profile  = await VocationalProfile.findOne({ userId }).sort({ createdAt: -1 });
  const programs = await AcademicProgram.find({ isActive: true });
  const rankings = programs.map(p => ({
    programId:      p._id,
    programName:    p.name,
    weightedScore:  Math.round(calculateWeighted(icfes, p.weights) * 100) / 100,
    alignmentLevel: getAlignment(profile, p.relatedVocationalAreas),
  })).sort((a, b) => b.weightedScore - a.weightedScore);

  await AdmissionRanking.deleteMany({ userId });
  await AdmissionRanking.insertMany(rankings.map(r => ({
    userId, programId: r.programId, icfesId: icfes._id,
    weightedScore: r.weightedScore, alignmentLevel: r.alignmentLevel,
  })));
  return rankings;
};

const getRankingByUser = async (userId) => {
  return await AdmissionRanking.find({ userId }).populate('programId').sort({ weightedScore: -1 });
};

module.exports = { generateRanking, getRankingByUser };