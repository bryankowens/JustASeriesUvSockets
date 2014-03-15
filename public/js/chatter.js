'use strict';

var socket = io.connect();

var chatter = angular.module('chatter', ['ngCookies','ngSanitize'],function($compileProvider) {
  $compileProvider.directive('compile', function($compile) {
    
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          return scope.$eval(attrs.compile);
        },
        function(value) {
          element.html(value);
          $compile(element.contents())(scope);
        }
      );
    };
  })
}).config(['$locationProvider', function ($locationProvider) {
		$locationProvider.html5Mode(true);
            }]);

chatter.factory('general', function($sce) {
    var sid = {};
    sid.name = '<h1><b>Nobody Is Logged In</b></h1>';
    return {
        renderSnippet: function(snippet) {
	  return $sce.trustAsHtml(snippet);
	},
	salty: function(data) {
	  return CryptoJS.SHA3(d, { outputLength: 512 }).toString(CryptoJS.enc.Base64);
	},
     }	    
});

function TbarCtrl($scope, $cookies, $http, $location, $compile, $sce, general) {
  
    socket.emit('startup', {cryptoken: $cookies.token || 'NoLogin'});

    socket.on('startup', function(data){
      $scope.userStore = "<h1>TEST</h1>";
      $cookies.token = data.cryptoken || "NoLogin";
      $scope.profile = data.profile;
      if (data.content.length == 0) {
	$scope.userMenu = "<div> HEY! </div>"
      } else {
	$scope.userMenu = data.content[0].htmlblob;
	$cookies.loginscreen = LZString.compress(data.content[0].htmlblob);
      }
      $scope.$apply();

    });
    socket.on('login', function(datum){
      console.log("Logging in:");
      console.log(datum);
      $cookies.token = datum.cryptoken;
      $scope.profile = datum.profile;
      $scope.blocks = datum.blocks;
      $scope.userStore = datum.forms[0].typeforms.form;
      $scope.$apply();	
    });
    
    $scope.submit = function(content) {      
      var submission = {}
      submission.oid = content.id;
      submission.content = content;
      submission.author = $scope.profile;
      socket.emit('submit', submission);
    }
    
    $scope.render = function(indexnumber) {
      //console.log("Index number is " + indexnumber);
      //console.log($scope.blocks[indexnumber].codeblob);
      var applied = setInterval( function()
	{
	if($scope.$$phase != '$digest' && $scope.$$phase != '$apply') {
	  $scope.userStore = $scope.blocks[indexnumber].codeblob;
	  $scope.$apply(); 
	  clearInterval(applied);
	  };
	}, 100 );
    }

    $scope.loginForm = function(formdata) {
      var logindata = {username: formdata.userName, password: formdata.userPassword, display: formdata.displayName || "blank", repeatemail: formdata.repeatEmail || "blank", repeatpassword: formdata.repeatPassword || "blank"};
      socket.emit('login', logindata);
    }
    
    $scope.logoutForm = function() {
      socket.emit('terminate', {cryptoken: $cookies.token});
    }

    socket.on('terminate', function(datum){
	eval(datum);
    });
    
    socket.on('update', function(datum){
      console.log(datum);
      for (var items in datum){
	console.log(datum[items]);
	$("#updates").prepend("<div>"+datum[items].content.body+"</div>").fadeIn(2000);
	console.log(items.content);
      }
      
    })
    
    setInterval(function(){
      socket.emit('update', $scope.profile);
    },60000);
    
};
