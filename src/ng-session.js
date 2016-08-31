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
  function ngSessionServiceFn($rootScope, $http, $q) {
    $rootScope.session = {};

    /**
     * Session update successful.
     */
    function onSessionUpdateSuccess(deferred, res) {
      $rootScope.session.user = res.data;

      deferred.resolve(res);
    }

    /**
     * On Sign In success.
     */
    function onSingInSuccess(deferred) {
      return update(null, deferred);
    }

    /**
     * On Sign Out success.
     */
    function onSingOutSuccess(deferred, res) {
      $rootScope.session.user = null;

      deferred.resolve(res);
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
      var deferred = $q.defer();

      /* Remove previous user object */
      $rootScope.session.user = null;

      $http.post(config.signInUrl, data, options)
        .then(onSingInSuccess.bind(null, deferred))
        .catch(deferred.reject);

      return deferred.promise;
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
      var deferred = $q.defer();

      $http.post(config.signOutUrl, data, options)
        .then(onSingOutSuccess.bind(null, deferred))
        .catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Updates the session user object.
     *
     * It will perform a GET to the `config.updateUrl` path and set the
     * session's user object on success with the request's `res.data`.
     *
     * @param {Object} options Optional AngularJS HTTP request options.
     * @param {Promise} deferred Optional deferred promise object.
     *
     * @returns {Promise} req The AngularJS HTTP promise. Will pass along the
     * request's `res` object.
     */
    function update(options, deferred) {
      if (!deferred) {
        deferred = $q.defer();
      }

      /* Retrieve current session */
      $http.get(config.updateUrl, options || {})
        .then(onSessionUpdateSuccess.bind(null, deferred))
        .catch(deferred.reject);

      return deferred.promise;
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
    /* Sets session update GET URL */
    if (ng.isString(cfg.updateUrl)) {
      config.updateUrl = cfg.updateUrl;
    }

    /* Sets sign in POST URL */
    if (ng.isString(cfg.signInUrl)) {
      config.signInUrl = cfg.signInUrl;
    }

    /* Sets sign out POST URL */
    if (ng.isString(cfg.signOutUrl)) {
      config.signOutUrl = cfg.signOutUrl;
    }
  }

  /**
   * ngSession provider definition.
   */
  var ngSessionProviderDef = {
    configure: configure,

    $get: [
      '$rootScope', '$http', '$q',

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
