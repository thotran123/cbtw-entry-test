// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// cypress/support/commands.js
import creds from '../fixtures/reqres-creds';

const getLoginCreds = () => {
  const obj = Cypress.env('LOGIN_CREDS');
  if (obj?.email && obj?.password) return obj;
  throw new Error('[Cypress] LOGIN_CREDS {email,password} not set by config.');
};

// 1) Login once, stash token in Cypress.env
Cypress.Commands.add('loginAndSetBearer', () => {
  const { email, password } = getLoginCreds();

  return cy.request({
    method: 'POST',
    url: '/api/login',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': Cypress.env('REQRES_API_KEY') || 'reqres-free-v1',
    },
    body: { email, password },
  }).then((resp) => {
    expect(resp.status).to.eq(200);
    const token = resp.body.token;
    expect(token).to.be.a('string').and.not.be.empty;
    Cypress.env('BEARER_TOKEN', token);
  });
});

// 2) A small wrapper that always sends the Bearer + x-api-key
Cypress.Commands.add('apiRequest', (opts) => {
  const token = Cypress.env('BEARER_TOKEN');
  const mergedHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': Cypress.env('REQRES_API_KEY') || 'reqres-free-v1',
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return cy.request({
    method: opts.method || 'GET',
    url: opts.url,
    qs: opts.qs,
    body: opts.body,
    headers: mergedHeaders,
    failOnStatusCode: opts.failOnStatusCode, // pass through if you need negatives
  });
});