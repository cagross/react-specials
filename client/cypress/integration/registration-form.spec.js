describe("Submitting Registration Form", () => {
  it("Makes correct HTTP request.", () => {
    const sampleUser = {
      email: "cagross@gmail.com",
      password: "pass",
      firstName: "Carl",
      lastName: "Gross",
      meatPref: "beef",
      price: "4.99",
    };
    const route = "/register";
    const method = "POST";

    cy.intercept(method, "http://localhost:5555/register", {}).as("getSearch");
    cy.visit(route);

    cy.get("input[name=username]").type(sampleUser.email);
    cy.get("input[name=password]").type(sampleUser.password);
    cy.get("input[name=firstname]").type(sampleUser.firstName);
    cy.get("input[name=lastname]").type(sampleUser.lastName);
    cy.get("select").select(sampleUser.meatPref);
    cy.get("input[name=price]").type(sampleUser.price);

    cy.get("#button").click(); // Click on button

    cy.wait("@getSearch").its("request.url").should("include", route);
    cy.get("@getSearch") // yields the same interception object
      .its("request.body")
      .should("deep.equal", sampleUser);
    cy.get("@getSearch").its("request.method").should("equal", method);
    cy.get("@getSearch").its("request.headers").should("include", {
      "content-type": "application/json",
    });
  });
});
