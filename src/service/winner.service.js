import { rankHands } from "@xpressit/winning-poker-hand-rank";

//Picas - Spades (S)
//Trebol - Club (C)
//Corazon - Hearts (H)
//Diamante - Diamonds (D)

const cardsTypes = {
  Pica: "S",
  Trebol: "C",
  Corazon: "H",
  Diamante: "D",
};

//['9S','10H'] además la librería en vez de utilizar número 10 solicita 'T' de ten.
function cardMapper(cards) {
  return cards.map((card) => {
    const cardNumber = card.symbol === "10" ? "T" : card.symbol;
    const cardType = cardsTypes[card.characterCardTypeEnum.name];
    return `${cardNumber}${cardType}`;
  });
}

//mapeo por medio de board (arreglo) cartas del tablero + playerCards (arreglo) en un .map que solicita la librería 'mappedPlayersCards'
export function getRankHands(board, playersCards) {
  const mappedBoard = cardMapper(board);
  const mappedPlayersCards = playersCards.map((playerCards) =>
    cardMapper(playerCards)
  );

  // biblioteca 'rankHands' se encarga de evaluar y obtener puntaje de jugadores.
  return rankHands("texas", mappedBoard, mappedPlayersCards); 
}

//recorrer los resultados de rankHands para otorgar el ganador '🏆'.
export function getWinnerIndex(rankHands) {
  let indexWinner = 0;
  for (let i = 1; i < rankHands.length; i++){
    if (rankHands[i].rank < rankHands[indexWinner].rank) {
      indexWinner = i;
    } else if (rankHands[i].rank === rankHands[indexWinner].rank) {  
      let indexWinner = rankHands[i].rank;

      // mostrar alerta de empate en caso de que rank == rankHands
      alert("¡Empate! Dos jugadores obtuvieron el mismo puntaje durante este juego."); 
    }
  }
  return indexWinner;
}


