const PASSWORD = "7890";


/* =========================
   LOAD SAVED KEYS
========================= */

let keys =
  JSON.parse(
    localStorage.getItem("keyvault_keys") || "[]"
  );



/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    document
      .getElementById("unlockButton")
      .onclick = unlock;


    document
      .getElementById("pinInput")
      .onkeydown = function (e) {

        if (e.key === "Enter") {

          unlock();

        }

      };


    document
      .getElementById("lockButton")
      .onclick = lock;


    document
      .getElementById("addButton")
      .onclick = function () {

        document
          .getElementById("addPanel")
          .style.display = "block";

      };


    document
      .getElementById("closeAdd")
      .onclick = function () {

        document
          .getElementById("addPanel")
          .style.display = "none";

      };


    document
      .getElementById("searchInput")
      .oninput = renderKeys;


    renderKeys();

  }
);



/* =========================
   PASSWORD
========================= */

function unlock() {

  const pin =
    document
      .getElementById("pinInput")
      .value;


  if (pin === PASSWORD) {

    document
      .getElementById("lockScreen")
      .style.display = "none";


    document
      .getElementById("app")
      .style.display = "block";


    document
      .getElementById("error")
      .textContent = "";


    renderKeys();

  }

  else {

    document
      .getElementById("error")
      .textContent =
      "Incorrect password";

  }

}



/* =========================
   LOCK
========================= */

function lock() {

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


  const balance =
    document
      .getElementById("balanceInput")
      .value
      .trim();



  /* CHECK */

  if (
    provider === "" ||
    name === "" ||
    api === ""
  ) {

    alert(
      "Please fill Provider, API name and API key."
    );

    return;

  }



  /* CREATE */

  const newKey = {

    id: Date.now(),

    provider: provider,

    name: name,

    key: api,

    balance:
      balance === ""
        ? "0.00"
        : Number(balance).toFixed(2)

  };



  /* ADD */

  keys.push(newKey);



  /* SAVE */

  localStorage.setItem(
    "keyvault_keys",
    JSON.stringify(keys)
  );



  /* CLEAR */

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
    .getElementById("balanceInput")
    .value = "";



  /* CLOSE */

  document
    .getElementById("addPanel")
    .style.display = "none";



  /* DISPLAY */

  renderKeys();

}



/* =========================
   DISPLAY KEYS
========================= */

function renderKeys() {


  const list =
    document
      .getElementById("keyList");


  const search =
    document
      .getElementById("searchInput")
      .value
      .toLowerCase();



  const filtered =
    keys.filter(
      function (key) {

        return (

          key.name
            .toLowerCase()
            .includes(search)

          ||

          key.provider
            .toLowerCase()
            .includes(search)

        );

      }
    );



  /* COUNT */

  document
    .getElementById("allCount")
    .textContent =
    keys.length;



  /* EMPTY */

  if (filtered.length === 0) {

    list.innerHTML = `

      <div class="empty">

        <div class="bigKey">
          🔑
        </div>

        <h2>
          No API keys yet
        </h2>

        <p>
          Add your first API key using the ＋ button.
        </p>

      </div>

    `;

    return;

  }



  /* CLEAR */

  list.innerHTML = "";



  /* CARDS */

  filtered.forEach(
    function (key) {


      const card =
        document.createElement("div");


      card.className =
        "apiCard";



      card.innerHTML = `

        <div class="providerIcon">

          ${getIcon(key.provider)}

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

          <strong>
            USD ${key.balance}
          </strong>

          <small>
            Balance
          </small>

          <br>

          <button
            class="deleteButton"
            onclick="deleteKey(${key.id})">

            🗑️

          </button>

        </div>

      `;


      list.appendChild(card);

    }
  );

}



/* =========================
   MASK KEY
========================= */

function maskKey(key) {


  if (key.length < 8) {

    return "••••••••";

  }


  return (

    key.substring(0, 3)

    +

    "••••••••••"

    +

    key.substring(
      key.length - 4
    )

  );

}



/* =========================
   ICON
========================= */

function getIcon(provider) {


  const p =
    provider.toLowerCase();


  if (
    p.includes("openai")
  ) {

    return "AI";

  }


  if (
    p.includes("gemini") ||
    p.includes("google")
  ) {

    return "GM";

  }


  if (
    p.includes("anthropic")
  ) {

    return "AN";

  }


  if (
    p.includes("deepseek")
  ) {

    return "DS";

  }


  if (
    p.includes("openrouter")
  ) {

    return "OR";

  }


  return "🔑";

}



/* =========================
   DELETE
========================= */

function deleteKey(id) {


  keys =
    keys.filter(
      function (key) {

        return key.id !== id;

      }
    );


  localStorage.setItem(
    "keyvault_keys",
    JSON.stringify(keys)
  );


  renderKeys();

}



/* =========================
   HTML SAFETY
========================= */

function escapeHTML(text) {


  const div =
    document.createElement("div");


  div.textContent = text;


  return div.innerHTML;

}
