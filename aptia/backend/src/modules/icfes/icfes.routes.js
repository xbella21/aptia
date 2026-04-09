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

router.post('/',        auth, async (req, res, next) => {
  try { const s = require('./icfes.service'); res.status(201).json({ success: true, data: await s.saveScore(req.user.id, req.body) }); } catch(e){next(e);}
});
router.post('/confirm', auth, async (req, res, next) => {
  try { const s = require('./icfes.service'); res.status(200).json({ success: true, data: await s.confirmScore(req.user.id) }); } catch(e){next(e);}
});
router.get('/me',       auth, async (req, res, next) => {
  try { const s = require('./icfes.service'); res.status(200).json({ success: true, data: await s.getScoreByUser(req.user.id) }); } catch(e){next(e);}
});

module.exports = router;