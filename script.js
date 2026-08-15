const PASSWORD = "7890";

let keys = JSON.parse(localStorage.getItem("keyvault_keys") || "[]");

document.addEventListener("DOMContentLoaded", function () {

  document.getElementById("unlockButton").onclick = unlock;

  document.getElementById("pinInput").onkeydown = function(e) {
    if (e.key === "Enter") unlock();
  };

  document.getElementById("lockButton").onclick = lock;

  document.getElementById("addButton").onclick = function() {
    document.getElementById("addPanel").style.display = "block";
  };

  document.getElementById("closeAdd").onclick = function() {
    document.getElementById("addPanel").style.display = "none";
  };

  document.getElementById("searchInput").oninput = renderKeys;

  renderKeys();
});


function unlock() {

  const pin = document.getElementById("pinInput").value;

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


/* SAVE API KEY */

function saveKey() {

  const provider =
    document.getElementById("providerInput").value.trim();

  const name =
    document.getElementById("nameInput").value.trim();

  const api =
    document.getElementById("apiInput").value.trim();


  if (provider === "" || name === "" || api === "") {

    alert("Please fill all three fields.");

    return;
  }


  const newKey = {

    id: Date.now(),

    provider: provider,

    name: name,

    key: api

  };


  keys.push(newKey);


  localStorage.setItem(
    "keyvault_keys",
    JSON.stringify(keys)
  );


  document.getElementById("providerInput").value = "";

  document.getElementById("nameInput").value = "";

  document.getElementById("apiInput").value = "";


  document.getElementById("addPanel").style.display = "none";


  renderKeys();

}


/* SHOW KEYS */

function renderKeys() {

  const list =
    document.getElementById("keyList");

  const search =
    document.getElementById("searchInput")
    .value
    .toLowerCase();


  const filtered = keys.filter(function(key) {

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


  filtered.forEach(function(key) {

    const card =
      document.createElement("div");

    card.className = "apiCard";


    card.innerHTML = `

      <div class="providerIcon">
        ${getIcon(key.provider)}
      </div>

      <div class="apiInfo">

        <h3>${escapeHTML(key.name)}</h3>

        <div class="provider">
          ${escapeHTML(key.provider)}
        </div>

        <div class="masked">
          ${maskKey(key.key)}
        </div>

        <div class="status">
          ● Saved
        </div>

      </div>

      <div class="cardRight">

        <strong>—</strong>

        <small>Balance</small>

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


/* MASK API KEY */

function maskKey(key) {

  if (key.length < 8) {

    return "••••••••";

  }

  return (
    key.substring(0, 3) +
    "••••••••••" +
    key.substring(key.length - 4)
  );

}


/* PROVIDER ICON */

function getIcon(provider) {

  const p = provider.toLowerCase();

  if (p.includes("openai")) return "AI";

  if (p.includes("gemini")) return "GM";

  if (p.includes("google")) return "GM";

  if (p.includes("anthropic")) return "AN";

  if (p.includes("deepseek")) return "DS";

  if (p.includes("openrouter")) return "OR";

  return "🔑";

}


/* DELETE */

function deleteKey(id) {

  keys = keys.filter(function(key) {

    return key.id !== id;

  });


  localStorage.setItem(
    "keyvault_keys",
    JSON.stringify(keys)
  );


  renderKeys();

}


/* SECURITY */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}
