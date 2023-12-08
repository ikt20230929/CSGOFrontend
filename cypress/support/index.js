beforeEach(() => {
  cy.visit("/");
});

Cypress.Commands.add('login', (username, password, shouldFail = false) => {
  cy.get('a[href="/login"]').click();
  cy.url().should('include', "/login");

  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);

  if (shouldFail) {
    cy.intercept('POST', '/api/login', (req) => {
      req.reply({ statusCode: 401, body: 'InvalidCredentials' });
    }).as('loginApi');
  } else {
    cy.intercept('POST', '/api/login', (req) => {
      req.reply({ statusCode: 200, body: { accessToken: 'validToken' } });
    }).as('loginApi');
  }

  cy.get('button[type="submit"]').click();

  if (shouldFail) {
    cy.get('#error').should('contain', 'Invalid username or password.');
  } else {
    cy.wait('@loginApi').should((interception) => {
      expect(interception.request.body).to.deep.equal({
        username: username,
        password: password
      });
    });
    cy.url().should('include', "/profile");
  }
});

Cypress.Commands.add('loginMFA', (username, password, totpToken) => {
  cy.get('a[href="/login"]').click();
  cy.url().should('include', "/login");

  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);

  cy.intercept('POST', '/api/login', (req) => {
    req.reply({ statusCode: 401, body: 'EnterTotp' });
  }).as('loginApi');

  cy.get('button[type="submit"]').click();

  cy.url().should('include', "/login/totp");
  cy.wait('@loginApi').then((interception) => {
    cy.get('input[name="totpToken"]').type(totpToken);
    cy.intercept('POST', '/api/login', (req) => {
      req.reply({ statusCode: 200, body: { accessToken: 'validToken' } });
    }).as('loginApi');
    cy.get('button[type="submit"]').click();
  });

  cy.wait('@loginApi').should((interception) => {
    expect(interception.request.body).to.deep.equal({
      username: username,
      password: password,
      mfa: {
        mfaType: '1',
        totpToken: `${totpToken}`
      }
    });
  });
  cy.url().should('include', "/profile");
});
