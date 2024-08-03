const pool = require("../db/pool");

class Category {
  static async findAll() {
    const { rows } = await pool.query("SELECT * FROM categories ORDER BY name");
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [
      id,
    ]);
    return rows[0];
  }

  

  static async create(name) {
    const { rows } = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    
    return rows[0];
  }

  static async update(id, name) {
    const { rows } = await pool.query(
      "UPDATE categories SET name = $1 WHERE id = $2",
      [name, id]
    );

    return rows[0];
  }
  static async delete(id) {
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
  }
}

module.exports = Category;
