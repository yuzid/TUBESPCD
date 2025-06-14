import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Game from './pages/game';
import MainMenu from "./pages/menu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu/>}/>
        <Route path="/game" element={<Game/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
