import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SearchGames.css';

const SearchGames = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchGames = async () => {
    try {
      const response = await axios.get(
        `https://api.rawg.io/api/games?key=${import.meta.env.VITE_RAWG_API_KEY}&search=${query}`
      );
      setResults(response.data.results);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  return (
    <div className="search-games">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games..."
          className="search-input"
        />
        <button onClick={searchGames} className="search-button">
          Search
        </button>
      </div>
      <ul className="game-list">
        {results.map((game) => (
          <li key={game.id} className="game-item">
            <Link to={`/game/${game.id}`} className="game-link">
              <h2 className="game-title">{game.name}</h2>
            </Link>
            {game.background_image && (
              <img
                src={game.background_image}
                alt={game.name}
                className="game-image"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchGames;