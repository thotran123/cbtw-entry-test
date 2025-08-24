// E2E: Register → Update → Delete → Delete again

import { reqres } from '../support/api/reqres';
import credsByEnv from '../fixtures/reqres-creds.js';

const ENV   = Cypress.env('ENV_NAME') || 'test';
const creds = credsByEnv[ENV];

describe('Second E2E: Register → Update → Delete', () => {

  // 1) Register and capture token for Bearer
  before(() => {
    return reqres.register(creds.register).then((resp) => {
      const token = resp?.body?.token;
      if (token) Cypress.env('BEARER_TOKEN', token);
      cy.wrap(resp).as('registerResp');   // create alias for later tests
    });
  });

  it('Registers a user successfully', () => {
    cy.get('@registerResp').then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('id');     // e.g. 4
      expect(resp.body).to.have.property('token');  // e.g. QpwL5tke4Pnpja7X4
      expect(resp.body.token).to.be.a('string').and.not.be.empty;
    });
  });

  // 2) Update that user (use known demo id=2)
  it('Updates user id=2', () => {
      reqres.updateUser(2, { name: 'morpheus', job: 'zion resident' }).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body).to.include({ name: 'morpheus', job: 'zion resident' });
        expect(resp.body).to.have.property('updatedAt'); // ISO timestamp from ReqRes
    });
  });

  // 3) Delete that user
  it('Deletes user id=2', () => {
    reqres.deleteUser(2).then((resp) => {
      expect(resp.status).to.eq(204);
      expect(resp.body === '' || resp.body == null).to.be.true;
    });
  });

  // 4) Attempt the same delete again (idempotence / safe repeat)
  it('Re-deletes user id=2 safely (204 or 404)', () => {
    reqres.deleteUser(2, { allowFail: true }).then((resp) => {
      expect([204, 404]).to.include(resp.status);
      if (resp.status === 204) {
        expect(resp.body === '' || resp.body == null).to.be.true;
      }
    });
  });
});