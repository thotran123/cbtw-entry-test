// E2E: Register → Update → Delete → Delete again

describe('Second E2E: Register → Update → Delete', () => {
  // Build headers at CALL TIME so the Bearer (set in before) is present
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'x-api-key': Cypress.env('REQRES_API_KEY') || 'reqres-free-v1',
    ...(Cypress.env('BEARER_TOKEN')
      ? { Authorization: `Bearer ${Cypress.env('BEARER_TOKEN')}` }
      : {}),
  });

  // 1) Register and capture token for Bearer
  before(() => {
    return cy.request({
      method: 'POST',
      url: '/api/register',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Cypress.env('REQRES_API_KEY') || 'reqres-free-v1',
      },
      body: { email: 'eve.holt@reqres.in', password: 'pistol' },
    }).then((resp) => {
      expect(resp.status).to.be.oneOf([200, 201]);
      expect(resp.body).to.have.property('token').and.be.a('string').and.not.be.empty;
      Cypress.env('BEARER_TOKEN', resp.body.token);
    });
  });

  // 2) Update that user (use known demo id=2)
  it('updates user id=2', () => {
    cy.request({
      method: 'PUT',
      url: '/api/users/2',
      headers: authHeaders(),
      body: { name: 'morpheus', job: 'zion resident' },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.include({ name: 'morpheus', job: 'zion resident' });
      expect(resp.body).to.have.property('updatedAt'); // ISO timestamp from ReqRes
    });
  });

  // 3) Delete that user
  it('deletes user id=2', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/users/2',
      headers: authHeaders(),
    }).then((resp) => {
      expect(resp.status).to.eq(204);
      // 204 bodies are often empty string in Cypress
      expect(resp.body).to.satisfy((b) => b === '' || b == null);
    });
  });

  // 4) Attempt the same delete again (idempotence / safe repeat)
  it('re-deletes user id=2 safely (204 or 404)', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/users/2',
      headers: authHeaders(),
      failOnStatusCode: false, // don't auto-fail on 404
    }).then((resp) => {
      expect([204, 404]).to.include(resp.status);
      if (resp.status === 204) {
        expect(resp.body).to.satisfy((b) => b === '' || b == null);
      }
    });
  });
});