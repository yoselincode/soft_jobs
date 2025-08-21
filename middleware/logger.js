const fs = require("fs");
const path = require("path");

const LOG_TO_FILE = String(process.env.LOG_TO_FILE ?? "true") === "true";

const LOG_FILE_PATH = path.resolve(
  process.env.LOG_FILE_PATH ?? path.join(process.cwd(), "logs", "access.log")
);
const LOG_DIR = path.dirname(LOG_FILE_PATH);
if (LOG_TO_FILE) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  } catch (e) {
    console.error("No se pudo crear el directorio de logs:", e);
  }
}

let stream = null;
if (LOG_TO_FILE) {
  try {
    stream = fs.createWriteStream(LOG_FILE_PATH, { flags: "a" });
    stream.on("error", (e) => console.error("Error en stream de logs:", e));
  } catch (e) {
    console.error("No se pudo abrir el archivo de logs:", e);
  }
}

module.exports = (req, res, next) => {
  const started = Date.now();

  res.on("finish", () => {
    const fecha = new Date().toLocaleString("es-CL");
    const ms = Date.now() - started;
    const line = `[${fecha}] ${req.ip} ${req.method} ${req.originalUrl} ${
      res.statusCode
    } ${ms}ms -> ${req.get("user-agent") || ""}\n`;

    process.stdout.write(line);

    if (LOG_TO_FILE && stream) {
      stream.write(line);
    }
  });

  next();
};
