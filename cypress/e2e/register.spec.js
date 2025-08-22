import credsByEnv from '../fixtures/reqres-creds.js';

const ENV = Cypress.env('ENV_NAME') || 'test';
const creds = credsByEnv[ENV];   // { register, missingPassword, ... }

describe('Verify ReqRes Register API', () => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': Cypress.env('REQRES_API_KEY'),
  };
  const url = '/api/register';

  it('registers successfully with valid email & password', () => {
    cy.request({
      method: 'POST',
      url,
      headers: defaultHeaders,
      body: creds.register,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('id');     // e.g. 4
      expect(resp.body).to.have.property('token');  // e.g. QpwL5tke4Pnpja7X4
      expect(resp.body.token).to.be.a('string').and.not.be.empty;
    });
  });

  it('fails with 400 when password is missing', () => {
    cy.request({
      method: 'POST',
      url,
      headers: defaultHeaders,
      failOnStatusCode: false, // allow asserting 4xx
      body: creds.missingPassword,
    }).then((resp) => {
      expect(resp.status).to.eq(400);
      expect(resp.body).to.have.property('error', 'Missing password');
    });
  });

  
  // Negative: Unrecognized email (not a defined demo user)
  it('fails with 400 for unrecognized email', () => {
    cy.request({
      method: 'POST',
      url,
      headers: defaultHeaders,
      body: creds.invalidEmail,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(400);
      // ReqRes returns a note like: "Note: Only defined users succeed registration"
      expect(resp.body)
        .to.have.property('error')
        .and.match(/only defined users succeed registration/i);
    });
  });
});