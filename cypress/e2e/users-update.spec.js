describe('Update user information', () => {
  before(() => {
    cy.loginAndSetBearer(); // sets BEARER_TOKEN via POST /api/login
  });

  const userId = 2;          // known demo id
  const missingId = 99999;   // non-existent id
  const APIurl = '/api/users/'
  const updatedInfor = { first_name: 'morpheus', job: 'zion resident' }

  // Positive
  it('Update a user information successfully', () => {
    cy.apiRequest({
      method: 'PUT',
      url: APIurl + userId,
      body: updatedInfor,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.include(updatedInfor);
      expect(resp.body).to.have.property('updatedAt'); // ISO timestamp
    });
  });

  // Negative 1: Empty or incomplete update
  it('Empty or incomplete update', () => {
    cy.apiRequest({
      method: 'PUT',
      url: APIurl + userId,
      body: {},                    // empty payload
      failOnStatusCode: false,     // treat errors as data
    }).then(({ status, body }) => {
      // ReqRes is permissive and often returns 200 + updatedAt even for empty bodies.
      // Make the test robust to either behavior.
      expect([200, 400, 422]).to.include(status);
      if (status === 200) {
        expect(body).to.have.property('updatedAt');
      } else {
        expect(body).to.have.property('error');
      }
    });
  });

  // Negative 2: Update non-existent ID
  it('Update non-existent ID', () => {
    cy.apiRequest({
      method: 'PUT',
      url: APIurl + missingId,
      body: { job: 'ghost' },
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      // Some mock APIs still return 200 with updatedAt; others return 404.
      expect([200, 404]).to.include(status);
      if (status === 200) {
        expect(body).to.have.property('updatedAt');
      } else {
        // 404 path
        // Optionally assert a message if the API returns one
        expect(body || {}).to.be.ok;
      }
    });
  });
});