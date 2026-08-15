const PASSWORD = "7890";

let keys = JSON.parse(
  localStorage.getItem("keyvault_keys") || "[]"
);


/* =========================
   START APP
========================= */

document.addEventListener("DOMContentLoaded", function () {

  document.getElementById("unlockButton").onclick = unlock;

  document.getElementById("pinInput").onkeydown = function (e) {
    if (e.key === "Enter") {
      unlock();
    }
  };

  document.getElementById("lockButton").onclick = lock;

  document.getElementById("addButton").onclick = function () {
    document.getElementById("addPanel").style.display = "block";
  };

  document.getElementById("closeAdd").onclick = function () {
    document.getElementById("addPanel").style.display = "none";
  };

  document.getElementById("searchInput").oninput = renderKeys;

  document.getElementById("keysNav").onclick = showKeys;

  document.getElementById("usageNav").onclick = showUsage;

  document.getElementById("settingsNav").onclick = showSettings;

  document.getElementById("refreshUsage").onclick = renderUsage;

  document.getElementById("settingsLock").onclick = lock;

  setupSettings();

  renderKeys();
  renderUsage();

});


/* =========================
   PASSWORD
========================= */

function unlock() {

  const pin =
    document.getElementById("pinInput").value;

  if (pin === PASSWORD) {

    document.getElementById("lockScreen").style.display = "none";

    document.getElementById("app").style.display = "block";

    document.getElementById("error").textContent = "";

    renderKeys();

  } else {

    document.getElementById("error").textContent =
      "Incorrect password";

  }

}


function lock() {

  document.getElementById("app").style.display = "none";

  document.getElementById("lockScreen").style.display = "flex";

  document.getElementById("pinInput").value = "";

}


/* =========================
   SAVE API KEY
========================= */

