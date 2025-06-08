var map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

L.Routing.control({
  waypoints: [
    L.latLng(51.505, -0.09),
    L.latLng(51.51, -0.1),
    L.latLng(51.515, -0.09),
    L.latLng(51.51, -0.08),
    L.latLng(51.505, -0.09),
  ],
}).addTo(map);
