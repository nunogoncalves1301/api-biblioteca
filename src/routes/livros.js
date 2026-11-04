import { Router } from 'express';
import db from '../db.js';
import { validarLivro } from '../validacao.js';

const router = Router();

// O SQLite guarda booleanos como 0/1, aqui convertemos para true/false
const formatar = (livro) => livro && { ...livro, disponivel: Boolean(livro.disponivel) };
const procurar = (id) => formatar(db.prepare('SELECT * FROM livros WHERE id = ?').get(id));

// GET /livros?q=saramago&genero=Romance&pagina=1&limite=10
router.get('/', (req, res) => {
  const pagina = Math.max(1, parseInt(req.query.pagina) || 1);
  const limite = Math.min(50, Math.max(1, parseInt(req.query.limite) || 10));
  const condicoes = [];
  const params = {};

  if (req.query.q) {
    condicoes.push('(titulo LIKE @q OR autor LIKE @q)');
    params.q = `%${req.query.q}%`;
  }
  if (req.query.genero) {
    condicoes.push('genero = @genero');
    params.genero = req.query.genero;
  }

  const where = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : '';
  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM livros ${where}`).get(params);
  const livros = db
    .prepare(`SELECT * FROM livros ${where} ORDER BY titulo LIMIT @limite OFFSET @offset`)
    .all({ ...params, limite, offset: (pagina - 1) * limite });

  res.json({ pagina, limite, total, dados: livros.map(formatar) });
});

router.get('/:id', (req, res) => {
  const livro = procurar(req.params.id);
  if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });
  res.json(livro);
});

router.post('/', (req, res) => {
  const erros = validarLivro(req.body);
  if (erros.length) return res.status(400).json({ erros });

  const { titulo, autor, ano = null, genero = null } = req.body;
  const { lastInsertRowid } = db
    .prepare('INSERT INTO livros (titulo, autor, ano, genero) VALUES (?, ?, ?, ?)')
    .run(titulo.trim(), autor.trim(), ano, genero);
  res.status(201).json(procurar(lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const livro = procurar(req.params.id);
  if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });

  const erros = validarLivro(req.body, true);
  if (erros.length) return res.status(400).json({ erros });

  const atualizado = { ...livro, ...req.body };
  db.prepare('UPDATE livros SET titulo = ?, autor = ?, ano = ?, genero = ? WHERE id = ?')
    .run(atualizado.titulo, atualizado.autor, atualizado.ano, atualizado.genero, livro.id);
  res.json(procurar(livro.id));
});

router.delete('/:id', (req, res) => {
  const { changes } = db.prepare('DELETE FROM livros WHERE id = ?').run(req.params.id);
  if (!changes) return res.status(404).json({ erro: 'Livro não encontrado' });
  res.status(204).end();
});

// Requisitar e devolver um livro
router.post('/:id/requisitar', (req, res) => alterarDisponibilidade(req, res, false));
router.post('/:id/devolver', (req, res) => alterarDisponibilidade(req, res, true));

function alterarDisponibilidade(req, res, disponivel) {
  const livro = procurar(req.params.id);
  if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });
  if (livro.disponivel === disponivel) {
    return res.status(409).json({ erro: disponivel ? 'O livro já está disponível' : 'O livro já está requisitado' });
  }
  db.prepare('UPDATE livros SET disponivel = ? WHERE id = ?').run(disponivel ? 1 : 0, livro.id);
  res.json(procurar(livro.id));
}

export default router;
