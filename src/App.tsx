import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/Home/HomePage';
import DiagramPage from './pages/Diagram/DiagramPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/diagram" element={<DiagramPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
