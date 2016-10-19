(function(window) {
  "use strict";
  var ng = window.angular;
  var CONFIG = {
    signOutUrl: "/api/users/sign-out",
    signInUrl: "/api/users/sign-in",
    updateUrl: "/api/session"
  };
  function ngSessionServiceFn($rootScope, $http, $q) {
    $rootScope.session = {};
    function onSessionUpdateSuccess(deferred, res) {
      $rootScope.session.user = res.data;
      deferred.resolve(res);
    }
    function onSingInSuccess(deferred) {
      return update(null, deferred);
    }
    function onSingOutSuccess(deferred, res) {
      $rootScope.session.user = null;
      deferred.resolve(res);
    }
    function signIn(data, config) {
      var deferred = $q.defer();
      $rootScope.session.user = null;
      $http.post(CONFIG.signInUrl, data, config).then(onSingInSuccess.bind(null, deferred)).catch(deferred.reject);
      return deferred.promise;
    }
    function signOut(data, config) {
      var deferred = $q.defer();
      $http.post(CONFIG.signOutUrl, data, config).then(onSingOutSuccess.bind(null, deferred)).catch(deferred.reject);
      return deferred.promise;
    }
    function reload(data, config, deferred) {
      if (!deferred) {
        deferred = $q.defer();
      }
      $http.put(CONFIG.updateUrl, data, config).then(update.bind(null, config, deferred)).catch(deferred.reject);
      return deferred.promise;
    }
    function update(config, deferred) {
      if (!deferred) {
        deferred = $q.defer();
      }
      $http.get(CONFIG.updateUrl, config).then(onSessionUpdateSuccess.bind(null, deferred)).catch(deferred.reject);
      return deferred.promise;
    }
    function user(prop) {
      var session = $rootScope.session;
      if (!session) {
        return null;
      }
      if (prop && session.user) {
        return session.user[prop];
      }
      return session.user;
    }
    function hasRole(roles, all) {
      var actual = user("roles");
      var matches = 0;
      if (!actual || !actual.length) {
        return false;
      }
      if (ng.isString(actual)) {
        actual = [ actual ];
      }
      if (ng.isString(roles)) {
        roles = [ roles ];
      }
      for (var i = 0, l = roles.length; i < l; i++) {
        if (actual.indexOf(roles[i]) > -1) {
          matches++;
        }
      }
      if (all) {
        return matches === roles.length;
      }
      return !!matches;
    }
    function set(prop, value) {
      $rootScope.session[prop] = value;
    }
    function get(prop) {
      return $rootScope.session[prop];
    }
    function del(prop) {
      delete $rootScope.session[prop];
    }
    var ngSessionServiceDef = {
      hasRole: hasRole,
      signOut: signOut,
      signIn: signIn,
      reload: reload,
      update: update,
      user: user,
      get: get,
      set: set,
      del: del
    };
    return ngSessionServiceDef;
  }
  var resolved = false;
  function sessionResolveFn($session) {
    if (resolved) {
      return resolved;
    }
    resolved = true;
    return $session.update();
  }
  var sessionResolveDef = [ "ngSession", sessionResolveFn ];
  function ngSessionRunFn($route) {
    for (var path in $route.routes) {
      var route = $route.routes[path];
      if (!ng.isObject(route.resolve)) {
        route.resolve = {};
      }
      route.resolve._session = sessionResolveDef;
    }
  }
  function configure(config) {
    if (ng.isString(config.updateUrl)) {
      CONFIG.updateUrl = config.updateUrl;
    }
    if (ng.isString(config.signInUrl)) {
      CONFIG.signInUrl = config.signInUrl;
    }
    if (ng.isString(config.signOutUrl)) {
      CONFIG.signOutUrl = config.signOutUrl;
    }
  }
  var ngSessionProviderDef = {
    configure: configure,
    $get: [ "$rootScope", "$http", "$q", ngSessionServiceFn ]
  };
  function ngSessionProviderFn() {
    return ngSessionProviderDef;
  }
  ng.module("ngSession", []).provider("ngSession", ngSessionProviderFn).run([ "$route", ngSessionRunFn ]);
})(window);