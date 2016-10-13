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
              name: 'John Tester',
              roles: 'user'
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

      .then(() => {
        done(new Error('Success callback shouldn\'t be called!'));
      })

      .catch((res) => {
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

      .then(() => {
        done(new Error('User should not be signed in!\n'));
      })

      .catch((res) => {
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

      .then((res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(200);
        expect($session.user()).to.not.be.empty;
        expect($session.user('id')).to.be.a('number');
        expect($session.user('name')).to.be.a('string');

        done();
      })

      .catch((res) => {
        done(new Error('User should be signed in! (Got ' + res.status + ')\n'));
      });

      $httpBackend.flush();
    });

    it('Should sign a user out', function (done) {
      $session.signOut()

      .then((res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(204);
        expect($session.user()).to.be.null;

        done();
      })

      .catch((res) => {
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

  describe('Single session role', function () {
    it('Should assign role', function () {
      $session.set('user', {
        name: 'Carl User',
        roles: 'user'
      });

      expect($session.user()).to.not.be.empty;
      expect($session.user('name')).to.be.a('string');
      expect($session.user('roles')).to.be.a('string');
    });

    it('Should match role against current session value', function () {
      expect($session.hasRole('user')).to.be.true;
      expect($session.hasRole('user', true)).to.be.true;
    });

    it('Should not match role against current session value', function () {
      expect($session.hasRole('admin')).to.be.false;
      expect($session.hasRole('admin', true)).to.be.false;
    });

    it('Should match the roles against current session value', function () {
      expect($session.hasRole(['user'])).to.be.true;
      expect($session.hasRole(['user'], true)).to.be.true;
      expect($session.hasRole(['user', 'admin'])).to.be.true;
    });

    it('Should not match the roles against current session value', function () {
      expect($session.hasRole(['admin'])).to.be.false;
      expect($session.hasRole(['admin'], true)).to.be.false;
      expect($session.hasRole(['user', 'admin'], true)).to.be.false;
    });
  });

  describe('Multiple session roles', function () {
    it('Should assign admin and manager roles', function () {
      $session.set('user', {
        name: 'Stephanie Manager',
        roles: ['admin', 'manager']
      });

      expect($session.user()).to.not.be.empty;
      expect($session.user('name')).to.be.a('string');
      expect($session.user('roles')).to.be.an('array');
    });

    it('Should match role against current session value', function () {
      expect($session.hasRole('manager')).to.be.true;
      expect($session.hasRole('manager', true)).to.be.true;
      expect($session.hasRole('admin')).to.be.true;
      expect($session.hasRole('admin', true)).to.be.true;
    });

    it('Should not match role against current session value', function () {
      expect($session.hasRole('user')).to.be.false;
      expect($session.hasRole('user', true)).to.be.false;
    });

    it('Should match the roles against current session value', function () {
      expect($session.hasRole(['admin'])).to.be.true;
      expect($session.hasRole(['admin', 'user'])).to.be.true;
      expect($session.hasRole(['admin'], true)).to.be.true;
      expect($session.hasRole(['manager'])).to.be.true;
      expect($session.hasRole(['manager', 'user'])).to.be.true;
      expect($session.hasRole(['manager'], true)).to.be.true;
      expect($session.hasRole(['admin', 'manager'])).to.be.true;
      expect($session.hasRole(['admin', 'manager', 'user'])).to.be.true;
      expect($session.hasRole(['admin', 'manager'], true)).to.be.true;
    });

    it('Should not match the roles against current session value', function () {
      expect($session.hasRole(['user'])).to.be.false;
      expect($session.hasRole(['user'], true)).to.be.false;
      expect($session.hasRole(['user', 'admin'], true)).to.be.false;
      expect($session.hasRole(['user', 'admin', 'manager'], true)).to.be.false;
    });
  });
});
