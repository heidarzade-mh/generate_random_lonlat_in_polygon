
mapboxgl.accessToken = 'pk.eyJ1IjoibmVvc2NhIiwiYSI6ImNrZm80ZnI4MzJlcHoyeW52eGZqeDVpNXcifQ.0b4R6NcNKL9SNDq1q7ECrA';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-68.13734351262877, 45.137451890638886], // starting position [lng, lat]
  zoom: 5 // starting zoom
});

map.on('load', function () {
  map.addSource('maine', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [
            [-67.13734351262877, 45.137451890638886],
            [-66.96466, 44.8097],
            [-68.03252, 44.3252],
            [-69.06, 43.98],
            [-70.11617, 43.68405],
            [-70.64573401557249, 43.090083319667144],
            [-70.75102474636725, 43.08003225358635],
            [-70.79761105007827, 43.21973948828747],
            [-70.98176001655037, 43.36789581966826],
            [-70.94416541205806, 43.46633942318431],
            [-71.08482, 45.3052400000002],
            [-70.6600225491012, 45.46022288673396],
            [-70.30495378282376, 45.914794623389355],
            [-70.00014034695016, 46.69317088478567],
            [-69.23708614772835, 47.44777598732787],
            [-68.90478084987546, 47.184794623394396],
            [-68.23430497910454, 47.35462921812177],
            [-67.79035274928509, 47.066248887716995],
            [-67.79141211614706, 45.702585354182816],
            [-67.13734351262877, 45.137451890638886]
          ]
        ]
      }
    }
  });
  map.addLayer({
    'id': 'maine',
    'type': 'fill',
    'source': 'maine',
    'layout': {},
    'paint': {
      'fill-color': '#088',
      'fill-opacity': 0.8
    }
  });
});

//same poly as added above
var polygon = {
  'type': 'geojson',
  'data': {
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        [
          [-67.13734351262877, 45.137451890638886],
          [-66.96466, 44.8097],
          [-68.03252, 44.3252],
          [-69.06, 43.98],
          [-70.11617, 43.68405],
          [-70.64573401557249, 43.090083319667144],
          [-70.75102474636725, 43.08003225358635],
          [-70.79761105007827, 43.21973948828747],
          [-70.98176001655037, 43.36789581966826],
          [-70.94416541205806, 43.46633942318431],
          [-71.08482, 45.3052400000002],
          [-70.6600225491012, 45.46022288673396],
          [-70.30495378282376, 45.914794623389355],
          [-70.00014034695016, 46.69317088478567],
          [-69.23708614772835, 47.44777598732787],
          [-68.90478084987546, 47.184794623394396],
          [-68.23430497910454, 47.35462921812177],
          [-67.79035274928509, 47.066248887716995],
          [-67.79141211614706, 45.702585354182816],
          [-67.13734351262877, 45.137451890638886]
        ]
      ]
    }
  }
};

randomPointInPoly = function(polygonGeoJson) {
  var bounds = getPolygonBoundingBox(polygonGeoJson);
  console.log('bounds are ' + bounds);
  console.log(bounds[0][0]);
  //[xMin, yMin][xMax, yMax]
  var x_min  = bounds[0][0];
  var x_max  = bounds[1][0];
  var y_min  = bounds[0][1];
  var y_max  = bounds[1][1];

  var lat = y_min + (Math.random() * (y_max - y_min));
  var lng = x_min + (Math.random() * (x_max - x_min));

  var poly = polygonGeoJson;
  var pt = turf.point([lng, lat]);
  var inside = turf.booleanPointInPolygon(pt, polygonGeoJson.data);

  console.log(inside);


  if (inside) {
    return pt
  } else {
    return randomPointInPoly(polygon)
  }
}


function getPolygonBoundingBox(feature) {
  const bounds = [[], []];
  let polygon;
  let latitude;
  let longitude;

  for (let i = 0; i < feature.data.geometry.coordinates.length; i++) {
    if (feature.data.geometry.coordinates.length === 1) {
      // Polygon coordinates[0][nodes]
      polygon = feature.data.geometry.coordinates[0];
    } else {
      // Polygon coordinates[poly][0][nodes]
      polygon = feature.data.geometry.coordinates[i][0];
    }

    for (let j = 0; j < polygon.length; j++) {
      longitude = polygon[j][0];
      latitude = polygon[j][1];

      bounds[0][0] = bounds[0][0] < longitude ? bounds[0][0] : longitude;
      bounds[1][0] = bounds[1][0] > longitude ? bounds[1][0] : longitude;
      bounds[0][1] = bounds[0][1] < latitude ? bounds[0][1] : latitude;
      bounds[1][1] = bounds[1][1] > latitude ? bounds[1][1] : latitude;
    }
  }

  return bounds;
}

console.log(randomPointInPoly(polygon));

