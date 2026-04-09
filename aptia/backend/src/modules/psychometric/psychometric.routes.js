const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const h = req.headers['authorization'];
    if (!h?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'No autorizado' });
    req.user = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ success: false, message: 'Token inválido' }); }
};

router.get('/questions', auth, async (req, res, next) => {
  try { const s = require('./psychometric.service'); res.status(200).json({ success: true, data: await s.getActiveQuestions() }); } catch(e){next(e);}
});
router.post('/submit',   auth, async (req, res, next) => {
  try { const s = require('./psychometric.service'); res.status(201).json({ success: true, data: await s.processAnswers(req.user.id, req.body.answers) }); } catch(e){next(e);}
});

module.exports = router;