const PASSWORD = "7890";


/* LOAD DATA */

let keys =
  JSON.parse(
    localStorage.getItem("keyvault_keys") || "[]"
  );


/* START */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    document
      .getElementById("unlockButton")
      .onclick = unlock;


    document
      .getElementById("pinInput")
      .onkeydown = function(e) {

        if (e.key === "Enter") {

          unlock();

        }

      };


    document
      .getElementById("lockButton")
      .onclick = lock;


    document
      .getElementById("addButton")
      .onclick = function() {

        document
          .getElementById("addPanel")
          .style.display = "block";

      };


    document
      .getElementById("closeAdd")
      .onclick = function() {

        document
          .getElementById("addPanel")
          .style.display = "none";

      };


    document
      .getElementById("searchInput")
      .oninput = renderKeys;


    document
      .getElementById("keysNav")
      .onclick = showKeys;


    document
      .getElementById("usageNav")
      .onclick = showUsage;


    document
      .getElementById("refreshUsage")
      .onclick = renderUsage;


    renderKeys();

    renderUsage();

  }
);


/* UNLOCK */

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


/* LOCK */

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


/* SAVE */

function saveKey() {

  const provider =
    document
      .getElementById("providerInput")
      .value.trim();


  const name =
    document
      .getElementById("nameInput")
      .value.trim();


  const api =
    document
      .getElementById("apiInput")
      .value.trim();


  const balance =
    document
      .getElementById("balanceInput")
      .value.trim();


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


  keys.push(newKey);


  localStorage.setItem(
    "keyvault_keys",
    JSON.stringify(keys)
  );


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


  document
    .getElementById("addPanel")
    .style.display = "none";


  renderKeys();

  renderUsage();

}


/* KEYS PAGE */

function showKeys() {

  document
    .getElementById("keysPage")
    .style.display = "block";


  document
    .getElementById("usagePage")
    .style.display = "none";


  document
    .getElementById("keysNav")
    .classList.add("selected");


  document
    .getElementById("usageNav")
    .classList.remove("selected");

}


/* USAGE PAGE */

function showUsage() {

  document
    .getElementById("keysPage")
    .style.display = "none";


  document
    .getElementById("usagePage")
    .style.display = "block";


  document
    .getElementById("usageNav")
    .classList.add("selected");


  document
    .getElementById("keysNav")
    .classList.remove("selected");


  renderUsage();

}


/* RENDER KEYS */

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
    .textContent =
    keys.length;


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


  list.innerHTML = "";


  filtered.forEach(function(key) {

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

  });

}


/* USAGE */

function renderUsage() {

  const total =
    keys.reduce(
      function(sum, key) {

        return sum + Number(key.balance || 0);

      },
      0
    );


  document
    .getElementById("totalBalance")
    .textContent =
    "USD " + total.toFixed(2);


  document
    .getElementById("usageKeyCount")
    .textContent =
    keys.length;


  document
    .getElementById("activeKeyCount")
    .textContent =
    keys.length;


  const list =
    document
      .getElementById("usageList");


  if (keys.length === 0) {

    list.innerHTML = `

      <div class="empty">

        <div class="bigKey">
          📊
        </div>

        <h2>
          No usage data
        </h2>

        <p>
          Add an API key to see usage here.
        </p>

      </div>

    `;

    return;

  }


  list.innerHTML = "";


  keys.forEach(function(key) {


    const balance =
      Number(key.balance || 0);


    const percentage =
      Math.min(
        100,
        Math.max(
          5,
          balance
        )
      );


    const card =
      document.createElement("div");


    card.className =
      "usageCard";


    card.innerHTML = `

      <div class="usageTop">

        <span class="usageName">
          ${escapeHTML(key.name)}
        </span>

        <span class="usageMoney">
          USD ${key.balance}
        </span>

      </div>


      <div class="progress">

        <div
          class="progressBar"
          style="width:${percentage}%">
        </div>

      </div>


      <div class="usageBottom">

        <span>
          ${escapeHTML(key.provider)}
        </span>

        <span>
          Active
        </span>

      </div>

    `;


    list.appendChild(card);

  });

}


/* DELETE */

function deleteKey(id) {

  keys =
    keys.filter(function(key) {

      return key.id !== id;

    });


  localStorage.setItem(
    "keyvault_keys",
    JSON.stringify(keys)
  );


  renderKeys();

  renderUsage();

}


/* MASK */

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


/* ICON */

function getIcon(provider) {

  const p =
    provider.toLowerCase();


  if (p.includes("openai"))
    return "AI";


  if (
    p.includes("gemini") ||
    p.includes("google")
  )
    return "GM";


  if (p.includes("anthropic"))
    return "AN";


  if (p.includes("deepseek"))
    return "DS";


  if (p.includes("openrouter"))
    return "OR";


  return "🔑";

}


/* HTML SAFETY */

function escapeHTML(text) {

  const div =
    document.createElement("div");


  div.textContent = text;


  return div.innerHTML;

}
