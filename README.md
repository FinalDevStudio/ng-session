# ng-session [![Build Status](https://travis-ci.org/FinalDevStudio/ng-session.svg?branch=master)](https://travis-ci.org/FinalDevStudio/ng-session)

Session handler for AngularJS

## Installation

Using bower, install with this command:

```sh
bower install --save ng-session
```

Then add either the `dist/ng-session.js` for development or the `dist/ng-session.min.js` for production to your application scripts.

And finally, add the `ngSession` module to your AngularJS application dependencies.

## Usage

This module defines a `session` object into the root scope, so you can access the values directly with `$rootScope.session` from your controllers or directives or with `$root.session` from your templates.

### Configuration

Ideally, the default URLs should do the job but you can configure the URLs during your application's config phase.

The default URLs are as follows:

```javascript
{
  signOutUrl: '/api/users/sign-out',
  signInUrl: '/api/users/sign-in',
  updateUrl: '/api/session'
}
```

### Provider

Use the provider to change the default URLs.

```javascript
angular.module('MyApp').config([
  'ngSessionProvider',

  function (ngSessionProvider) {
    ngSessionProvider.configure({
      signOutUrl: '/my/url/for/users/sign-out',
      signInUrl: '/my/url/for/users/sign-in',
      updateUrl: '/my/url/for/session/update'
    });
  }
]);
```

### Service

The `ngSession` service exposes various methods:

Method    | Arguments                           | Description
--------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`update`  | `options`:`Object`                  | Updates the session. The options object is optional and must be a valid AngularJS HTTP options object.
`signIn`  | `data`:`Object`, `options`:`Object` | Signs a user in and updates the session with the user's data. Argument `data` must contain the POST data to send to the server. Argument `options` can be a valid AngularJS HTTP options object.
`signOut` | `data`:`Object`, `options`:`Object` | Signs a user out. Argument `data` can be a POST data object. Argument `options` can be a valid AngularJS HTTP options object.
`user`    | `prop`:`String`                     | Retrieves a property from the `session.user` object if any. If no argument is passed it will return the whole object.
`hasRole` | `prop`:`String \| String[]` | Checks if the current user has any or all of the provided roles.
`set`     | `prop`:`String`, `value`:`Mixed`    | Sets a value into the session object. Argument `prop` must be a property name to assign the value to. Argument `value` must be the value to assign.
`get`     | `prop`:`String`                     | Obtains a value from the session object. Argument `prop` must be the property name to retrieve the value from.
`del`     | `prop`:`String`                     | Deletes a property from the session object. Argument `prop` must be the property name to delete.

#### Example usage

```javascript
angular.module('MyApp').controller('MyController', [
  '$scope', 'ngSession',

  function ($scope, $session) {
    // ...

    $scope.signingIn = true;

    function onSignInSuccess(res) {
      // res.status === 200
      // Yay! user signed in!

      $session.set('happiness', 100);

      $scope.userName = $session.user('name');
      $scope.userId = $session.user('id');
    }

    function onSignInError(res) {
      // res.status === 4xx
      // Couldn't sign user in
      $session.set('happiness', -100);
    }

    function afterSignIn() {
      $scope.happiness = $session.get('happiness');      
      $scope.signingIn = false;
    }

    ngSession.signIn($scope.data)
      .then(onSignInSuccess, onSignInError)
      .finally(afterSignIn);

    $scope.$on('$destroy', function () {
      $session.del('happiness');
    });
  }
]);
```

## Documentation

To learn more please view the [API Docs](docs/ng-session.md).
