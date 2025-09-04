import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = "segredo123";

// Rota de cadastro
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // verifica se já existe
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "E-mail já cadastrado" });
    }

    await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      password
    ]);

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro no register:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Rota de login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ? AND password = ?", [
      email,
      password
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "E-mail ou senha incorretos" });
    }

    const user = rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login realizado com sucesso", token });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Rota protegida
app.get("/api/profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token não enviado" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: "Perfil do usuário", user: decoded });
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
