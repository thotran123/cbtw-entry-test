export const reqres = {
  // POST /api/register
  register: (payload, { allowFail = false } = {}) =>
    cy.apiRequest({ method: 'POST', url: '/api/register', body: payload, failOnStatusCode: !allowFail }),

  // POST /api/login (handy to get a token once)
  login: (payload, { allowFail = false } = {}) =>
    cy.apiRequest({ method: 'POST', url: '/api/login', body: payload, failOnStatusCode: !allowFail }),

  // GET /api/users?page=#
  listUsers: (page = 1) =>
    cy.apiRequest({ method: 'GET', url: '/api/users', qs: { page } }),

  // PUT /api/users/{id}
  updateUser: (id, payload) =>
    cy.apiRequest({ method: 'PUT', url: `/api/users/${id}`, body: payload }),

  // DELETE /api/users/{id}
  deleteUser: (id) =>
    cy.apiRequest({ method: 'DELETE', url: `/api/users/${id}` }),
};