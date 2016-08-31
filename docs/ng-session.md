# ngSession

Session handler module for AngularJS.



* * *


# ngSession

ngSession Service



* * *

### ngSession.signIn(data, options) 

Signs a user in.

It will perform a `POST` to the `config.signOutUrl` path and perform an
`update` if successful.

**Parameters**

**data**: `Object`, The data to send for sign in.

**options**: `Object`, Optional AngularJS HTTP request options.

**Returns**: `Promise`, A promise resolving the request's `res` object.

**Example**:
```js
ngSession.signIn($scope.data)
  .then(function (res) {})
  .catch(function (res) {})
```


### ngSession.signOut(data, options) 

Signs a user out.

It will perform a POST to the `config.signOutUrl` path and delete the
user object on success.

**Parameters**

**data**: `Object`, The optional data to send for sign out.

**options**: `Object`, Optional AngularJS HTTP request options.

**Returns**: `Promise`, A promise resolving the request's `res` object.

**Example**:
```js
ngSession.signOut($scope.data)
  .then(function (res) {})
  .catch(function (res) {})
```


### ngSession.update(options, deferred) 

Updates the session user object.

It will perform a GET to the `config.updateUrl` path and set the
session's user object on success with the request's `res.data`.

**Parameters**

**options**: `Object`, Optional AngularJS HTTP request options.

**deferred**: `Promise`, Optional deferred promise object.

**Returns**: `Promise`, A promise resolving the request's `res` object.

**Example**:
```js
ngSession.update($scope.data)
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

### ngSessionProvider.configure(config) 

Configuration method.

**Parameters**

**config**: `Object`, The configuration object.


**Example**:
```js
ngSessionProvider.configure({
  signOutUrl: '/api/users/sign-out',
  signInUrl: '/api/users/sign-in',
  updateUrl: '/api/session'
});
```



* * *










