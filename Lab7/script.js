const ACCESS_KEY = "_X2599kN3yJzQhuM5cXYTmVpKoFdGGBweJ31k5fVS2k"; 
const API_URL = "https://api.unsplash.com/search/photos";
const PER_PAGE = 10;

const Images = document.getElementById("Images");
const statusEl = document.getElementById("status");

document.getElementById("buttonXHR").addEventListener("click", searchXHR);
document.getElementById("buttonPromises").addEventListener("click", searchFetchPromises);
document.getElementById("buttonAsync").addEventListener("click", searchFetchAsync);

function getQuery() {
  return document.getElementById("query").value.trim() || "nature";
}

function buildURL(query) {
  return `${API_URL}?${new URLSearchParams({ query, per_page: PER_PAGE })}`;
}

function renderImages(data) {
  Images.innerHTML = "";
  if (!data.results || data.results.length === 0) {
    showStatus("No results found.", false);
    return;
  }
  data.results.forEach(photo => {
    const img = document.createElement("img");
    img.src = photo.urls.regular;
    img.alt = photo.alt_description || photo.description || "Unsplash photo";
    img.loading = "lazy";
    Images.appendChild(img);
  });
  showStatus(`${data.results.length} photos for "${getQuery()}"`, false);
}

function showStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.className = "status" + (isError ? " error" : "");
}


function searchXHR() {
  showStatus("Loading…");
  const xhr = new XMLHttpRequest();
  xhr.open("GET", buildURL(getQuery()));
  xhr.setRequestHeader("Authorization", `Client-ID ${ACCESS_KEY}`);
  xhr.addEventListener("load", () => {
    if (xhr.status === 200) renderImages(JSON.parse(xhr.responseText));
    else showStatus(`Error ${xhr.status}: ${xhr.statusText}`, true);
  });
  xhr.addEventListener("error", () => showStatus("Error (XHR)", true));
  xhr.send();
}

function searchFetchPromises() {
  showStatus("Loading…");
  fetch(buildURL(getQuery()), {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` }
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => renderImages(data))
    .catch(err => showStatus(`Error: ${err.message}`, true));
}

async function searchFetchAsync() {
  showStatus("Loading…");
  try {
    const res = await fetch(buildURL(getQuery()), {
      headers: { Authorization: `Client-ID ${ACCESS_KEY}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderImages(data);
  } catch (err) {
    showStatus(`Error: ${err.message}`, true);
  }
}
