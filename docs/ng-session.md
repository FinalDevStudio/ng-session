# ngSession

Session handler module for AngularJS.



* * *


# ngSession

ngSession Service



* * *

### ngSession.signIn(data, config) 

Signs a user in.

It will perform a `POST` to the `defaults.signOutUrl` path and perform an
`update` if successful.

**Parameters**

**data**: `Object`, The data to send for sign in.

**config**: `Object`, Optional AngularJS HTTP request configuration.

**Returns**: `Promise`, A promise resolving the request's `res` object.

**Example**:
```js
ngSession.signIn($scope.data)
  .then(function (res) {})
  .catch(function (res) {})
```


### ngSession.signOut(data, config) 

Signs a user out.

It will perform a POST to the `defaults.signOutUrl` path and delete the
user object on success.

**Parameters**

**data**: `Object`, The optional data to send for sign out.

**config**: `Object`, Optional AngularJS HTTP request configuration.

**Returns**: `Promise`, A promise resolving the request's `res` object.

**Example**:
```js
ngSession.signOut($scope.data)
  .then(function (res) {})
  .catch(function (res) {})
```


### ngSession.reload(data, config, deferred) 

Reloads the session user object.

It will perform a PUT to the `defaults.updateUrl` path and then a
consecuent session `update`.

The server should handle the OUt request as a reload request and fetch
updated session data.

**Parameters**

**data**: `Object`, The optional data to send for the reload.

**config**: `Object`, Optional AngularJS HTTP request configuration.

**deferred**: `Promise`, Optional deferred promise object.

**Returns**: `Promise`, A promise resolving the request's `res` object.

**Example**:
```js
ngSession.reload($scope.data)
  .then(function (res) {})
  .catch(function (res) {})
```


### ngSession.update(config, deferred) 

Updates the session user object.

It will perform a GET to the `defaults.updateUrl` path and set the
session's user object on success with the request's `res.data`.

**Parameters**

**config**: `Object`, Optional AngularJS HTTP request configuration.

**deferred**: `Promise`, Optional deferred promise object.

**Returns**: `Promise`, A promise resolving the request's `res` object.

**Example**:
```js
ngSession.update()
  .then(function (res) {})
  .catch(function (res) {})
```


### ngSession.user(prop) 

Retrieves a user data value by property name.

**Parameters**

**prop**: `String`, The property name to retrieve.

**Returns**: `Mixed`, The property's value or the user object if no
property name is provided.

**Example**:
```js
ngSession.user('name'); // => 'John Smith'
```


### ngSession.hasRole(roles, all) 

Checks if the current user has any or all of the provided roles.

**Parameters**

**roles**: `String | Array.&lt;String&gt;`, The required roles.

**all**: `Boolean`, If all the provided roles are required.

**Returns**: `Boolean`

**Example**:
```js
ngSession.hasRole('ROLE.ADMIN'); // => false
ngSession.hasRole('ROLE.USER'); // => true
ngSession.hasRole(['ROLE.ADMIN', 'ROLE.USER']); // => true
ngSession.hasRole(['ROLE.ADMIN', 'ROLE.USER'], true); // => false
```


### ngSession.set(prop, The) 

Sets a value in the session object.

**Parameters**

**prop**: `String`, The property name to set.

**The**: `Mixed`, property value to set.


**Example**:
```js
ngSession.set('test', 'Test Value');
```


### ngSession.get(prop) 

Obtains a value from the session object.

**Parameters**

**prop**: `String`, The property name to obtain.

**Returns**: `Mixed`, The property's value.

**Example**:
```js
ngSession.get('test'); // => 'Test Value'
```


### ngSession.del(prop) 

Deletes a property from the session object.

**Parameters**

**prop**: `String`, The property name.


**Example**:
```js
ngSession.del('test');
ngSession.get('test'); // => null
```



# ngSessionProvider

ngSession Provider



* * *

### ngSessionProvider.configure(cfg) 

Configuration method.

**Parameters**

**cfg**: `Object`, The configuration object.

 - **cfg.updateUrl**: `Object`, The session update URL (GET|PUT).

 - **cfg.signInUrl**: `Object`, The session sign in URL (POST).

 - **cfg.signOutUrl**: `Object`, The session sign out URL (POST).

 - **cfg.cache**: `Number | Boolean`, The session cache behavior. Number is the milliseconds to cache the session for.
A boolean "true" will cache the session forever.


**Example**:
```js
ngSessionProvider.configure({
  signOutUrl: '/api/users/sign-out',
  signInUrl: '/api/users/sign-in',
  updateUrl: '/api/session',
  cache: '1h'
});
```



* * *










