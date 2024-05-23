import { useState } from "react";
import "./App.css";
import ArrowPath from "./components/ArrowPath";
import Plus from "./components/Plus";
import UserCircle from "./components/UserCircle";
import ChevronRight from "./components/ChevronRight";

function getPlayerCardsData(playerCards) {
  return playerCards.map((card) => ({
    symbol: card.symbol,
    name: card.characterCardTypeEnum.name,
  }));
}

function App() {
  const [jugada, setJugada] = useState("");
  const [disabledMezclarCartas, setDisabledMezclarCartas] = useState(false);

  const [players, setPlayers] = useState([]);
  const [disabledAgregarJugador, setDisabledAgregarJugador] = useState(false);

  const [phase, setPhase] = useState("flop");
  const [cartasComunitarias, setCartasComunitarias] = useState([]);

  const BASE_API_URL = "http://localhost:8080/v1/poker";

  const handleMezclarCartas = async () => {
    const response = await fetch(BASE_API_URL);
    const UUID = await response.text();
    setJugada(UUID);
    setDisabledMezclarCartas(true);
  };

  const handleAgregarJugador = async () => {
    const response = await fetch(`${BASE_API_URL}/${jugada}/player`);
    const newPlayerCards = await response.json();

    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers, newPlayerCards];
      if (newPlayers.length === 7) setDisabledAgregarJugador(true);
      return newPlayers;
    });
  };

  const handleChangePhase = async () => {
    const response = await fetch(`${BASE_API_URL}/${jugada}/${phase}`);
    const newCartasComunitarias = await response.json();
    setCartasComunitarias((prevCartasComunitarias) => [
      ...prevCartasComunitarias,
      ...newCartasComunitarias,
    ]);

    setPhase((prevPhase) => {
      if (prevPhase === "flop") return "turn";
      if (prevPhase === "turn") return "river";
      if (prevPhase === "river") return "";
    });
  };

  return (
    <main>
      <h1>♦ Poker Game ♦</h1>
      <div className="card">
        <button onClick={handleMezclarCartas} disabled={disabledMezclarCartas}>
          <span> Mezclar Cartas </span>
          <ArrowPath />
        </button>
        {jugada ? <p>Jugada - {jugada}</p> : null}
      </div>

      {jugada ? (
        <div className="card" style={{ justifyContent: "flex-start" }}>
          <button
            onClick={handleAgregarJugador}
            disabled={disabledAgregarJugador}
          >
            <span>Agregar Jugador</span>
            <Plus />
          </button>
        </div>
      ) : null}

      {players.length !== 0 ? (
        <ol>
          {players.map((player, index) => {
            const [card1, card2] = getPlayerCardsData(player);
            return (
              <li key={index} className="playerCardsItem">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <UserCircle />
                  <span>Jugador {index + 1}</span>
                </div>
                <div>
                  {card1.symbol} {card1.name}
                </div>
                <div>
                  {card2.symbol} {card2.name}
                </div>
                <span>
                  <ChevronRight />
                </span>
              </li>
            );
          })}
        </ol>
      ) : null}

      {players.length >= 2 ? (
        <div className="card">
          <button disabled={phase != "flop"} onClick={handleChangePhase}>
            Flop
          </button>
          <button disabled={phase != "turn"} onClick={handleChangePhase}>
            Turn
          </button>
          <button disabled={phase != "river"} onClick={handleChangePhase}>
            River
          </button>
        </div>
      ) : null}

      {cartasComunitarias.length > 1 ? (
        <div>
          <ul
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            {cartasComunitarias.map((card, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: "#1a1a1a",
                  padding: "0.6em 1.2em",
                  borderRadius: "8px",
                }}
              >
                {card.symbol} {card.characterCardTypeEnum.name}{" "}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </main>
  );
}

export default App;
