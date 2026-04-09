require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('debug', true);
const express        = require('express');
const cors           = require('cors');
const connectDB      = require('./src/config/db');
const authRoutes     = require('./src/modules/auth/auth.routes');
const icfesRoutes    = require('./src/modules/icfes/icfes.routes');
const psychoRoutes   = require('./src/modules/psychometric/psychometric.routes');
const rankingRoutes  = require('./src/modules/ranking/ranking.routes');
const errorMiddleware = require('./src/middlewares/error.middleware');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth',        authRoutes);
app.use('/api/icfes',       icfesRoutes);
app.use('/api/psychometric', psychoRoutes);
app.use('/api/ranking',     rankingRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor APTIA corriendo en http://localhost:${PORT}`);
      console.log(`📡 Modo: ${process.env.NODE_ENV}`);
    });
  };
  start();
}

module.exports = app;