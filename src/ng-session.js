(function (window) {
  'use strict';

  var ng = window.angular;

  /* Default configuration */
  var config = {
    url: null
  };

  /**
   * ngSession service function.
   */
  function ngSessionServiceFn($rootScope, $http) {
    $rootScope.session = {};

    /**
     * Sign a user in.
     */
    function signin(user) {
      $rootScope.session.user = user;
    }

    /**
     * Sign a user out.
     */
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

    /**
     * Removes a property from the session object.
     *
     * @param {String} key The property name.
     */
    function del(key) {
      delete $rootScope.session[key];
    }

    /**
     * Session update successful.
     */
    function onGetSessionSuccess(res) {
      signin(res.data);
    }

    /**
     * Updates the session user object.
     *
     * @param {String} url URL to overwrite the default url.
     */
    function update(url) {
      if (!url && !config.url) {
        throw new Error('Please configure ngSession!');
      }

      /* Retrieve current session */
      return $http.get(url || config.url)
        .then(onGetSessionSuccess);
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

  /**
   * ngSession run function.
   */
  function ngSessionRunFn($session) {
    $session.update();
  }

  /**
   * Configuration method.
   *
   * @param {Object} config The configuration object.
   */
  function configure(cfg) {
    /* Sets default session GET URL */
    if (ng.isString(cfg.url)) {
      config.url = cfg.url;
    }
  }

  /**
   * ngSession provider definition.
   */
  var ngSessionProviderDef = {
    configure: configure,

    $get: [
      '$rootScope', '$http',

      ngSessionServiceFn
    ]
  };

  /**
   * ngSession provider function.
   */
  function ngSessionProviderFn() {
    return ngSessionProviderDef;
  }

  /* Define AngularJS module */
  ng.module('ngSession', [])

  /* Define service provider */
  .provider('ngSession', ngSessionProviderFn)

  /* Define AngularJS module run function */
  .run([
    'ngSession',

    ngSessionRunFn
  ]);

}(window));
