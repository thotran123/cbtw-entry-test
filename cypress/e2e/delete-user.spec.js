describe('Delete a user', () => {
  before(() => {
    cy.loginAndSetBearer(); // sets BEARER_TOKEN via POST /api/login
  });

  const existingId = 2;       // known demo id
  const missingId  = 99999;   // non-existent id
  const APIurl = '/api/users/'

  // Positive: Delete existing user → 204 No Content
  it('Delete existing user successfully', () => {
    cy.apiRequest({
      method: 'DELETE',
      url: APIurl + existingId,
    }).then((resp) => {
      expect(resp.status).to.eq(204);
      expect(resp.body).to.satisfy((b) => b === '' || b == null);
    });
  });

  // Negative: Delete same user twice
  it('Delete same user twice', () => {
    cy.apiRequest({
      method: 'DELETE',
      url: APIurl + existingId,
      failOnStatusCode: false, // don't auto-fail if 404
    }).then((resp) => {
      expect([204, 404]).to.include(resp.status);
      if (resp.status === 204) {
        expect(resp.body).to.satisfy((b) => b === '' || b == null);
      }
    });
  });

  // Negative: Delete non-existent ID
  it('Delete non-existent ID', () => {
    cy.apiRequest({
      method: 'DELETE',
      url: APIurl + missingId,
      failOnStatusCode: false,
    }).then((resp) => {
      expect([204, 404]).to.include(resp.status);
      if (resp.status === 204) {
        expect(resp.body).to.satisfy((b) => b === '' || b == null);
      }
    });
  });
});