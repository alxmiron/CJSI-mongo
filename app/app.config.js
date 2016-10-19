'use strict';

angular
  .module('OMDbHero')
    .config([
      '$locationProvider',
      '$routeProvider',
      'localStorageServiceProvider',
      ($locationProvider, $routeProvider, localStorageServiceProvider) => {
        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode(true);
        $routeProvider.
          when('/', {
            template: '<movies-block favourites="MainCtrl.favourites" notifyevents="MainCtrl.notifyEvents"></movies-block>',
            private: true
          }).
          when('/movie/:movieID', {
            template: '<movie-details favourites="MainCtrl.favourites" notifyevents="MainCtrl.notifyEvents"></movie-details>',
            private: true
          }).
          when('/login', {
            template: '<entry-login notifyevents="MainCtrl.notifyEvents"></entry-lofin>'
          }).
          when('/signup', {
            template: '<entry-register notifyevents="MainCtrl.notifyEvents"></entry-register>'
          }).
          otherwise({ redirectTo: '/' });

        localStorageServiceProvider
          .setPrefix('omdbhero');
      }])

      .controller('OMDbHero.Controller', [
        '$scope', '$rootScope', '$log', 'localStorageService',
        function($scope, $rootScope, $log, localStorageService) {
          this.notifyEvents = [];
          $rootScope.user = {
            logined: true
          };
          this.favourites = localStorageService.get('favourites');
          if (!this.favourites) this.favourites = [];
        }])

      .run( ['$rootScope', '$location', '$log', 'CONFIG',
        function($rootScope, $location, $log, CONFIG) {
          $rootScope.$on( '$routeChangeStart', (event, next) => {
            if (!$rootScope.user.logined && next.private) {
              if (CONFIG.debug) $log.log('Redirecting to /login');
              $location.path( '/login' );
            }
          });
        }])

    .constant('CONFIG', {
      'moviesPerPage': 10,
      'appDomain': 'http://localhost:3000',
      'omdbAPI': '6f0a67d0',
      'appName': 'OMDb Hero',
      'debug': true
    });
