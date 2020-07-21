import Head from "next/head";
import Link from "next/link";
// import socketIOClient from "socket.io-client";
const ENDPOINT = "https://guarded-dusk-46450.herokuapp.com";
// const ENDPOINT = "http://localhost:4000";

import * as io from "socket.io-client";

// Socket
import SocketContext from "../components/socket-context";

const socket = io(ENDPOINT);

const Index = () => {
  // socketIOClient(ENDPOINT);
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
      </Head>
      <h1>
        Go to <Link href="/map">map page</Link>
      </h1>
    </div>
  );
};

export default Index;
