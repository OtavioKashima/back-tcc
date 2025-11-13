// middleware.js
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  // O token geralmente é enviado no cabeçalho 'Authorization'
  // no formato 'Bearer <token>'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    // Se não há token, o usuário não está autorizado
    return res.status(401).json({ message: 'Acesso não autorizado. Token não fornecido.' });
  }

  // Verifica se o token é válido
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Se o token for inválido (expirado, assinatura errada)
      return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }

    // Se o token for válido, salvamos os dados do usuário no 'req'
    // para que as próximas rotas possam usá-lo
    req.user = user;
    next(); // Continua para a próxima rota
  });
};

module.exports = verificarToken;