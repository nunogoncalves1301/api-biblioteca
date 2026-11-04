import Database from 'better-sqlite3';

const db = new Database(process.env.DB_FILE || 'biblioteca.db');
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS livros (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo      TEXT    NOT NULL,
    autor       TEXT    NOT NULL,
    ano         INTEGER,
    genero      TEXT,
    disponivel  INTEGER NOT NULL DEFAULT 1
  )
`);

// Dados iniciais para a API não arrancar vazia
const { total } = db.prepare('SELECT COUNT(*) AS total FROM livros').get();
if (total === 0) {
  const inserir = db.prepare('INSERT INTO livros (titulo, autor, ano, genero) VALUES (?, ?, ?, ?)');
  const livros = [
    ['Os Maias', 'Eça de Queirós', 1888, 'Romance'],
    ['A Cidade e as Serras', 'Eça de Queirós', 1901, 'Romance'],
    ['Mensagem', 'Fernando Pessoa', 1934, 'Poesia'],
    ['Memorial do Convento', 'José Saramago', 1982, 'Romance'],
    ['Ensaio sobre a Cegueira', 'José Saramago', 1995, 'Romance'],
    ['Os Lusíadas', 'Luís de Camões', 1572, 'Poesia'],
  ];
  db.transaction(() => livros.forEach((l) => inserir.run(...l)))();
}

export default db;
