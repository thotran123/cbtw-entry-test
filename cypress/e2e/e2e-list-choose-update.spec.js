describe('E2E — List → Choose → Update', () => {
  before(() => {
    cy.loginAndSetBearer(); // sets BEARER_TOKEN via POST /api/login
  });

  it('List unrealistic → list real → pick → update', () => {
    // 1) Unrealistic page — expect empty list but safe 200
    cy.apiRequest({
      method: 'GET',
      url: '/api/users',
      qs: { page: 9999 },
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body).to.have.property('data');
      expect(Array.isArray(body.data)).to.be.true;
      expect(body.data.length).to.eq(0);
    });

    // 2) Real page — expect non-empty list
    cy.apiRequest({
      method: 'GET',
      url: '/api/users',
      qs: { page: 2 },
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body).to.have.property('data');
      expect(Array.isArray(body.data)).to.be.true;
      expect(body.data.length).to.be.greaterThan(0);

      // 3) Pick the first user from the list
      const picked = body.data[0]; // { id, email, first_name, last_name, avatar, ... }
      expect(picked).to.have.property('id');
      cy.wrap(picked.id).as('pickedId');
    });

    // 4) Update that user (PUT /api/users/{id})
    cy.get('@pickedId').then((id) => {
      cy.apiRequest({
        method: 'PUT',
        url: `/api/users/${id}`,
        body: { name: 'workflow-user', job: 'customer-success' },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.include({ name: 'workflow-user', job: 'customer-success' });
        expect(body).to.have.property('updatedAt'); // timestamp from ReqRes
      });
    });
  });
});