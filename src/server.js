import express from 'express';
import livrosRouter from './routes/livros.js';

const app = express();
const PORTA = process.env.PORT || 3001;

app.use(express.json());

// Middleware simples de logging
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString('pt-PT')} ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/livros', livrosRouter);

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));
app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(erro.status || 500).json({ erro: erro.status ? erro.message : 'Erro interno do servidor' });
});

app.listen(PORTA, () => console.log(`📚 Biblioteca em http://localhost:${PORTA}/livros`));
