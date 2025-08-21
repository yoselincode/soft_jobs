module.exports = (err, req, res, next) => {
  const status = err.code || err.status || 500;
  const payload = {
    ok: false,
    error: err.message || "Error interno del servidor",
  };

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  console.error("ERROR:", status, err);
  res.status(status).json(payload);
};
