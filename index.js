let map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let control = L.Routing.control({
  waypoints: [
    L.latLng(51.505, -0.09),
    L.latLng(51.51, -0.1),
    L.latLng(51.515, -0.09),
    L.latLng(51.51, -0.08),
    L.latLng(51.505, -0.09),
  ],
}).addTo(map);

function createButton(label, container) {
  let btn = L.DomUtil.create("button", "", container);
  btn.setAttribute("type", "button");
  btn.innerHTML = label;
  return btn;
}

map.on("click", function (e) {
  let container = L.DomUtil.create("div"),
    startBtn = createButton("Start from this location", container),
    destBtn = createButton("Go to this location", container);

  L.popup().setContent(container).setLatLng(e.latlng).openOn(map);

  L.DomEvent.on(startBtn, "click", function () {
    control.spliceWaypoints(0, 1, e.latlng);
    map.closePopup();
  });

  L.DomEvent.on(destBtn, "click", function () {
    control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
    map.closePopup();
  });
});
