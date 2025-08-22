export default {
  test: {
    login:    { email: 'eve.holt@reqres.in', password: 'cityslicka' },
    register: { email: 'eve.holt@reqres.in', password: 'pistol' },
    missingPassword: { email: 'eve.holt@reqres.in' },
    missingEmail:    { password: 'pistol' },
    invalidEmail:    { email: 'eve.holt@', password: 'pistol' },
  },
  stage: {
    login:    { email: 'eve.holt@reqres.in', password: 'cityslicka' },
    register: { email: 'eve.holt@reqres.in', password: 'pistol' },
    missingPassword: { email: 'eve.holt@reqres.in' },
    missingEmail:    { password: 'pistol' },
    invalidEmail:    { email: 'eve.holt@', password: 'pistol' },
  },
};