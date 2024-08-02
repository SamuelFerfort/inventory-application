#! /usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();
const SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR (100) NOT NULL

);
  CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR ( 100 ) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  category_id INTEGER REFERENCES categories(id) NOT NULL,
  stock INTEGER,
  imageURL TEXT
);


INSERT INTO categories (name) VALUES 
('Fruits'),
('Vegetables'),
('Meat');

INSERT INTO items (name, description, price, category_id, stock, imageURL) VALUES
  ('Apple', 'Fresh Red Apple', 0.99, 1, 100, 'https://images.unsplash.com/photo-1611574474484-ced6cb70a2cf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
  ('Broccoli', 'Fresh Green Broccoli', 1.29, 2, 50, 'https://images.unsplash.com/photo-1533910063084-5b1b485d2c35?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
  ('Beef', 'Premium grass-fed beef sirloin. Rich in flavor and essential nutrients…', 2.50, 3, 200, 'https://unsplash.com/photos/YwokcqExk2A/download');
`;


async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DEV_DB_URL,
  });
  try {
    await client.connect();
    await client.query(SQL);
    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await client.end();
  }
}

main();
