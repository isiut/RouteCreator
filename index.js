let apiKey;

// Get api key from JSON file
async function initializeApp() {
    // const response = await fetch('config.json');
    // const config = await response.json();
    // apiKey = config.apiKey;

    navigator.geolocation.getCurrentPosition(displayMap, error => {
        alert("Could not obtain geolocation: " + error.message);
    }, {
        enableHighAccuracy: true,
    });
}

let userLatitude, userLongitude;
let control;

function displayMap(position) {
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

    control = L.Routing.control({
        waypoints: [L.latLng(userLatitude, userLongitude)],
        routeWhileDragging: true,
        waypointMode: "snap",
        showAlternatives: true,
        // router: L.Routing.graphHopper(apiKey, {
        //     urlParameters: {
        //         vehicle: 'foot'
        //     }
        // }),

    }).addTo(map);

    control.on("routesfound", function (e) {
        const meterDistance = (e.routes)[0].summary.totalDistance;
        const kilometerDistance = meterDistance / 1000;
        const milesDistance = kilometerDistance * 0.621371;
        console.log(milesDistance.toFixed(2) + " mi (" + kilometerDistance.toFixed(2) + " km)");
    });

    map.on("contextmenu", function (e) {
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

    map.on("click", function (e) {
        // For some reason, the spliceWaypoints function only updates the route when an element is replaced,
        // so I'm creating a waypoint and then immediately replacing it
        control.spliceWaypoints(control.getWaypoints().length - 1, 0, e.latlng);
        control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
    });
}

function undo() {
    control.spliceWaypoints(control.getWaypoints().length - 1, 1);
}

function createButton(label, container) {
    let btn = L.DomUtil.create("button", "", container);
    btn.setAttribute("type", "button");
    btn.innerHTML = label;
    return btn;
}


initializeApp();
