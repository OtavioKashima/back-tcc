import mysql from '../mysql.js';

// ======== COMENTÁRIOS ========

// Criar um novo comentário
export async function createComment(req, res) {
    try {
        const { post_id, conteudo } = req.body;
        const user_id = res.locals.idUsuario;

        if (!post_id || !conteudo) {
            return res.status(400).send({ 
                "mensagem": "post_id e conteudo são obrigatórios" 
            });
        }

        // Verificar se a postagem existe
        const post = await mysql.execute(
            `SELECT id FROM posts WHERE id = ?`,
            [post_id]
        );

        if (post.length === 0) {
            return res.status(404).send({ 
                "mensagem": "Postagem não encontrada" 
            });
        }

        // Inserir comentário
        const resultado = await mysql.execute(
            `INSERT INTO comments (post_id, user_id, conteudo) 
             VALUES (?, ?, ?)`,
            [post_id, user_id, conteudo]
        );

        return res.status(201).send({ 
            "mensagem": "Comentário criado com sucesso!",
            "id": resultado.insertId
        });

    } catch (error) {
        console.error('Erro ao criar comentário:', error);
        return res.status(500).send({ error: error.message });
    }
};

// Obter todos os comentários de uma postagem
export async function getCommentsByPost(req, res) {
    try {
        const { post_id } = req.params;

        const comentarios = await mysql.execute(
            `SELECT c.id, c.conteudo, c.criado_em, c.atualizado_em,
                    u.id as user_id, u.nome, u.foto_perfil
             FROM comments c
             INNER JOIN users u ON c.user_id = u.id
             WHERE c.post_id = ?
             ORDER BY c.criado_em DESC`,
            [post_id]
        );

        return res.status(200).send({
            "total": comentarios.length,
            "comentarios": comentarios
        });

    } catch (error) {
        console.error('Erro ao obter comentários:', error);
        return res.status(500).send({ error: error.message });
    }
}

// Atualizar um comentário
export async function updateComment(req, res) {
    try {
        const { comment_id, conteudo } = req.body;
        const user_id = res.locals.idUsuario;

        if (!comment_id || !conteudo) {
            return res.status(400).send({ 
                "mensagem": "comment_id e conteudo são obrigatórios" 
            });
        }

        // Verificar se o comentário existe e pertence ao usuário
        const comentario = await mysql.execute(
            `SELECT user_id FROM comments WHERE id = ?`,
            [comment_id]
        );

        if (comentario.length === 0) {
            return res.status(404).send({ 
                "mensagem": "Comentário não encontrado" 
            });
        }

        if (comentario[0].user_id !== user_id) {
            return res.status(403).send({ 
                "mensagem": "Você não tem permissão para editar este comentário" 
            });
        }

        // Atualizar comentário
        await mysql.execute(
            `UPDATE comments SET conteudo = ? WHERE id = ?`,
            [conteudo, comment_id]
        );

        return res.status(200).send({ 
            "mensagem": "Comentário atualizado com sucesso!" 
        });

    } catch (error) {
        console.error('Erro ao atualizar comentário:', error);
        return res.status(500).send({ error: error.message });
    }
}

// Deletar um comentário
export async function deleteComment(req, res) {
    try {
        const { id } = req.params;
        const user_id = res.locals.idUsuario;

        // Verificar se o comentário existe e pertence ao usuário
        const comentario = await mysql.execute(
            `SELECT user_id FROM comments WHERE id = ?`,
            [id]
        );

        if (comentario.length === 0) {
            return res.status(404).send({ 
                "mensagem": "Comentário não encontrado" 
            });
        }

        if (comentario[0].user_id !== user_id) {
            return res.status(403).send({ 
                "mensagem": "Você não tem permissão para deletar este comentário" 
            });
        }

        // Deletar comentário
        await mysql.execute(
            `DELETE FROM comments WHERE id = ?`,
            [id]
        );

        return res.status(200).send({ 
            "mensagem": "Comentário deletado com sucesso!" 
        });

    } catch (error) {
        console.error('Erro ao deletar comentário:', error);
        return res.status(500).send({ error: error.message });
    }
}

export default {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment
};

