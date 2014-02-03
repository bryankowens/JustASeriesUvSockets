var myApp = angular.module('myApp',[]).config(function($httpProvider){});

 
myApp.controller('FirstCtrl', ['$scope', function($scope){
    $scope.data = {message: "Hello",color: "red"};
    $scope.customSpice = "wasabi";
    $scope.spice = typeof $scope.data;
    
    $scope.spicy = function(spice){
        $scope.spice = spice;
    };
}]);

myApp.controller('SecondCtrl', ['$scope', function($scope, $http, $location){
    
    $scope.blog = {name: 'Name', email: 'email'};

    // Function to be called when pressing ENTER
    $scope.myFunc = function() {
      $http.put('/submit', $scope.form).success(function(data) {
        $location.path('/ang1');
      });
    };
    
    $scope.updateFromModel = 'Initial Value';
    $scope.timeNow = Date();
    setInterval( function()
    {
        $scope.updateFromModel = "As of " + Date.now();
        $scope.timeNow = Date();
        $scope.$apply();
    }, 10 );
}]);

function AddPostCtrl($scope, $http, $location) {
  
  $scope.blog = {name: 'Name', email: 'email'};
  $scope.submitPost = function () {
    $http.post('/api/post', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}