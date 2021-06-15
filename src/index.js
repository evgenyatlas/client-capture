import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import createApp from "./app";

//DISABLE CONTEXT MENU

function main() {

  const App = createApp()

  bridge.send("VKWebAppInit");
  ReactDOM.render(<App />, document.getElementById("root"));

  // if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === 'production') {
  //   import("./eruda").then(({ default: eruda }) => { }); //runtime download
  // }

}

main()