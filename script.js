const btn = document.querySelector('.search--nav');
const inputSearch = document.querySelector('.search');
const tabContainer = document.querySelector('.tab');
const errContainer = document.querySelector('.err--container');

let lat, lng;

const html = function (data) {
  const htmlContent = `
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
    `;

  tabContainer.insertAdjacentHTML('afterbegin', htmlContent);
};

const renderError = function (msg) {
  // errContainer.innerHTML = ' ';
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
  }, 6000);
};

inputSearch.value = '';
const getIpAddress = async function (ipAddress) {
  try {
    //prettier-ignore
    const res = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=at_cKnccJRUQPNjlT30AzwmVsc0fGhXC&ipAddress=${ipAddress}`);
    if (!res.ok) throw new Error(`problem getting IP Address`);
    console.log(res);
    const data = await res.json();
    console.log(data);
    getCountry(data.location.country, data.location.region);
    html(data);
  } catch (err) {
    console.error(`${err} 💥`);
    // renderError(err.message)
  }
};

getIpAddress(inputSearch.value);

const getIPByDomain = async function (domain) {
  try {
    const resDom = await fetch(
      `https://api.ipify.org?format=json&domain=${domain}&apiKey=at_cKnccJRUQPNjlT30AzwmVsc0fGhX`
    );
    if (!resDom.ok) throw new Error(`problem getting IP Address`);
    console.log(resDom);
    const dataDom = await resDom.json();
    console.log(dataDom.ip);
    const ipAddress = dataDom.ip;
    return getIpAddress(ipAddress);
  } catch (err) {
    console.error(`${err} 💥`);
  }
};

btn.addEventListener('click', function () {
  // const dd = getIPByDomain(inputSearch.value);
  // console.log(dd);
  tabContainer.innerHTML = '';
  console.log(inputSearch.value);
  if (inputSearch.value.endsWith('com')) {
    const domain = inputSearch.value; // Replace with the domain you want to check
    getIPByDomain(domain)
      .then(info => {
        console.log('Information from Domain:', info);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    getIpAddress(inputSearch.value);
  }
  // inputSearch.value = ''
  console.log(inputSearch.value.endsWith('com'));
});

const getCountry = async function (code, cityName) {
  try {
    //prettier-ignore
    const res = await fetch(`https://restcountries.com/v3.1/alpha?codes=${code}`);
    if (!res.ok) throw new Error(`problem getting Country data`);
    const [data] = await res.json();
    console.log(data);

    const countryName = data.name.common;

    const resGeo = await fetch(
      `https://nominatim.openstreetmap.org/search?state=${cityName}&country=${countryName}&format=json`
    );
    if (!resGeo.ok) throw new Error(`problem getting data on the State`);
    const [dataGeo] = await resGeo.json();
    console.log(dataGeo);
    lat = dataGeo.lat;
    lng = dataGeo.lon;
    console.log(lat, lng);
    latlng(lat, lng);
  } catch (err) {
    console.error(`${err} 💥`);
    // renderError(err.message)
  }
};

let map;

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
