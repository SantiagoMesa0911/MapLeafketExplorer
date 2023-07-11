const capitals = 'data/usa-capitals.geojson';
const provinces = 'data/usa-provinces.geojson';


// Crear el mapa
var map = L.map('map').setView([39.8282, -98.5795], 4);

// Crear las capas base
var streetsLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
});

var satelliteLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors',
    id: 'mapbox/satellite-v9',
    accessToken: 'your-mapbox-access-token'
});

// Crear una capa de grupo para las capas de marcadores
var markersLayer = L.layerGroup();

function makeCapitalMarkers(map) {
    fetch(capitals)
        .then(response => response.json())
        .then(data => {
            for (datos of data.features) {
                const lon = datos.geometry.coordinates[0];
                const lat = datos.geometry.coordinates[1];
                const nombre = datos.properties.state[0];
                const points = L.marker([lat, lon], nombre);
                points.addTo(map).bindPopup(`
                    <h4>COORDENADAS ACTUALES</h4>
                    <p>${lon} y ${lat}</p>
                    <button>Actualizar</button>
                    <button>Modificar</button>
                `);
            }
        })
        .catch(error => {
            console.error('Error al leer el archivo:', error);
        });
}

makeCapitalMarkers(markersLayer)

// Crear una capa de grupo para las capas de polígonos
var polygonsLayer1 = L.layerGroup();
var polygonsLayer2 = L.layerGroup();
var polygonsLayer3 = L.layerGroup();
// Crear capas de polígonos individuales
var polygon1 = L.polygon([
    [30.266667, -97.75],
    [21.30895, -157.826182],
    [58.301935, -134.41974]
]).addTo(polygonsLayer1);


var polygon2 = L.polygon([
    [38.349497, -81.633294],
    [44.367966, -100.336378],
    [44.931109, -123.029159],
    [33.448457, -112.073844]
], { color: 'red' }).addTo(polygonsLayer2)


var polygon3 = L.polygon([
    [44.323535, -69.765261],
    [44.26639, -72.57194],
    [42.659829, -73.781339],
    [40.269789, -76.875613],
    [38.349497, -81.633294],

    [35.771, -78.638],
    [37.54, -77.46], 
    [40.221741, -74.756138],
    [41.767, -72.677],
    [41.82355, -71.422132],
    [43.220093, -71.549127]
], { color: 'orange' }).addTo(polygonsLayer3)

var LeafIcon = L.Icon.extend({
    options: {
        shadowUrl: 'http://leafletjs.com/docs/images/leaf-shadow.png',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    }
});

var greenIcon = new LeafIcon({
    iconUrl: 'http://leafletjs.com/docs/images/leaf-green.png'
});

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    position: 'topright',
    draw: {
        polygon: {
            shapeOptions: {
                color: 'purple'
            },
            allowIntersection: false,
            drawError: {
                color: 'orange',
                timeout: 1000
            },
            showArea: true,
            metric: false,
            repeatMode: true
        },
        polyline: {
            shapeOptions: {
                color: 'red'
            }
        },
        rect: {
            shapeOptions: {
                color: 'green'
            }
        },
        circle: {
            shapeOptions: {
                color: 'steelblue'
            }
        },
        marker: {
            icon: greenIcon
        }
    },
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;

    if (type === 'marker') {
        layer.bindPopup('A popup!');
        drawnItems.addLayer(layer);
    } else if (type === 'polygon') {
        drawnItems.addLayer(layer);
    }
});

// Definir las capas base disponibles
var baseLayers = {
    'Streets': streetsLayer,
    'Satellite': satelliteLayer
};

// Definir las capas de marcadores disponibles
var overlayLayers = {
    'Markers': markersLayer,
    'Polygons 1': polygonsLayer1,
    'Polygons 2': polygonsLayer2,
    'polygons 3': polygonsLayer3
};

// Agregar las capas base al mapa
streetsLayer.addTo(map);

// Agregar las capas de marcadores al mapa
markersLayer.addTo(map);

// Agregar control de capas al mapa
L.control.layers(baseLayers, overlayLayers).addTo(map);
