import './App.css';
import { Excalidraw, exportToCanvas, exportToSvg } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useState } from 'react';

function App() {
  const UI_OPTIONS = {
    canvasActions: {
      exportWithSpecifiedScale: false, // Masque l'export natif
      saveAsImage: false,              // Masque "Enregistrer en tant qu'image"
    },
  };
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  const handleCustomExport = async () => {
    if (!excalidrawAPI) return;
    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();

    // Utiliser le helper d'exportation pour obtenir un Blob ou un Canvas
    const canvas = await exportToCanvas({
      elements,
      appState,
      files,
    });
    const svg = await exportToSvg({
      elements,
      appState,
      files,
    })
    const base64 = canvas.toDataURL();
    const stringSvg = new XMLSerializer().serializeToString(svg)
    window.saveImageToGo(base64, stringSvg); // Appel vers votre backend Go
  };
  return (
    <>
      <div style={{ height: "100vh", width: "100vw" }} className="custom-styles">
        <Excalidraw UIOptions={UI_OPTIONS}
          excalidrawAPI={(api)=> setExcalidrawAPI(api)}
          renderTopRightUI={() => (
            <button
              onClick={handleCustomExport}
              className="sidebar-trigger default-sidebar-trigger"
            >
              Save Image
            </button>
          )} />
      </div>
    </>
  )
}

export default App
