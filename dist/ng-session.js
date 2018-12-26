(function(window) {
  "use strict";
  var ng = window.angular;
  var defaults = {
    signOutUrl: "/api/users/sign-out",
    signInUrl: "/api/users/sign-in",
    updateUrl: "/api/session",
    cache: false
  };
  var updatedAt;
  function ngSessionServiceFn($rootScope, $http, $q) {
    $rootScope.session = {};
    function onSessionUpdateSuccess(deferred, res) {
      $rootScope.session.user = res.data;
      updatedAt = new Date();
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
      $http.post(defaults.signInUrl, data, config).then(onSingInSuccess.bind(null, deferred), deferred.reject);
      return deferred.promise;
    }
    function signOut(data, config) {
      var deferred = $q.defer();
      $http.post(defaults.signOutUrl, data, config).then(onSingOutSuccess.bind(null, deferred), deferred.reject);
      return deferred.promise;
    }
    function resolve() {
      if (ng.isDate(updatedAt)) {
        if (typeof defaults.cache == "boolean" && defaults.cache) {
          return $q.resolve();
        }
        if (ng.isNumber(defaults.cache) && updatedAt.valueOf() + defaults.cache > Date.now()) {
          return $q.resolve();
        }
      }
      return update();
    }
    function reload(data, config, deferred) {
      if (!deferred) {
        deferred = $q.defer();
      }
      $http.put(defaults.updateUrl, data, config).then(update.bind(null, config, deferred), deferred.reject);
      return deferred.promise;
    }
    function update(config, deferred) {
      if (!deferred) {
        deferred = $q.defer();
      }
      $http.get(defaults.updateUrl, config).then(onSessionUpdateSuccess.bind(null, deferred), deferred.reject);
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
      resolve: resolve,
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
  function sessionResolveFn($session) {
    return $session.resolve();
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
  function configure(cfg) {
    if (ng.isString(cfg.updateUrl)) {
      defaults.updateUrl = cfg.updateUrl;
    }
    if (ng.isString(cfg.signInUrl)) {
      defaults.signInUrl = cfg.signInUrl;
    }
    if (ng.isString(cfg.signOutUrl)) {
      defaults.signOutUrl = cfg.signOutUrl;
    }
    if (ng.isNumber(cfg.cache) || typeof cfg.cache == "boolean") {
      defaults.cache = cfg.cache;
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