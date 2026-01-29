const mysql = require('../mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.updateUser = async (req, res) => {
    try {
        const resultado = await mysql.execute(

            `update users 
            set nome = ?,
            cpf = ?, 
            email = ?,
            telefone = ?, 
            senha	= ?,
            foto_perfil = ?
             where id = ?;`,
            [
                req.body.nome,
                req.body.cpf,
                req.body.email,
                req.body.telefone,
                req.body.senha,
                req.body.foto_perfil,
                res.locals.idUsuario
            ]

        );
        return res.status(201).send({ "mensagem": "Usuario atualizado com sucesso!" });

    } catch (error) {
        return res.status(500).send({ error });

    }
}

exports.registerUser = async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const resultado = await mysql.execute(
            `insert into users (nome, cpf, email, telefone, senha, foto_perfil) values(?, ?, ?, ?, ?, ?)`,
            [
                req.body.nome,
                req.body.cpf,
                req.body.email,
                req.body.telfone,
                hash,
                req.body.foto_perfil
            ]
        );
        return res.status(201).send({ "mensagem": "Usuario criado com sucesso!" });

    } catch (error) {
        return res.status(500).send({ error });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const idUsuarios = Number(req.params.id);

        const resultado = await mysql.execute(
            `delete from users where id = ?`,
            [
                req.params.id
            ]
        );
        return res.status(201).send({ "mensagem": "Usuario deletado com sucesso!" });
    } catch (error) {
        return res.status(500).send({ error });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const usuario = await mysql.execute(
            `select * from users where email = ?`,
            [req.body.email]
        );

        if (usuario.length == 0) {
            return res.status(401).send({ "mensagem": "Falha na autenticação" });
        }
        const match = await bcrypt.compare(req.body.password, usuario[0].password);

        if (!match) {
            return res.status(200).send({ "mensagem": "senha incorreta" });
        }
        const token = jwt.sign({
            id: usuario[0].id,
            nome: usuario[0].nome,
            cpf: usuario[0].cpf,
            email: usuario[0].email,
            telefone: usuario[0].telefone,
            admin: usuario[0].admin
        }, 'senhajwt');
        return res.status(200).send({
            "mensagem": "Usuario logado com sucesso!",
            "token": token,
            "user":{
                "nome": usuario[0].nome,
                "cpf": usuario[0].cpf,
                "email": usuario[0].email,
                "telefone": usuario[0].telefone,
                "foto_perfil": usuario[0].foto_perfil
            }
        })

    } catch (error) {
        res.status(500).send({ error });
    }
}

exports.admin = async (req, res, next) => {
    try{
        if(!res.locals.admin){
            return res.status(401).send({ "mensagem": "Usuario não autorizado" });
        }
        next();
    }catch(error){
        return res.status(401).send(error);
    }
 }
