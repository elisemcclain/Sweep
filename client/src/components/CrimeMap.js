import React from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const CrimeMap = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo || "",
  });

  const center = { lat: 18.52043, lng: 73.856743 };

  return (
    <div className="App">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "400px",
          }}
          center={center}
          zoom={10}
        ></GoogleMap>
      )}
    </div>
  );
};

export default CrimeMap;

// AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo
