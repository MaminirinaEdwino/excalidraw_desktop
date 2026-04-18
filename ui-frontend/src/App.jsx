import './App.css';
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

function App() {
 
  return (
    <>
      <div style={{ height: "100vh", width: "100vw" }} className="custom-styles">
        <Excalidraw/>
      </div>
    </>
  )
}

export default App
