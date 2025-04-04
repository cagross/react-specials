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

    // Find two different rows and verify they're visible
    cy.get(".row").each(($row, index) => {
      if (index === 0) {
        const firstRow = $row;
        const firstText = firstRow.find(".row__name").text();

        cy.get(".row").each(($otherRow, otherIndex) => {
          if (otherIndex > 0) {
            const otherText = $otherRow.find(".row__name").text();
            if (firstText !== otherText) {
              cy.wrap(firstRow).should("be.visible");
              cy.wrap($otherRow).should("be.visible");
              return false;
            }
          }
        });
      }
    });

    cy.get(".row__storaddress").should("contain", "7235 Arlington Blvd.");
    cy.get(".row__storaddress").should("contain", "1230 W. Broad St.");

    /* Begin test for radio button visibility after clicking filter */
    cy.get('input[type="radio"]').eq(1).click();
    cy.get(".filter").should("be.visible");
    /* End test that should return two stores found in the store search.*/

    /* Begin test that should return zero stores found in the store search.*/
    cy.intercept("POST", "/items").as("itemsRequest");

    cy.get("input[name=zip]").clear();
    cy.get("input[name=zip]").type("90210");
    cy.get("input[name=radius]").clear();
    cy.get("input[name=radius]").type(5);

    cy.get("#button").click(); // Click submit button

    // Wait for the first network request, then assert it returns a status code is 204, as it is the semantically correct response for this case.
    cy.wait("@itemsRequest").its("response.statusCode").should("eq", 204);

    //Wait for all network requests to complete, then assert that only one request was made.
    cy.get("@itemsRequest.all").should("have.length", 1);

    cy.get("#items_container").should("contain", "No stores found");

    /* End test that should return zero stores found in the store search.*/
  });
});
