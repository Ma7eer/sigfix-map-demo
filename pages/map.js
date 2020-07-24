import Head from "next/head";
import mapboxgl from "mapbox-gl";
import { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "https://guarded-dusk-46450.herokuapp.com";
// const ENDPOINT = "http://localhost:4000";

import Loader from "react-loader-spinner";

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
  // backgroundColor: "#404040",
  background:
    "radial-gradient( circle farthest-corner at 10% 20%,  rgba(90,92,106,1) 0%, rgba(32,45,58,1) 81.3% )",
  color: "#ffffff",
  zIndex: "1",
  padding: "6px",
  fontWeight: "bold",
  textShadow: "2px 2px 2px #000",
  borderRadius: "2px",
};

const sideBarStyle2 = {
  display: "inline-block",
  position: "absolute",
  top: "50px",
  left: "0",
  margin: "12px",
  // backgroundColor: "#404040",
  background:
    "radial-gradient( circle farthest-corner at 10% 20%,  rgba(90,92,106,1) 0%, rgba(32,45,58,1) 81.3% )",
  color: "#ffffff",
  zIndex: "1",
  paddingTop: "6px", //6
  paddingBottom: "6px", //6
  paddingLeft: "25px", //6
  paddingRight: "25px", //6
  fontWeight: "bold",
  textShadow: "2px 2px 2px #000",
  borderRadius: "2px",
};

const sideBarStyle3 = {
  display: "inline-block",
  position: "absolute",
  top: "280px", //260
  left: "0",
  margin: "12px",
  // backgroundColor: "#404040",
  background:
    "radial-gradient( circle farthest-corner at 10% 20%,  rgba(90,92,106,1) 0%, rgba(32,45,58,1) 81.3% )",
  color: "#ffffff",
  zIndex: "1",
  paddingTop: "6px", //6
  paddingBottom: "6px", //6
  paddingLeft: "28px", //6
  paddingRight: "28px", //6
  // padding: "6px",
  // width: "250px",
  textShadow: "2px 2px 2px #000",
  borderRadius: "2px",
};

export default function Map() {
  const [lng, setLng] = useState(55.47); // 57.47
  const [lat, setLat] = useState(19.8); // 22.8
  const [zoom, setZoom] = useState(1);
  const [markerLng, setMarkerLng] = useState(57.47);
  const [markerLat, setMarkerLat] = useState(19.8);
  const [temp, setTemp] = useState(0);
  const [loading, setLoading] = useState(false);
  const [coordinates, setRouteCoordinates] = useState([]);

  let mapContainer = useRef(null);

  useEffect(() => {
    setLoading(true);

    const socket = socketIOClient(ENDPOINT);
    socket.on("data", async (data) => {
      await setLoading(true);
      setTimeout(async () => {
        await setTemp(parseFloat(data["Temp"]));
        await setMarkerLat(parseFloat(data["latitude"]));
        await setMarkerLng(parseFloat(data["longitude"]));
        await marker.setLngLat([
          parseFloat(data["longitude"]),
          parseFloat(data["latitude"]),
        ]);
        map.flyTo({
          center: [parseFloat(data["longitude"]), parseFloat(data["latitude"])],
          zoom: 18,
        });
        setRouteCoordinates((prevState) => {
          let copy = prevState;
          copy.push([
            parseFloat(data["longitude"]),
            parseFloat(data["latitude"]),
          ]);
          return copy;
        });
        map.getSource("route").setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        });
        await setLoading(false);
      }, 500);
    });

    // Map bound
    let bounds = [
      [50.081944, 15.900659], // Southwest coordinates
      [63.238926, 28.582236], // Northeast coordinates
    ];

    // create a map
    var map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      maxBounds: bounds, // Sets bounds as max
    });
    // streets-v11
    // light-v10

    // when we pan this happens
    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // create a marker
    let marker = new mapboxgl.Marker()
      .setLngLat([markerLng, markerLat])
      .addTo(map);

    setLoading(false);

    map.on("load", function () {
      map.addSource(`route`, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#888",
          "line-width": 8,
        },
      });
    });
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
      </Head>
      <div style={{ fontFamily: "sans-serif" }}>
        <div style={sideBarStyle1}>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div style={sideBarStyle2}>
          <h2 style={{ textAlign: "center" }}>Temperature</h2>
          <h1 style={{ textAlign: "center", fontSize: "60px" }}>
            {loading ? (
              <div style={{ padding: "6px 10px 6px 10px" }}>
                <Loader
                  type="Grid"
                  color="#3fb1ce"
                  height={50}
                  width={50}
                  timeout={100000} //3 secs
                />
              </div>
            ) : (
              temp.toFixed(0) + " C"
            )}
          </h1>
        </div>
        <div style={sideBarStyle3}>
          <h2 style={{ textAlign: "center" }}>Humidity</h2>
          <h1 style={{ textAlign: "center", fontSize: "60px" }}>
            {" "}
            {loading ? (
              <div style={{ padding: "6px 41px 6px 41px" }}>
                <Loader
                  type="Grid"
                  color="#3fb1ce"
                  height={50}
                  width={50}
                  timeout={100000} //3 secs
                />
              </div>
            ) : (
              "20 %"
            )}
          </h1>
        </div>
      </div>
      {loading ? (
        <div
          style={{
            display: "inline-block",
            position: "absolute",
            top: "0",
            right: "0",
            margin: "12px",
            zIndex: "1",
            padding: "6px",
            fontWeight: "bold",
            color: "#3fb1ce",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Loader
              type="Rings"
              color="#3fb1ce"
              height={80}
              width={80}
              timeout={100000} //3 secs
            />
            Loading...
          </div>
        </div>
      ) : null}

      <div ref={(el) => (mapContainer = el)} style={mapContainerStyle} />
    </div>
  );
}
