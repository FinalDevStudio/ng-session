'use strict';

/* Test the directive */
describe('The ngSession service', function () {
  var $httpBackend, $session, sess;

  beforeEach(module('ngSession'));

  describe('Sign in proccess', function () {
    beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $session = $injector.get('ngSession');

      $httpBackend.whenGET('/api/session')
        .respond(function () {
          if (sess) {
            return [200, {
              id: 1,
              name: 'John Tester'
            }];
          }

          return [401];
        });

      $httpBackend.whenPOST('/api/users/sign-in')
        .respond(function (method, url, data) {
          data = JSON.parse(data);

          if (data.email !== 'user@example.com' || data.password !== 'p45sw0rd') {
            return [403];
          }

          sess = data;

          return [204];
        });

      $httpBackend.whenPOST('/api/users/sign-out')
        .respond(function () {
          sess = null;

          return [204];
        });
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('Should actually load', function () {
      expect($session).to.be.an('object');
      $httpBackend.flush();
    });

    it('Should update the session', function (done) {
      $session.update()

      .then(function () {
        done(new Error('Success callback shouldn\'t be called!'));
      })

      .catch(function (res) {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(401);
        expect(res.data).to.be.empty;
        expect($session.user()).to.be.empty;

        done();
      });

      $httpBackend.flush();
    });

    it('Should not sign a user in with wrong credentials', function (done) {
      var data = {
        email: 'user@example.com',
        password: 'password'
      };

      $session.signIn(data)

      .then(function () {
        done(new Error('User should not be signed in!\n'));
      })

      .catch(function (res) {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(403);

        done();
      });

      $httpBackend.flush();
    });

    it('Should sign a user in with correct credentials', function (done) {
      var data = {
        email: 'user@example.com',
        password: 'p45sw0rd'
      };

      $session.signIn(data)

      .then(function (res) {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(200);
        expect($session.user()).to.not.be.empty;
        expect($session.user('id')).to.be.a('number');
        expect($session.user('name')).to.be.a('string');

        done();
      })

      .catch(function (res) {
        done(new Error('User should be signed in! (Got ' + res.status + ')\n'));
      });

      $httpBackend.flush();
    });

    it('Should sign a user out', function (done) {
      $session.signOut()

      .then(function (res) {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(204);
        expect($session.user()).to.be.null;

        done();
      })

      .catch(function (res) {
        done(new Error('User should be signed out! (Got ' + res.status + ')\n'));
      });

      $httpBackend.flush();
    });
  });

  describe('Session values', function () {
    it('Should set a value into the session object', function () {
      $session.set('test', 1);

      expect($session.get('test')).to.equal(1);
    });

    it('Should delete a value from the session object', function () {
      $session.del('test', 1);

      expect($session.get('test')).to.be.empty;
    });
  });
});
