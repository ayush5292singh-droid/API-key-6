const PASSWORD = "7890";

let keys = [];


document.addEventListener("DOMContentLoaded", function () {

  document
    .getElementById("unlockButton")
    .addEventListener("click", unlockVault);


  document
    .getElementById("pinInput")
    .addEventListener("keydown", function (event) {

      if (event.key === "Enter") {
        unlockVault();
      }

    });


  document
    .getElementById("lockButton")
    .addEventListener("click", lockVault);


  document
    .getElementById("addButton")
    .addEventListener("click", openAddPanel);


  document
    .getElementById("emptyAddButton")
    .addEventListener("click", openAddPanel);


  document
    .getElementById("closeAddButton")
    .addEventListener("click", closeAddPanel);


  document
    .getElementById("saveButton")
    .addEventListener("click", saveKey);


  document
    .getElementById("searchInput")
    .addEventListener("input", renderKeys);


  renderKeys();

});


/* UNLOCK */

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


/* LOCK */

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


/* OPEN ADD */

function openAddPanel() {

  document
    .getElementById("addPanel")
    .style.display = "block";

  document
    .getElementById("addPanel")
    .scrollIntoView({
      behavior: "smooth"
    });

}


/* CLOSE ADD */

function closeAddPanel() {

  document
    .getElementById("addPanel")
    .style.display = "none";

}


/* SAVE */

function saveKey() {

  const provider =
    document.getElementById("providerInput").value.trim();

  const name =
    document.getElementById("nameInput").value.trim();

  const api =
    document.getElementById("apiInput").value.trim();


  if (!provider || !name || !api) {

    alert("Please fill all fields.");

    return;

  }


  keys.push({

    id: Date.now(),

    provider: provider,

    name: name,

    key: api

  });


  document.getElementById("providerInput").value = "";

  document.getElementById("nameInput").value = "";

  document.getElementById("apiInput").value = "";


  closeAddPanel();

  renderKeys();

}


/* DISPLAY */

function renderKeys() {

  const list =
    document.getElementById("keyList");

  const search =
    document
      .getElementById("searchInput")
      .value
      .toLowerCase();


  const filtered =
    keys.filter(function (item) {

      return (
        item.name.toLowerCase().includes(search) ||
        item.provider.toLowerCase().includes(search)
      );

    });


  document
    .querySelectorAll(".filter b")[0]
    .textContent = keys.length;


  if (filtered.length === 0) {

    list.innerHTML = `

      <div class="empty-state">

        <div class="key-symbol">🔑</div>

        <h2>No API keys yet</h2>

        <p>
          Add your first API key using the ＋ button.
        </p>

        <button
          id="emptyAddButton"
          class="primary-button">

          ＋ Add API Key

        </button>

      </div>

    `;


    document
      .getElementById("emptyAddButton")
      .addEventListener(
        "click",
        openAddPanel
      );

    return;

  }


  list.innerHTML = "";


  filtered.forEach(function (item) {

    const card =
      document.createElement("article");


    card.className = "api-card";


    card.innerHTML = `

      <div class="provider-icon">
        ${getIcon(item.provider)}
      </div>

      <div class="api-info">

        <h3>
          ${escapeHTML(item.name)}
        </h3>

        <span class="provider">
          ${escapeHTML(item.provider)}
        </span>

        <div class="masked-key">
          ${maskKey(item.key)}
        </div>

        <div class="status">
          <i></i>
          Not checked
        </div>

      </div>

      <div class="api-right">

        <strong>—</strong>

        <small>Balance</small>

        <button
          class="delete-button"
          data-id="${item.id}">
          🗑️
        </button>

      </div>

    `;


    list.appendChild(card);

  });


  document
    .querySelectorAll(".delete-button")
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          deleteKey(
            Number(button.dataset.id)
          );

        }
      );

    });

}


/* MASK */

function maskKey(key) {

  if (key.length <= 8) {
    return "••••••••";
  }


  return (
    key.substring(0, 3) +
    "••••••••••" +
    key.substring(key.length - 4)
  );

}


/* ICON */

function getIcon(provider) {

  const name =
    provider.toLowerCase();


  if (name.includes("openai")) {
    return "◎";
  }

  if (
    name.includes("google") ||
    name.includes("gemini")
  ) {
    return "✦";
  }

  if (name.includes("anthropic")) {
    return "A";
  }

  return "🔑";

}


/* DELETE */

function deleteKey(id) {

  keys =
    keys.filter(function (item) {
      return item.id !== id;
    });


  renderKeys();

}


/* ESCAPE */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}
