import { useQuery } from "@tanstack/react-query";
import { MapContainer, Polygon, Popup, TileLayer } from "react-leaflet";
import axios from "axios";
import { useEffect, useState } from "react";

const ONE_SECOND = 1000;
const CHECK_EXPIRE_TIME = ONE_SECOND * 1.5;
const FLICKER_TIME = CHECK_EXPIRE_TIME / 2;

function App() {
  const [showAreas, setShowAreas] = useState(true);
  const [alertedAreas, setAlertedAreas] = useState([]);

  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: () =>
      axios.get("http://localhost:3001/cities").then((res) => res.data),
    placeholderData: [],
  });

  const { data: alerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: () =>
      axios.get("http://localhost:3001/alerts").then((res) => res.data),
    placeholderData: [],
    refetchInterval: 10000,
  });

  const synth = window.speechSynthesis;

  const speak = () => {
    if (synth.speaking) {
      console.error("SpeechSynthesis already speaking");
      return;
    }

    alerts.forEach(({ name }) => {
      const utterance = new SpeechSynthesisUtterance(name);

      synth.speak(utterance);
    });
  };

  // const makeAreasFlicker = () => {
  //   setShowAreas(false);
  //   setTimeout(() => {
  //     setShowAreas(true);
  //   }, FLICKER_TIME);
  // };

  // useEffect(() => {
  //   if (alerts.length > 0) {
  //     const expiryInterval = setInterval(() => {
  //       setAlertedAreas((areas) =>
  //         areas.filter((area) => isDateRelevant(area.expiry))
  //       );

  //       makeAreasFlicker();
  //     }, CHECK_EXPIRE_TIME);

  //     return () => {
  //       clearInterval(expiryInterval);
  //     };
  //   }
  // }, [alertedAreas, setAlertedAreas]);
  setInterval(() => {
    speak();
  }, 1000);
  console.log("asdsad");
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
        {cities.map((city) => (
          <Polygon
            key={city.id}
            positions={city.shape.coordinates}
            fillColor="red"
            opacity={1}
            fillOpacity={0.3}
            color={showAreas ? "#5f0021" : "#ab003c"}
          >
            <Popup>{city.name}</Popup>
          </Polygon>
        ))}
        {alerts.map((alert) => (
          <Polygon
            key={showAreas ? alert.id : alert.id * -1}
            positions={alert.shape.coordinates}
            fillColor="red"
            opacity={1}
            fillOpacity={0.3}
            color={showAreas ? "#5f0021" : "#ab003c"}
          >
            <Popup>{alert.name}</Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
