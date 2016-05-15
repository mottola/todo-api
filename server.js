var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

// array to store data, once we use a database, this won't be necessary
var todos = [{
    id: 1,
    description: 'Study node.js',
    completed: false
}, {
    id: 2,
    description: 'Go to WholeFoods',
    completed: false
}, {
    id: 3,
    description: 'Help Anna with Code',
    completed: true
}];

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

app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});
