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

    setPlayers((players) => {
      const newPlayers = [...players, newPlayerCards];
      if (newPlayers.length === 7) setDisabledAgregarJugador(true);
      return newPlayers;
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
        {jugada ? <p>Jugada : {jugada}</p> : null}
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
    </main>
  );
}

export default App;
