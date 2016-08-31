(function (window) {
  'use strict';

  var ng = window.angular;

  /* Default configuration */
  var config = {
    signOutUrl: '/api/users/sign-out',
    signInUrl: '/api/users/sign-in',
    updateUrl: '/api/session'
  };

  /**
   * ngSession service function.
   */
  function ngSessionServiceFn($rootScope, $http) {
    $rootScope.session = {};

    /**
     * Session update successful.
     */
    function onSessionUpdateSuccess(res) {
      $rootScope.session.user = res.data;
      return res;
    }

    /**
     * On Sign In success.
     */
    function onSingInSuccess() {
      return update().then(onSessionUpdateSuccess);
    }

    /**
     * On Sign Out success.
     */
    function onSingOutSuccess(res) {
      $rootScope.session.user = null;
      return res;
    }

    /**
     * Signs a user in.
     *
     * It will perform a POST to the `config.signOutUrl` path and assign the
     * user object from the `res.data` object on success.
     *
     * @param {Object} data The data to send for sign in.
     * @param {Object} options Optional AngularJS HTTP request options.
     *
     * @returns {Promise} req The AngularJS HTTP promise. Will pass along the
     * request's `res` object.
     */
    function signIn(data, options) {
      /* Remove previous user object */
      $rootScope.session.user = null;

      return $http.post(config.signInUrl, data, options)
        .then(onSingInSuccess);
    }

    /**
     * Signs a user out.
     *
     * It will perform a POST to the `config.signOutUrl` path and delete the
     * user object on success.
     *
     * @param {Object} data The optional data to send for sign out.
     * @param {Object} options Optional AngularJS HTTP request options.
     *
     * @returns {Promise} req The AngularJS HTTP promise. Will pass along the
     * request's `res` object.
     */
    function signOut(data, options) {
      return $http.post(config.signOutUrl, data, options)
        .then(onSingOutSuccess);
    }

    /**
     * Updates the session user object.
     *
     * It will perform a GET to the `config.updateUrl` path and set the
     * session's user object on success with the request's `res.data`.
     *
     * @param {Object} options Optional AngularJS HTTP request options.
     *
     * @returns {Promise} req The AngularJS HTTP promise. Will pass along the
     * request's `res` object.
     */
    function update(options) {
      /* Retrieve current session */
      return $http.get(config.updateUrl, options)
        .then(onSessionUpdateSuccess);
    }

    /**
     * Retrieves a user data value by property name.
     *
     * @param {String} prop The property name to retrieve.
     *
     * @returns {Mixed} value The property's value or the user object if no
     * property name is provided.
     */
    function user(prop) {
      if (prop && $rootScope.session.user) {
        return $rootScope.session.user[prop];
      }

      return $rootScope.session.user;
    }

    /**
     * Obtains a value from the session object.
     *
     * @param {String} prop The property name to obtain.
     *
     * @returns {Mixed} value The property's value.
     */
    function get(prop) {
      return $rootScope.session[prop];
    }

    /**
     * Sets a value in the session object.
     *
     * @param {String} prop The property name to set.
     * @param {Mixed} value The property value to set.
     */
    function set(prop, value) {
      $rootScope.session[prop] = value;
    }

    /**
     * Deletes a property from the session object.
     *
     * @param {String} prop The property name.
     */
    function del(prop) {
      delete $rootScope.session[prop];
    }

    /* Session service definition */
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
