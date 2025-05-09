import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from "@apollo/client";
import "../App.css";

const GET_MY_COLLECTION = gql`
  query MyCollection {
    myCollection {
      _id
      gameId
      name
      imageUrl
      comment
    }
  }
`;

const REMOVE_FROM_COLLECTION = gql`
  mutation RemoveGameFromCollection($gameId: String!) {
    removeGameFromCollection(gameId: $gameId) {
      _id
      gameId
      name
    }
  }
`;

const UPDATE_COMMENT = gql`
  mutation UpdateComment($gameId: String!, $comment: String!) {
    updateComment(gameId: $gameId, comment: $comment) {
      _id
      gameId
      comment
    }
  }
`;

const MyShelf = () => {
  const token = localStorage.getItem('id_token');
  const { loading, error, data, refetch } = useQuery(GET_MY_COLLECTION);
  const [removeFromCollection] = useMutation(REMOVE_FROM_COLLECTION);
  const [updateComment] = useMutation(UPDATE_COMMENT);
  const [comments, setComments] = useState({});
  const [localComments, setLocalComments] = useState({});
  const [editMode, setEditMode] = useState({});
  const [mutationError, setMutationError] = useState(null);
  const [saving, setSaving] = useState({});

  // Debug when data updates
  useEffect(() => {
    console.log('useQuery data updated:', data);
  }, [data]);

  const handleRemove = async (gameId) => {
    try {
      await removeFromCollection({ variables: { gameId } });
      refetch();
    } catch (error) {
      console.error('Error removing game from collection:', error);
      alert('Failed to remove game from collection');
    }
  };

  const handleCommentChange = (gameId, value) => {
    setComments(prev => ({ ...prev, [gameId]: value }));
  };

  const handleCommentSubmit = async (gameId, currentComment) => {
    try {
      setSaving(prev => ({ ...prev, [gameId]: true }));
      const comment = comments[gameId] !== undefined ? comments[gameId] : currentComment || '';
      if (comment === currentComment) {
        setEditMode(prev => ({ ...prev, [gameId]: false }));
        return;
      }
      console.log(`Saving comment for gameId: ${gameId}, comment: ${comment}`);
      // Update local state immediately
      setLocalComments(prev => ({ ...prev, [gameId]: comment }));
      setEditMode(prev => ({ ...prev, [gameId]: false })); // Exit edit mode immediately
      await updateComment({ variables: { gameId, comment } });
      setComments(prev => {
        const newComments = { ...prev };
        delete newComments[gameId];
        return newComments;
      });
      setMutationError(null);
      await refetch(); // Await refetch to ensure data is updated
    } catch (error) {
      console.error('Error saving comment:', error);
      setMutationError('Failed to save comment: ' + error.message);
      // Revert local comment on error
      setLocalComments(prev => {
        const newLocalComments = { ...prev };
        delete newLocalComments[gameId];
        return newLocalComments;
      });
    } finally {
      setSaving(prev => ({ ...prev, [gameId]: false }));
    }
  };

  const toggleEditMode = (gameId, currentComment) => {
    if (!editMode[gameId] && !comments[gameId] && currentComment) {
      setComments(prev => ({ ...prev, [gameId]: currentComment }));
    }
    setEditMode(prev => ({ ...prev, [gameId]: !prev[gameId] }));
  };

  if (!token) {
    return (
      <div className="my-shelf">
        <h2>My Shelf</h2>
        <p>
          Log in or sign up to add games to your shelf!{' '}
          <Link to="/auth">Log In / Sign Up</Link>
        </p>
      </div>
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="my-shelf">
      <h2>My Shelf</h2>
      {data.myCollection.length === 0 ? (
        <p>No games in your collection yet.</p>
      ) : (
        <ul>
          {mutationError && <p className="error">{mutationError}</p>}
          {data.myCollection.map((game) => (
            <li key={game._id} className="game-item">
              {game.imageUrl && (
                <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="game-image"
                />
              )}
              <Link to={`/game/${game.gameId}`} className="game-link">
                <h3 className="game-title">{game.name}</h3>
              </Link>
              <button
                onClick={() => handleRemove(game.gameId)}
                className="remove-button"
              >
                Remove from Collection
              </button>
              <div className="comment-section">
                {editMode[game.gameId] ? (
                  <textarea
                    value={comments[game.gameId] !== undefined ? comments[game.gameId] : game.comment || ""}
                    onChange={(e) => handleCommentChange(game.gameId, e.target.value)}
                    placeholder="Write a review..."
                    rows="3"
                    className="comment-input"
                  />
                ) : (
                  <p className="comment-text">{localComments[game.gameId] || game.comment || "No review yet"}</p>
                )}
                <button
                  onClick={() => editMode[game.gameId] ? handleCommentSubmit(game.gameId, game.comment) : toggleEditMode(game.gameId, game.comment)}
                  className="review-button"
                  disabled={saving[game.gameId]}
                >
                  {saving[game.gameId] ? "Saving..." : editMode[game.gameId] ? "Save Review" : "Edit Review"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyShelf;