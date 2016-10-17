'use strict';

angular.
  module('navbar').
  component('navbar', {
    controller: ['$scope', 'CONFIG',
      function NavbarCtrl($scope, CONFIG) {
        this.homeButton = {
          link: '/',
          title: CONFIG.appName,
        };
      }
    ],

    template: `
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="{{$ctrl.homeButton.link}}">{{$ctrl.homeButton.title}}</a>
            </div>
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav"></ul>
            </div>
        </div>
    </nav>
    `,
  });