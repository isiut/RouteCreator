let userLatitude, userLongitude;

navigator.geolocation.getCurrentPosition(
  (position) => {
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;

    console.log(userLatitude);
    console.log(userLongitude);

    let map = L.map("map").setView([userLatitude, userLongitude], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    let control = L.Routing.control({
      waypoints: [L.latLng(userLatitude, userLongitude)],
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
  },
  (error) => {
    alert("Could not obtain geolocation: " + error.message);
  },
  {
    enableHighAccuracy: true,
  }
);
