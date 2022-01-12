describe("Listing Items", () => {
  it("Displays items from the circular.", () => {
    const sampleItems = [
      {
        display_name: "Perdue Chicken Short Cuts",
        name: "Perdue Chicken Short Cuts",
        description: "Selected Varieties, 6–9 oz. pkg.",
        current_price: "6.0",
        pre_price_text: "2/",
        price_text: "",
        valid_to: "2020-09-03",
        valid_from: "2020-08-28",
        disclaimer_text: null,
        unit_price: 16,
      },
      {
        display_name: "Giant Smoked Bone-In Ham Butt or Shank",
        name: "Giant Smoked Bone-In Ham Butt or Shank",
        description: null,
        current_price: "0.99",
        pre_price_text: "",
        price_text: "/lb.",
        valid_to: "2020-04-12",
        valid_from: "2020-04-10",
        disclaimer_text: "LIMIT 2",
        unit_price: "0.99",
      },
    ];

    const url = "http://localhost:5555/items";
    cy.intercept(url, sampleItems);

    cy.visit("/");
    cy.contains(sampleItems[0].name);
    cy.contains(sampleItems[1].name);
  });
});
