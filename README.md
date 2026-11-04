# 📚 API Biblioteca

API REST para gerir os livros de uma biblioteca, com **pesquisa, paginação** e
**requisição/devolução** de livros. Os dados ficam numa base de dados **SQLite**.

## 🛠️ Tecnologias
- Node.js + Express 5
- SQLite (`better-sqlite3`)
- Organização em rotas (`Router`) e validação separada

## ▶️ Como executar
```bash
npm install
npm run dev
```
A base de dados `biblioteca.db` é criada automaticamente com alguns livros portugueses.

## 📚 Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/livros?q=&genero=&pagina=&limite=` | Lista com pesquisa e paginação |
| GET | `/livros/:id` | Detalhe de um livro |
| POST | `/livros` | Cria livro (`titulo`, `autor`, `ano`, `genero`) |
| PUT | `/livros/:id` | Atualiza livro |
| DELETE | `/livros/:id` | Apaga livro |
| POST | `/livros/:id/requisitar` | Marca como requisitado |
| POST | `/livros/:id/devolver` | Marca como disponível |

Exemplo:
```bash
curl "http://localhost:3001/livros?q=saramago"
```

## 💡 O que aprendi
- SQL (CREATE, SELECT com `LIKE`, `LIMIT/OFFSET`, transações)
- Queries parametrizadas para evitar SQL injection
- Separar a API em camadas (rotas, validação, base de dados)
- Código 409 (Conflict) para regras de negócio
