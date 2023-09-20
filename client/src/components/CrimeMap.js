import React, { useEffect, useState } from "react";

import {
  GoogleMap,
  useJsApiLoader,
  useLoadScript,
  Marker,
  Autocomplete,
  InfoBox,
} from "@react-google-maps/api";

const apiKey = "AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo";

const CrimeMap = async (address) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Geocoding API request failed");
    }

    const data = await response.json();

    if (data.status === "OK") {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error("Geocoding API response status not OK");
    }
  } catch (error) {
    console.error("Error making Geocoding API request:", error);
    throw error;
  }
};

export default CrimeMap;

// const CrimeMap = () => {
//   const [addresses, setAddresses] = useState([]);
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo",
//   });

//   useEffect(() => {
//     fetch("http://127.0.0.1:5555/locations")
//       .then((response) => response.json())
//       .then((data) => {
//         setAddresses(data);
//         console.log(data);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }, []);

//   if (!isLoaded) {
//     return "Loading...";
//   }

//   const center = { lat: 36.0822, lng: 94.1719 };

//   return (
//     <div className="App">
//       <GoogleMap
//         center={center}
//         mapContainerStyle={{
//           width: "100%",
//           height: "400px",
//         }}
//         zoom={5}
//       >
//         {addresses.map((location, index) => (
//           <Marker
//             key={index}
//             position={{ lat: location.lat, lng: location.lng }}
//           />
//         ))}
//       </GoogleMap>
//     </div>
//   );
// };

// export default CrimeMap;

// AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo;
