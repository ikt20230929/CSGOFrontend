describe('Login Form', () => {
  it('should handle login with valid credentials', () => {
    cy.login("username", "password");
  });

  it('should handle login with 2FA', () => {
    cy.loginMFA("username", "password", 12345);
  });

  it('should handle login with invalid credentials', () => {
    cy.login("username", "password", true);
  });
});
