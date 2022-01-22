/**
 * Form handler for registration form on /register route.
 * @module
 * @param {*} e
 * @returns
 */
export function regSubmitHandler(e) {
  console.log("Inside registration submit handler.");
  e.preventDefault();

  const confirmText = document.createTextNode(
    "Thank you for your submission. Your user has been created."
  );
  document.getElementById("confirm").appendChild(confirmText);

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
