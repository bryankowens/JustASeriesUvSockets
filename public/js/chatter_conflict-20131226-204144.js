'use strict';

/* Controllers */

angular.module('chatter', ['ngCookies']);

function TodoCtrl($scope, $cookies) {
    var socket = io.connect();
    socket.on('change', function(obj) {
        $scope.todos = obj;
        $scope.$apply();
	console.log(typeof connect.sid);
    });
    
    socket.on('session', function(session){
      console.log(session);
    });
    
    socket.on('notice', function(data){
      console.log(data);
    });
    
    $scope.addTodo = function() {
        $scope.todos.push({text:$scope.todoText, done:false});
        $cookies.timestamp = "Blah blah blah fooey";
        $cookies.NameOfMyCookie = "Setting a value";
        $cookies.soundry = JSON.stringify({whenever:Date.now()});

        $scope.todoText = '';
        socket.emit('change', $scope.todos);
        console.log(JSON.parse($cookies.soundry).whenever);
    };

    $scope.remaining = function() {
        var count = 0;
        angular.forEach($scope.todos, function(todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };

    $scope.archive = function() {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function(todo) {
            if (!todo.done) $scope.todos.push(todo);
        });
        socket.emit('change', $scope.todos);
    };

    $scope.change = function() {
        socket.emit('change', $scope.todos);
    };
}