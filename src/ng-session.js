/**
 * ngSession
 *
 * @description Session handler module for AngularJS.
 * @module ngSession
 * @author Final Development Studio
 * @license MIT
 */

(function(window) {
  'use strict';

  var ng = window.angular;

  /* Default configuration */
  var defaults = {
    signOutUrl: '/api/users/sign-out',
    signInUrl: '/api/users/sign-in',
    updateUrl: '/api/session',
    cache: false
  };

  var updatedAt;

  /**
   * ngSession service function.
   *
   * @private
   */
  function ngSessionServiceFn($rootScope, $http, $q) {
    $rootScope.session = {};

    /**
     * @module ngSession
     * @description ngSession Service
     */

    /**
     * Session update successful.
     *
     * @private
     */
    function onSessionUpdateSuccess(deferred, res) {
      $rootScope.session.user = res.data;

      updatedAt = new Date();

      deferred.resolve(res);
    }

    /**
     * On Sign In success.
     *
     * @private
     */
    function onSingInSuccess(deferred) {
      return update(null, deferred);
    }

    /**
     * On Sign Out success.
     *
     * @private
     */
    function onSingOutSuccess(deferred, res) {
      $rootScope.session.user = null;

      deferred.resolve(res);
    }

    /**
     * Signs a user in.
     *
     * It will perform a `POST` to the `defaults.signOutUrl` path and perform an
     * `update` if successful.
     *
     * @param {Object} data The data to send for sign in.
     * @param {Object} config Optional AngularJS HTTP request configuration.
     *
     * @returns {Promise} A promise resolving the request's `res` object.
     *
     * @example
     * ngSession.signIn($scope.data)
     *   .then(function (res) {})
     *   .catch(function (res) {})
     */
    function signIn(data, config) {
      var deferred = $q.defer();

      /* Remove previous user object */
      $rootScope.session.user = null;

      $http.post(defaults.signInUrl, data, config).then(onSingInSuccess.bind(null, deferred), deferred.reject);

      return deferred.promise;
    }

    /**
     * Signs a user out.
     *
     * It will perform a POST to the `defaults.signOutUrl` path and delete the
     * user object on success.
     *
     * @param {Object} data The optional data to send for sign out.
     * @param {Object} config Optional AngularJS HTTP request configuration.
     *
     * @returns {Promise} A promise resolving the request's `res` object.
     *
     * @example
     * ngSession.signOut($scope.data)
     *   .then(function (res) {})
     *   .catch(function (res) {})
     */
    function signOut(data, config) {
      var deferred = $q.defer();

      $http.post(defaults.signOutUrl, data, config).then(onSingOutSuccess.bind(null, deferred), deferred.reject);

      return deferred.promise;
    }

    /**
     * Reloads the session user object.
     *
     * It will perform a PUT to the `defaults.updateUrl` path and then a
     * consecuent session `update`.
     *
     * The server should handle the OUt request as a reload request and fetch
     * updated session data.
     *
     * @param {Object} data The optional data to send for the reload.
     * @param {Object} config Optional AngularJS HTTP request configuration.
     * @param {Promise} deferred Optional deferred promise object.
     *
     * @returns {Promise} A promise resolving the request's `res` object.
     *
     * @example
     * ngSession.reload($scope.data)
     *   .then(function (res) {})
     *   .catch(function (res) {})
     */
    function reload(data, config, deferred) {
      if (!deferred) {
        deferred = $q.defer();
      }

      /* Reloads current session */
      $http.put(defaults.updateUrl, data, config).then(update.bind(null, config, deferred), deferred.reject);

      return deferred.promise;
    }

    /**
     * Updates the session user object.
     *
     * It will perform a GET to the `defaults.updateUrl` path and set the
     * session's user object on success with the request's `res.data`.
     *
     * @param {Object} config Optional AngularJS HTTP request configuration.
     * @param {Promise} deferred Optional deferred promise object.
     *
     * @returns {Promise} A promise resolving the request's `res` object.
     *
     * @example
     * ngSession.update()
     *   .then(function (res) {})
     *   .catch(function (res) {})
     */
    function update(config, deferred) {
      if (!deferred) {
        deferred = $q.defer();
      }

      /* Retrieve current session */
      $http.get(defaults.updateUrl, config).then(onSessionUpdateSuccess.bind(null, deferred), deferred.reject);

      return deferred.promise;
    }

    /**
     * Retrieves a user data value by property name.
     *
     * @param {String} prop The property name to retrieve.
     *
     * @returns {Mixed} The property's value or the user object if no
     * property name is provided.
     *
     * @example ngSession.user('name'); // => 'John Smith'
     */
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

    /**
     * Checks if the current user has any or all of the provided roles.
     *
     * @param {(String|String[])} roles The required roles.
     * @param {Boolean} all If all the provided roles are required.
     *
     * @return {Boolean}
     *
     * @example
     * ngSession.hasRole('ROLE.ADMIN'); // => false
     * ngSession.hasRole('ROLE.USER'); // => true
     * ngSession.hasRole(['ROLE.ADMIN', 'ROLE.USER']); // => true
     * ngSession.hasRole(['ROLE.ADMIN', 'ROLE.USER'], true); // => false
     */
    function hasRole(roles, all) {
      var actual = user('roles');
      var matches = 0;

      if (!actual || !actual.length) {
        return false;
      }

      if (ng.isString(actual)) {
        actual = [actual];
      }

      if (ng.isString(roles)) {
        roles = [roles];
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

    /**
     * Sets a value in the session object.
     *
     * @param {String} prop The property name to set.
     * @param {Mixed} The property value to set.
     *
     * @example ngSession.set('test', 'Test Value');
     */
    function set(prop, value) {
      $rootScope.session[prop] = value;
    }

    /**
     * Obtains a value from the session object.
     *
     * @param {String} prop The property name to obtain.
     *
     * @returns {Mixed} The property's value.
     *
     * @example ngSession.get('test'); // => 'Test Value'
     */
    function get(prop) {
      return $rootScope.session[prop];
    }

    /**
     * Deletes a property from the session object.
     *
     * @param {String} prop The property name.
     *
     * @example
     * ngSession.del('test');
     * ngSession.get('test'); // => null
     */
    function del(prop) {
      delete $rootScope.session[prop];
    }

    /* Session service definition */
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

  /**
   * Session resolve callback function.
   *
   * @private
   */
  function sessionResolveFn($session) {
    console.log('Resolving session...');

    if (ng.isDate(updatedAt)) {
      console.log('Updated at is date...');

      if (typeof defaults.cache == 'boolean' && defaults.cache) {
        console.log('Cache is boolean and should not update...');
        return;
      }

      if (ng.isNumber(defaults.cache) && updatedAt.valueOf() + defaults.cache > Date.now()) {
        console.log('Cache is number and should not update...');
        return;
      }
    }

    console.log('Updated at is', typeof updatedAt);

    return $session.update();
  }

  /* Session resolve definition */
  var sessionResolveDef = ['ngSession', sessionResolveFn];

  /**
   * ngSession run function.
   *
   * @private
   */
  function ngSessionRunFn($route) {
    for (var path in $route.routes) {
      var route = $route.routes[path];

      if (!ng.isObject(route.resolve)) {
        route.resolve = {};
      }

      route.resolve._session = sessionResolveDef;
    }
  }

  /**
   * @module ngSessionProvider
   * @description ngSession Provider
   */

  /**
   * Configuration method.
   *
   * @param {Object} cfg The configuration object.
   * @param {Object} cfg.updateUrl The session update URL (GET|PUT).
   * @param {Object} cfg.signInUrl The session sign in URL (POST).
   * @param {Object} cfg.signOutUrl The session sign out URL (POST).
   * @param {Number|Boolean} cfg.cache The session cache behavior. Number is the milliseconds to cache the session for.
   * A boolean "true" will cache the session forever.
   *
   * @example
   * ngSessionProvider.configure({
   *   signOutUrl: '/api/users/sign-out',
   *   signInUrl: '/api/users/sign-in',
   *   updateUrl: '/api/session',
   *   cache: '1h'
   * });
   */
  function configure(cfg) {
    /* Sets session update GET URL */
    if (ng.isString(cfg.updateUrl)) {
      defaults.updateUrl = cfg.updateUrl;
    }

    /* Sets sign in POST URL */
    if (ng.isString(cfg.signInUrl)) {
      defaults.signInUrl = cfg.signInUrl;
    }

    /* Sets sign out POST URL */
    if (ng.isString(cfg.signOutUrl)) {
      defaults.signOutUrl = cfg.signOutUrl;
    }

    /* Sets the cache behavior */
    if (ng.isNumber(cfg.cache) || typeof cfg.cache == 'boolean') {
      defaults.cache = cfg.cache;
    }
  }

  /**
   * ngSession provider definition.
   *
   * @private
   */
  var ngSessionProviderDef = {
    configure: configure,

    $get: ['$rootScope', '$http', '$q', ngSessionServiceFn]
  };

  /**
   * ngSession provider function.
   *
   * @private
   */
  function ngSessionProviderFn() {
    return ngSessionProviderDef;
  }

  /* Define AngularJS module */
  ng.module('ngSession', [])

    /* Define service provider */
    .provider('ngSession', ngSessionProviderFn)

    /* Define AngularJS module run function */
    .run(['$route', ngSessionRunFn]);
})(window);
