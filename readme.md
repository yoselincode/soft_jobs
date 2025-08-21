````markdown
# API de Usuarios 👤

API REST construida con **Node.js + Express**, conectada a **PostgreSQL**, con autenticación basada en **JWT** y manejo seguro de contraseñas con **bcrypt**.

## 🚀 Características

- Registro y autenticación de usuarios.
- Hash de contraseñas con bcrypt.
- Validación de entradas con `express-validator`.
- Rutas protegidas con JWT.
- CRUD de usuarios.
- Logs en archivo.

---

## 📦 Requisitos previos

- [Node.js](https://nodejs.org/) >= 14
- [PostgreSQL](https://www.postgresql.org/) >= 12
- npm o yarn

---

## ⚙️ Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/api-usuarios.git
   cd api-usuarios
   ```
````

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Configurar variables de entorno en `.env`:

   ```env
   # Puerto del servidor
   PORT=3000

   # PostgreSQL
   PGUSER=postgres
   PGHOST=localhost
   PGDATABASE=softjobs
   PGPASSWORD=1234
   PGPORT=5433

   # JWT
   JWT_SECRET=az_AZ
   JWT_EXPIRES=12h

   # Seguridad
   BCRYPT_ROUNDS=10

   # Logs
   LOG_TO_FILE=true
   LOG_FILE_PATH=./logs/access.log
   ```

4. Crear la tabla `usuarios` en PostgreSQL:

   ```sql
   CREATE TABLE usuarios (
     id SERIAL PRIMARY KEY,
     email VARCHAR(100) UNIQUE NOT NULL,
     password TEXT NOT NULL,
     rol VARCHAR(50) DEFAULT 'user',
     lenguage VARCHAR(10) DEFAULT 'es'
   );
   ```

5. Ejecutar en modo desarrollo:

   ```bash
   npm run dev
   ```

---

## 📡 Endpoints

### 🔑 Autenticación

#### **POST** `/login`

Inicia sesión con email y contraseña.
**Body:**

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "ok": true,
  "token": "<jwt_token>"
}
```

---

### 👤 Usuarios

#### **POST** `/usuarios`

Registra un nuevo usuario.
**Body:**

```json
{
  "email": "nuevo@example.com",
  "password": "123456",
  "rol": "admin",
  "lenguage": "es"
}
```

#### **GET** `/usuarios`

Obtiene el usuario autenticado.
**Headers:**

```
Authorization: Bearer <jwt_token>
```

#### **PUT** `/usuarios/:id`

Actualiza un usuario (solo el propio).
**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Body:**

```json
{
  "email": "nuevo@example.com",
  "rol": "user",
  "lenguage": "en"
}
```

#### **DELETE** `/usuarios/:id`

Elimina un usuario (solo el propio).
**Headers:**

```
Authorization: Bearer <jwt_token>
```

---

## 📜 Licencia

MIT

```

```
