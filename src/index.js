import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import createApp from "./app";
import { delay } from "./lib/async/delay";

//DISABLE CONTEXT MENU
// import("./eruda").then(({ default: eruda }) => { }); //runtime download

async function main() {
  const App = await createApp()
  bridge.send("VKWebAppInit");

  ReactDOM.render(<App />, document.getElementById("root"));
}

main()