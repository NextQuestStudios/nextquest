import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore();

const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

const tilePreview = document.getElementById("tilePreview").getContext("2d");
const tilePicker = document.getElementById("tilePicker");
const layerSelect = document.getElementById("layerSelect");
const modeSelect = document.getElementById("modeSelect");
const entitySelect = document.getElementById("entitySelect");
const entityPreview = document.getElementById("entityPreview").getContext("2d");

const saveMapBtn = document.getElementById("saveMapBtn");
const clearMapBtn = document.getElementById("clearMapBtn");

const tileControls = document.getElementById("tileControls");
const entityControls = document.getElementById("entityControls");

let selectedTile = null;
let tileImage = new Image();
let selectedEntity = null;
let mapData = {
  ground: {},
  object: {},
  overlay: {},
  npcs: {},
  objects: {}
};

let camera = { x: 0, y: 0 };
const tileSize = 32;

tilePicker.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    tileImage.src = event.target.result;
    tileImage.onload = () => {
      selectedTile = tileImage;
      tilePreview.clearRect(0, 0, 32, 32);
      tilePreview.drawImage(tileImage, 0, 0, 32, 32);
    };
  };
  reader.readAsDataURL(file);
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left + camera.x) / tileSize);
  const y = Math.floor((e.clientY - rect.top + camera.y) / tileSize);
  const key = `${x},${y}`;
  const mode = modeSelect.value;

  if (mode === "tile") {
    if (!selectedTile) return;
    const layer = layerSelect.value;
    mapData[layer][key] = selectedTile.src;
  } else if (mode === "npc" && selectedEntity) {
    mapData.npcs[key] = selectedEntity;
  } else if (mode === "object" && selectedEntity) {
    mapData.objects[key] = selectedEntity;
  }

  drawMap();
});

function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ["ground", "object", "overlay"].forEach((layer) => {
    for (const key in mapData[layer]) {
      const [x, y] = key.split(",").map(Number);
      const img = new Image();
      img.src = mapData[layer][key];
      ctx.drawImage(img, x * tileSize - camera.x, y * tileSize - camera.y, tileSize, tileSize);
    }
  });

  // Draw objects
  for (const key in mapData.objects) {
    const [x, y] = key.split(",").map(Number);
    const img = new Image();
    img.src = mapData.objects[key].icon;
    ctx.drawImage(img, x * tileSize - camera.x, y * tileSize - camera.y, tileSize, tileSize);
  }

  // Draw NPCs
  for (const key in mapData.npcs) {
    const [x, y] = key.split(",").map(Number);
    const img = new Image();
    img.src = mapData.npcs[key].icon;
    ctx.drawImage(img, x * tileSize - camera.x, y * tileSize - camera.y, tileSize, tileSize);
  }
}

window.addEventListener("keydown", (e) => {
  const speed = 32;
  if (e.key === "ArrowUp") camera.y -= speed;
  if (e.key === "ArrowDown") camera.y += speed;
  if (e.key === "ArrowLeft") camera.x -= speed;
  if (e.key === "ArrowRight") camera.x += speed;
  drawMap();
});

saveMapBtn.addEventListener("click", async () => {
  const mapId = prompt("Enter map ID to save:", "tutorial-island");
  if (!mapId) return;

  try {
    await setDoc(doc(db, "maps", mapId), mapData);
    alert("Map saved to Firebase as: " + mapId);
  } catch (err) {
    alert("Save failed: " + err.message);
  }
});

clearMapBtn.addEventListener("click", () => {
  if (confirm("Clear the entire map?")) {
    mapData = {
      ground: {},
      object: {},
      overlay: {},
      npcs: {},
      objects: {}
    };
    drawMap();
  }
});

// Load NPCs & Objects from Firebase
async function loadEntities() {
  const npcSnap = await getDocs(collection(db, "npcs"));
  const objectSnap = await getDocs(collection(db, "items")); // using items as objects for now

  const all = [];
  npcSnap.forEach(doc => {
    const data = doc.data();
    if (data.sprite) {
      all.push({ id: doc.id, icon: data.sprite, type: "npc", name: data.name });
    }
  });

  objectSnap.forEach(doc => {
    const data = doc.data();
    if (data.icon) {
      all.push({ id: doc.id, icon: data.icon, type: "object", name: data.name });
    }
  });

  entitySelect.innerHTML = `<option value="">-- Select --</option>`;
  all.forEach(ent => {
    const option = document.createElement("option");
    option.value = JSON.stringify(ent);
    option.textContent = `[${ent.type}] ${ent.name}`;
    entitySelect.appendChild(option);
  });
}

entitySelect.addEventListener("change", () => {
  const value = entitySelect.value;
  if (!value) {
    selectedEntity = null;
    entityPreview.clearRect(0, 0, 32, 32);
    return;
  }

  const parsed = JSON.parse(value);
  selectedEntity = parsed;

  const img = new Image();
  img.src = parsed.icon;
  img.onload = () => {
    entityPreview.clearRect(0, 0, 32, 32);
    entityPreview.drawImage(img, 0, 0, 32, 32);
  };
});

modeSelect.addEventListener("change", () => {
  const mode = modeSelect.value;
  tileControls.style.display = mode === "tile" ? "block" : "none";
  entityControls.style.display = mode !== "tile" ? "block" : "none";
});

import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Replace "tutorial-island" with the actual ID you use
const mapId = "tutorial-island";

const unsubscribe = onSnapshot(doc(db, "maps", mapId), (docSnap) => {
  if (docSnap.exists()) {
    mapData = docSnap.data();
    drawMap();
  }
});

loadEntities();
