var MyApp = angular.module("MyApp", ['ngSanitize']);

MyApp.controller("Control", function($scope, $http, $location, $sce){
  
  $scope.blog = {name: 'Name', email: 'email'};
  $scope.post = {name: 'Blobbert', email: 'email', entry: '<h1>HEY</h1>'};
  $scope.renderSnippet = function(snippet) {
    return $sce.trustAsHtml(snippet);
  };
  
  $scope.submitPost = function () {
    $scope.blog.fields = {metadata: {}, content: {}};
    $scope.blog.fields['metadata'] = {"name":$scope.post['name'], "email":$scope.post['email']};
    $scope.blog.fields['content'] = {"content":tinyMCE.get('editor').getContent()};
    $scope.blog.table = 'testdata';
    
    $http.post('/submit', $scope.blog).
      success(function(data) {
	  var applied = setInterval( function()
	  {
	  if($scope.$$phase != '$digest' && $scope.$$phase != '$apply') {
	    $scope.snippet = $scope.renderSnippet(data.fields.content.content);
	    $scope.$apply(); 
	    clearInterval(applied);
	    };
	  }, 500 );
      });
  };
  
});