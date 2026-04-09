const icfesService = require('./icfes.service');

const saveScore = async (req, res, next) => {
  try {
    const result = await icfesService.saveScore(req.user.id, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

const confirmScore = async (req, res, next) => {
  try {
    const result = await icfesService.confirmScore(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

const getMyScore = async (req, res, next) => {
  try {
    const result = await icfesService.getScoreByUser(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

module.exports = { saveScore, confirmScore, getMyScore };