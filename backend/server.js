require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true'
};

if (process.env.DB_SSL === 'true') {
    dbConfig.ssl = {minVersion: 'TLSv1.2',
                    rejectUnauthorized: true};
}

const pool = mysql.createPool(dbConfig);

// READ obtener todos los vinilos registrados en la base de datos
app.get('/api/vinylos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM vinylos ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching vinylos:', err);
        res.status(500).json({ error: 'Error al obtener los vinilos' });
    }
});

// CREATE agregar un nuevo vinilo a la base de datos
app.post('/api/vinylos', async (req, res) => {
    const { nombre, artista, precio } = req.body;
    const precioNum = Number(precio);
    if (!nombre || !artista || !precio === undefined || precio === ''|| isNaN(precioNum) || precioNum < 0) {
        return res.status(400).json({ error: 'Faltó alguno de los campos requeridos' });
    }
    try {
        const [result] = await pool.query('INSERT INTO vinylos (nombre, artista, precio) VALUES (?, ?, ?)', [nombre, artista, precio]);
            res.status(201).json({ id: result.insertId, nombre, artista, precio });
    }
    catch (err) {
        console.error('Error inserting vinilo:', err);
        res.status(500).json({ error: 'Error al insertar vinilo' });
    }
});

// UPDATE actualizar un vinilo existente en la base de datos
app.put('/api/vinylos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, artista, precio } = req.body;
    if (!nombre || !artista || !precio) {
        return res.status(400).json({ error: 'Faltó alguno de los campos requeridos' });
    }
    try {
        const [result] = await pool.query('UPDATE vinylos SET nombre = ?, artista = ?, precio = ? WHERE id = ?', [nombre, artista, precio, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Vinilo no encontrado' });
        }
        res.json({ id, nombre, artista, precio });
    } catch (err) {
        console.error('Error updating vinilo:', err);
        res.status(500).json({ error: 'Error al actualizar vinilo' });
    }
});

// DELETE eliminar un vinilo existente de la base de datos
app.delete('/api/vinylos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM vinylos WHERE id = ?', [id]);    
        res.json({ message: 'Vinilo eliminado correctamente' });
    } catch (err) {
        console.error('Error deleting vinilo:', err);
        res.status(500).json({ error: 'Error al eliminar vinilo' });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT || 3000}`);
});