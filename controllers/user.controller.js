const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");

const SECRET = process.env.JWT_SECRET || "az_AZ";
const EXPIRES = process.env.JWT_EXPIRES || "12h";

const validateRegistration = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password mínimo 6 caracteres"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Password requerido"),
];

const validateUpdate = [
  body("email").optional().isEmail().withMessage("Email inválido"),
  body("rol").optional().isString(),
  body("lenguage").optional().isString(),
];

const handleValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(", ");
    const error = new Error(message);
    error.code = 400;
    throw error;
  }
};
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const usuario = await userModel.getById(id);
  if (!usuario)
    return res.status(404).json({ ok: false, error: "Usuario no encontrado" });
  res.status(200).json({ ok: true, data: usuario });
});

const registerUser = [
  ...validateRegistration,
  asyncHandler(async (req, res) => {
    handleValidation(req);
    const { email, password, rol, lenguage } = req.body;

    const existing = await userModel.getByEmail(email);
    if (existing) {
      return res
        .status(409)
        .json({ ok: false, error: "El email ya está registrado" });
    }

    const user = await userModel.create({ email, password, rol, lenguage });
    res
      .status(201)
      .json({ ok: true, message: "Usuario creado con éxito", data: user });
  }),
];

const loginUser = [
  ...validateLogin,
  asyncHandler(async (req, res) => {
    handleValidation(req);
    const { email, password } = req.body;
    const usuario = await userModel.verifyCredentials(email, password);
    const { id, rol, lenguage } = usuario;

    const token = jwt.sign({ id, email, rol, lenguage }, SECRET, {
      expiresIn: EXPIRES,
    });
    res.status(200).json({ ok: true, token });
  }),
];

const updateUser = [
  ...validateUpdate,
  asyncHandler(async (req, res) => {
    handleValidation(req);
    const { id } = req.params;

    if (Number(req.user.id) !== Number(id)) {
      return res.status(403).json({
        ok: false,
        error: "No tienes permiso para actualizar este usuario",
      });
    }

    const { email, rol, lenguage } = req.body;
    const updated = await userModel.update(id, { email, rol, lenguage });
    res
      .status(200)
      .json({ ok: true, message: "Usuario actualizado", data: updated });
  }),
];

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (Number(req.user.id) !== Number(id)) {
    return res.status(403).json({
      ok: false,
      error: "No tienes permiso para eliminar este usuario",
    });
  }
  await userModel.remove(id);
  res
    .status(200)
    .json({ ok: true, message: `Usuario ${id} eliminado con éxito` });
});

module.exports = { registerUser, getUser, loginUser, deleteUser, updateUser };
