const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

let db = new sqlite3.Database('blog.db', (err) => {
	if (err) {
		console.error(err.message);
	} else {
		db.run(
			'CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT)',
			(err) => {
				if (err) {
					console.error(err.message);
				} else {
					console.log('Table cerated succesfully...!');
				}
			}
		);
	}
});

/* Getting all the posts data from databse and sending to /posts endpoint */
app.get('/posts', (req, res) => {
	const sql = 'SELECT * FROM posts';
	db.all(sql, [], (err, rows) => {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.status(200).send(rows);
		}
	});
});

/* CREATING/Putting a single post data to database*/
app.post('/posts', (req, res) => {
	const { title, description } = req.body;
	const sql = 'INSERT INTO posts (title, description) VALUES (?, ?)';
	db.run(sql, [title, description], (err) => {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.status(200).json({ msg: 'Successully inserted' });
		}
	});
});

/* Get single post by id */
app.get('/posts/:id', (req, res) => {
	const { id } = req.params;
	const sql = 'SELECT * FROM posts where id = ?';
	db.get(sql, [id], (err, post) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(post);
		}
	});
});

/* Modifying posts with id */
app.patch('/posts/:id', (req, res) => {
	const { id } = req.params;
	const { title, description } = req.body;
	const sql = 'UPDATE posts SET title = ?, description = ? WHERE id = ?';
	db.run(sql, [title, description, id], (err) => {
		if (err) {
			res.status(500).send({ msg: 'posts not updated' });
		} else {
			res.status(200).send({ msg: 'posts updated successfully' });
		}
	});
});

/* Deleting a post by id int posts table*/
app.delete('/posts/:id', (req, res) => {
	const { id } = req.params;
	const sql = 'DELETE FROM posts WHERE id = ?';
	db.run(sql, [id], (err) => {
		if (err) {
			res.status(500).send({ msg: 'post not deleted' });
		} else {
			res.status(200).send({ msg: 'post deleted sucessfully' });
		}
	});
});

//server running status
app.listen(PORT, () => {
	console.log('Server running');
});
