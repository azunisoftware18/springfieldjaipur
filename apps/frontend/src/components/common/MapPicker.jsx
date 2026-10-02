"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

function LocationMarker({
  setLatitude,
  setLongitude,
  initialLatitude,
  initialLongitude,
}) {
  const [position, setPosition] = useState(null);

  // Set existing location when editing a place
  useEffect(() => {
    const lat = Number(initialLatitude);
    const lng = Number(initialLongitude);

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    ) {
      setPosition([lat, lng]);
    } else {
      setPosition(null);
    }
  }, [initialLatitude, initialLongitude]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);

      setLatitude(Number(lat.toFixed(6)));
      setLongitude(Number(lng.toFixed(6)));
    },
  });

  if (!position) {
    return null;
  }

  return <Marker position={position} icon={markerIcon} />;
}

export default function MapPicker({
  setLatitude,
  setLongitude,
  initialLatitude = "",
  initialLongitude = "",
}) {
  const latitude = Number(initialLatitude);
  const longitude = Number(initialLongitude);

  const hasInitialLocation =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  const center = hasInitialLocation
    ? [latitude, longitude]
    : [20.5937, 78.9629];

  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={center}
        zoom={hasInitialLocation ? 13 : 5}
        scrollWheelZoom={true}
        className="h-[400px] w-full rounded-2xl z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          initialLatitude={initialLatitude}
          initialLongitude={initialLongitude}
        />
      </MapContainer>
    </div>
  );
}
