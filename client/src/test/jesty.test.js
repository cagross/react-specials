/**
 * [Jest](https://jestjs.io/) unit tests for Express app.
 * @file
 * @author Carl Gross
 */

require("@testing-library/jest-dom/extend-expect");
window.fetch = () => {};

describe("When registration page submit button is clicked", () => {
  const fs = require("fs");
  const html = fs.readFileSync("../routes/register/register.html");

  document.body.innerHTML = html;
  const regModule = require("../../../routes/register/register.js");
  const { screen } = require("@testing-library/dom");
  const { default: userEvent } = require("@testing-library/user-event");

  const testEmail = "testemail@example.com";
  const testPass = "testpass";
  const testFirstName = "testfirstname";
  const testLastName = "testLastname";
  const testMeatPref = "Beef";
  const testPrice = "4.99";

  beforeAll(() => jest.spyOn(window, "fetch"));

  regModule.test();

  it("Sends the correct HTTP request.", async () => {
    window.fetch.mockResolvedValueOnce({});

    await userEvent.type(
      screen.getByPlaceholderText("e.g. johndoe@example.com"),
      testEmail
    );
    await userEvent.type(
      screen.getByPlaceholderText("e.g. mysecretpassphrase123!"),
      testPass
    );
    await userEvent.type(
      screen.getByPlaceholderText("e.g. John"),
      testFirstName
    );
    await userEvent.type(screen.getByPlaceholderText("e.g. Doe"), testLastName);
    await userEvent.selectOptions(
      screen.getByLabelText("Meat Preference"),
      "Beef"
    );
    await userEvent.type(screen.getByPlaceholderText("e.g. 4.99"), testPrice);

    userEvent.click(screen.getByTestId("mytestid"));
    expect(window.fetch).toHaveBeenCalledWith(
      "/register",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: testEmail,
          password: testPass,
          firstName: testFirstName,
          lastName: testLastName,
          meatPref: testMeatPref.toLowerCase(),
          price: testPrice,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  });
});
