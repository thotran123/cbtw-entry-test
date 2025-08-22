import credsByEnv from '../fixtures/reqres-creds.js';

const ENV = Cypress.env('ENV_NAME') || 'test';
const creds = credsByEnv[ENV];   // { register, missingPassword, ... }

describe('Verify ReqRes Login API', () => {
  const url = '/api/login'
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': Cypress.env('REQRES_API_KEY'),
  };

  it('login successfully with valid email & password', () => {
    cy.request({
      method: 'POST',
      url,
      headers: defaultHeaders,
      body: creds.login,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('token').and.be.a('string').and.not.be.empty;
    });
  });

  it('login unsuccessfully (expected to FAIL)', () => {
    // NOT using failOnStatusCode:false
    cy.request({
      method: 'POST',
      url,
      headers: defaultHeaders,
      body: creds.missingPassword, // missing password -> 400
    });
  });
});