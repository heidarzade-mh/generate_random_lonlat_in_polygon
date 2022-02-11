import {AfterViewInit, Component} from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import {Map} from "mapbox-gl";
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import { RandomPointGenerator } from './random-point-generator';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  public numberOfPoints: number = 0;

  private map?: mapboxgl.Map;
  private poly?: any;
  private points?: any;

  public ngAfterViewInit(): void {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoibWhoZWlkYXJ6YWRlaCIsImEiOiJja2hjMHZxMDEwMmx2MnFtcDZvM3dnb3NtIn0.2A9N_1V2IYkb2Yl1SyG4AQ';
    this.map = new Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ 53.6880,32.4279],
      zoom: 5.2
    });

    const mapboxDraw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon'
    });


    this.map.addControl(mapboxDraw, 'top-left');

    this.map.on('load', function() {
    });

    this.addCreatedDrawEvent();
  }

  public addCreatedDrawEvent(): void {
    this.map?.on('draw.create', (e) => {
      this.poly = e.features[0];
    });
  }

  public addPoint(geo: any): void {
    if (this.map?.getSource('pointSourceId')) {
      this.map?.removeLayer('pointLayerId');
      this.map?.removeSource('pointSourceId');
    }

    this.map?.addSource('pointSourceId' ,geo);
    this.points = geo;
    this.map?.addLayer({
      id: 'pointLayerId',
      source: 'pointSourceId',
      type: 'circle',
    });
  }

  public generate(): void {
    const geo = {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [] as any
      }
    };
    for (let i = 0; i < this.numberOfPoints; i++) {
      const point = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': RandomPointGenerator.getRandomPointInPoly(this.poly).geometry.coordinates
        }
      } as any;

      geo.data.features.push(point);
    }

    this.addPoint(geo);
  }

  public generateCSV(): void {
    const data = this.points.data.features.map((x: any) => {
      return {
        lat: x.geometry.coordinates[0],
        lon: x.geometry.coordinates[1]
      }
    });

    new AngularCsv(data, 'My Report', {
      headers: ["Longitude", "Latitude"]
    });
  }
}
