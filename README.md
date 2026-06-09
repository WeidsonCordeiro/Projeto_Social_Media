## 📝 Social Media App — Fullstack (React (Vite) + Node.js + MongoDB)

Social Media App é uma aplicação fullstack inspirada em redes sociais como o Facebook, permitindo que usuários compartilhem posts, interajam entre si e gerenciem seus perfis.

O projeto foi desenvolvido com React (Vite) no frontend e Node.js + Express no backend, utilizando MongoDB, JWT para autenticação e Cloudinary para upload de imagens.

## 📸 Prévia da Aplicação

<p align="center">
 <img width="1285" height="791" alt="image" src="https://github.com/user-attachments/assets/6c44da5d-f62f-4359-b808-55fbb31cb766" />
</p>

## 🚀 Tecnologias Utilizadas

🖥️ Frontend

- ⚛️ React + Vite — Interface rápida e moderna
- 🗂️ Context Api — Gerenciamento de estado global
- 🔐 JWT Decode — Controle de autenticação no client
- 🎨 CSS Modules — Estilização

⚙️ Backend

- 🟢 Node.js + Express — API REST
- 🍃 MongoDB + Mongoose — Banco de dados
- 🔐 JWT (JSON Web Token) — Autenticação segura
- ☁️ Cloudinary — Upload e armazenamento de imagens
- 📦 Multer — Upload de arquivos
- 🔌 Socket.IO — Comunicação em tempo real

## 📦 Funcionalidades

1. 🔐 **Autenticação**

- Registro e login de usuários com JWT
- Proteção de rotas privadas
- Logout automático ao expirar o token

2. 📝 **Posts**

- Criar posts com imagem
- Listar posts (feed)
- Curtir / descurtir / comentar posts
- Editar posts
- Excluir posts
- Visualizar detalhes do post

3. 💬 **Comentários**

- Criar comentários
- Editar comentários (somente o autor)
- Excluir comentários (autor ou dono do post)
- Modal para gerenciar comentários

4. 📊 **Dashboard do Usuário**

- Visualizar dados do usuário
- Listar posts do usuário
- Editar perfil (nome, descrição, foto de perfil e capa)

5. 🤝 **Amigos**

- Lista de amigos online (Socket.IO)

6. ⚡ **UX e Estado**

- Atualização do feed em tempo real (Context Api)
- Mensagens de sucesso/erro
- Controle de loading

7. 🔐 **Segurança**

- Tokens JWT com expiração (1h)
- Logout automático no frontend ao expirar
- Validação de token no backend
- Proteção de rotas

## 🚧 Funcionalidades em Desenvolvimento

As seguintes funcionalidades ainda estão sendo implementadas:

- 🔍 **Busca de amigos em geral**
- 📱 **Responsividade completa usando o Bootstrap**
- 💬 **Conversas simultâneas (chat em tempo real)**
- 🔔 **Notificações de novos posts de amigos**
- 🤝 **Sistema de amizade (convites)**
- 🔐 **Troca de senhas**

## 🛠️ Pré-requisitos

Antes de começar:

- Node.js(v18+ recomendado) https://nodejs.org/ [Node](https://nodejs.org/)
- npm ou yarn
- Conta no Cloudinary [Cloudinary](https://www.cloudinary.com)
- Instância do MongoDB (local ou Atlas) [MongoDB](https://www.mongodb.com/)

---

### 🤝 Como Contribuir

1. Faça um fork deste repositório.
2. Crie uma branch para sua feature (`git checkout -b minha-feature`).
3. Commit suas alterações (`git commit -m 'Adiciona minha feature'`).
4. Faça o push para a branch (`git push origin minha-feature`).
5. Abra um Pull Request.
