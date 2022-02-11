import * as turf from '@turf/turf';
export class RandomPointGenerator {
  public static getRandomPointInPoly(polygonGeoJson: any): any {
    const bounds = RandomPointGenerator.getPolygonBoundingBox(polygonGeoJson);
    const x_min  = bounds[0][0];
    const x_max  = bounds[1][0];
    const y_min  = bounds[0][1];
    const y_max  = bounds[1][1];

    const lat = y_min + (Math.random() * (y_max - y_min));
    const lng = x_min + (Math.random() * (x_max - x_min));

    const pt = turf.point([lng, lat]);
    const inside = turf.booleanPointInPolygon(pt, polygonGeoJson);


    if (inside) {
      return pt
    } else {
      return RandomPointGenerator.getRandomPointInPoly(polygonGeoJson)
    }
  }

  private static getPolygonBoundingBox(feature: any) {
    let bounds: any = [[], []];
    let polygon;
    let latitude;
    let longitude;

    for (let i = 0; i < feature.geometry.coordinates.length; i++) {
      if (feature.geometry.coordinates.length === 1) {
        polygon = feature.geometry.coordinates[0];
      } else {
        polygon = feature.geometry.coordinates[i][0];
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
}
