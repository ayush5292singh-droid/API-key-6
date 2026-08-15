const PASSWORD = "7890";

let keys = [];


document.addEventListener("DOMContentLoaded", function () {


  /* UNLOCK */

  document
    .getElementById("unlockButton")
    .addEventListener("click", unlock);


  document
    .getElementById("pinInput")
    .addEventListener("keydown", function(e) {

      if (e.key === "Enter") {

        unlock();

      }

    });


  /* LOCK */

  document
    .getElementById("lockButton")
    .addEventListener("click", function() {

      document
        .getElementById("app")
        .style.display = "none";

      document
        .getElementById("lockScreen")
        .style.display = "flex";

      document
        .getElementById("pinInput")
        .value = "";

    });


  /* ADD */

  document
    .getElementById("addButton")
    .addEventListener("click", function() {

      document
        .getElementById("addPanel")
        .style.display = "block";

    });


  /* CLOSE */

  document
    .getElementById("closeAdd")
    .addEventListener("click", function() {

      document
        .getElementById("addPanel")
        .style.display = "none";

    });


  /* SAVE */

  document
    .getElementById("saveButton")
    .addEventListener("click", saveKey);


  /* SEARCH */

  document
    .getElementById("searchInput")
    .addEventListener("input", renderKeys);


  renderKeys();

});


/* =========================
   UNLOCK
========================= */

function unlock() {

  const pin =
    document.getElementById("pinInput").value;

  const error =
    document.getElementById("error");


  if (pin === PASSWORD) {

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

  }

}


/* =========================
   SAVE API
========================= */

function saveKey() {

  const provider =
    document
      .getElementById("providerInput")
      .value
      .trim();

  const name =
    document
      .getElementById("nameInput")
      .value
      .trim();

  const api =
    document
      .getElementById("apiInput")
      .value
      .trim();


  if (
    provider === "" ||
    name === "" ||
    api === ""
  ) {

    alert("Please fill all fields.");

    return;

  }


  keys.push({

    id: Date.now(),

    provider: provider,

    name: name,

    key: api

  });


  document
    .getElementById("providerInput")
    .value = "";

  document
    .getElementById("nameInput")
    .value = "";

  document
    .getElementById("apiInput")
    .value = "";


  document
    .getElementById("addPanel")
    .style.display = "none";


  renderKeys();

}


/* =========================
   RENDER
========================= */

function renderKeys() {

  const list =
    document.getElementById("keyList");

  const search =
    document
      .getElementById("searchInput")
      .value
      .toLowerCase();


  const filtered =
    keys.filter(function(key) {

      return (

        key.name
          .toLowerCase()
          .includes(search)

        ||

        key.provider
          .toLowerCase()
          .includes(search)

      );

    });


  document
    .getElementById("allCount")
    .textContent = keys.length;


  if (filtered.length === 0) {

    list.innerHTML = `

      <div class="empty">

        <div class="bigKey">🔑</div>

        <h2>No API keys yet</h2>

        <p>
          Add your first API key using the ＋ button.
        </p>

      </div>

    `;

    return;

  }


  list.innerHTML = "";


  filtered.forEach(function(key) {


    const card =
      document.createElement("div");


    card.className = "apiCard";


    card.innerHTML = `

      <div class="providerIcon">

        ${getProviderIcon(key.provider)}

      </div>


      <div class="apiInfo">

        <h3>
          ${escapeHTML(key.name)}
        </h3>

        <div class="provider">
          ${escapeHTML(key.provider)}
        </div>

        <div class="masked">
          ${maskKey(key.key)}
        </div>

        <div class="status">
          ● Valid
        </div>

      </div>


      <div class="cardRight">

        <strong>—</strong>

        <small>Balance</small>

        <button
          class="deleteButton"
          data-id="${key.id}">
          🗑️
        </button>

      </div>

    `;


    list.appendChild(card);

  });


  document
    .querySelectorAll(".deleteButton")
    .forEach(function(button) {

      button.addEventListener(
        "click",
        function() {

          deleteKey(
            Number(button.dataset.id)
          );

        }
      );

    });

}


/* =========================
   MASK API
========================= */

function maskKey(key) {

  if (key.length <= 7) {

    return "••••••••";

  }


  return (

    key.substring(0,3) +

    "••••••••••" +

    key.substring(key.length - 4)

  );

}


/* =========================
   PROVIDER ICON
========================= */

function getProviderIcon(provider) {

  const p =
    provider.toLowerCase();


  if (p.includes("openai")) {

    return "AI";

  }


  if (
    p.includes("gemini") ||
    p.includes("google")
  ) {

    return "GM";

  }


  if (p.includes("anthropic")) {

    return "AN";

  }


  if (p.includes("deepseek")) {

    return "DS";

  }


  if (p.includes("openrouter")) {

    return "OR";

  }


  return "🔑";

}


/* =========================
   DELETE
========================= */

function deleteKey(id) {

  keys =
    keys.filter(function(key) {

      return key.id !== id;

    });


  renderKeys();

}


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}
