const btn = document.querySelector('.search--nav');
const inputSearch = document.querySelector('.search');
const tabContainer = document.querySelector('.tab--container');
const errContainer = document.querySelector('.err--container');
const loader = document.querySelector('.loader');

let lat, lng;

const html = function (data) {
  const htmlContent = `
  <div class="tab">
    <div class="tab--col">
    <p>ip address</p>
    <h1 class="heading__secondary ip-address">${data.ip}</h1>
  </div>
  <div class="tab--col">
    <p>Location</p>
    <h1 class="heading__secondary location">${data.location.region}</h1>
  </div>
  <div class="tab--col">
    <p>Timezone</p>
    <h1 class="heading__secondary timezone">UTC${data.location.timezone}</h1>
  </div>
  <div class="tab--col">
    <p>ISP</p>
    <h1 class="heading__secondary isp">${data.isp}</h1>
  </div>
  </div>
    `;

  tabContainer.insertAdjacentHTML('afterbegin', htmlContent);
};

const showLoader = function () {
  loader.classList.remove('hidden');
};

const hideLoader = function () {
  loader.classList.add('hidden');
};

const renderError = function (msg) {
  errContainer.classList.remove('hidden');
  let errHtml;
  errHtml = `<div class="error">
            <p class="error--text">${msg}</p>
            <img src="images/exclamation-octagon-fill.svg" alt="error--icon" class="error--icon">
            </div>`;
  errContainer.innerHTML = errHtml;

  setTimeout(function () {
    errContainer.classList.add('hidden');
    getIpAddress(inputSearch.value);
  }, 3000);
};

inputSearch.value = '';
const getIpAddress = async function (ipAddress) {
  try {
    showLoader();
    //prettier-ignore
    const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_MFvG7e8L3IdZZOIrq35GhcPiBkknG&domain=${ipAddress}`);
    if (!res.ok) throw new Error(`problem getting IP Address`);
    console.log(res);
    const data = await res.json();
    hideLoader();
    console.log(data);
    lat = data.location.lat;
    lng = data.location.lng;
    console.log(lat, lng);
    latlng(lat, lng);
    html(data);
  } catch (err) {
    console.error(`${err} 💥`);
    renderError(err.message);
  }
};

getIpAddress(inputSearch.value);

btn.addEventListener('click', function () {
  tabContainer.innerHTML = '';
  console.log(inputSearch.value);
  getIpAddress(inputSearch.value);
  inputSearch.value = '';
});

let map;
document.getElementById('map').style.backgroundColor = 'rgb(218, 214, 214)';
const latlng = function (lat, lng) {
  // Check if the map is already initialized
  if (!map) {
    // If not initialized, create the map
    map = L.map('map').setView([lat, lng], 13);
    //prettier-ignore
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(map)
  } else {
    // If already initialized, update the map view
    map.setView([lat, lng], 13);
  }

  // Remove previous markers
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  //setting marker icon
  var myIcon = L.icon({
    iconUrl: 'images/icon-location.svg',
    iconSize: [28, 40],
  });

  // Add a new marker
  L.marker([lat, lng], { icon: myIcon }).addTo(map);
};
