import jwt from "jsonwebtoken";

export async function required(req, res, next) {
    try {
        res.locals.idUsuario = 0;
        res.locals.admin = 0;

        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.decode(token, process.env.JWT_SECRET || "senhajwt");

        if (decode.id) {
            res.locals.idUsuario = decode.id;
            res.locals.admin = decode.admin;
            next(); 
        } else {
            return res.status(401).send({ "mensagem": "Usuario não autenticado" });
        }
    } catch (error) {
        return res.status(401).send(error);
    }
}

export function generateToken(user) {
    return jwt.sign(
        { id: user.id, cpf: user.cpf },
        process.env.JWT_SECRET || "senhajwt",
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
}

export default { required, generateToken };