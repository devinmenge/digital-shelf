import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './GameDetails.css';

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(
          `https://api.rawg.io/api/games/${id}?key=${import.meta.env.VITE_RAWG_API_KEY}`
        );
        setGame(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching game details:', error);
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!game) return <div className="error">Game not found</div>;

  return (
    <div className="game-details">
      <h1 className="game-details-title">{game.name}</h1>
      {game.background_image && (
        <img
          src={game.background_image}
          alt={game.name}
          className="game-details-image"
        />
      )}
      <p className="game-description">{game.description_raw}</p>
      <div className="game-info">
        <div className="info-section">
          <h2 className="info-title">Details</h2>
          <p><strong>Released:</strong> {game.released || 'N/A'}</p>
          <p><strong>Rating:</strong> {game.rating || 'N/A'}</p>
        </div>
        <div className="info-section">
          <h2 className="info-title">Platforms</h2>
          <ul className="platform-list">
            {game.platforms?.map((platform) => (
              <li key={platform.platform.id}>{platform.platform.name}</li>
            )) || <li>N/A</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;