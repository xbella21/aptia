const errorMiddleware = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: 'Datos inválidos', errors });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `El campo '${field}' ya está en uso` });
  }
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Error interno del servidor' });
};

module.exports = errorMiddleware;