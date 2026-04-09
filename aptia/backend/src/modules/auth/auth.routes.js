const express = require('express');
const router  = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const authService = require('./auth.service');
    const result = await authService.registerUser(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const authService = require('./auth.service');
    const result = await authService.loginUser(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (e) { next(e); }
});

router.get('/me', async (req, res, next) => {
  try {
    const jwt = require('jsonwebtoken');
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'No autorizado' });
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    const authService = require('./auth.service');
    const user = await authService.getUserById(decoded.id);
    res.status(200).json({ success: true, data: user });
  } catch (e) { next(e); }
});

module.exports = router;