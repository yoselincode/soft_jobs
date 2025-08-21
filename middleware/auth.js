const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "az_AZ";

module.exports = (req, res, next) => {
  const Authorization = req.header("Authorization");
  if (!Authorization || !Authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ ok: false, error: "Token no proporcionado o malformado" });
  }
  try {
    const token = Authorization.slice("Bearer ".length);
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res
      .status(401)
      .json({ ok: false, error: "Token inválido o expirado" });
  }
};
