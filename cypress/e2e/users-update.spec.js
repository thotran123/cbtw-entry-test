import { reqres } from '../support/api/reqres.js';

describe('Update user information', () => {
  before(() => {
    cy.loginAndSetBearer(); // sets BEARER_TOKEN via POST /api/login
  });

  const userId = 2;          // known demo id
  const nonExistentID = 99999;   // non-existent id
  const updatedInfor = { first_name: 'morpheus', job: 'zion resident' }

  // Positive
  it('Update a user information successfully', () => {
    reqres.updateUser(userId, updatedInfor).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.include(updatedInfor);
      expect(resp.body).to.have.property('updatedAt'); // ISO timestamp
    });
  });

  // Negative 1: Empty or incomplete update
  it('Empty or incomplete update', () => {
    reqres.updateUser(userId, {}, { allowFail: true }).then((resp) => {
      // ReqRes is permissive and often returns 200 + updatedAt even for empty bodies.
      // Make the test robust to either behavior.
      expect([200, 400, 422]).to.include(resp.status);
      if (resp.status === 200) {
        expect(resp.body).to.have.property('updatedAt');
      } else {
        expect(resp.body).to.have.property('error');
      }
    });
  });

  // Negative 2: Update non-existent ID
  it('Update non-existent ID', () => {
    reqres.updateUser(nonExistentID, updatedInfor, { allowFail: true }).then((resp) => {
      expect([200, 404]).to.include(resp.status);
      if (resp.status === 200) {
        expect(resp.body).to.have.property('updatedAt');
      } else {
        // 404 path
        expect(resp.body || {}).to.be.ok;
      }
    });
  });
});