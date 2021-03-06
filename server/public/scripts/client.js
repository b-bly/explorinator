var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngMap']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
 // console.log('myApp -- config')
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'PlaceController as pc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/add', {
      templateUrl: '/views/templates/add.html',
      controller: 'PlaceController as pc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/public/:userName', {
      templateUrl: '/views/templates/public.html',
      controller: 'PublicController as pc'
    })
    .otherwise({
      redirectTo: 'home'
    });
});


