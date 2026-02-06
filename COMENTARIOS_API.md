# Sistema de Comentários em Postagens - Documentação da API

## 📋 Visão Geral

Este documento descreve os endpoints da API para gerenciamento de postagens e comentários.

---

## 🗂️ Estrutura do Banco de Dados

### Tabela: `posts`
```sql
- id (INT, PK)
- user_id (INT, FK)
- titulo (VARCHAR 255)
- conteudo (LONGTEXT)
- imagem_url (VARCHAR 500)
- criado_em (TIMESTAMP)
- atualizado_em (TIMESTAMP)
```

### Tabela: `comments`
```sql
- id (INT, PK)
- post_id (INT, FK)
- user_id (INT, FK)
- conteudo (TEXT)
- criado_em (TIMESTAMP)
- atualizado_em (TIMESTAMP)
```

---

## 📌 POSTAGENS (Posts)

### 1️⃣ Criar Postagem
**POST** `/post/criar`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "Meu Primeiro Post",
  "conteudo": "Este é o conteúdo da minha postagem",
  "imagem_url": "https://example.com/image.jpg"
}
```

**Response (201):**
```json
{
  "mensagem": "Postagem criada com sucesso!",
  "id": 1
}
```

---

### 2️⃣ Obter Todas as Postagens
**GET** `/posts?page=1&limit=10`

**Headers:**
```
Content-Type: application/json
```

**Response (200):**
```json
{
  "page": "1",
  "limit": "10",
  "postagens": [
    {
      "id": 1,
      "titulo": "Meu Primeiro Post",
      "conteudo": "Este é o conteúdo da minha postagem",
      "imagem_url": "https://example.com/image.jpg",
      "criado_em": "2026-02-06T10:30:00.000Z",
      "atualizado_em": "2026-02-06T10:30:00.000Z",
      "user_id": 1,
      "nome": "João Silva",
      "foto_perfil": "https://example.com/perfil.jpg",
      "total_comentarios": 3
    }
  ]
}
```

---

### 3️⃣ Obter Postagem com Comentários
**GET** `/post/:post_id`

**Response (200):**
```json
{
  "postagem": {
    "id": 1,
    "titulo": "Meu Primeiro Post",
    "conteudo": "Este é o conteúdo da minha postagem",
    "imagem_url": "https://example.com/image.jpg",
    "criado_em": "2026-02-06T10:30:00.000Z",
    "atualizado_em": "2026-02-06T10:30:00.000Z",
    "user_id": 1,
    "nome": "João Silva",
    "foto_perfil": "https://example.com/perfil.jpg"
  },
  "comentarios": [
    {
      "id": 1,
      "conteudo": "Ótimo post!",
      "criado_em": "2026-02-06T11:00:00.000Z",
      "atualizado_em": "2026-02-06T11:00:00.000Z",
      "user_id": 2,
      "nome": "Maria Santos",
      "foto_perfil": "https://example.com/perfil2.jpg"
    }
  ]
}
```

---

### 4️⃣ Atualizar Postagem
**PUT** `/post/atualizar`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "post_id": 1,
  "titulo": "Título Atualizado",
  "conteudo": "Conteúdo atualizado",
  "imagem_url": "https://example.com/new-image.jpg"
}
```

**Response (200):**
```json
{
  "mensagem": "Postagem atualizada com sucesso!"
}
```

---

### 5️⃣ Deletar Postagem
**DELETE** `/post/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensagem": "Postagem deletada com sucesso!"
}
```

---

## 💬 COMENTÁRIOS (Comments)

### 1️⃣ Criar Comentário
**POST** `/comentario/criar`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "post_id": 1,
  "conteudo": "Ótimo post!"
}
```

**Response (201):**
```json
{
  "mensagem": "Comentário criado com sucesso!",
  "id": 5
}
```

---

### 2️⃣ Obter Comentários de uma Postagem
**GET** `/comentarios/post/:post_id`

**Response (200):**
```json
{
  "total": 3,
  "comentarios": [
    {
      "id": 1,
      "conteudo": "Ótimo post!",
      "criado_em": "2026-02-06T11:00:00.000Z",
      "atualizado_em": "2026-02-06T11:00:00.000Z",
      "user_id": 2,
      "nome": "Maria Santos",
      "foto_perfil": "https://example.com/perfil2.jpg"
    }
  ]
}
```

---

### 3️⃣ Atualizar Comentário
**PUT** `/comentario/atualizar`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "comment_id": 1,
  "conteudo": "Realmente ótimo post!"
}
```

**Response (200):**
```json
{
  "mensagem": "Comentário atualizado com sucesso!"
}
```

---

### 4️⃣ Deletar Comentário
**DELETE** `/comentario/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensagem": "Comentário deletado com sucesso!"
}
```

---

## 🔒 Autenticação

Todos os endpoints que requerem autenticação usam **JWT Bearer Token**.

Incluir no header:
```
Authorization: Bearer seu_token_jwt_aqui
```

O token é decodificado no middleware `user.middleware.js` e os dados do usuário são disponibilizados em `res.locals.idUsuario`.

---

## ⚠️ Códigos de Resposta HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Requisição inválida (dados faltando) |
| 403 | Permissão negada (não é o proprietário) |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

---

## 📝 Permissões

- ✅ **Criar Postagem/Comentário**: Qualquer usuário autenticado
- ✅ **Editar Postagem/Comentário**: Apenas o proprietário
- ✅ **Deletar Postagem/Comentário**: Apenas o proprietário
- ✅ **Visualizar**: Qualquer pessoa (não precisa autenticação)

---

## 🛠️ Instalação do Banco de Dados

Execute o script em `database.sql` no seu MySQL:

```bash
mysql -u root -p banco_tcc < database.sql
```

Ou execute manualmente as queries SQL fornecidas.

---

## 📦 Exemplo de Fluxo Completo

1. **Usuário cria uma postagem:**
   ```bash
   POST /post/criar
   Headers: Authorization: Bearer token123
   Body: { titulo, conteudo, imagem_url }
   ```

2. **Outros usuários comentam:**
   ```bash
   POST /comentario/criar
   Headers: Authorization: Bearer token456
   Body: { post_id: 1, conteudo }
   ```

3. **Visualizar postagem com comentários:**
   ```bash
   GET /post/1
   ```

4. **Editar próprio comentário:**
   ```bash
   PUT /comentario/atualizar
   Headers: Authorization: Bearer token456
   Body: { comment_id: 1, conteudo: "novo texto" }
   ```

5. **Deletar próprio comentário:**
   ```bash
   DELETE /comentario/1
   Headers: Authorization: Bearer token456
   ```

---

## 🎯 Possíveis Melhorias Futuras

- [ ] Sistema de likes/reações em postagens e comentários
- [ ] Notificações em tempo real
- [ ] Respostas a comentários (comentários aninhados)
- [ ] Busca e filtros avançados
- [ ] Paginação de comentários
- [ ] Moderação e denúncia de conteúdo
- [ ] Sistema de tags/categorias
