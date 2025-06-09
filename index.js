const MAP_CONFIG = {
    INITIAL_ZOOM: 13,
    MAX_ZOOM: 19,
    TILE_LAYER_URL: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    ATTRIBUTION: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
};

class MapController {
    constructor() {
        this.map = null;
        this.routingControl = null;
        this.userLocation = {
            latitude: null,
            longitude: null
        };
    }

    async initialize() {
        try {
            await this.getUserLocation();
            this.initializeMap();
            this.setupEventListeners();
        } catch (error) {
            alert(`Could not obtain geolocation: ${error.message}`);
        }
    }

    async getUserLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    resolve();
                },
                reject,
                {enableHighAccuracy: true}
            );
        });
    }

    initializeMap() {
        this.map = L.map("map").setView(
            [this.userLocation.latitude, this.userLocation.longitude],
            MAP_CONFIG.INITIAL_ZOOM
        );

        L.tileLayer(MAP_CONFIG.TILE_LAYER_URL, {
            maxZoom: MAP_CONFIG.MAX_ZOOM,
            attribution: MAP_CONFIG.ATTRIBUTION
        }).addTo(this.map);

        this.routingControl = L.Routing.control({
            waypoints: [L.latLng(this.userLocation.latitude, this.userLocation.longitude)],
            routeWhileDragging: true,
            waypointMode: "snap",
            showAlternatives: true
        }).addTo(this.map);
    }

    setupEventListeners() {
        this.routingControl.on("routesfound", this.handleRouteFound.bind(this));
        this.map.on("contextmenu", this.handleContextMenu.bind(this));
        this.map.on("click", this.handleMapClick.bind(this));
    }

    handleRouteFound(event) {
        const meterDistance = event.routes[0].summary.totalDistance;
        const distance = this.calculateDistance(meterDistance);
        console.log(`${distance.miles.toFixed(2)} mi (${distance.kilometers.toFixed(2)} km)`);
    }

    calculateDistance(meters) {
        const kilometers = meters / 1000;
        return {
            kilometers,
            miles: kilometers * 0.621371
        };
    }

    handleContextMenu(event) {
        const container = L.DomUtil.create("div");
        const startBtn = this.createButton("Start from this location", container);
        const destBtn = this.createButton("Go to this location", container);

        L.popup().setContent(container).setLatLng(event.latlng).openOn(this.map);

        L.DomEvent.on(startBtn, "click", () => {
            this.routingControl.spliceWaypoints(0, 1, event.latlng);
            this.map.closePopup();
        });

        L.DomEvent.on(destBtn, "click", () => {
            this.routingControl.spliceWaypoints(
                this.routingControl.getWaypoints().length - 1,
                1,
                event.latlng
            );
            this.map.closePopup();
        });
    }

    handleMapClick(event) {
        const waypointsLength = this.routingControl.getWaypoints().length - 1;
        this.routingControl.spliceWaypoints(waypointsLength, 0, event.latlng);
        this.routingControl.spliceWaypoints(waypointsLength + 1, 1, event.latlng);
    }

    createButton(label, container) {
        const btn = L.DomUtil.create("button", "", container);
        btn.setAttribute("type", "button");
        btn.innerHTML = label;
        return btn;
    }

    removeLastWaypoint() {
        this.routingControl.spliceWaypoints(
            this.routingControl.getWaypoints().length - 1,
            1
        );
    }
}

window.removeLastWaypoint = () => mapController.removeLastWaypoint();

const mapController = new MapController();
mapController.initialize();
