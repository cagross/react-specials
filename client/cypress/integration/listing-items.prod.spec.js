describe("Production URL: Listing Items", () => {
  it("Displays items from the circular.", () => {
    cy.visit("https://gentle-gorge-04163.herokuapp.com/");

    //Ensure $items_container element is not empty.
    cy.get("#items_container");
    cy.contains(/.+/);
  });
});
