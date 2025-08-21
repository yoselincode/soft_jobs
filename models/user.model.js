const bcrypt = require("bcryptjs");
const pool = require("../db");

const table = "usuarios";

const sanitizeUser = (row) => {
  if (!row) return null;
  const { password, ...safe } = row;
  return safe;
};

async function getById(id) {
  const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1;`, [
    id,
  ]);
  return rows.map(sanitizeUser)[0] || null;
}

async function getByEmail(email) {
  const { rows } = await pool.query(
    `SELECT * FROM ${table} WHERE email = $1;`,
    [email]
  );
  return rows[0] || null;
}

async function create({ email, password, rol = "user", lenguage = "es" }) {
  const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;
  const hash = bcrypt.hashSync(password, rounds);

  const insert = `INSERT INTO ${table} (email, password, rol, lenguage)
VALUES ($1, $2, $3, $4)
RETURNING *;`;
  const values = [email, hash, rol, lenguage];
  const { rows } = await pool.query(insert, values);
  return sanitizeUser(rows[0]);
}

async function verifyCredentials(email, password) {
  const usuario = await getByEmail(email);
  if (!usuario) throw { code: 401, message: "Email o contraseña incorrecta" };
  const passwordEncriptada = usuario.password;
  const ok = bcrypt.compareSync(password, passwordEncriptada);
  if (!ok) throw { code: 401, message: "Email o contraseña incorrecta" };
  return usuario;
}

async function remove(id) {
  const { rowCount } = await pool.query(`DELETE FROM ${table} WHERE id = $1;`, [
    id,
  ]);
  if (!rowCount)
    throw { code: 404, message: `No se encontró ningún usuario con id: ${id}` };
}

async function update(id, { email, rol, lenguage }) {
  const { rows, rowCount } = await pool.query(
    `UPDATE ${table} SET email = $2, rol = $3, lenguage = $4 WHERE id = $1 RETURNING *;`,
    [id, email, rol, lenguage]
  );
  if (!rowCount)
    throw { code: 404, message: `No se encontró ningún usuario con id: ${id}` };
  return sanitizeUser(rows[0]);
}

module.exports = {
  getById,
  getByEmail,
  create,
  verifyCredentials,
  remove,
  update,
};
