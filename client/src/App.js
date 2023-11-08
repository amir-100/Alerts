import { useQuery } from "@tanstack/react-query";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import axios from "axios";

function App() {
  const { data: alerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: () =>
      axios.get("http://localhost:3001/cities").then((res) => res.data),
    placeholderData: [],
    refetchInterval: 10000,
  });

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={[31.3, 34.8]}
        zoom={7}
        minZoom={7}
        maxZoom={30}
        maxBounds={[
          [33.5, 38.9],
          [29.4, 30.7],
        ]}
        maxBoundsViscosity={1}
        attributionControl={false}
        zoomControl={false}
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {alerts.map((alert) => (
          <Polygon
            key={alert.id}
            positions={alert.shape.coordinates}
            fillColor="red"
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
