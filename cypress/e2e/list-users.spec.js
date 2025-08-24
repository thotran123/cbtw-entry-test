import { reqres } from '../support/api/reqres';

describe('Get the list of users', () => {
  before(() => {
    cy.loginAndSetBearer(); // sets BEARER_TOKEN via POST /api/login
  });

  const validPage = 2;          // known demo id
  const nonExistentPage = 99999;   // non-existent id
  const invalidPage = 'string';   // non-existent id
  const expectUserShape = (u) => {
    expect(u).to.be.an('object');
    expect(u).to.have.property('id');
    expect(u).to.have.property('email').and.to.match(/@/);
    expect(u).to.have.property('first_name');
    expect(u).to.have.property('last_name');
    expect(u).to.have.property('avatar');
  };

  // Positive: page=2 returns list of user with expected shape
  it('Successfully get the information of user list (page=2)', () => {
    reqres.listUsers(validPage).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('page', validPage);
      expect(resp.body).to.have.property('data');
      expect(Array.isArray(resp.body.data)).to.be.true;
      expect(resp.body.data.length).to.be.greaterThan(0);
      resp.body.data.forEach(expectUserShape);
    });
  });

  // Negative: non-existent page — expect a safe, empty list
  it('Non-existent page number (page=9999) returns empty list', () => {
    reqres.listUsers(nonExistentPage).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(Array.isArray(resp.body.data)).to.be.true;
      expect(resp.body.data.length).to.eq(0);
    });
  });

  // Negative: invalid page formats — API should respond safely
  it('Invalid page number format (string)', () => {
    reqres.listUsers(invalidPage).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(Array.isArray(resp.body.data)).to.be.true;
    });
  });
});