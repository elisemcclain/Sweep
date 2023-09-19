import React, { Component } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

class CrimeMap extends Component {
  componentDidMount() {
    const L = require("leaflet");
    require("leaflet-control-geocoder");
    const map = L.map("map").setView([40.7128, -74.006], 11);

    L.tileLayer(
      "https://{s}-tiles.locationiq.com/v2/obk/r/{z}/{x}/{y}.png?key=pk.1d5ad7de00e718309607920a131efa94"
    ).addTo(map);

    const geocoder = L.Control.geocoder({
      apiKey: "pk.1d5ad7de00e718309607920a131efa94",
    });
    geocoder.addTo(map);
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div
              className="leaf-map"
              id="map"
              style={{ height: "400px" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
}

export default CrimeMap;

// AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo
