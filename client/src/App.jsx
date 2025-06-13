import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Game from './pages/game';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game/>}/>
        <Route path="/menu" element={<></>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
