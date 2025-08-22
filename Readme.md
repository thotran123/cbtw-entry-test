# Test Plan 

### 1. Test Plan Overview 
Purpose: To verify that core user operations—create, read, update, delete—work reliably and handle errors gracefully. 

### 2. Scope 
- Register a new user — POST /api/register 
- List users — GET /users 
- Update a user — PUT /users 
- Delete a user — DELETE /users 

### 3. Test Objectives 

### 4. Test Environment 
TEST and STAGE (the same test pack runs on both). 

### 5. Test Data 
Registration credentials (valid and invalid) 

### 6. Test Scenarios 
a. Register a new user — POST /api/register 
- Positive cases 
    - Can register successfully with valid details 
- Negative cases 
    - Missing password 
    - Missing email 
    - Unrecognized email (not a defined demo user) 

b. Get user list by ID — GET /users 
- Positive cases 
    - Successfully get the information of user list
- Negative cases 
    - Non-existent page number 
    - Invalid page number format (String, Boolean) 

c. Update a user — PUT /users/{id} 
- Positive cases 
    - Can update a user information 
- Negative cases 
    - Empty or incomplete update 
    - Update non-existent ID 

d. Delete a user — DELETE /users/{id} 
- Positive cases 
    - Delete existing user (e.g., id=2) 
    - Expect: 204 No Content; nothing in the body. 
- Negative cases 
    - Delete same user twice 
    - Delete non-existent ID 

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

### Run
#### Cypress Set up
Open terminal and run below command
```
npm init
npn install cypress --save-dev
npx cypress open
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
