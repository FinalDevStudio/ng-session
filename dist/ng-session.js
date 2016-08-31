(function(window) {
  "use strict";
  var ng = window.angular;
  var config = {
    signOutUrl: "/api/users/sign-out",
    signInUrl: "/api/users/sign-in",
    updateUrl: "/api/session"
  };
  function ngSessionServiceFn($rootScope, $http) {
    $rootScope.session = {};
    function onSingInSuccess(res) {
      $rootScope.session.user = res.data;
      return res;
    }
    function signIn(data, options) {
      return $http.post(config.signInUrl, data, options).then(onSingInSuccess);
    }
    function onSingOutSuccess(res) {
      $rootScope.session.user = null;
      return res;
    }
    function signOut(data, options) {
      return $http.post(config.signOutUrl, data, options).then(onSingOutSuccess);
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
    function onGetSessionSuccess(res) {
      signIn(res.data);
    }
    function update(url) {
      return $http.get(url || config.url).then(onGetSessionSuccess);
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
    if (ng.isString(cfg.url)) {
      config.url = cfg.url;
    }
  }
  var ngSessionProviderDef = {
    configure: configure,
    $get: [ "$rootScope", "$http", ngSessionServiceFn ]
  };
  function ngSessionProviderFn() {
    return ngSessionProviderDef;
  }
  ng.module("ngSession", []).provider("ngSession", ngSessionProviderFn).run([ "ngSession", ngSessionRunFn ]);
})(window);