function saveKey() {

  const provider =
    document.getElementById("providerInput").value.trim();

  const name =
    document.getElementById("nameInput").value.trim();

  const api =
    document.getElementById("apiInput").value.trim();

  const balance =
    document.getElementById("balanceInput").value.trim();


  if (!provider || !name || !api) {

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


  document.getElementById("providerInput").value = "";

  document.getElementById("nameInput").value = "";

  document.getElementById("apiInput").value = "";

  document.getElementById("balanceInput").value = "";


  document.getElementById("addPanel").style.display = "none";


  renderKeys();

  renderUsage();

}


/* =========================
   KEYS PAGE
========================= */

function showKeys() {

  document.getElementById("keysPage").style.display = "block";

  document.getElementById("usagePage").style.display = "none";

  document.getElementById("settingsPage").style.display = "none";


  document.getElementById("keysNav").classList.add("selected");

  document.getElementById("usageNav").classList.remove("selected");

  document.getElementById("settingsNav").classList.remove("selected");

}


/* =========================
   USAGE PAGE
========================= */

function showUsage() {

  document.getElementById("keysPage").style.display = "none";

  document.getElementById("usagePage").style.display = "block";

  document.getElementById("settingsPage").style.display = "none";


  document.getElementById("keysNav").classList.remove("selected");

  document.getElementById("usageNav").classList.add("selected");

  document.getElementById("settingsNav").classList.remove("selected");


  renderUsage();

}


/* =========================
   SETTINGS PAGE
========================= */

function showSettings() {

  document.getElementById("keysPage").style.display = "none";

  document.getElementById("usagePage").style.display = "none";

  document.getElementById("settingsPage").style.display = "block";


  document.getElementById("keysNav").classList.remove("selected");

  document.getElementById("usageNav").classList.remove("selected");

  document.getElementById("settingsNav").classList.add("selected");

}


/* =========================
   RENDER API CARDS
========================= */

function renderKeys() {

  const list =
    document.getElementById("keyList");

  const search =
    document.getElementById("searchInput")
      .value
      .toLowerCase();


  const filtered =
    keys.filter(function (key) {

      return (
        key.name.toLowerCase().includes(search) ||
        key.provider.toLowerCase().includes(search)
      );

    });


  document.getElementById("allCount").textContent =
    keys.length;


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


  filtered.forEach(function (key) {

    const card =
      document.createElement("div");

    card.className = "apiCard";


    const hide =
      localStorage.getItem("hideKeys") !== "false";


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
          ${
            hide
              ? maskKey(key.key)
              : escapeHTML(key.key)
          }
        </div>

        <div class="status">
          ● Saved
        </div>

      </div>

      <div class="cardRight">

        <strong>
          ${
            key.balance
              ? "USD " + key.balance
              : "—"
          }
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


/* =========================
   USAGE
========================= */

function renderUsage() {

  const total =
    keys.reduce(function (sum, key) {

      return sum + Number(key.balance || 0);

    }, 0);


  document.getElementById("totalBalance").textContent =
    "USD " + total.toFixed(2);


  document.getElementById("usageKeyCount").textContent =
    keys.length;


  document.getElementById("activeKeyCount").textContent =
    keys.length;


  const list =
    document.getElementById("usageList");


  if (keys.length === 0) {

    list.innerHTML = `

      <div class="empty">

        <div class="bigKey">📊</div>

        <h2>No usage data</h2>

        <p>
          Add an API key to see usage here.
        </p>

      </div>

    `;

    return;

  }


  list.innerHTML = "";


  keys.forEach(function (key) {

    const balance =
      Number(key.balance || 0);


    const percentage =
      Math.min(100, Math.max(5, balance));


    const card =
      document.createElement("div");

    card.className = "usageCard";


    card.innerHTML = `

      <div class="usageTop">

        <span class="usageName">
          ${escapeHTML(key.name)}
        </span>

        <span class="usageMoney">
          USD ${balance.toFixed(2)}
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


/* =========================
   DELETE
========================= */

function deleteKey(id) {

  keys =
    keys.filter(function (key) {

      return key.id !== id;

    });


  localStorage.setItem(
    "keyvault_keys",
    JSON.stringify(keys)
  );


  renderKeys();

  renderUsage();

}


/* =========================
   SETTINGS
========================= */

function setupSettings() {

  const hideKeys =
    document.getElementById("hideKeys");

  hideKeys.checked =
    localStorage.getItem("hideKeys") !== "false";


  hideKeys.onchange = function () {

    localStorage.setItem(
      "hideKeys",
      this.checked
    );

    renderKeys();

  };


  const autoClipboard =
    document.getElementById("autoClipboard");

  autoClipboard.checked =
    localStorage.getItem("autoClipboard") === "true";


  autoClipboard.onchange = function () {

    localStorage.setItem(
      "autoClipboard",
      this.checked
    );

  };


  const lowBalance =
    document.getElementById("lowBalance");

  lowBalance.checked =
    localStorage.getItem("lowBalance") !== "false";


  lowBalance.onchange = function () {

    localStorage.setItem(
      "lowBalance",
      this.checked
    );

  };


  const invalidAlerts =
    document.getElementById("invalidAlerts");

  invalidAlerts.checked =
    localStorage.getItem("invalidAlerts") !== "false";


  invalidAlerts.onchange = function () {

    localStorage.setItem(
      "invalidAlerts",
      this.checked
    );

  };


  document
    .querySelectorAll(".appearanceButton")
    .forEach(function (button) {

      button.onclick = function () {

        document
          .querySelectorAll(".appearanceButton")
          .forEach(function (b) {

            b.classList.remove("active");

          });


        button.classList.add("active");

      };

    });


  /* EXPORT */

  document.getElementById("exportBackup").onclick =
    function () {

      const data =
        JSON.stringify(keys, null, 2);


      const blob =
        new Blob(
          [data],
          { type: "application/json" }
        );


      const url =
        URL.createObjectURL(blob);


      const a =
        document.createElement("a");


      a.href = url;

      a.download =
        "keyvault-backup.json";


      a.click();


      URL.revokeObjectURL(url);

    };


  /* IMPORT */

  const importButton =
    document.getElementById("importBackup");

  const backupFile =
    document.getElementById("backupFile");


  importButton.onclick = function () {

    backupFile.click();

  };


  backupFile.onchange =
    function (event) {

      const file =
        event.target.files[0];


      if (!file) return;


      const reader =
        new FileReader();


      reader.onload =
        function (e) {

          try {

            const imported =
              JSON.parse(e.target.result);


            if (!Array.isArray(imported)) {

              alert("Invalid backup file.");

              return;

            }


            keys = imported;


            localStorage.setItem(
              "keyvault_keys",
              JSON.stringify(keys)
            );


            renderKeys();

            renderUsage();


            alert(
              "Backup imported successfully."
            );

          }

          catch {

            alert(
              "Could not read backup."
            );

          }

        };


      reader.readAsText(file);

    };

}


/* =========================
   HELPERS
========================= */

function maskKey(key) {

  if (!key || key.length < 8) {

    return "••••••••";

  }


  return (
    key.substring(0, 3) +
    "••••••••••" +
    key.substring(key.length - 4)
  );

}


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


function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}
