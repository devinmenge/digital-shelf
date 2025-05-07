import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SearchGames from './components/SearchGames';
import GameDetails from './components/GameDetails';
import MyShelf from './components/MyShelf';
import Auth from './components/Auth'; // Import the new Auth component
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<SearchGames />} />
            <Route path="/game/:id" element={<GameDetails />} />
            <Route path="/my-shelf" element={<MyShelf />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;