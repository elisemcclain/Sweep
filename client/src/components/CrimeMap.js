import React, { useEffect, useState } from "react";

import {
  GoogleMap,
  useJsApiLoader,
  useLoadScript,
  Marker,
  Autocomplete,
  InfoBox,
} from "@react-google-maps/api";

const CrimeMap = () => {
  const [addresses, setAddresses] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5555/locations")
      .then((response) => response.json())
      .then((data) => {
        setAddresses(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (!isLoaded) {
    return "Loading...";
  }

  const center = { lat: 36.0822, lng: 94.1719 };

  return (
    <div className="App">
      <GoogleMap
        center={center}
        mapContainerStyle={{
          width: "100%",
          height: "400px",
        }}
        zoom={5}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default CrimeMap;

// AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo;
