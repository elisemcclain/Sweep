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
  const [selectedCrime, setSelectedCrime] = useState(null);
  const [locationsWithCrimes, setLocationsWithCrimes] = useState([]);
  const [crimes, setCrimes] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 36.0627, lng: -94.1606 }); // Initial map center

  const filteredCoordinates = coordinates.filter((coord, index) => {
    return crimes[index] !== null;
  });
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo",
  });

  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:5555/crime_location_association")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setLocationsWithCrimes(data.associations);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:5555/locations")
        .then((response) => response.json())
        .then((data) => {
          const filteredAddresses = data.filter((address) => {
            const crimeIndex = locationsWithCrimes.findIndex(
              (crimeLocation) => crimeLocation.location_id === address.id
            );
            return crimeIndex !== -1;
          });
          setAddresses(filteredAddresses);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    fetchData();
  }, [locationsWithCrimes]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:5555/crimes")
        .then((response) => response.json())
        .then((data) => {
          setCrimes(data);
        })
        .catch((error) => {
          console.error("Error fetching crime data:", error);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (addresses.length > 0 || crimes.length > 0) {
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
        })
        .catch((error) => {
          console.error("Error geocoding addresses:", error);
        });
    }
  }, [addresses, crimes]);

  if (!isLoaded) {
    return "Loading...";
  }

  const handleMapLoad = (map) => {
    map.addListener("dragend", () => handleMapDrag(map));
  };

  const handleMapDrag = (map) => {
    setMapCenter({
      lat: map.getCenter().lat(),
      lng: map.getCenter().lng(),
    });
  };

  return (
    <div className="App">
      <GoogleMap
        center={mapCenter}
        mapContainerStyle={{
          width: "100vw",
          height: "85vh",
        }}
        zoom={12}
        onLoad={handleMapLoad}
      >
        {filteredCoordinates.map((coord, index) => (
          <Marker
            key={index}
            position={{ lat: coord.lat, lng: coord.lng }}
            onClick={() => {
              setSelectedMarker(index);
              setSelectedCrime(crimes[index]);
            }}
          />
        ))}

        {selectedMarker !== null && (
          <InfoWindow
            position={{
              lat: filteredCoordinates[selectedMarker].lat,
              lng: filteredCoordinates[selectedMarker].lng,
            }}
            onCloseClick={() => {
              setSelectedMarker(null);
              setSelectedCrime(null);
            }}
          >
            <div>
              <p>Address: {addresses[selectedMarker].address}</p>
              {selectedCrime !== null && (
                <div>
                  <p>Name: {selectedCrime.name}</p>
                  <p>Description: {selectedCrime.desc}</p>
                  <p>Date: {selectedCrime.date}</p>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default CrimeMap;

// AIzaSyB3uMb2taYq7oVoUNYjQ9dE3HbIdGKq9Lo
