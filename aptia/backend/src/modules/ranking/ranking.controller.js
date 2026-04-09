const rankingService = require('./ranking.service');

const generate = async (req, res, next) => {
  try {
    const result = await rankingService.generateRanking(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

const getMyRanking = async (req, res, next) => {
  try {
    const result = await rankingService.getRankingByUser(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

module.exports = { generate, getMyRanking };