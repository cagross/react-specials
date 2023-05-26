/**
 * Defines automated end-to-end tests of browse component (using Cypress).
 * @file
 * @author Carl Gross
 */

describe("Listing Items", () => {
  it("Displays items from the expected stores.", () => {
    cy.visit("/");
    cy.get('input[type="radio"]').should("have.length", 4);

    /* Begin test that should return two stores found in the store search.*/
    cy.get("input[name=zip]").clear();
    cy.get("input[name=zip]").type("22042");
    cy.get("input[name=radius]").clear();
    cy.get("input[name=radius]").type(2);
    cy.get("#button").click(); // Click submit button
    cy.get(".row__storaddress").should("contain", "7235 Arlington Blvd.");
    cy.get(".row__storaddress").should("contain", "1230 W. Broad St.");
    /* End test that should return two stores found in the store search.*/

    /* Begin test that should return zero stores found in the store search.*/
    cy.get("input[name=zip]").clear();
    cy.get("input[name=zip]").type("90210");
    cy.get("input[name=radius]").clear();
    cy.get("input[name=radius]").type(5);
    cy.get("#button").click(); // Click submit button
    cy.get("#items_container").should("contain", "No stores found");
    /* End test that should return zero stores found in the store search.*/
  });
});
