import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import createApp from "./app";

//DISABLE CONTEXT MENU

async function main() {

  const App = await createApp()
  bridge.send("VKWebAppInit");
  ReactDOM.render(<App />, document.getElementById("root"));

  // import("./eruda").then(({ default: eruda }) => { }); //runtime download

}

main()