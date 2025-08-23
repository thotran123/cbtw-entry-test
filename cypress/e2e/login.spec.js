import credsByEnv from '../fixtures/reqres-creds.js';
import { reqres } from '../support/api/reqres.js';

const ENV = Cypress.env('ENV_NAME') || 'test';
const creds = credsByEnv[ENV];   // { register, missingPassword, ... }

describe('Verify ReqRes Login API', () => {

  it('Login successfully with valid email & password', () => {
    reqres.login(creds.login).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('token').and.be.a('string').and.not.be.empty;
    });
  });

  it('Login unsuccessfully (expected to FAIL)', () => {
    // NOT using failOnStatusCode:false
    reqres.login(creds.missingPassword);
  });
});