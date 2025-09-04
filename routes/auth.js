// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/user.js";

// const router = express.Router();

// // Registrar usuário
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: "E-mail já registrado" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword });

//     await newUser.save();
//     res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
//   } catch (error) {
//     res.status(500).json({ message: "Erro no servidor", error });
//   }
// });

// // Login usuário
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) return res.status(401).json({ message: "Senha incorreta" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.json({ message: "Login realizado com sucesso", token });
//   } catch (error) {
//     res.status(500).json({ message: "Erro no servidor", error });
//   }
// });

// export default router;
