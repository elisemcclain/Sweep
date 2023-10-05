// AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo;

import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const CrimeMap = () => {
  const [addresses, setAddresses] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5555/locations")
      .then((response) => response.json())
      .then((data) => {
        setAddresses(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (addresses.length > 0) {
      Promise.all(
        addresses.map((address) =>
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              address.address
            )}&key=AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry.location;
                return { lat, lng };
              } else {
                return null;
              }
            })
        )
      )
        .then((coords) => {
          const validCoords = coords.filter((coord) => coord !== null);
          setCoordinates(validCoords);
          // console.log(validCoords);
        })
        .catch((error) => {
          console.error("Error geocoding addresses:", error);
        });
    }
  }, [addresses]);

  if (!isLoaded) {
    return "Loading...";
  }

  const center = { lat: 36.0627, lng: -94.1606 };

  return (
    <div className="App">
      <GoogleMap
        center={center}
        mapContainerStyle={{
          width: "100%",
          height: "400px",
        }}
        zoom={12}
      >
        {coordinates.map((coord, index) => (
          <Marker
            key={index}
            position={{ lat: coord.lat, lng: coord.lng }}
            onClick={() => {
              setSelectedMarker(index);
            }}
          />
        ))}

        {selectedMarker !== null && (
          <InfoWindow
            position={{
              lat: coordinates[selectedMarker].lat,
              lng: coordinates[selectedMarker].lng,
            }}
            onCloseClick={() => {
              setSelectedMarker(null);
            }}
          >
            <div>
              <p>Address: {addresses[selectedMarker].address}</p>
              <p>Crime: {addresses[selectedMarker].crimeDate}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default CrimeMap;

// AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo
