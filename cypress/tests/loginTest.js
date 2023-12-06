describe('Login Form', () => {
  beforeEach(() => {
    cy.visit("/");
  })

  it('should handle login with valid credentials', () => {
    cy.login("valid_username", "valid_password");
  });

  it('should handle login with invalid credentials', () => {
    cy.login("valid_username", "valid_password", true);
  });
});
