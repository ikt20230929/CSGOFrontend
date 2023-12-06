Cypress.Commands.add('login', (username, password, shouldFail=false) => {
    cy.get('a[href="/login"]').click();
    cy.url().should('include', "/login");

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);

    if(shouldFail) {
      cy.intercept('POST', '/api/login', (req) => {
        req.reply({ statusCode: 401, body: 'InvalidCredentials' });
      }).as('loginApi');
    }else{
      cy.intercept('POST', '/api/login', (req) => {
        req.reply({ statusCode: 200, body: { accessToken: 'validToken' } });
      }).as('loginApi');
    }

    cy.get('button[type="submit"]').click();

    if(shouldFail) {
      cy.get('#error').should('contain','Invalid username or password.')
    }else{
      cy.wait('@loginApi').should((interception) => {
        expect(interception.request.body).to.deep.equal({
          username: username,
          password: password
        });
      });
      cy.url().should('include', "/profile")
    }
});