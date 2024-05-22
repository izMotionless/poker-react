import { useState } from "react";
import "./App.css";
import ArrowPath from "./components/ArrowPath";

function App() {
  const [jugada, setJugada] = useState("");
  const [disabledMezclarCartas, setDisabledMezclarCartas] = useState(false);

  const handleMezclarCartas = async () => {
    const response = await fetch("http://localhost:8080/v1/poker");
    const UUID = await response.text();
    setJugada(UUID);
    setDisabledMezclarCartas(true);
  };

  return (
    <>
      <h1>♦ Poker Game ♦</h1>
      <div className="card">
        <button onClick={handleMezclarCartas} disabled={disabledMezclarCartas}>
          <span> Mezclar Cartas </span>
          <ArrowPath />
        </button>
        {jugada ? <p>Jugada : {jugada}</p> : null}
      </div>
    </>
  );
}

export default App;
