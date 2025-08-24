import credsByEnv from '../fixtures/reqres-creds.js';
import { reqres } from '../support/api/reqres';

const ENV = Cypress.env('ENV_NAME') || 'test';
const creds = credsByEnv[ENV];   // { register, missingPassword, ... }

describe('Verify ReqRes Register API', () => {
  it('Registers successfully with valid email & password', () => {
    reqres.register(creds.register).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('id');     // e.g. 4
      expect(resp.body).to.have.property('token');  // e.g. QpwL5tke4Pnpja7X4
      expect(resp.body.token).to.be.a('string').and.not.be.empty;
    });
  });

  it('Fails with 400 when password is missing', () => {
    reqres.register(creds.missingPassword, { allowFail: true }).then((resp) => {
      expect(resp.status).to.eq(400);
      expect(resp.body).to.have.property('error', 'Missing password');
    });
  });

  
  // Negative: Unrecognized email (not a defined demo user)
  it('fails with 400 for unrecognized email', () => {
    reqres.register(creds.invalidEmail, { allowFail: true }).then((resp) => {
      expect(resp.status).to.eq(400);
      // ReqRes returns a note like: "Note: Only defined users succeed registration"
      expect(resp.body)
        .to.have.property('error')
        .and.match(/only defined users succeed registration/i);
    });
  });
});