/**
 * Form handler for registration form on /register route. Note that export syntax is non-standard, because I'd like this module to be available for use by both Node and the browser ([see here](https://stackoverflow.com/a/3226739/3623908))
 * @module
 * @param {*} e
 * @returns
 */
export function regSubmitHandler(e) {
  console.log("Inside registration submit handler.");
  e.preventDefault();

  fetch("/register", {
    method: "POST",
    body: JSON.stringify({
      email: document.querySelectorAll("input")[0].value,
      password: document.querySelectorAll("input")[1].value,
      firstName: document.querySelectorAll("input")[2].value,
      lastName: document.querySelectorAll("input")[3].value,
      meatPref: document.querySelector("#meat-select").value,
      price: document.querySelectorAll("input")[4].value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.log("Error fetching.");
    console.log(err);
  });
  return;
}
