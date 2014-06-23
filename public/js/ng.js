'use strict';

// Cleans up hash left over from Facebook auth
window.location.hash = '';
new K('http://bit.ly/1m9pSFC');

angular.module('TodoApp', [
  'ui.bootstrap',
  'firebase'
])
.service('genFB', function($window, $firebase) {
  // Helper for $firebase
  return function(location) {
    return $firebase(new $window.Firebase('https://mashape-todo.firebaseio.com/' + $window.fburl + '/' + location));
  };
})
.controller('TasksCtrl', function($scope, $http, $window, genFB) {
  $scope.tasks = genFB('tasks');
  
  // 0 - Dirty state
  // 1 - Save in progress
  // 2 - Save completed
  $scope.saveState = 0;
  $scope.newTask = {};
  $scope.filters = {};
  $scope.user = {
    phone: $window.phone
  };

  // Whenever tasks changes, save the changes to Firebase
  $scope.tasks.$on('loaded', function() {
    $scope.$watch(function() {
      return $scope.tasks;
    }, function() {
      $scope.tasks.$save();
    }, true);
  });
  
  // Dirty bit checking for phone form
  $scope.$watch('user.phone', function() {
    $scope.saveState = 0;
  });
  
  $scope.createTask = function() {
    if ($scope.newTask.tags) {
      $scope.newTask.tags = $scope.newTask.tags.split(',').map(function(str) { return str.toLowerCase().trim(); }).filter(Boolean);
    }
    $scope.newTask.completed = false;
    $scope.newTask.created = new Date();
    $scope.tasks.$add($scope.newTask);
    $scope.newTask = {};
  };
  
  $scope.deleteTask = function(key) {
    if (confirm('Are you sure you want to delete this task?')) {
      $scope.tasks.$remove(key);
    }
  };
  
  $scope.saveUserSettings = function() {
    $scope.saveState = 1;
    $scope.saveError = '';
    $http.put('/profile', {
      phone: $scope.user.phone,
      _method: 'put'
    })
    .success(function() {
      $scope.saveState = 2;
    }).error(function(err) {
      $scope.saveError = err;
    });
  };
  
  $scope.saveBtnText = function() {
    switch ($scope.saveState) {
      case 0:
        return 'Save';
      case 1:
        return 'Saving...';
      case 2:
        return 'Saved';
    }
  };
  
  $scope.sendText = function(task) {
    if (!user.phone || !task.completed) { return; }
    $http.post('/text', {
      title: task.title
    });
  };
});