'use strict';

angular.
  module('core.authorization').
  factory('Authorization', [
    '$state', '$log', 'User', 'localStorageService', 'CONFIG',
    function($state, $log, User, localStorageService, CONFIG) {
      this.authorized  = localStorageService.get('lastAuth') || false;
      const getAuthorized = () => this.authorized;

      const init = () => {
        update();
      };

      const setUser = (user) => {this.user = user;};
      const getUser = () => this.user;

      const update = () => {
        User.get(user => {
          if (user.local != undefined) this.authorized = true;
          if (CONFIG.debug) $log.log(`- Authorization init with ${this.authorized}`);
          localStorageService.set('lastAuth', this.authorized);
        });
      };

      const clear = () => {
        this.authorized = false;
        this.user = undefined;
        localStorageService.set('lastAuth', this.authorized);
      };

      const go = (targetState = 'home') => {
        this.authorized = true;
        $state.go(targetState);
        localStorageService.set('lastAuth', this.authorized);
      };

      return {
        init,
        authorized: getAuthorized,
        clear,
        go,
        setUser,
        getUser
      };
    }
  ]);