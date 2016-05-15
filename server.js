var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());


// root/home route
app.get('/', function(req, res) {
    res.send('Todo API root');
});

// GET /todos to show our todos
app.get('/todos', function(req, res) {
    //convert to JSON
    res.json(todos);
});

// GET /todos/:id  to show a specific todos
app.get('/todos/:id', function(req, res) {
    // use parseInt to make certain the request is as an int
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo;

    // iterate array looking for match
    todos.forEach(function(todo) {
        if (todoId === todo.id) {
            matchedTodo = todo;
        }
    });

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

// POST
app.post('/todos', function (req, res) {
  var body = req.body;

  body.id = todoNextId++;

  todos.push(body);

  console.log('description');

  res.json(body);
});

app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});
