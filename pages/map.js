import Head from "next/head";
import mapboxgl from "mapbox-gl";
import { useState, useEffect, useRef } from "react";
import Chart from "react-google-charts";
import axios from "axios";

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
  padding: "6px",
  fontWeight: "bold",
};

const sideBarStyle3 = {
  display: "inline-block",
  position: "absolute",
  top: "260px",
  left: "0",
  margin: "12px",
  backgroundColor: "#404040",
  color: "#ffffff",
  zIndex: "1",
  padding: "6px",
  width: "250px",
};

export default function Map() {
  const [lng, setLng] = useState(57.47);
  const [lat, setLat] = useState(22.8);
  const [zoom, setZoom] = useState(4);

  let mapContainer = useRef(null);

  useEffect(() => {
    axios
      .get(
        "https://5edca77ee833d9165b72fd13:9dad3e98096e120917f3261f4734683e@api.sigfox.com/v2/device-types/5ed7b65de833d9165b8ef3c8/messages"
      )
      .then((res) => console.log(res))
      .catch((e) => console.log(e));

    //   increase this
    let bounds = [
      [50.081944, 15.900659], // Southwest coordinates
      [61.238926, 26.582236], // Northeast coordinates
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

    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
    new mapboxgl.Marker().setLngLat([57.673909, 19.646699]).addTo(map);

    //     map.addControl(
    //       new MapboxDirections({
    //         accessToken: mapboxgl.accessToken
    //       }),
    //       "top-right"
    //     );
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
          <Chart
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
          />
        </div>
        <div style={sideBarStyle3}>
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
        </div>
      </div>
      <div ref={(el) => (mapContainer = el)} style={mapContainerStyle} />
    </div>
  );
}
