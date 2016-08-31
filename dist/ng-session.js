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
    function update(options, deferred) {
      if (!deferred) {
        deferred = $q.defer();
      }
      $http.get(config.updateUrl, options || {}).then(onSessionUpdateSuccess.bind(null, deferred)).catch(deferred.reject);
      return deferred.promise;
    }
    function user(prop) {
      if (prop && $rootScope.session.user) {
        return $rootScope.session.user[prop];
      }
      return $rootScope.session.user;
    }
    function get(prop) {
      return $rootScope.session[prop];
    }
    function set(prop, value) {
      $rootScope.session[prop] = value;
    }
    function del(prop) {
      delete $rootScope.session[prop];
    }
    var ngSessionServiceDef = {
      signOut: signOut,
      signIn: signIn,
      update: update,
      user: user,
      get: get,
      set: set,
      del: del
    };
    return ngSessionServiceDef;
  }
  function ngSessionRunFn($session) {
    $session.update();
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
  ng.module("ngSession", []).provider("ngSession", ngSessionProviderFn).run([ "ngSession", ngSessionRunFn ]);
})(window);