const PASSWORD = "7890";


document.addEventListener(
  "DOMContentLoaded",
  function () {

    const pin =
      document.getElementById("pinInput");

    const unlockButton =
      document.getElementById("unlockButton");


    unlockButton.addEventListener(
      "click",
      unlockVault
    );


    pin.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Enter") {

          unlockVault();

        }

      }
    );


    document
      .getElementById("lockButton")
      .addEventListener(
        "click",
        lockVault
      );

  }
);


function unlockVault() {

  const pin =
    document.getElementById("pinInput");

  const error =
    document.getElementById("error");


  if (pin.value === PASSWORD) {

    error.textContent = "";

    document
      .getElementById("lockScreen")
      .style.display = "none";

    document
      .getElementById("app")
      .style.display = "block";

  } else {

    error.textContent =
      "Incorrect password";

    pin.value = "";

  }

}


function lockVault() {

  document
    .getElementById("app")
    .style.display = "none";

  document
    .getElementById("lockScreen")
    .style.display = "flex";

  document
    .getElementById("pinInput")
    .value = "";

}
