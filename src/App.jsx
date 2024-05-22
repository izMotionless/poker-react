import "./App.css";
import ArrowPath from "./components/ArrowPath";
function App() {
  return (
    <>
      <h1>♦ Poker Game ♦</h1>
      <div className="card">
        <button onClick={() => console.log("You clicked me!")}>
          Mezclar Cartas
          <ArrowPath />
        </button>
      </div>
    </>
  );
}

export default App;
