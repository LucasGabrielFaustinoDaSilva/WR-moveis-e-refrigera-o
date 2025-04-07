const db = require('../config/db');

class ClienteModel {
  static async listarTodos() {
    const [rows] = await db.query('SELECT * FROM clientes ORDER BY id DESC');
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
    return rows[0];
  }

  static async criar(cliente) {
    const { nome, email, telefone, documento, cep, status } = cliente;
    const [result] = await db.query(
      'INSERT INTO clientes (nome, email, telefone, documento, cep, status) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, email, telefone, documento, cep, status]
    );
    return result.insertId;
  }

  static async atualizar(id, cliente) {
    const { nome, email, telefone, documento, cep, status } = cliente;
    await db.query(
      'UPDATE clientes SET nome=?, email=?, telefone=?, documento=?, cep=?, status=? WHERE id=?',
      [nome, email, telefone, documento, cep, status, id]
    );
  }

  static async excluir(id) {
    await db.query('DELETE FROM clientes WHERE id = ?', [id]);
  }
}

module.exports = ClienteModel;