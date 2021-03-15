const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const existingUser = users.find(user=> user.username === username)
  if (!existingUser) {
    response.status(404).json({error: "No such user"})
  }
  request.user = existingUser;
  return next()
}

function checkExistingTodo(request, response, next) {
  const { id } = request.params;
  const todo = user.todos.find(todo=> todo.id === id);
  if (!todo){
    response.status(404).json({error: "No such todo"})
  }
  request.todo = todo;
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const existingUsername = users.some(user=> user.username === username)
  if (existingUsername) {
    response.status(400).json({error: "username not available"})
  }
  
  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(newUser);
  response.status(200).json(newUser);


});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {todos} = request.user
  response.status(200).json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const { title, deadline } = request.body;
  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline), //YYYY-MM-DD
    created_at: new Date()
    
  }
  user.todos.push(newTodo);
  response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const {user} = request;
  const { id } = request.params;
  const todo = user.todos.find(todo=> todo.id === id);
  if (!todo){
    response.status(404).json({error: "No such todo"})
  }
  todo.title = title
  todo.deadline = new Date(deadline)
  response.status(203).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const { id } = request.params;
  const todo = user.todos.find(todo=> todo.id === id);
  if (!todo){
    response.status(404).json({error: "No such todo"})
  }
  todo.done = !todo.done;
  response.status(203).json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const { id } = request.params;
  const todo = user.todos.find(todo=> todo.id === id);
  if (!todo){
    response.status(404).json({error: "No such todo"})
  }
  user.todos.splice(todo, 1);
  response.status(204).send();
  

});

module.exports = app;