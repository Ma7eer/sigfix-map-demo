import Head from "next/head";
import mapboxgl from "mapbox-gl";
import { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "https://guarded-dusk-46450.herokuapp.com";
// const ENDPOINT = "http://localhost:4000";

// mapboxgl.accessToken =
// "pk.eyJ1IjoibWE3ZWVyIiwiYSI6ImNrN2J2aTd0NzAxMWwzbnBxMmoyb3BlcmgifQ.CEJCp-jGZO4pQWT68WSA8g";
mapboxgl.accessToken = process.env.ACCESS_KEY;

const mapContainerStyle = {
  position: "absolute",
  top: "0",
  right: "0",
  left: "0",
  bottom: "0",
};

const sideBarStyle1 = {
  display: "inline-block",
  position: "absolute",
  top: "0",
  left: "0",
  margin: "12px",
  backgroundColor: "#404040",
  color: "#ffffff",
  zIndex: "1",
  padding: "6px",
  fontWeight: "bold",
};

const sideBarStyle2 = {
  display: "inline-block",
  position: "absolute",
  top: "50px",
  left: "0",
  margin: "12px",
  backgroundColor: "#404040",
  color: "#ffffff",
  zIndex: "1",
  paddingTop: "6px", //6
  paddingBottom: "6px", //6
  paddingLeft: "25px", //6
  paddingRight: "25px", //6
  fontWeight: "bold",
};

const sideBarStyle3 = {
  display: "inline-block",
  position: "absolute",
  top: "280px", //260
  left: "0",
  margin: "12px",
  backgroundColor: "#404040",
  color: "#ffffff",
  zIndex: "1",
  paddingTop: "6px", //6
  paddingBottom: "6px", //6
  paddingLeft: "25px", //6
  paddingRight: "25px", //6
  // padding: "6px",
  // width: "250px",
};

export default function Map() {
  const [lng, setLng] = useState(55.47); // 57.47
  const [lat, setLat] = useState(19.8); // 22.8
  const [zoom, setZoom] = useState(1);
  const [markerLng, setMarkerLng] = useState(57.47);
  const [markerLat, setMarkerLat] = useState(19.8);
  const [temp, setTemp] = useState(0);

  let mapContainer = useRef(null);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("data", (data) => {
      console.log(data);
      setTemp(parseInt(data["Temp"]));
      setMarkerLat(parseInt(data["latitude"]));
      setMarkerLng(parseInt(data["longitude"]));
    });
    //   increase this
    let bounds = [
      [51.081944, 16.900659], // Southwest coordinates
      [62.238926, 27.582236], // Northeast coordinates
    ];
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/light-v10",
      center: [lng, lat],
      zoom: zoom,
      maxBounds: bounds, // Sets bounds as max
    });
    // streets-v11
    // light-v10

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // let marker =
    new mapboxgl.Marker().setLngLat([markerLng, markerLat]).addTo(map);

    setInterval(() => {
      console.log("yo");
      // marker.setLngLat([markerLng, markerLat]);
      new mapboxgl.Marker().setLngLat([markerLng, markerLat]).addTo(map);
    }, 5000);
  }, []);
  return (
    <div>
      <Head>
        <title>Asyad Demo</title>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.css"
          rel="stylesheet"
        ></link>
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.0.2/mapbox-gl-directions.css"
          type="text/css"
        />
        {/* <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.0.2/mapbox-gl-directions.js"></script> */}
      </Head>
      <div>
        <div style={sideBarStyle1}>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div style={sideBarStyle2}>
          <h2 style={{ textAlign: "center" }}>Temperature</h2>
          <h1 style={{ textAlign: "center", fontSize: "60px" }}>
            {temp.toFixed(2)} C
          </h1>
          {/* <Chart
            style={{
              display: "flex",
              justifyContent: "center",
            }}
            width={250}
            height={180}
            chartType="Gauge"
            loader={<div>Loading Chart</div>}
            data={[
              ["Label", "Value"],
              ["Temperature", 80],
            ]}
            options={{
              redFrom: 90,
              redTo: 100,
              yellowFrom: 75,
              yellowTo: 90,
              minorTicks: 5,
            }}
            rootProps={{ "data-testid": "1" }}
          /> */}
        </div>
        <div style={sideBarStyle3}>
          <h2 style={{ textAlign: "center" }}>Humidity</h2>
          <h1 style={{ textAlign: "center", fontSize: "60px" }}>20 %</h1>
        </div>
        {/* <div style={sideBarStyle3}>
          <strong>Truck ID:</strong> nq98fq347 <br />
          <strong>Current Location:</strong> Nizwa <br />
          <strong>Destination:</strong> Duqm <br />
          <strong>Driver:</strong> Fulan bin Fulan <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <img src="/img/avatar.png" alt="driver" width="180px" />
          </div>
          <strong>Date Time:</strong> 2020-03-02 9:00 AM <br />
        </div> */}
      </div>
      <div ref={(el) => (mapContainer = el)} style={mapContainerStyle} />
    </div>
  );
}
