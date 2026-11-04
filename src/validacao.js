// Valida o corpo de um pedido. Com parcial=true os campos são opcionais (para PUT).
export function validarLivro(dados = {}, parcial = false) {
  const erros = [];
  const { titulo, autor, ano, genero } = dados;

  if (!parcial || titulo !== undefined) {
    if (typeof titulo !== 'string' || !titulo.trim()) erros.push('"titulo" é obrigatório');
  }
  if (!parcial || autor !== undefined) {
    if (typeof autor !== 'string' || !autor.trim()) erros.push('"autor" é obrigatório');
  }
  if (ano !== undefined && (!Number.isInteger(ano) || ano > new Date().getFullYear())) {
    erros.push('"ano" tem de ser um número inteiro válido');
  }
  if (genero !== undefined && typeof genero !== 'string') {
    erros.push('"genero" tem de ser texto');
  }
  return erros;
}
