import mysql from '../mysql.js';

// ======== POSTAGENS ========

// Criar uma nova postagem
export async function createPost(req, res) {
    try {
        const { titulo, conteudo, imagem_url } = req.body;
        const user_id = res.locals.idUsuario;

        if (!titulo || !conteudo) {
            return res.status(400).send({ 
                "mensagem": "titulo e conteudo são obrigatórios" 
            });
        }

        const resultado = await mysql.execute(
            `INSERT INTO posts (user_id, titulo, conteudo, imagem_url) 
             VALUES (?, ?, ?, ?)`,
            [user_id, titulo, conteudo, imagem_url || null]
        );

        return res.status(201).send({ 
            "mensagem": "Postagem criada com sucesso!",
            "id": resultado.insertId
        });

    } catch (error) {
        console.error('Erro ao criar postagem:', error);
        return res.status(500).send({ error: error.message });
    }
}

// Obter todas as postagens
export async function getAllPosts(req, res) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const postagens = await mysql.execute(
            `SELECT p.id, p.titulo, p.conteudo, p.imagem_url, 
                    p.criado_em, p.atualizado_em,
                    u.id as user_id, u.nome, u.foto_perfil,
                    COUNT(c.id) as total_comentarios
             FROM posts p
             INNER JOIN users u ON p.user_id = u.id
             LEFT JOIN comments c ON p.id = c.post_id
             GROUP BY p.id
             ORDER BY p.criado_em DESC
             LIMIT ? OFFSET ?`,
            [parseInt(limit), parseInt(offset)]
        );

        return res.status(200).send({
            "page": page,
            "limit": limit,
            "postagens": postagens
        });

    } catch (error) {
        console.error('Erro ao obter postagens:', error);
        return res.status(500).send({ error: error.message });
    }
}

// Obter uma postagem com seus comentários
export async function getPostWithComments(req, res) {
    try {
        const { post_id } = req.params;

        const postagem = await mysql.execute(
            `SELECT p.id, p.titulo, p.conteudo, p.imagem_url, 
                    p.criado_em, p.atualizado_em,
                    u.id as user_id, u.nome, u.foto_perfil
             FROM posts p
             INNER JOIN users u ON p.user_id = u.id
             WHERE p.id = ?`,
            [post_id]
        );

        if (postagem.length === 0) {
            return res.status(404).send({ 
                "mensagem": "Postagem não encontrada" 
            });
        }

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
            "postagem": postagem[0],
            "comentarios": comentarios
        });

    } catch (error) {
        console.error('Erro ao obter postagem:', error);
        return res.status(500).send({ error: error.message });
    }
}

// Atualizar uma postagem
export async function updatePost(req, res) {
    try {
        const { post_id, titulo, conteudo, imagem_url } = req.body;
        const user_id = res.locals.idUsuario;

        if (!post_id) {
            return res.status(400).send({ 
                "mensagem": "post_id é obrigatório" 
            });
        }

        // Verificar se a postagem existe e pertence ao usuário
        const postagem = await mysql.execute(
            `SELECT user_id FROM posts WHERE id = ?`,
            [post_id]
        );

        if (postagem.length === 0) {
            return res.status(404).send({ 
                "mensagem": "Postagem não encontrada" 
            });
        }

        if (postagem[0].user_id !== user_id) {
            return res.status(403).send({ 
                "mensagem": "Você não tem permissão para editar esta postagem" 
            });
        }

        let query = `UPDATE posts SET `;
        const params = [];

        if (titulo) {
            query += `titulo = ?, `;
            params.push(titulo);
        }
        if (conteudo) {
            query += `conteudo = ?, `;
            params.push(conteudo);
        }
        if (imagem_url) {
            query += `imagem_url = ?, `;
            params.push(imagem_url);
        }

        query = query.slice(0, -2) + ` WHERE id = ?`;
        params.push(post_id);

        await mysql.execute(query, params);

        return res.status(200).send({ 
            "mensagem": "Postagem atualizada com sucesso!" 
        });

    } catch (error) {
        console.error('Erro ao atualizar postagem:', error);
        return res.status(500).send({ error: error.message });
    }
}

// Deletar uma postagem
export async function deletePost(req, res) {
    try {
        const { id } = req.params;
        const user_id = res.locals.idUsuario;

        // Verificar se a postagem existe e pertence ao usuário
        const postagem = await mysql.execute(
            `SELECT user_id FROM posts WHERE id = ?`,
            [id]
        );

        if (postagem.length === 0) {
            return res.status(404).send({ 
                "mensagem": "Postagem não encontrada" 
            });
        }

        if (postagem[0].user_id !== user_id) {
            return res.status(403).send({ 
                "mensagem": "Você não tem permissão para deletar esta postagem" 
            });
        }

        // Deletar postagem (comentários serão deletados automaticamente pela CASCADE)
        await mysql.execute(
            `DELETE FROM posts WHERE id = ?`,
            [id]
        );

        return res.status(200).send({ 
            "mensagem": "Postagem deletada com sucesso!" 
        });

    } catch (error) {
        console.error('Erro ao deletar postagem:', error);
        return res.status(500).send({ error: error.message });
    }
}

export default { createPost, getAllPosts, getPostWithComments, updatePost, deletePost };
