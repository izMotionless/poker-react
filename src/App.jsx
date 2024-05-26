import { useEffect, useState } from "react";
import "./App.css";
import ArrowPath from "./components/ArrowPath";
import Plus from "./components/Plus";
import UserCircle from "./components/UserCircle";
import ChevronRight from "./components/ChevronRight";
import { getRankHands, getWinnerIndex } from "./service/winner.service";

//npm run dev
function getPlayerCardsData(playerCards) {
  return playerCards.map((card) => ({
    symbol: card.symbol,
    name: card.characterCardTypeEnum.name,
  }));
}

//states o hooks para actualizar variables durante el juego
function App() {
  const [jugada, setJugada] = useState("");
  const [disabledMezclarCartas, setDisabledMezclarCartas] = useState(false);

  const [players, setPlayers] = useState([]);
  const [disabledAgregarJugador, setDisabledAgregarJugador] = useState(false);

  const [phase, setPhase] = useState("flop");
  const [cartasComunitarias, setCartasComunitarias] = useState([]);

  const [indexWinner, setIndexWinner] = useState(-1);

  const BASE_API_URL = "http://localhost:8080/v1/poker";

  //endpoint /{uuid} 
  const handleMezclarCartas = async () => {
    const response = await fetch(BASE_API_URL);
    const UUID = await response.text();
    setJugada(UUID);
    setDisabledMezclarCartas(true);
  };

  //endpoint /{player}
  const handleAgregarJugador = async () => {
    const response = await fetch(`${BASE_API_URL}/${jugada}/player`);
    const newPlayerCards = await response.json();

    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers, newPlayerCards];
      if (newPlayers.length === 7) setDisabledAgregarJugador(true);
      return newPlayers;
    });
  };

  //segun el state de phase actualizo el arreglo de cartas comunitarias (flop+turn+river)
  const handleChangePhase = async () => {
    const response = await fetch(`${BASE_API_URL}/${jugada}/${phase}`);
    const newCartasComunitarias = await response.json();
    setCartasComunitarias((prevCartasComunitarias) => [
      ...prevCartasComunitarias,
      ...newCartasComunitarias,
    ]);

    setPhase((prevPhase) => {
      //defino {phase} y deshabilito botón de agregar jugador si ya ha comenzado ronda
      setDisabledAgregarJugador(true);
      if (prevPhase === "flop") return "turn";
      if (prevPhase === "turn") return "river";
      if (prevPhase === "river") return "end";
    });
  };

  //declaro indexWinner y actualizo valor -1 para identificar la posicion del ganador '🏆' 
  useEffect(() => {
    if (phase !== "end") return;
      const rankedPlayersHands = getRankHands(cartasComunitarias, players);
      const indexWinner = getWinnerIndex(rankedPlayersHands);

      console.log({ rankedPlayersHands });
      console.log({ indexWinner });

      setIndexWinner(indexWinner);
  }, [phase, cartasComunitarias, players]);

  return (
    <main>
      <h1>♦ Poker Game ♦</h1>
      <div className="card">
        <button onClick={handleMezclarCartas} disabled={disabledMezclarCartas}>
          <span> Mezclar Cartas </span>
          <ArrowPath />
        </button>
        {jugada ? <p>Sesión de juego - {jugada}</p> : null}
      </div>

      {jugada ? (
        <div className="card" style={{ justifyContent: "flex-start" }}>
          <button onClick={handleAgregarJugador}
            disabled={disabledAgregarJugador}
            >
            <span>Agregar Jugador</span> 
            <Plus />
          </button>
      
          <button onClick={() => window.location.reload()}
            >
            <span>Reiniciar Juego</span>
            <ArrowPath />
          </button>
        </div>
      ) : null}

      {players.length !== 0 ? ( //aqui cargo la información de los jugadores e indexo su posición
        <ol>
          {players.map((player, index) => {
            const [card1, card2] = getPlayerCardsData(player);

            //defino img dinámicas en base a .name y .symbol de las cartas de jugadores
            const imgOverlay = `/images/card_back.png`;
            console.log(imgOverlay);
            const imgSrcCard1 = `/images/${card1.name}-${card1.symbol}.png`;
            console.log(imgSrcCard1);
            const imgSrcCard2 = `/images/${card2.name}-${card2.symbol}.png`;
            console.log(imgSrcCard2);
            
            return (
              <li key={index} className="playerCardsItem">
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <UserCircle />
                  <span>Jugador {index + 1}</span>
                </div>

                <div class="image">                 
                  {/*card1.symbol} {card1.name*/}
                  <img src = {imgSrcCard1} alt = {` ${card1.symbol} ${card1.name}`}/>
                </div>
                <div class="image">                 
                  {/*card2.symbol} {card2.name*/} 
                  <img src = {imgSrcCard2} alt = {` ${card2.symbol} ${card2.name}`}/>
                </div>

                {indexWinner === index ? (
                  <span><h2>🏆</h2></span>
                ) : (
                  <span><ChevronRight /></span>
                )}
              </li>
            );
          })}
        </ol>
      ) : null}

      {players.length >= 2 ? ( //si hay más de 2 jugadores habilito botones de fases de ronda
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
  //contenedor cartas comunitarias 
  <div>
    <ul
      style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center",}}>

      {cartasComunitarias.map((card, index) => (
        <li
          key={index}
          style={{ backgroundColor: "#1a1a1a", padding: "0.6em 1.2em", borderRadius: "8px",}}>
            
          <img
          //defino img según .characterCardTypeEnum.name y .symbol de cartas comunitarias
            src={`/images/${card.characterCardTypeEnum.name}-${card.symbol}.png`} alt="{card.symbol} {card.characterCardTypeEnum.name}" 
          />
        </li>
      ))}
    </ul>
  </div>
) : null}
     
      {phase === "end" ? (
          //muestra los resultados cuando actualizo fase a END.        
        <ul>
          <div style={{ padding: 20 }}>
            <h2><u>RESULTADOS</u></h2>
          </div>
          {getRankHands(cartasComunitarias, players).map((player, index) => (       

            <li key={index} style={{backgroundColor: "#1a1a1a",padding: "0.6em 1.2em",}}>
              <b>Jugador {index + 1}</b> 🔸 {player.rank} 🔸 {player.combination} 🔸 Jugada: {player.madeHand.join("-")} 🔸 {player.unused.join("-")}
            </li>
          ))}
        </ul>
      ) : null}

      <div >
        <h6>Desarrollado por RR ⚡ v1.0</h6>
      </div>

    </main>
  );
}

export default App;
