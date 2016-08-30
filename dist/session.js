(function(window) {
  "use strict";
  var ng = window.angular;
  var config = {
    url: null
  };
  function ngSessionServiceFn($rootScope, $http) {
    $rootScope.session = {};
    function signin(user) {
      $rootScope.session.user = user;
    }
    function signout() {
      $rootScope.session.user = null;
    }
    function user(field) {
      if (field && $rootScope.session.user) {
        return $rootScope.session.user[field];
      }
      return !!$rootScope.session.user;
    }
    function get(key) {
      return $rootScope.session[key];
    }
    function set(key, value) {
      $rootScope.session[key] = value;
    }
    function del(key) {
      delete $rootScope.session[key];
    }
    function onGetSessionSuccess(res) {
      signin(res.data);
    }
    function update(url) {
      if (!url && !config.url) {
        throw new Error("Please configure ngSession!");
      }
      return $http.get(url || config.url).then(onGetSessionSuccess);
    }
    return {
      signout: signout,
      signin: signin,
      update: update,
      user: user,
      get: get,
      set: set,
      del: del
    };
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