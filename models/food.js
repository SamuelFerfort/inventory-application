const pool = require("../db/pool");

class Item {
  static async findAll() {
    const { rows } = await pool.query("SELECT * FROM items");
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query("SELECT * FROM items WHERE id = $1", [
      id,
    ]);
    return rows[0];
  }

  static async create(itemData) {
    const { name, description, price, category_id, stock, imageURL } = itemData;

    const { rows } = await pool.query(
      "INSERT INTO items (name, description, price, category_id, stock, imageURL) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description, price, category_id, stock, imageURL]
    );

    return rows[0];
  }

  static async update(id, userData) {
    const { name, description, price, category_id, stock, imageURL } = itemData;

    const { rows } = await pool.query(
      "UPDATE items SET name = $1, description = $2, price = $3, category_id = $4, stock = $5, imageURL = $6 WHERE id = $7",
      [name, description, price, category_id, stock, imageURL, id]
    );

    return rows[0];
  }
  static async delete(id) {
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
  }
}

module.exports = Item;
