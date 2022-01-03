/**
 * [Jest](https://jestjs.io/) unit tests for Express app.
 * @file
 * @author Carl Gross
 */

import * as fs from "fs";
import { jest } from "@jest/globals";
import { regSubmitHandler } from "../../../routes/register/register.js";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
window.fetch = () => {};

describe("When registration page submit button is clicked", () => {
  const html = fs.readFileSync("../routes/register/register.html");

  document.body.innerHTML = html;

  const testEmail = "testemail@example.com";
  const testPass = "testpass";
  const testFirstName = "testfirstname";
  const testLastName = "testLastname";
  const testMeatPref = "Beef";
  const testPrice = "4.99";

  beforeAll(() => jest.spyOn(window, "fetch"));

  document.querySelector("form").addEventListener("submit", regSubmitHandler);

  it("Sends the correct HTTP request.", async () => {
    window.fetch.mockResolvedValueOnce({});
    userEvent.type(
      screen.getByPlaceholderText("e.g. johndoe@example.com"),
      testEmail
    );
    userEvent.type(
      screen.getByPlaceholderText("e.g. mysecretpassphrase123!"),
      testPass
    );
    userEvent.type(screen.getByPlaceholderText("e.g. John"), testFirstName);
    userEvent.type(screen.getByPlaceholderText("e.g. Doe"), testLastName);
    userEvent.selectOptions(screen.getByLabelText("Meat Preference"), "Beef");
    userEvent.type(screen.getByPlaceholderText("e.g. 4.99"), testPrice);
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
