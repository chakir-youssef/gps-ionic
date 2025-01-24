import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {ServiceService} from "./service/service.service";
import {DeviceData} from "../types";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone:false
})


export class AppComponent implements AfterViewInit{
  map: any;
  start!:L.Marker;
  end!:L.Marker;
  data:DeviceData[]=[];
  pathCoordinates = [];
  polyline!:L.Polyline;

  constructor(private service:ServiceService) {}

  ngAfterViewInit(): void {
    this.getData();
  }


  initializeMap(): void {
   this.map = L.map("map").setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.start= L.marker([this.data[0].latitude, this.data[0].longitude]).addTo(this.map).bindPopup("Device ID: "+this.data[0].id_device).openPopup();
    this.end= L.marker([this.data[this.data.length-1].latitude, this.data[this.data.length-1].longitude]).addTo(this.map).bindPopup("Target").openPopup();

   this.polyline = L.polyline([this.start.getLatLng(), this.end.getLatLng()], { color: 'red' }).addTo(this.map);



  }


  getData(){
    this.service.getData().subscribe(
      (response) => {
        this.data = response;
        this.initializeMap();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }


  startMoving(){
    this.data.map((item, index) => {
      setTimeout(() => {
        this.moveMarker(this.start, item.latitude, item.longitude);
      }, 500 * index);
    });

  }


  moveMarker(startMarker:L.Marker, endLatitude:number, endLongitude:number) {
    const startLatLng = startMarker.getLatLng();
    const endLatLng = L.latLng(endLatitude, endLongitude);

    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const lat = startLatLng.lat + (endLatLng.lat - startLatLng.lat) * progress;
      const lng = startLatLng.lng + (endLatLng.lng - startLatLng.lng) * progress;

      startMarker.setLatLng([lat, lng]);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
      else {
        // @ts-ignore
        this.pathCoordinates.push([endLatLng.lat, endLatLng.lng]);
        this.polyline.setLatLngs(this.pathCoordinates);
      }
    };
    requestAnimationFrame(animate);
  }




}
