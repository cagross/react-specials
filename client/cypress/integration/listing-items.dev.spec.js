describe("Development URL: Listing Items", () => {
  it("Displays items from the circular.", () => {
    cy.visit("/");

    //Ensure $items_container element is not empty.
    cy.get("#items_container");
    cy.contains(/.+/);
  });
});
