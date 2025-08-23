import { reqres } from '../support/api/reqres';

describe('First E2E: List → Choose → Update', () => {
  before(() => {
    cy.loginAndSetBearer(); // sets BEARER_TOKEN via POST /api/login
  });

  it('List unrealistic → list real → pick → update', () => {
    // 1) Unrealistic page — expect empty list but safe 200
    reqres.listUsers(9999).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(Array.isArray(resp.body.data)).to.be.true;
      expect(resp.body.data.length).to.eq(0);
    });

    // 2) Real page — expect non-empty list
    reqres.listUsers(2).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('page', 2);
      expect(resp.body).to.have.property('data');
      expect(Array.isArray(resp.body.data)).to.be.true;
      expect(resp.body.data.length).to.be.greaterThan(0);

      // 3) Pick the first user from the list
      const picked = resp.body.data[0]; // { id, email, first_name, last_name, avatar, ... }
      expect(picked).to.have.property('id');
      cy.wrap(picked.id).as('pickedId');
    });

    // 4) Update that user (PUT /api/users/{id})
    reqres.updateUser('@pickedId', { name: 'workflow-user', job: 'customer-success' }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.include({ name: 'workflow-user', job: 'customer-success' });
      expect(resp.body).to.have.property('updatedAt'); 
    });
  });
});