const psychoService = require('./psychometric.service');

const getQuestions = async (req, res, next) => {
  try {
    const questions = await psychoService.getActiveQuestions();
    res.status(200).json({ success: true, data: questions });
  } catch (error) { next(error); }
};

const submitAnswers = async (req, res, next) => {
  try {
    const result = await psychoService.processAnswers(req.user.id, req.body.answers);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

module.exports = { getQuestions, submitAnswers };