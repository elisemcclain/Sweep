import React, { Component } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

class CrimeMap extends Component {
  componentDidMount() {
    const L = require("leaflet");
    require("leaflet-control-geocoder");
    const map = L.map("map").setView([36.0627, 94.1606], 12);

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
      <div>
        <div id="map" style={{ height: "400px" }}></div>
        <p>hello</p>
      </div>
    );
  }
}

export default CrimeMap;

// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// function CrimeMap() {
//   const [userLocation, setUserLocation] = useState(null);
//   const [zipCode, setZipCode] = useState("");

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setUserLocation([latitude, longitude]);
//       },
//       (error) => {
//         console.error("error getting user location:", error);
//       }
//     );
//   }, []);

//   const handleZipCodeSubmit = () => {
//     const apiKey = "YOUR_API_KEY";
//     const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${zipCode}&key=${apiKey}`;

//     fetch(apiUrl)
//       .then((response) => response.json())
//       .then((data) => {
//         const { results } = data;
//         if (results.length > 0) {
//           const { lat, lng } = results[0].geometry;
//           setUserLocation([lat, lng]);
//         } else {
//           console.error("Location not found for ZIP code:", zipCode);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching location data:", error);
//       });
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Enter ZIP code"
//         value={zipCode}
//         onChange={(e) => setZipCode(e.target.value)}
//       />
//       <button onClick={handleZipCodeSubmit}>Submit</button>
//       <MapContainer
//         center={userLocation || [36.0822, -94.1719]} // Use a default location if user location is not available
//         zoom={13}
//         style={{ height: "500px", width: "100%" }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         {userLocation && <Marker position={userLocation} />}
//       </MapContainer>
//     </div>
//   );
// }

// export default CrimeMap;
