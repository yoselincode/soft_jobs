const express = require("express");
const cors = require("cors");
const path = require("path");
// rutas del apid e usaurio
const userRoutes = require("./routes/user.routes");
// lamo al error handler para caturar los errores y luego usarlo en el server
const errorHandler = require("./middleware/error");
// llamo al logger apra implementarlo y logear todas lasa cciones del usaurio
const logger = require("./middleware/logger");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ ok: false, error: "JSON inválido" });
  }
  next(err);
});
app.use(logger);
app.get("/", (req, res) => res.send("api usuarios"));
app.use("/", userRoutes);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
