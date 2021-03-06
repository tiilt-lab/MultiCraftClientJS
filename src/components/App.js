import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import ServerForm from "./ServerForm";
import UsernameForm from "./UsernameForm";
import TextEntry from "./TextEntry";
import VoiceEntry from "./VoiceEntry";

function App() {
  const [state, setState] = useState({
    view: "server",
    ip: "localhost",
    port: "5005",
    username: "",
    uuid: "",
    websocket: null,
  });

  return (
    <ChakraProvider>
      <div className="App">
        <header className="App-header">
          {state.view === "server" && (
            <ServerForm state={state} setState={setState} />
          )}
          {state.view === "username" && (
            <UsernameForm state={state} setState={setState} />
          )}
          {state.view === "text" && (
            <TextEntry state={state} setState={setState} />
          )}
          {state.view === "voice" && (
            <VoiceEntry state={state} setState={setState} />
          )}
        </header>
      </div>
    </ChakraProvider>
  );
}

export default App;
