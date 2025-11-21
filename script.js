const loginForm = document.getElementById('loginForm');
const menu = document.getElementById('menu');
const welcomeMsg = document.getElementById('welcomeMsg');
const form = document.getElementById('itemForm');
const lostDiv = document.getElementById('lostItems');
const foundDiv = document.getElementById('foundItems');
const navButtons = document.querySelectorAll('nav button');

let items = JSON.parse(localStorage.getItem("items")) || [];
let currentUser = localStorage.getItem("currentUser") || null;

// Handle login
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const studentNumber = document.getElementById('studentNumber').value.trim();
  if (studentNumber) {
    currentUser = studentNumber;
    localStorage.setItem("currentUser", currentUser);
    document.getElementById('loginSection').style.display = 'none';
    menu.style.display = 'block';
    welcomeMsg.textContent = `Logged in as Student #${currentUser}`;
    showTab('report');
  }
});

// Logout
function logout() {
  localStorage.removeItem("currentUser");
  currentUser = null;
  menu.style.display = 'none';
  document.getElementById('report').style.display = 'none';
  document.getElementById('lost').style.display = 'none';
  document.getElementById('found').style.display = 'none';
  document.getElementById('loginSection').style.display = 'block';
  welcomeMsg.textContent = "";
}

// Toggle founder name field
function toggleFounderName() {
  const type = document.getElementById('type').value;
  document.getElementById('founderNameField').style.display = (type === 'found') ? 'block' : 'none';
}

// Handle item upload
form.addEventListener('submit', e => {
  e.preventDefault();

  const type = document.getElementById('type').value;
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;
  const place = document.getElementById('place').value;
  const contact = document.getElementById('contact').value;
  const founderName = document.getElementById('founderName').value || null;
  const imageFile = document.getElementById('image').files[0];
  const timestamp = new Date().toLocaleString();

  const item = { 
    type, 
    name, 
    description, 
    date, 
    place, 
    contact, 
    founderName, 
    image: null, 
    timestamp, 
    owner: currentUser 
  };

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function() {
      item.image = reader.result;
      items.push(item);
      localStorage.setItem("items", JSON.stringify(items));
      form.reset();
      toggleFounderName();
      showTab(type);
    };
    reader.readAsDataURL(imageFile);
  } else {
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
    form.reset();
    toggleFounderName();
    showTab(type);
  }
});

// Show tab
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';

  navButtons.forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-${tabId}`);
  if (activeBtn) activeBtn.classList.add('active');

  if (tabId !== 'report') displayItems();
}

// Display items
function displayItems() {
  lostDiv.innerHTML = '';
  foundDiv.innerHTML = '';

  items.forEach((i, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      ${i.image ? `<img src="${i.image}">` : `<div style="height:160px;background:#eee;display:flex;align-items:center;justify-content:center;">No Image</div>`}
      <h3>${i.name}</h3>
      <p><strong>Description:</strong> ${i.description}</p>
      <p><strong>Date:</strong> ${i.date}</p>
      <p><strong>Place:</strong> ${i.place}</p>
      <p><strong>Contact:</strong> ${i.contact}</p>
      ${i.founderName ? `<p><strong>Founder:</strong> ${i.founderName}</p>` : ""}
      <em>Reported on: ${i.timestamp}</em>
      ${i.owner === currentUser ? `<button class="delete-btn" onclick="deleteItem(${index})">Delete</button>` : ""}
    `;
    if (i.type === 'lost') lostDiv.appendChild(card);
    else foundDiv.appendChild(card);
  });
}

// Delete item (only uploader)
function deleteItem(index) {
  items.splice(index, 1);
  localStorage.setItem("items", JSON.stringify(items));
  displayItems();
}

// Auto-login if student number already saved
if (currentUser) {
  document.getElementById('loginSection').style.display = 'none';
  menu.style.display = 'block';
  welcomeMsg.textContent = `Logged in as Student #${currentUser}`;
  showTab('report');
}