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
  
    socket.emit('startup', {cryptoken: $cookies.token || 'NoLogon'});

    var markup = "socket.emit('startup', {cryptoken: $cookies.token || 'NoLogon'})";
    socket.on('startup', function(data){
      $scope.userStore = "<h1>TEST</h1>";
      $scope.userMenu = data;

    });
    socket.on('login', function(datum){
      console.log("Show data now...");console.log(datum);
      var divstring = "BEGIN: ";
      $cookies.token = datum.cryptoken;
      $scope.profile = datum.profile;
      $scope.blocks = datum.blocks;
//      for (var index = 0; index < datum.blocks.length; ++index) {
//	 divstring = divstring + '<ol><a class="btn btn-primary btn-large" ng-click="render('+ index + ')"><i class="icon-white icon-user"></i>'+ datum.blocks[index].funcmeta.displayname + '</a></ol>';
 //     }
      $scope.userMenu = divstring;
      $scope.$apply();
    });    
    
    $scope.submit = function(content) {
      console.log(content);
    }
    
    $scope.render = function(indexnumber) {
      console.log("Index number is " + indexnumber);
      console.log($scope.blocks[indexnumber].codeblob);
      var applied = setInterval( function()
	{
	if($scope.$$phase != '$digest' && $scope.$$phase != '$apply') {
	  $scope.userStore = $scope.blocks[indexnumber].codeblob;
	  $scope.$apply(); 
	  clearInterval(applied);
	  };
	}, 100 );
    }
    
    $scope.loginoption = "Login";
    $scope.loginchoice = function() {
      if ($scope.loginoption == "Login") {
	$scope.loginoption = "Register";
	$scope.newuserdiv = "hidden";
	$scope.logintype = "register";
      }
      else {
	$scope.loginoption = "Login";
	$scope.newuserdiv = "none";
	$scope.logintype = "login";
      }
    };
    $scope.loginForm = function(formdata) {
      var logindata = {username: formdata.userName, password: formdata.userPassword, display: formdata.displayName || "blank", repeatemail: formdata.repeatEmail || "blank", repeatpassword: formdata.repeatPassword || "blank"};
      socket.emit('login', logindata);
    }
    $scope.logoutForm = function() {
      console.log("Requesting logout");
      socket.emit('terminate', {cryptoken: $cookies.token});
    }

    socket.on('terminate', function(datum){
       // eval(datum);
	//delete $cookies.token;
    });
};
