const { Router } = require("express");
const router = Router();
const userCtrl = require("../controllers/user.controller");
const auth = require("../middleware/auth");

router.post("/login", userCtrl.loginUser);
router.post("/usuarios", userCtrl.registerUser);

router.get("/usuarios", auth, userCtrl.getUser);
router.put("/usuarios/:id", auth, userCtrl.updateUser);
router.delete("/usuarios/:id", auth, userCtrl.deleteUser);

module.exports = router;
