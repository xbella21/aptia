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

router.get('/generate', auth, async (req, res, next) => {
  try { const s = require('./ranking.service'); res.status(200).json({ success: true, data: await s.generateRanking(req.user.id) }); } catch(e){next(e);}
});
router.get('/me',       auth, async (req, res, next) => {
  try { const s = require('./ranking.service'); res.status(200).json({ success: true, data: await s.getRankingByUser(req.user.id) }); } catch(e){next(e);}
});

module.exports = router;