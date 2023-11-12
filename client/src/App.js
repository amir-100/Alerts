import { useQuery } from "@tanstack/react-query";
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";
import axios from "axios";
import { useEffect, useState } from "react";

const ONE_SECOND = 1000;
const CHECK_EXPIRE_TIME = ONE_SECOND * 1.5;
const FLICKER_TIME = CHECK_EXPIRE_TIME / 2;

function MapLocation() {
  const [location, setLocation] = useState([]);
  const map = useMap();

  map.locate().on("locationfound", ({ latlng }) => {
    setLocation([latlng.lat, latlng.lng]);
  });

  return location.length === 2 ? (
    <Marker
      position={location}
      icon={
        new Icon({
          iconUrl: markerIconPng,
        })
      }
    >
      <Popup>מיקומך</Popup>
    </Marker>
  ) : null;
}

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

  // const speakText = () => {
  //   const speech = new SpeechSynthesisUtterance();
  //   speech.lang = "en-US";

  //   textArray.forEach((text, index) => {
  //     speech.text = text;
  //     speech.rate = 1.0; // Adjust the rate as needed

  //     // Speak each sentence in sequence
  //     speech.onend = () => {
  //       if (index + 1 < textArray.length) {
  //         speech.text = textArray[index + 1];
  //         window.speechSynthesis.speak(speech);
  //       }
  //     };

  //     window.speechSynthesis.speak(speech);
  //   });
  // };

  const speak = () => {
    alerts.forEach(({ name }) => {
      const utterance = new SpeechSynthesisUtterance(`אזעקה ב${name}`);
      utterance.lang = "he-IL";

      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(speak, [alerts]);

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

  const getFilteredCities = () => {
    const alertIdSet = new Set(alerts.map(({ id }) => id));
    const filteredCities = cities.filter(({ id }) => !alertIdSet.has(id));

    return filteredCities;
  };
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
        <MapLocation />
        {getFilteredCities().map((city) => (
          <Polygon
            key={city.id}
            positions={city.shape.coordinates}
            fillOpacity={0.3}
          >
            <Popup>{city.name}</Popup>
          </Polygon>
        ))}
        {alerts.map((alert) => (
          <Polygon
            key={showAreas ? alert.id : alert.id * -1}
            positions={alert.shape.coordinates}
            fillColor="red"
            fillOpacity={0.3}
            color="red"
            // color={showAreas ? "#5f0021" : "#ab003c"}
          >
            <Popup>{alert.name}</Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
