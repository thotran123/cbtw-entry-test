import { reqres } from '../support/api/reqres';

describe('Delete a user', () => {
  before(() => {
    cy.loginAndSetBearer(); // sets BEARER_TOKEN via POST /api/login
  });

  const existingId = 2;       // known demo id
  const nonExistentId  = 99999;   // non-existent id

  // Positive: Delete existing user → 204 No Content
  it('Delete existing user successfully', () => {
    reqres.deleteUser(existingId).then((resp) => {
      expect(resp.status).to.eq(204);
      expect(resp.body === '' || resp.body == null).to.be.true;
    });
  });

  // Negative: Delete same user twice
  it('Delete same user twice', () => {
    reqres.deleteUser(existingId, { allowFail: true }).then((resp) => {
      expect([204, 404]).to.include(resp.status);
      if (resp.status === 204) {
        expect(resp.body === '' || resp.body == null).to.be.true;
      }
    });
  });

  // Negative: Delete non-existent ID
  it('Delete non-existent ID', () => {
    reqres.deleteUser(nonExistentId, { allowFail: true }).then((resp) => {
      expect([204, 404]).to.include(resp.status);
      if (resp.status === 204) {
        expect(resp.body === '' || resp.body == null).to.be.true;
      }
    });
  });
});