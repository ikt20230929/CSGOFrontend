describe('Profile Page Rendering', () => {
    it('should render the profile page correctly', () => {
        cy.login("testUser", "testPassword");
        cy.intercept('GET', '/api/profile', {
            statusCode: 200,
            body: {
                username: 'testUser',
                balance: 100
            }
        }).as('getProfile');

        cy.intercept('GET', '/api/inventory', {
            statusCode: 200,
            body: [
                { itemId: 1, itemName: 'Item 1' },
                { itemId: 2, itemName: 'Item 2' }
            ]
        }).as('getInventory');

        cy.intercept('GET', '/api/cases', {
            statusCode: 200,
            body: [
                { caseId: 1, caseName: 'Case 1', items: [{ itemId: 11, itemName: 'Item 11' }] },
                { caseId: 2, caseName: 'Case 2', items: [
                    { itemId: 21, itemName: 'Item 21' },
                    { itemId: 22, itemName: 'Item 22' },
                    { itemId: 23, itemName: 'Item 23' },
                    { itemId: 24, itemName: 'Item 24' }]
                }
            ]
        }).as('getCases');

        cy.visit('/profile');

        cy.wait('@getProfile');
        cy.wait('@getInventory');
        cy.wait('@getCases');

        cy.contains(`Hello testUser!`);
        cy.contains(`Your balance is: 100.`);

        cy.contains(`Here is a list of all your inventory items: (2 items)`);
        cy.get('[data-cy=inventory-item]').should('have.length', 2);

        cy.contains(`Here is a list of all cases: (2 cases)`);
        cy.get('[data-cy=case]').should('have.length', 2);

        cy.contains('[data-cy=case]', 'Case 1 (has 1 items)');
        cy.contains('[data-cy=case]', 'Case 2 (has 4 items)');
    });
});
