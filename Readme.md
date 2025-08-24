# Test Plan 

### 1. Test Plan Overview 
Purpose: To verify that core user operations—create, read, update, delete—work reliably and handle errors gracefully. 

### 2. Scope 
- Register a new user — POST /api/register 
- List users — GET /users 
- Update a user — PUT /users 
- Delete a user — DELETE /users 

### 3. Test Objectives 
- Validate success paths return the expected status codes and fields.
- Validate error/edge cases return safe, predictable responses.
- Prove flows work end-to-end across environments (TEST/STAGE).

### 4. Test Environment 
TEST and STAGE (same test pack; environment chosen via TEST_ENV).

### 5. Test Data 
Registration/login credentials (valid & invalid).
- Example valid register: { email: 'eve.holt@reqres.in', password: 'pistol' }
- Invalids: missing password, missing email, unrecognized email.

### 6. Test Scenarios 
a. Register a new user — POST /api/register 
- Positive cases 
    - Can register successfully with valid details (expect 200, id, token).
- Negative cases 
    - Missing password → 400 with erro message.
    - Missing email → 400 with error message.
    - Unrecognized email → 400.

b. Get user list by ID — GET /users 
- Positive cases 
    - Successfully get a page of users (expect 200, data is a non-empty array for known pages).
- Negative cases 
    - Non-existent page number (e.g., page=9999) → 200 with empty data.
    - Invalid page format (string/boolean) → safe 200

c. Update a user — PUT /users/{id} 
- Positive cases 
    - Can update a user’s information (e.g., { name, job }) → 200 with updatedAt.
- Negative cases 
    - Update a user’s information with empty bodies → safe response (no server error).
    - Update non-existent ID → safe response (no server error).

d. Delete a user — DELETE /users/{id} 
- Positive cases 
    - Delete existing user (e.g., id=2) → 204 No Content, empty body.
- Negative cases 
    - Delete same user twice → still safe.
    - Delete non-existent ID → safe response (no server error).

### 7. End-to-End / Workflow Tests 
#### Register → Update → Delete 
Description:  
- Register a new User (capture token) 
- Update that user 
- Delete that user 
- Attempt the same delete again 

#### List → Choose → Update 
Description:  
- List users with an unrealistic page 
- List users on a real page 
- Pick a known user 
- Update that user 

### 8. Run
#### Cypress Set up
Open terminal and run below command
```
npm init
npm install cypress --save-dev
npx cypress open
```
#### Install reporter
Open terminal and run below command
```
npm i -D cypress-mochawesome-reporter 
```
#### Run Test on Test env (default)
```
npx cypress run
```
#### Run Test on Stage env
```
TEST_ENV=stage npx cypress run
```
#### Report
```
open reports/mocha/index.html
```
