import React from "react";
import {
  GoogleMap,
  useJsApiLoader,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";

const CrimeMap = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo",
  });

  if (!isLoaded) {
    return "Loading...";
  }

  const center = { lat: 36.0822, lng: 94.1719 };

  return (
    <div className="App">
      {isLoaded ? (
        <GoogleMap
          center={center}
          mapContainerStyle={{
            width: "100%",
            height: "400px",
          }}
          zoom={10}
        >
          <Marker position={center} />
        </GoogleMap>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default CrimeMap;
