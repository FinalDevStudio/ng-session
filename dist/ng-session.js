(function(window) {
  "use strict";
  var ng = window.angular;
  var config = {
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
    function signIn(data, options) {
      var deferred = $q.defer();
      $rootScope.session.user = null;
      $http.post(config.signInUrl, data, options).then(onSingInSuccess.bind(null, deferred)).catch(deferred.reject);
      return deferred.promise;
    }
    function signOut(data, options) {
      var deferred = $q.defer();
      $http.post(config.signOutUrl, data, options).then(onSingOutSuccess.bind(null, deferred)).catch(deferred.reject);
      return deferred.promise;
    }
    function reload(data, options, deferred) {
      if (!deferred) {
        deferred = $q.defer();
      }
      $http.put(config.updateUrl, data, options || {}).then(update.bind(null, options, deferred)).catch(deferred.reject);
      return deferred.promise;
    }
    function update(options, deferred) {
      if (!deferred) {
        deferred = $q.defer();
      }
      $http.get(config.updateUrl, options || {}).then(onSessionUpdateSuccess.bind(null, deferred)).catch(deferred.reject);
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
  function sessionResolveFn($session) {
    return $session.update({
      cache: true
    });
  }
  var sessionResolveDef = [ "ngSession", sessionResolveFn ];
  function ngSessionRunFn($route) {
    for (var path in $route.routes) {
      var route = $route.routes[path];
      if (!ng.isObject(route.resolve)) {
        route.resolve = {};
      }
      route.resolve.__ngsession = sessionResolveDef;
    }
  }
  function configure(cfg) {
    if (ng.isString(cfg.updateUrl)) {
      config.updateUrl = cfg.updateUrl;
    }
    if (ng.isString(cfg.signInUrl)) {
      config.signInUrl = cfg.signInUrl;
    }
    if (ng.isString(cfg.signOutUrl)) {
      config.signOutUrl = cfg.signOutUrl;
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