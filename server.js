const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://root:root@db:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Define a Todo schema
const todoSchema = new mongoose.Schema({
    text: String,
});

const Todo = mongoose.model('Todo', todoSchema);

// Get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a specific todo
app.get('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        if (todo) {
            res.json(todo);
        } else {
            res.status(404).json({ error: 'Todo not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new todo
app.post('/todos', async (req, res) => {
    try {
        const { text } = req.body;

        const newTodo = new Todo({ text });
        const savedTodo = await newTodo.save();

        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { text },
            { new: true }
        );

        if (updatedTodo) {
            res.json(updatedTodo);
        } else {
            res.status(404).json({ error: 'Todo not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTodo = await Todo.findByIdAndDelete(id);
        if (deletedTodo) {
            res.json({ message: 'Todo deleted' });
        } else {
            res.status(404).json({ error: 'Todo not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
