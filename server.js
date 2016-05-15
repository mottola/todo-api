var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());


// root/home route
app.get('/', function(req, res) {
    res.send('Todo API root');
});

// GET / READ in CRUD
app.get('/todos', function(req, res) {
    var queryParams = req.query;
    var filteredTodos = todos;
    // if has property && completed === 'true'
    // _.where
    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {
            completed: true
        });
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {
            completed: false
        });
    }
    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
      filteredTodos = _.filter(filteredTodos, function (todo) {
        return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
      });
    }

    //convert to JSON
    res.json(filteredTodos);
});

// GET /todos/:id  to show a specific todos
app.get('/todos/:id', function(req, res) {
    // use parseInt to make certain the request is as an int
    var todoId = parseInt(req.params.id, 10);

    // user underscore to search through todo
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

// POST - add a new todo to our array -CREATE in CRUD
app.post('/todos', function(req, res) {
    // get rid of undesired input
    var body = _.pick(req.body, 'description', 'completed');

    // use underscore isBoolean and isString for input validation
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }
    // sanitize unnecessary spaces
    body.description = body.description.trim();

    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
});

// DELETE /todos/:id - DELETE in CRUD
app.delete('/todos/:id', function(req, res) {
    // make sure integer
    var todoId = parseInt(req.params.id, 10);
    // find and store todo to be deleted using underscore findWhere
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (!matchedTodo) {
        res.status(404).json({
            'error': 'no todo found with that id'
        });
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
});

// PUT /todos/:id  - UPDATE in CRUD
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(404).send();
    }

    // validate boolean with hasOwnProperty
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    // validate description with hasOwnProperty
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(404).send();
    }

    // use underscore extend method to update properties
    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});

app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});
